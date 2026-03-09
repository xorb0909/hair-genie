import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "뚝딱 AI 에디터 - 사진 무드 변환 AI 툴";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f5f3ff 0%, #ffffff 40%, #fdf4ff 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* 상단 장식 */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #8b5cf6, #d946ef)",
          }}
        />

        {/* 아이콘 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "80px",
            height: "80px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #8b5cf6, #d946ef)",
            marginBottom: "24px",
            fontSize: "40px",
          }}
        >
          🪄
        </div>

        {/* 타이틀 */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <span style={{ fontSize: "52px", fontWeight: 800, color: "#7c3aed" }}>
            뚝딱
          </span>
          <span style={{ fontSize: "52px", fontWeight: 800, color: "#1f2937" }}>
            AI 에디터
          </span>
        </div>

        {/* 서브 타이틀 */}
        <div
          style={{
            fontSize: "24px",
            color: "#6b7280",
            marginBottom: "40px",
          }}
        >
          AI로 사진의 무드를 뚝딱 바꿔보세요
        </div>

        {/* 기능 태그들 */}
        <div
          style={{
            display: "flex",
            gap: "12px",
          }}
        >
          {["헤어스타일 변환", "배경 무드 변경", "마인크래프트·레고·클레이"].map((tag) => (
            <div
              key={tag}
              style={{
                padding: "10px 24px",
                borderRadius: "999px",
                background: "#f3f0ff",
                color: "#7c3aed",
                fontSize: "18px",
                fontWeight: 600,
              }}
            >
              {tag}
            </div>
          ))}
        </div>

        {/* 하단 URL */}
        <div
          style={{
            position: "absolute",
            bottom: "28px",
            fontSize: "16px",
            color: "#9ca3af",
          }}
        >
          ddokddak-ai.vercel.app
        </div>
      </div>
    ),
    { ...size }
  );
}
