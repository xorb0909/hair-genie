// ============================================
// POST /api/payment/kakao/approve - 카카오페이 결제 승인
// - 결제 승인 → 토큰 충전 → Firestore 기록
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-helpers";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

const TOKEN_PACKAGES: Record<string, { tokens: number; price: number }> = {
  token_10: { tokens: 10, price: 1000 },
  token_30: { tokens: 30, price: 2500 },
  token_100: { tokens: 100, price: 7000 },
};

export async function POST(request: NextRequest) {
  const decoded = await verifyAuth(request);
  if (!decoded) {
    return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  }

  try {
    const { tid, pg_token, orderId } = await request.json();

    if (!tid || !pg_token || !orderId) {
      return NextResponse.json({ error: "결제 정보 부족" }, { status: 400 });
    }

    const secretKey = process.env.KAKAO_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: "결제 설정 오류" }, { status: 500 });
    }

    // 카카오페이 결제 승인 API 호출
    const res = await fetch("https://open-api.kakaopay.com/online/v1/payment/approve", {
      method: "POST",
      headers: {
        Authorization: `SECRET_KEY ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cid: "TC0ONETIME",
        tid,
        partner_order_id: orderId,
        partner_user_id: decoded.uid,
        pg_token,
      }),
    });

    const kakaoData = await res.json();

    if (!res.ok) {
      console.error("[KakaoPay] 결제 승인 실패:", kakaoData);
      return NextResponse.json(
        { error: kakaoData.msg || "결제 승인 실패" },
        { status: 400 }
      );
    }

    // orderId에서 패키지 타입 추출 (형식: token_10_uid_timestamp)
    const packageType = orderId.split("_").slice(0, 2).join("_");
    const pkg = TOKEN_PACKAGES[packageType];

    if (!pkg || pkg.price !== kakaoData.amount.total) {
      console.error("[KakaoPay] 패키지 불일치:", { packageType, amount: kakaoData.amount });
      return NextResponse.json({ error: "결제 정보 불일치" }, { status: 400 });
    }

    // 첫 결제 보너스 확인
    const prevPayments = await adminDb
      .collection("payments")
      .where("uid", "==", decoded.uid)
      .where("status", "==", "completed")
      .limit(1)
      .get();

    const isFirstPayment = prevPayments.empty;
    const bonusTokens = isFirstPayment ? 5 : 0;
    const totalTokens = pkg.tokens + bonusTokens;

    // 토큰 충전
    const userRef = adminDb.collection("users").doc(decoded.uid);
    await userRef.update({
      tokens: FieldValue.increment(totalTokens),
    });

    // 결제 내역 저장
    await adminDb.collection("payments").add({
      uid: decoded.uid,
      orderId,
      tid,
      amount: kakaoData.amount.total,
      packageType,
      tokensGranted: totalTokens,
      bonusTokens,
      isFirstPayment,
      status: "completed",
      paymentMethod: "kakaopay",
      kakaoData,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      tokensGranted: totalTokens,
      bonusTokens,
      isFirstPayment,
    });
  } catch (error) {
    console.error("[KakaoPay] 에러:", error);
    return NextResponse.json({ error: "결제 처리 실패" }, { status: 500 });
  }
}
