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
  title: "헤어지니 - AI 헤어스타일 합성 시뮬레이터",
  description:
    "AI로 내 얼굴에 원하는 헤어스타일을 합성해보세요. 헤어지니에서 가상으로 헤어스타일을 체험하고 나에게 맞는 스타일을 찾아보세요.",
  keywords: [
    "헤어스타일 합성",
    "AI 헤어 시뮬레이터",
    "헤어 가상 체험",
    "헤어스타일 변환",
    "AI 헤어 추천",
    "헤어스타일 미리보기",
    "가상 헤어",
  ],
  openGraph: {
    title: "헤어지니 - AI 헤어스타일 합성 시뮬레이터",
    description:
      "AI로 내 얼굴에 원하는 헤어스타일을 합성해보세요. 가상으로 헤어스타일을 체험하고 나에게 맞는 스타일을 찾아보세요.",
    url: "https://hair-genie-wine.vercel.app",
    siteName: "헤어지니 Hair Genie",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "헤어지니 - AI 헤어스타일 합성 시뮬레이터",
    description:
      "AI로 내 얼굴에 원하는 헤어스타일을 합성해보세요. 가상으로 헤어스타일을 체험하고 나에게 맞는 스타일을 찾아보세요.",
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
  name: "헤어지니",
  alternateName: "Hair Genie",
  description:
    "AI로 내 얼굴에 원하는 헤어스타일을 합성해보세요. 가상으로 헤어스타일을 체험하고 나에게 맞는 스타일을 찾아보세요.",
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
    "가상 헤어 체험",
    "다양한 헤어스타일 추천",
    "염색 색상 시뮬레이션",
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
