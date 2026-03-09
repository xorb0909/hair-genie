"use client";

// ============================================
// ShareButton - 공유하기 버튼
// - 카카오톡 / 인스타 공유
// - 공유 시 +1 토큰 보너스 (하루 1회)
// ============================================

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface ShareButtonProps {
  resultImageUrl?: string;
}

export default function ShareButton({ resultImageUrl }: ShareButtonProps) {
  const { user, refreshUserData } = useAuth();
  const [shared, setShared] = useState(false);
  const [bonusMsg, setBonusMsg] = useState<string | null>(null);

  const claimBonus = async (platform: string) => {
    if (!user) return;

    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/tokens/share-bonus", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ platform }),
      });

      const data = await res.json();
      if (data.success) {
        setBonusMsg("공유 보너스 +1 토큰 지급!");
        refreshUserData();
      } else if (data.error) {
        setBonusMsg(data.error);
      }

      setShared(true);
      setTimeout(() => setBonusMsg(null), 3000);
    } catch {
      // 보너스 지급 실패해도 공유는 됨
    }
  };

  const shareToKakao = () => {
    const shareUrl = `https://ddokddak-ai.vercel.app/`;
    const text = "AI로 헤어스타일 미리보기! Hair Genie에서 나만의 스타일을 찾아보세요 ✂️";

    // 카카오톡 공유 (모바일에서는 카카오톡 앱으로, 데스크톱에서는 웹 공유)
    const kakaoShareUrl = `https://sharer.kakao.com/talk/friends/picker/link?url=${encodeURIComponent(
      shareUrl
    )}&text=${encodeURIComponent(text)}`;

    window.open(kakaoShareUrl, "_blank", "width=500,height=600");
    claimBonus("kakao");
  };

  const shareToInstagram = () => {
    // 인스타그램은 URL 공유가 제한적이므로 클립보드 복사 후 인스타 열기
    const shareText =
      "AI로 헤어스타일 미리보기! ✂️\nhttps://ddokddak-ai.vercel.app/";

    navigator.clipboard.writeText(shareText).then(() => {
      alert("링크가 복사되었어요! 인스타그램 스토리에 붙여넣기 해주세요.");
      window.open("https://www.instagram.com/", "_blank");
      claimBonus("instagram");
    });
  };

  if (!user) return null;

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <button
          onClick={shareToKakao}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#FEE500] text-[#3C1E1E] rounded-lg text-xs font-medium hover:brightness-95 transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3C6.48 3 2 6.58 2 10.94c0 2.8 1.86 5.27 4.66 6.68l-.95 3.52c-.08.3.26.54.52.37l4.18-2.76c.52.06 1.05.09 1.59.09 5.52 0 10-3.58 10-7.94S17.52 3 12 3z" />
          </svg>
          카카오톡
        </button>
        <button
          onClick={shareToInstagram}
          className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-xs font-medium hover:brightness-95 transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
          </svg>
          인스타그램
        </button>
      </div>

      {/* 보너스 메시지 */}
      {bonusMsg && (
        <p className="text-xs text-violet-600 font-medium animate-pulse">
          {bonusMsg}
        </p>
      )}
    </div>
  );
}
