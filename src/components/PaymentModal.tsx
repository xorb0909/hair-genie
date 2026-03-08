"use client";

// ============================================
// PaymentModal - 토큰 충전 모달
// - 토큰 패키지 선택
// - 카카오페이 결제 연동
// ============================================

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  reason?: "empty" | "charge"; // empty: 토큰 부족, charge: 자발적 충전
}

const PACKAGES = [
  { id: "token_10", tokens: 10, price: 1000, label: "10개", priceLabel: "1,000원" },
  { id: "token_30", tokens: 30, price: 2500, label: "30개", priceLabel: "2,500원", popular: true },
  { id: "token_100", tokens: 100, price: 7000, label: "100개", priceLabel: "7,000원", best: true },
];

export default function PaymentModal({ isOpen, onClose, reason = "charge" }: PaymentModalProps) {
  const { user } = useAuth();
  const [selectedPkg, setSelectedPkg] = useState<string>("token_30");
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePayment = async () => {
    if (!user || !selectedPkg) return;

    setProcessing(true);
    try {
      const idToken = await user.getIdToken();

      // 1. 서버에 결제 준비 요청
      const readyRes = await fetch("/api/payment/kakao/ready", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ packageId: selectedPkg }),
      });

      const readyData = await readyRes.json();

      if (!readyData.success) {
        alert(readyData.error || "결제 준비에 실패했습니다.");
        return;
      }

      // tid와 orderId를 sessionStorage에 저장 (승인 시 필요)
      sessionStorage.setItem("kakao_tid", readyData.tid);
      sessionStorage.setItem("kakao_orderId", readyData.orderId);

      // 2. 카카오페이 결제창으로 이동 (모바일/PC 분기)
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const redirectUrl = isMobile ? readyData.redirectMobileUrl : readyData.redirectUrl;

      window.location.href = redirectUrl;
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : "";
      if (!errMsg.includes("취소") && !errMsg.includes("CANCEL")) {
        console.error("[Payment] 결제 에러:", error);
        alert("결제 중 오류가 발생했습니다.");
      }
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white p-6">
          <h2 className="text-lg font-bold">
            {reason === "empty" ? "토큰이 부족해요!" : "토큰 충전"}
          </h2>
          <p className="text-sm text-white/80 mt-1">
            {reason === "empty"
              ? "토큰을 충전하고 헤어스타일 변환을 계속 즐겨보세요"
              : "토큰을 충전하면 더 많은 헤어스타일을 체험할 수 있어요"}
          </p>
          <div className="mt-2 bg-white/20 rounded-lg px-3 py-1.5 inline-block">
            <span className="text-xs font-medium">
              첫 결제 보너스: +5 토큰 추가 지급!
            </span>
          </div>
        </div>

        {/* 패키지 선택 */}
        <div className="p-6 space-y-3">
          {PACKAGES.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setSelectedPkg(pkg.id)}
              className={`
                w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all
                ${
                  selectedPkg === pkg.id
                    ? "border-violet-500 bg-violet-50"
                    : "border-gray-200 hover:border-gray-300"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">🪙</span>
                <div className="text-left">
                  <p className="font-bold text-gray-800">토큰 {pkg.label}</p>
                  <p className="text-xs text-gray-400">
                    {pkg.best
                      ? "가장 저렴해요! (개당 70원)"
                      : pkg.popular
                      ? "인기 패키지 (개당 83원)"
                      : "개당 100원"}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-violet-600">{pkg.priceLabel}</p>
                {(pkg.popular || pkg.best) && (
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      pkg.best
                        ? "bg-amber-100 text-amber-700"
                        : "bg-violet-100 text-violet-700"
                    }`}
                  >
                    {pkg.best ? "BEST" : "인기"}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* 결제수단 안내 */}
        <div className="px-6 pb-2">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>카카오페이로 간편하게 결제됩니다</span>
          </div>
        </div>

        {/* 버튼 */}
        <div className="px-6 pb-6 pt-3 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            닫기
          </button>
          <button
            onClick={handlePayment}
            disabled={processing || !selectedPkg}
            className="flex-1 py-3 rounded-xl bg-[#FEE500] text-[#191919] text-sm font-bold hover:bg-[#FDD835] transition-colors disabled:opacity-50"
          >
            {processing ? "처리 중..." : "카카오페이 결제"}
          </button>
        </div>
      </div>
    </div>
  );
}
