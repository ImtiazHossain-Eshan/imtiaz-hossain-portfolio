"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { ShaderVariant } from "@/lib/hero-variants";

/**
 * Fullscreen-triangle trick: a 2x2 plane whose vertex shader writes clip-space
 * positions directly, so it fills the viewport regardless of camera.
 */
const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/**
 * Domain-warped fbm aurora. Flowing filaments in the page accent, blooming
 * toward the pointer, fading to transparent in the troughs and at the edges so
 * it sits over the observatory-black background.
 */
const FRAG = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform vec2 uResolution;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform float uScale;
  uniform float uSpeed;
  uniform float uIntensity;
  varying vec2 vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 34.56);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = rot * p * 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
    vec2 mp = uPointer * 0.5 * vec2(aspect, 1.0);
    float t = uTime * 0.05 * uSpeed;

    vec2 q = p * (1.6 * uScale);
    // Two-pass domain warp for the drifting-aurora feel.
    vec2 w = vec2(fbm(q + vec2(0.0, t)), fbm(q + vec2(5.2, -t)));
    float f = fbm(q + 1.8 * w + vec2(t * 0.6, 0.0));

    // Soft bloom that follows the pointer.
    float d = length(p - mp);
    float bloom = (1.0 - smoothstep(0.0, 0.7, d)) * 0.35;

    float g = clamp(smoothstep(0.25, 0.95, f) + bloom, 0.0, 1.0);
    vec3 col = mix(uColorB, uColorA, g);
    float vig = smoothstep(1.25, 0.25, length(p));
    float alpha = g * vig * uIntensity;

    gl_FragColor = vec4(col, alpha);
  }
`;

function AuroraPlane({ variant }: { variant: ShaderVariant }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const size = useThree((s) => s.size);

  const pointerTarget = useRef({ x: 0, y: 0 });
  const pointerSmooth = useRef({ x: 0, y: 0 });

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uColorA: { value: new THREE.Color(variant.colorA) },
      uColorB: { value: new THREE.Color(variant.colorB) },
      uScale: { value: variant.scale },
      uSpeed: { value: variant.speed },
      uIntensity: { value: variant.intensity },
    }),
    // Built once; live updates handled below so the material is never recreated.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  useEffect(() => {
    uniforms.uColorA.value.set(variant.colorA);
    uniforms.uColorB.value.set(variant.colorB);
    uniforms.uScale.value = variant.scale;
    uniforms.uSpeed.value = variant.speed;
    uniforms.uIntensity.value = variant.intensity;
  }, [variant, uniforms]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointerTarget.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerTarget.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((_, delta) => {
    const u = uniforms;
    u.uTime.value += Math.min(delta, 0.05);
    pointerSmooth.current.x += (pointerTarget.current.x - pointerSmooth.current.x) * 0.06;
    pointerSmooth.current.y += (pointerTarget.current.y - pointerSmooth.current.y) * 0.06;
    u.uPointer.value.set(pointerSmooth.current.x, pointerSmooth.current.y);
    u.uResolution.value.set(size.width, size.height);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        uniforms={uniforms}
        vertexShader={VERT}
        fragmentShader={FRAG}
        transparent
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}

/**
 * Isolated so the whole three.js bundle can be `next/dynamic`-imported off each
 * page's critical path. Pauses its frameloop when scrolled out of view.
 */
export default function ShaderHeroCanvas({
  variant,
  dprMax,
  inView,
  onContextLost,
}: {
  variant: ShaderVariant;
  dprMax: number;
  inView: boolean;
  onContextLost: () => void;
}) {
  return (
    <Canvas
      className="transition-opacity duration-1000"
      dpr={[1, dprMax]}
      frameloop={inView ? "always" : "never"}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener(
          "webglcontextlost",
          (e) => {
            e.preventDefault();
            onContextLost();
          },
          { once: true },
        );
      }}
    >
      <AuroraPlane variant={variant} />
    </Canvas>
  );
}
