"use client";

// ============================================
// AI Studio 허브 메인 페이지
// - 여러 AI 툴 카드를 나열하고 클릭 시 해당 툴 페이지로 이동
// ============================================

import { useState } from "react";
import Header from "@/components/Header";
import ToolCard from "@/components/ToolCard";
import PaymentModal from "@/components/PaymentModal";
import { TOOLS } from "@/lib/tools-config";

export default function Home() {
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentReason, setPaymentReason] = useState<"empty" | "charge">("charge");

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
      {/* 헤더 */}
      <Header
        onOpenPayment={() => {
          setPaymentReason("charge");
          setPaymentOpen(true);
        }}
      />

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* 히어로 섹션 */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            AI로 나를 꾸며보세요
          </h2>
          <p className="text-gray-500 text-base">
            헤어스타일 변환, 배경 변경 등 다양한 AI 뷰티 툴을 한 곳에서 체험하세요
          </p>
        </div>

        {/* 툴 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.id} {...tool} />
          ))}
        </div>

        {/* 하단 안내 */}
        <div className="text-center bg-white rounded-2xl border border-gray-200 p-8">
          <p className="text-2xl mb-2">🪙</p>
          <p className="text-sm font-medium text-gray-700 mb-1">
            토큰 하나로 어떤 툴이든 사용 가능
          </p>
          <p className="text-xs text-gray-400">
            토큰을 충전하면 모든 AI 툴을 자유롭게 이용할 수 있어요
          </p>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="border-t border-gray-100 mt-16">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center">
          <p className="text-xs text-gray-400">
            AI Studio - AI 뷰티 툴 모음
          </p>
          <p className="text-[10px] text-gray-300 mt-1">
            결과 이미지는 참고용이며 실제와 차이가 있을 수 있습니다.
          </p>
        </div>
      </footer>

      {/* 결제 모달 */}
      <PaymentModal
        isOpen={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        reason={paymentReason}
      />
    </div>
  );
}
