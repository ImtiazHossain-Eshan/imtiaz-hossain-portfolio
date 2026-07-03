import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Apple touch icon: the constellation mark scaled up. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0b0d11",
          borderRadius: 36,
        }}
      >
        <svg width="180" height="180" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <g stroke="#2a5d70" strokeWidth="1.1">
            <line x1="9.5" y1="21.5" x2="16" y2="9.5" />
            <line x1="16" y1="9.5" x2="23" y2="18.5" />
            <line x1="9.5" y1="21.5" x2="23" y2="18.5" />
            <line x1="16" y1="9.5" x2="14" y2="15.8" />
          </g>
          <circle cx="14" cy="15.8" r="1.4" fill="#7cdfff" />
          <circle cx="9.5" cy="21.5" r="2" fill="#7cdfff" />
          <circle cx="16" cy="9.5" r="2.6" fill="#7cdfff" />
          <circle cx="23" cy="18.5" r="2" fill="#446877" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
