// ============================================
// POST /api/payment/confirm - 토스페이먼츠 결제 승인
// - 결제 승인 → 토큰 충전 → Firestore 기록
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-helpers";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

// 토큰 패키지 정의
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
    const { paymentKey, orderId, amount } = await request.json();

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json({ error: "결제 정보 부족" }, { status: 400 });
    }

    // 토스페이먼츠 결제 승인 API 호출
    const secretKey = process.env.TOSS_SECRET_KEY;
    const encryptedKey = Buffer.from(`${secretKey}:`).toString("base64");

    const tossRes = await fetch(
      "https://api.tosspayments.com/v1/payments/confirm",
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${encryptedKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ paymentKey, orderId, amount }),
      }
    );

    const tossData = await tossRes.json();

    if (!tossRes.ok) {
      console.error("[Payment] 토스 결제 승인 실패:", tossData);
      return NextResponse.json(
        { error: tossData.message || "결제 승인 실패" },
        { status: 400 }
      );
    }

    // orderId에서 패키지 타입 추출 (형식: token_10_uid_timestamp)
    const packageType = orderId.split("_").slice(0, 2).join("_");
    const pkg = TOKEN_PACKAGES[packageType];

    if (!pkg || pkg.price !== amount) {
      console.error("[Payment] 패키지 불일치:", { packageType, amount });
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
      paymentKey,
      amount,
      packageType,
      tokensGranted: totalTokens,
      bonusTokens,
      isFirstPayment,
      status: "completed",
      tossData,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      tokensGranted: totalTokens,
      bonusTokens,
      isFirstPayment,
    });
  } catch (error) {
    console.error("[Payment] 에러:", error);
    return NextResponse.json({ error: "결제 처리 실패" }, { status: 500 });
  }
}
