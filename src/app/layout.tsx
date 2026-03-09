import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "뚝딱 AI 에디터 - 사진 무드 변환 AI 툴",
  description:
    "헤어스타일 변환, 마인크래프트·레고·클레이 스타일 배경 변경 등 AI로 사진의 무드를 뚝딱 바꿔보세요",
  keywords: [
    "AI 사진 편집",
    "사진 무드 변환",
    "헤어스타일 합성",
    "마인크래프트 스타일",
    "레고 스타일",
    "AI 배경 변경",
    "뚝딱 AI 에디터",
  ],
  openGraph: {
    title: "뚝딱 AI 에디터 - 사진 무드 변환 AI 툴",
    description:
      "헤어스타일 변환, 마인크래프트·레고·클레이 스타일 배경 변경 등 AI로 사진의 무드를 뚝딱 바꿔보세요",
    url: "https://ddokddak-ai.vercel.app",
    siteName: "뚝딱 AI 에디터",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "뚝딱 AI 에디터 - 사진 무드 변환 AI 툴",
    description:
      "헤어스타일 변환, 마인크래프트·레고·클레이 스타일 배경 변경 등 AI로 사진의 무드를 뚝딱 바꿔보세요",
  },
  alternates: {
    canonical: "https://ddokddak-ai.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD 구조화 데이터
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "뚝딱 AI 에디터",
  description:
    "헤어스타일 변환, 마인크래프트·레고·클레이 스타일 배경 변경 등 AI로 사진의 무드를 뚝딱 바꿔보세요",
  url: "https://ddokddak-ai.vercel.app",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
    description: "무료 체험 후 토큰 충전",
  },
  featureList: [
    "AI 헤어스타일 합성",
    "마인크래프트 스타일 배경 변환",
    "레고 스타일 배경 변환",
    "사진 무드 변환",
  ],
  inLanguage: "ko",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* 구조화 데이터 (JSON-LD) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* 네이버 서치어드바이저 인증 */}
        {process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION && (
          <meta
            name="naver-site-verification"
            content={process.env.NEXT_PUBLIC_NAVER_SITE_VERIFICATION}
          />
        )}
        {/* 구글 서치콘솔 인증 */}
        {process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION && (
          <meta
            name="google-site-verification"
            content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION}
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
