import { ImageResponse } from "next/og";
import { store } from "@/lib/store";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ username: string }> };

export default async function OgImage({ params }: Props) {
  const { username } = await params;
  const page = await store.getPageByUsername(username);
  const name = page?.displayName || username;
  const bio = page?.bio || "Send a private Zcash payment.";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#050505",
          color: "#e8e8e8",
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ color: "#00c9a7", fontSize: 36, fontFamily: "monospace" }}>Ƶ</div>
          <div style={{ fontSize: 28, opacity: 0.7 }}>ZecPay</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 64, fontWeight: 600 }}>{name}</div>
          <div style={{ fontSize: 28, color: "#888", maxWidth: 900 }}>{bio}</div>
        </div>
        <div style={{ fontSize: 22, color: "#00c9a7" }}>Private Zcash payments</div>
      </div>
    ),
    { ...size }
  );
}
