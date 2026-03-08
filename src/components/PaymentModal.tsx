"use client";

// ============================================
// PaymentModal - 토큰 충전 모달
// - 토큰 패키지 선택
// - 토스페이먼츠 결제 연동
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
  const { user, userData } = useAuth();
  const [selectedPkg, setSelectedPkg] = useState<string>("token_30");
  const [processing, setProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePayment = async () => {
    if (!user || !selectedPkg) return;

    setProcessing(true);
    try {
      const pkg = PACKAGES.find((p) => p.id === selectedPkg);
      if (!pkg) return;

      const orderId = `${selectedPkg}_${user.uid.slice(0, 8)}_${Date.now()}`;

      // 토스페이먼츠 SDK 동적 로드
      const { loadTossPayments } = await import("@tosspayments/tosspayments-sdk");
      const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
      if (!clientKey) {
        alert("결제 설정이 완료되지 않았습니다.");
        return;
      }

      const tossPayments = await loadTossPayments(clientKey);
      const payment = tossPayments.payment({ customerKey: user.uid });

      await payment.requestPayment({
        method: "CARD",
        amount: { currency: "KRW", value: pkg.price },
        orderId,
        orderName: `Hair Genie 토큰 ${pkg.label}`,
        customerEmail: user.email || undefined,
        customerName: user.displayName || undefined,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      });
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

  // 첫 결제 여부 확인 (userData에서)
  const isFirstPayment = (userData?.totalUsed ?? 0) >= 0; // 서버에서 판단하므로 UI에선 항상 표시

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
          {isFirstPayment && (
            <div className="mt-2 bg-white/20 rounded-lg px-3 py-1.5 inline-block">
              <span className="text-xs font-medium">
                첫 결제 보너스: +5 토큰 추가 지급!
              </span>
            </div>
          )}
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

        {/* 버튼 */}
        <div className="px-6 pb-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            닫기
          </button>
          <button
            onClick={handlePayment}
            disabled={processing || !selectedPkg}
            className="flex-1 py-3 rounded-xl bg-violet-600 text-white text-sm font-bold hover:bg-violet-700 transition-colors disabled:opacity-50"
          >
            {processing ? "처리 중..." : "결제하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
