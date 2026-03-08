// ============================================
// GET /api/admin/users - 전체 유저 목록 조회
// POST /api/admin/users - 특정 유저 토큰 수동 지급/차감
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { verifyAuth, isAdmin } from "@/lib/auth-helpers";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function GET(request: NextRequest) {
  const decoded = await verifyAuth(request);
  if (!decoded || !(await isAdmin(decoded.uid))) {
    return NextResponse.json({ error: "관리자 권한 필요" }, { status: 403 });
  }

  const usersSnap = await adminDb
    .collection("users")
    .orderBy("createdAt", "desc")
    .get();

  const users = usersSnap.docs.map((doc) => {
    const data = doc.data();
    return {
      uid: doc.id,
      email: data.email,
      displayName: data.displayName,
      photoURL: data.photoURL,
      tokens: data.tokens ?? 0,
      totalUsed: data.totalUsed ?? 0,
      isAdmin: data.isAdmin ?? false,
      referralCode: data.referralCode,
      createdAt: data.createdAt?.toDate?.()?.toISOString() ?? null,
    };
  });

  return NextResponse.json({ users });
}

export async function POST(request: NextRequest) {
  const decoded = await verifyAuth(request);
  if (!decoded || !(await isAdmin(decoded.uid))) {
    return NextResponse.json({ error: "관리자 권한 필요" }, { status: 403 });
  }

  const { targetUid, amount, reason } = await request.json();

  if (!targetUid || typeof amount !== "number") {
    return NextResponse.json({ error: "잘못된 요청" }, { status: 400 });
  }

  const userRef = adminDb.collection("users").doc(targetUid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    return NextResponse.json({ error: "유저를 찾을 수 없음" }, { status: 404 });
  }

  await userRef.update({
    tokens: FieldValue.increment(amount),
  });

  // 관리자 작업 로그 기록
  await adminDb.collection("adminLogs").add({
    adminUid: decoded.uid,
    targetUid,
    action: amount > 0 ? "grant" : "deduct",
    amount,
    reason: reason || "",
    createdAt: FieldValue.serverTimestamp(),
  });

  return NextResponse.json({ success: true });
}
