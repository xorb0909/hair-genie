"use client";

// ============================================
// 결제 성공 페이지
// - 카카오페이 리다이렉트 후 서버에 결제 승인 요청
// ============================================

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Suspense } from "react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const { user, refreshUserData } = useAuth();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [result, setResult] = useState<{
    tokensGranted: number;
    bonusTokens: number;
    isFirstPayment: boolean;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const confirmPayment = async () => {
      if (!user) return;

      // 카카오페이에서 전달받는 pg_token
      const pgToken = searchParams.get("pg_token");
      const orderId = sessionStorage.getItem("kakao_orderId");
      const tid = sessionStorage.getItem("kakao_tid");

      if (!pgToken || !orderId || !tid) {
        setStatus("error");
        setErrorMsg("결제 정보가 올바르지 않습니다.");
        return;
      }

      try {
        const idToken = await user.getIdToken();
        const res = await fetch("/api/payment/kakao/approve", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            tid,
            pg_token: pgToken,
            orderId,
          }),
        });

        const data = await res.json();

        if (data.success) {
          setResult(data);
          setStatus("success");
          refreshUserData();
          // 사용 완료된 결제 정보 제거
          sessionStorage.removeItem("kakao_tid");
          sessionStorage.removeItem("kakao_orderId");
        } else {
          setStatus("error");
          setErrorMsg(data.error || "결제 처리 실패");
        }
      } catch {
        setStatus("error");
        setErrorMsg("결제 확인 중 오류가 발생했습니다.");
      }
    };

    confirmPayment();
  }, [user, searchParams, refreshUserData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
        {status === "loading" && (
          <>
            <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4" />
            <h2 className="text-lg font-bold text-gray-800">결제 확인 중...</h2>
            <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요</p>
          </>
        )}

        {status === "success" && result && (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-800">결제 완료!</h2>
            <p className="text-3xl font-bold text-violet-600 mt-4">
              🪙 +{result.tokensGranted}개
            </p>
            {result.isFirstPayment && result.bonusTokens > 0 && (
              <p className="text-sm text-amber-600 mt-2 font-medium">
                첫 결제 보너스 +{result.bonusTokens}개 포함!
              </p>
            )}
            <a
              href="/"
              className="block mt-6 py-3 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-700 transition-colors"
            >
              헤어스타일 변환하러 가기
            </a>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-800">결제 처리 실패</h2>
            <p className="text-sm text-gray-500 mt-2">{errorMsg}</p>
            <a
              href="/"
              className="block mt-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition-colors"
            >
              홈으로 돌아가기
            </a>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
