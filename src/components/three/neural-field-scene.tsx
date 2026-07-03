"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export type FieldQuality = {
  points: number;
  maxEdges: number;
  pulses: number;
};

/** Deterministic RNG so the field is identical every visit. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Soft radial sprite so points render as glows, not squares. */
function makeGlowTexture() {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.35, "rgba(255,255,255,0.55)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

const ACCENT = new THREE.Color("#7cdfff");
const MOUSE_RADIUS = 2.6;
const CONNECT_DIST = 2.15;

type Pulse = { edge: number; start: number; dur: number };

export function NeuralFieldScene({ quality }: { quality: FieldQuality }) {
  const { points: COUNT, maxEdges, pulses: PULSE_COUNT } = quality;

  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const pulsesRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);

  const camera = useThree((s) => s.camera);

  // Track the pointer at window level: hero copy sits above the canvas and
  // would swallow its pointer events, which made the field feel unresponsive.
  // Target is written by the listener; `smooth` is lerped every frame.
  const pointerTarget = useRef({ x: 0, y: 0 });
  const pointerSmooth = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerTarget.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerTarget.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const glowTexture = useMemo(makeGlowTexture, []);

  /** Static topology: base positions, per-particle motion params, edge list. */
  const field = useMemo(() => {
    const rand = mulberry32(20260702);
    const base = new Float32Array(COUNT * 3);
    const phase = new Float32Array(COUNT * 3);
    const speed = new Float32Array(COUNT);
    const amp = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      // Loose ellipsoid slab, denser toward the center.
      const r = Math.pow(rand(), 0.72);
      const theta = rand() * Math.PI * 2;
      const y = (rand() * 2 - 1) * 4.4 * (0.55 + 0.45 * rand());
      base[i * 3] = Math.cos(theta) * r * 9.5;
      base[i * 3 + 1] = y;
      base[i * 3 + 2] = (rand() * 2 - 1) * 3.2;
      phase[i * 3] = rand() * Math.PI * 2;
      phase[i * 3 + 1] = rand() * Math.PI * 2;
      phase[i * 3 + 2] = rand() * Math.PI * 2;
      speed[i] = 0.25 + rand() * 0.5;
      amp[i] = 0.22 + rand() * 0.3;
    }

    // k-nearest edges within CONNECT_DIST, deduped.
    const pairs: Array<[number, number, number]> = [];
    for (let i = 0; i < COUNT; i++) {
      const dists: Array<[number, number]> = [];
      for (let j = i + 1; j < COUNT; j++) {
        const dx = base[i * 3] - base[j * 3];
        const dy = base[i * 3 + 1] - base[j * 3 + 1];
        const dz = base[i * 3 + 2] - base[j * 3 + 2];
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d < CONNECT_DIST) dists.push([d, j]);
      }
      dists.sort((a, b) => a[0] - b[0]);
      for (const [d, j] of dists.slice(0, 3)) pairs.push([i, j, d]);
    }
    const edges = pairs.slice(0, maxEdges);

    // Node -> outgoing edge indices, for connected pulse walks.
    const adjacency: number[][] = Array.from({ length: COUNT }, () => []);
    edges.forEach(([a, b], idx) => {
      adjacency[a].push(idx);
      adjacency[b].push(idx);
    });

    const edgeSeed = new Float32Array(edges.length);
    for (let e = 0; e < edges.length; e++) edgeSeed[e] = rand() * Math.PI * 2;

    return { base, phase, speed, amp, edges, adjacency, edgeSeed, rand };
  }, [COUNT, maxEdges]);

  /** Mutable GPU buffers. */
  const buffers = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    positions.set(field.base);
    const linePositions = new Float32Array(field.edges.length * 6);
    const lineColors = new Float32Array(field.edges.length * 6);
    const pulsePositions = new Float32Array(PULSE_COUNT * 3).fill(9999);
    const pulseState: Pulse[] = Array.from({ length: PULSE_COUNT }, (_, i) => ({
      edge: Math.floor(field.rand() * field.edges.length),
      start: -(i * 0.35),
      dur: 0.9 + field.rand() * 0.9,
    }));
    return { positions, linePositions, lineColors, pulsePositions, pulseState };
  }, [COUNT, PULSE_COUNT, field]);

  const mouse3 = useMemo(() => new THREE.Vector3(9999, 9999, 0), []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const { base, phase, speed, amp, edges, adjacency, edgeSeed } = field;
    const { positions, linePositions, lineColors, pulsePositions, pulseState } = buffers;

    // Ease toward the latest pointer position: responsive but never jittery.
    pointerSmooth.current.x += (pointerTarget.current.x - pointerSmooth.current.x) * 0.22;
    pointerSmooth.current.y += (pointerTarget.current.y - pointerSmooth.current.y) * 0.22;
    const px = pointerSmooth.current.x;
    const py = pointerSmooth.current.y;

    // Project the pointer onto the z=0 plane the field lives around.
    const dist = camera.position.length();
    const halfH = Math.tan(THREE.MathUtils.degToRad(55 / 2)) * dist;
    const aspect = (camera as THREE.PerspectiveCamera).aspect ?? 1.6;
    mouse3.set(px * halfH * aspect, py * halfH, 0);

    // Particles: gentle triaxial drift + local repulsion from the pointer.
    for (let i = 0; i < COUNT; i++) {
      const s = speed[i];
      const a = amp[i];
      let x = base[i * 3] + Math.sin(t * s + phase[i * 3]) * a;
      let y = base[i * 3 + 1] + Math.sin(t * s * 0.9 + phase[i * 3 + 1]) * a;
      const z = base[i * 3 + 2] + Math.sin(t * s * 0.7 + phase[i * 3 + 2]) * a * 0.7;

      const dx = x - mouse3.x;
      const dy = y - mouse3.y;
      const md = Math.sqrt(dx * dx + dy * dy);
      if (md < MOUSE_RADIUS && md > 0.0001) {
        const push = (1 - md / MOUSE_RADIUS) ** 2 * 0.9;
        x += (dx / md) * push;
        y += (dy / md) * push;
      }

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
    }

    // Edges: endpoints track particles; brightness = proximity wave + pointer boost.
    for (let e = 0; e < edges.length; e++) {
      const [a, b, restLen] = edges[e];
      const ax = positions[a * 3];
      const ay = positions[a * 3 + 1];
      const az = positions[a * 3 + 2];
      const bx = positions[b * 3];
      const by = positions[b * 3 + 1];
      const bz = positions[b * 3 + 2];
      linePositions[e * 6] = ax;
      linePositions[e * 6 + 1] = ay;
      linePositions[e * 6 + 2] = az;
      linePositions[e * 6 + 3] = bx;
      linePositions[e * 6 + 4] = by;
      linePositions[e * 6 + 5] = bz;

      let brightness =
        Math.max(0.06, 1 - restLen / CONNECT_DIST) *
        0.26 *
        (0.75 + 0.45 * Math.sin(t * 0.6 + edgeSeed[e]));

      const mx = (ax + bx) / 2 - mouse3.x;
      const my = (ay + by) / 2 - mouse3.y;
      const mDist = Math.sqrt(mx * mx + my * my);
      if (mDist < MOUSE_RADIUS) brightness += (1 - mDist / MOUSE_RADIUS) * 0.55;

      const r = ACCENT.r * brightness;
      const g = ACCENT.g * brightness;
      const bl = ACCENT.b * brightness;
      lineColors[e * 6] = r;
      lineColors[e * 6 + 1] = g;
      lineColors[e * 6 + 2] = bl;
      lineColors[e * 6 + 3] = r;
      lineColors[e * 6 + 4] = g;
      lineColors[e * 6 + 5] = bl;
    }

    // Pulses: signals travelling edge to connected edge.
    for (let p = 0; p < pulseState.length; p++) {
      const pulse = pulseState[p];
      let progress = (t - pulse.start) / pulse.dur;
      if (progress >= 1) {
        const [, endNode] = edges[pulse.edge];
        const options = adjacency[endNode];
        pulse.edge = options[Math.floor(Math.random() * options.length)] ?? pulse.edge;
        pulse.start = t;
        pulse.dur = 0.8 + Math.random() * 0.9;
        progress = 0;
      }
      if (progress < 0) {
        pulsePositions[p * 3 + 1] = 9999;
        continue;
      }
      const e = pulse.edge;
      pulsePositions[p * 3] =
        linePositions[e * 6] + (linePositions[e * 6 + 3] - linePositions[e * 6]) * progress;
      pulsePositions[p * 3 + 1] =
        linePositions[e * 6 + 1] + (linePositions[e * 6 + 4] - linePositions[e * 6 + 1]) * progress;
      pulsePositions[p * 3 + 2] =
        linePositions[e * 6 + 2] + (linePositions[e * 6 + 5] - linePositions[e * 6 + 2]) * progress;
    }

    if (pointsRef.current) {
      (pointsRef.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }
    if (linesRef.current) {
      (linesRef.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (linesRef.current.geometry.attributes.color as THREE.BufferAttribute).needsUpdate = true;
    }
    if (pulsesRef.current) {
      (pulsesRef.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
    }

    // Slow observational camera drift with pointer parallax.
    camera.position.x = Math.sin(t * 0.06) * 0.7 + px * 0.45;
    camera.position.y = Math.cos(t * 0.05) * 0.35 + py * 0.3;
    camera.lookAt(0, 0, 0);

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.03) * 0.07;
    }
  });

  return (
    // Nudged right so the hero copy on the left sits over calmer space.
    <group ref={groupRef} position={[1.8, 0, 0]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[buffers.positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.09}
          map={glowTexture}
          color="#a8c8d8"
          transparent
          opacity={0.85}
          depthWrite={false}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[buffers.linePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[buffers.lineColors, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      <points ref={pulsesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[buffers.pulsePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.32}
          map={glowTexture}
          color="#7cdfff"
          transparent
          opacity={0.9}
          depthWrite={false}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
