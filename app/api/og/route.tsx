import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const runtime = "edge";

/** Dynamic Open Graph image. /api/og?title=... */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") ?? siteConfig.name).slice(0, 100);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0a",
          backgroundImage:
            "radial-gradient(circle at 20% 0%, rgba(198,241,53,0.16), transparent 50%)",
          padding: "80px",
        }}
      >
        <div style={{ display: "flex", color: "#c6f135", fontSize: 28, letterSpacing: 4 }}>
          {siteConfig.tagline.toUpperCase()}
        </div>
        <div
          style={{
            display: "flex",
            color: "#ffffff",
            fontSize: 80,
            fontWeight: 700,
            lineHeight: 1.05,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div style={{ display: "flex", color: "#9ca3af", fontSize: 32 }}>
          {siteConfig.name} · {new URL(siteConfig.url).host}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
