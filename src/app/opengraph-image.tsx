import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name} — personalized, laser-engraved gifts`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#2a2620",
          padding: "72px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", fontSize: 40, fontWeight: 700, color: "#fff" }}>
          Foma<span style={{ color: "#caa45a" }}>Print</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 68,
              fontWeight: 800,
              color: "#fff",
              lineHeight: 1.05,
              maxWidth: 900,
              letterSpacing: "-0.02em",
            }}
          >
            Personalized &amp; laser-engraved gifts, made to order
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#caa45a" }}>
            Drinkware · Cutting boards · Frames · Keepsakes
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 26, color: "#b8afa2" }}>
          {site.legalName} · Made in the USA
        </div>
      </div>
    ),
    { ...size },
  );
}
