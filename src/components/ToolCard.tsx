"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

interface ToolCardProps {
  id: string;
  name: string;
  description: string;
  icon: string;
  path: string;
  tokensPerUse: number;
  badge: string | null;
  available: boolean;
}

export default function ToolCard({
  name,
  description,
  icon,
  path,
  tokensPerUse,
  badge,
  available,
}: ToolCardProps) {
  const { user, signInWithGoogle } = useAuth();
  const [loggingIn, setLoggingIn] = useState(false);

  const handleClick = async () => {
    if (!available) return;

    if (!user) {
      setLoggingIn(true);
      try {
        const params = new URLSearchParams(window.location.search);
        const ref = params.get("ref");
        await signInWithGoogle(ref);
      } catch {
        // 에러 처리는 AuthContext에서
      } finally {
        setLoggingIn(false);
      }
      return;
    }

    window.location.href = path;
  };

  return (
    <button
      onClick={handleClick}
      disabled={!available || loggingIn}
      className={`
        relative w-full text-left p-6 rounded-2xl border-2 transition-all
        ${
          available
            ? "bg-white border-gray-200 hover:border-violet-400 hover:shadow-lg hover:shadow-violet-100 cursor-pointer"
            : "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
        }
      `}
    >
      {/* 뱃지 */}
      {badge && (
        <span
          className={`
            absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full
            ${
              badge === "NEW"
                ? "bg-emerald-100 text-emerald-700"
                : badge === "SOON"
                ? "bg-amber-100 text-amber-700"
                : "bg-gray-100 text-gray-600"
            }
          `}
        >
          {badge}
        </span>
      )}

      {/* 아이콘 */}
      <div className="text-4xl mb-3">{icon}</div>

      {/* 이름 */}
      <h3 className="text-lg font-bold text-gray-800 mb-1">{name}</h3>

      {/* 설명 */}
      <p className="text-sm text-gray-500 mb-3">{description}</p>

      {/* 토큰 소모량 */}
      <div className="flex items-center gap-1 text-xs text-violet-600 font-medium">
        <span>🪙</span>
        <span>{tokensPerUse}개</span>
      </div>

      {/* 로그인 중 표시 */}
      {loggingIn && (
        <div className="absolute inset-0 bg-white/80 rounded-2xl flex items-center justify-center">
          <span className="text-sm text-violet-600 font-medium">로그인 중...</span>
        </div>
      )}
    </button>
  );
}
