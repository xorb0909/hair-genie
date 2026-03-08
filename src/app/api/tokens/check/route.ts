// ============================================
// GET /api/tokens/check - 토큰 잔액 확인
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-helpers";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(request: NextRequest) {
  const decoded = await verifyAuth(request);
  if (!decoded) {
    return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  }

  const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
  if (!userDoc.exists) {
    return NextResponse.json({ error: "유저 없음" }, { status: 404 });
  }

  const data = userDoc.data()!;
  return NextResponse.json({
    tokens: data.tokens ?? 0,
    isAdmin: data.isAdmin ?? false,
  });
}
