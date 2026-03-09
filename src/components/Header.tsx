"use client";

// ============================================
// Header - 로그인/로그아웃 + 토큰 잔액 표시
// ============================================

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

interface HeaderProps {
  onOpenPayment: () => void;
}

export default function Header({ onOpenPayment }: HeaderProps) {
  const { user, userData, loading, signInWithGoogle, logout } = useAuth();
  const [loggingIn, setLoggingIn] = useState(false);

  const handleLogin = async () => {
    setLoggingIn(true);
    try {
      // URL에서 초대코드 확인
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref");
      await signInWithGoogle(ref);
    } catch {
      // 에러 처리는 AuthContext에서
    } finally {
      setLoggingIn(false);
    }
  };

  return (
    <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* 로고 */}
        <a href="/" className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-gray-900">
            <span className="text-violet-600">뚝딱</span> AI 에디터
          </h1>
        </a>

        {/* 우측: 유저 정보 */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-20 h-8 bg-gray-100 rounded-lg animate-pulse" />
          ) : user && userData ? (
            <>
              {/* 토큰 잔액 */}
              <button
                onClick={onOpenPayment}
                className="flex items-center gap-1.5 bg-violet-50 text-violet-700 px-3 py-1.5 rounded-full text-sm font-medium hover:bg-violet-100 transition-colors"
              >
                <span>🪙</span>
                <span>{userData.isAdmin ? "∞" : userData.tokens}개</span>
              </button>

              {/* 유저 아바타 + 드롭다운 */}
              <div className="flex items-center gap-2">
                {userData.photoURL ? (
                  <img
                    src={userData.photoURL}
                    alt="사용자 프로필 사진"
                    className="w-8 h-8 rounded-full border border-gray-200"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-sm">
                    {userData.displayName?.[0] || "U"}
                  </div>
                )}

                {/* 마이페이지 링크 */}
                <a
                  href="/mypage"
                  className="text-xs text-gray-500 hover:text-violet-600 transition-colors"
                >
                  마이페이지
                </a>

                {/* 관리자 링크 */}
                {userData.isAdmin && (
                  <a
                    href="/admin"
                    className="text-xs text-red-500 hover:text-red-600 transition-colors"
                  >
                    관리자
                  </a>
                )}

                {/* 로그아웃 */}
                <button
                  onClick={logout}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  로그아웃
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={handleLogin}
              disabled={loggingIn}
              className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              {loggingIn ? "로그인 중..." : "구글 로그인"}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
