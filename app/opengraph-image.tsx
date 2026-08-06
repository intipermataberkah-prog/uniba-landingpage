import { ImageResponse } from "next/og";

export const alt = "PMB UNIBA Surakarta — Gratis Uang Gedung, Cicilan Fleksibel";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded, build-time OG/Twitter preview card (navy + gold). No external fonts
// or assets are fetched, so it renders reliably in any build environment.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0a1f42 0%, #123163 50%, #1c3f86 100%)",
          padding: "72px",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "64px",
              height: "64px",
              borderRadius: "16px",
              background: "linear-gradient(135deg, #d4af37, #f59e0b)",
              color: "#0f2c59",
              fontSize: "34px",
              fontWeight: 800,
            }}
          >
            U
          </div>
          <div style={{ display: "flex", fontSize: "30px", fontWeight: 700 }}>
            UNIBA Surakarta
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              padding: "10px 22px",
              borderRadius: "999px",
              background: "rgba(245, 158, 11, 0.16)",
              border: "1px solid rgba(245, 158, 11, 0.5)",
              color: "#fcd34d",
              fontSize: "24px",
              fontWeight: 600,
            }}
          >
            PMB 2026/2027 · Promo Kemerdekaan
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "68px",
              fontWeight: 800,
              lineHeight: 1.1,
              maxWidth: "940px",
            }}
          >
            Kuliah Tanpa Beban Finansial di Kota Solo
          </div>
          <div
            style={{
              display: "flex",
              fontSize: "29px",
              color: "rgba(255, 255, 255, 0.82)",
              maxWidth: "900px",
            }}
          >
            Gratis Uang Gedung · Bayar 60% di Semester 1 · Sisanya Fleksibel Tanpa Bunga
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: "24px",
            color: "rgba(255, 255, 255, 0.72)",
          }}
        >
          <div style={{ display: "flex" }}>Terakreditasi BAN-PT</div>
          <div
            style={{ display: "flex", width: "6px", height: "6px", borderRadius: "999px", background: "#f59e0b" }}
          />
          <div style={{ display: "flex" }}>S1 &amp; S2 · Kelas Pagi &amp; Malam</div>
          <div
            style={{ display: "flex", width: "6px", height: "6px", borderRadius: "999px", background: "#f59e0b" }}
          />
          <div style={{ display: "flex" }}>pmb.uniba.ac.id</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
