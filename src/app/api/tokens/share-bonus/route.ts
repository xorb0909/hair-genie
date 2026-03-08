// ============================================
// POST /api/tokens/share-bonus - 공유 보너스 토큰 지급
// - 하루 1회만 지급
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-helpers";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  const decoded = await verifyAuth(request);
  if (!decoded) {
    return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  }

  const { platform } = await request.json(); // "kakao" | "instagram"

  // 오늘 이미 보너스를 받았는지 확인
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const bonusRef = adminDb
    .collection("users")
    .doc(decoded.uid)
    .collection("shareBonuses")
    .doc(today);

  const bonusDoc = await bonusRef.get();
  if (bonusDoc.exists) {
    return NextResponse.json({
      success: false,
      error: "오늘은 이미 공유 보너스를 받았어요. 내일 다시 시도해주세요!",
    });
  }

  // 보너스 지급
  await bonusRef.set({
    platform,
    grantedAt: FieldValue.serverTimestamp(),
  });

  await adminDb
    .collection("users")
    .doc(decoded.uid)
    .update({
      tokens: FieldValue.increment(1),
    });

  return NextResponse.json({ success: true, bonusTokens: 1 });
}
