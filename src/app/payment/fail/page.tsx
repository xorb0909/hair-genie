"use client";

// ============================================
// 결제 실패 페이지
// ============================================

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function PaymentFailContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("code") || "";
  const errorMessage = searchParams.get("message") || "결제가 취소되었거나 실패했습니다.";

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-gray-800">결제 실패</h2>
        <p className="text-sm text-gray-500 mt-2">{errorMessage}</p>
        {errorCode && (
          <p className="text-xs text-gray-400 mt-1">오류 코드: {errorCode}</p>
        )}
        <a
          href="/"
          className="block mt-6 py-3 rounded-xl bg-gray-200 text-gray-700 font-bold hover:bg-gray-300 transition-colors"
        >
          홈으로 돌아가기
        </a>
      </div>
    </div>
  );
}

export default function PaymentFailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      }
    >
      <PaymentFailContent />
    </Suspense>
  );
}
