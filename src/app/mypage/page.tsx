"use client";

// ============================================
// 마이페이지 - 잔액, 사용내역, 초대링크, 초대 친구 수
// ============================================

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import PaymentModal from "@/components/PaymentModal";
import Header from "@/components/Header";

export default function MyPage() {
  const { user, userData, loading } = useAuth();
  const [referralCount, setReferralCount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);

  // 초대한 친구 수 조회
  useEffect(() => {
    if (!user) return;

    const fetchReferrals = async () => {
      const q = query(
        collection(db, "users"),
        where("referredBy", "==", user.uid)
      );
      const snap = await getDocs(q);
      setReferralCount(snap.size);
    };

    fetchReferrals();
  }, [user]);

  const copyReferralLink = () => {
    if (!userData) return;
    const link = `https://ddokddak-ai.vercel.app/?ref=${userData.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
        <Header onOpenPayment={() => {}} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-gray-500">로그인이 필요합니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
      <Header onOpenPayment={() => setPaymentOpen(true)} />

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">마이페이지</h2>

        {/* 프로필 카드 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-4">
            {userData.photoURL ? (
              <img
                src={userData.photoURL}
                alt="사용자 프로필 사진"
                className="w-16 h-16 rounded-full border-2 border-violet-200"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 font-bold text-2xl">
                {userData.displayName?.[0] || "U"}
              </div>
            )}
            <div>
              <h3 className="text-lg font-bold text-gray-800">
                {userData.displayName}
              </h3>
              <p className="text-sm text-gray-500">{userData.email}</p>
              {userData.isAdmin && (
                <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-medium">
                  관리자
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 토큰 정보 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">토큰 현황</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-violet-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-violet-600">
                {userData.isAdmin ? "∞" : userData.tokens}
              </p>
              <p className="text-xs text-gray-500 mt-1">잔여 토큰</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold text-gray-600">
                {userData.totalUsed}
              </p>
              <p className="text-xs text-gray-500 mt-1">총 사용량</p>
            </div>
          </div>
          <button
            onClick={() => setPaymentOpen(true)}
            className="w-full mt-4 py-3 rounded-xl bg-violet-600 text-white font-bold hover:bg-violet-700 transition-colors"
          >
            토큰 충전하기
          </button>
        </div>

        {/* 친구 초대 */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            친구 초대
          </h3>
          <p className="text-xs text-gray-400 mb-4">
            친구를 초대하면 나도 +2토큰, 친구도 +2토큰 보너스!
          </p>

          {/* 초대 링크 */}
          <div className="flex gap-2">
            <input
              readOnly
              value={`https://ddokddak-ai.vercel.app/?ref=${userData.referralCode}`}
              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600"
            />
            <button
              onClick={copyReferralLink}
              className="px-4 py-2 bg-violet-100 text-violet-700 rounded-lg text-xs font-medium hover:bg-violet-200 transition-colors whitespace-nowrap"
            >
              {copied ? "복사됨!" : "복사"}
            </button>
          </div>

          {/* 초대 현황 */}
          <div className="mt-4 bg-amber-50 rounded-xl p-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-amber-800">
                초대한 친구
              </p>
              <p className="text-xs text-amber-600">
                {referralCount > 0
                  ? `총 ${referralCount * 2} 보너스 토큰 획득!`
                  : "아직 초대한 친구가 없어요"}
              </p>
            </div>
            <p className="text-3xl font-bold text-amber-600">{referralCount}명</p>
          </div>
        </div>

        {/* 홈으로 */}
        <a
          href="/"
          className="block text-center text-sm text-gray-500 hover:text-violet-600 transition-colors"
        >
          ← 홈으로 돌아가기
        </a>
      </main>

      <PaymentModal
        isOpen={paymentOpen}
        onClose={() => setPaymentOpen(false)}
      />
    </div>
  );
}
