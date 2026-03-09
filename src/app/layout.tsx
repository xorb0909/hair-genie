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
  title: "AI Studio - AI 뷰티 툴 모음",
  description:
    "헤어스타일 변환, 배경 변경 등 다양한 AI 뷰티 툴을 한 곳에서 체험하세요",
  keywords: [
    "AI 뷰티 툴",
    "헤어스타일 합성",
    "AI 헤어 시뮬레이터",
    "배경 변경",
    "AI 사진 편집",
    "헤어스타일 변환",
    "AI 뷰티",
  ],
  openGraph: {
    title: "AI Studio - AI 뷰티 툴 모음",
    description:
      "헤어스타일 변환, 배경 변경 등 다양한 AI 뷰티 툴을 한 곳에서 체험하세요",
    url: "https://hair-genie-wine.vercel.app",
    siteName: "AI Studio",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Studio - AI 뷰티 툴 모음",
    description:
      "헤어스타일 변환, 배경 변경 등 다양한 AI 뷰티 툴을 한 곳에서 체험하세요",
  },
  alternates: {
    canonical: "https://hair-genie-wine.vercel.app",
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
  name: "AI Studio",
  description:
    "헤어스타일 변환, 배경 변경 등 다양한 AI 뷰티 툴을 한 곳에서 체험하세요",
  url: "https://hair-genie-wine.vercel.app",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "KRW",
    description: "무료 체험 후 토큰 충전",
  },
  featureList: [
    "AI 헤어스타일 합성",
    "AI 배경 변경",
    "가상 헤어 체험",
    "다양한 AI 뷰티 툴",
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
