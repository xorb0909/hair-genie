// ============================================
// POST /api/auth/register - 유저 등록/조회
// - Firebase Auth 토큰 검증
// - 신규 유저: Firestore에 생성 + 초대코드 처리
// - 기존 유저: 그냥 패스
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  try {
    // 토큰 검증
    const authHeader = request.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "인증 필요" }, { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(idToken);
    const { uid, email, name, picture } = decoded;

    const { referralCode } = await request.json();

    // 이미 등록된 유저인지 확인
    const userRef = adminDb.collection("users").doc(uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      return NextResponse.json({ success: true, isNew: false });
    }

    // 관리자 이메일 확인
    const adminEmail = process.env.ADMIN_EMAIL || "xorb090916@gmail.com";
    const isAdmin = email === adminEmail;

    // 신규 유저 생성
    let baseTokens = 3;
    let referredByUid: string | null = null;

    // 초대 코드 처리
    if (referralCode) {
      const referrerQuery = await adminDb
        .collection("users")
        .where("referralCode", "==", referralCode)
        .limit(1)
        .get();

      if (!referrerQuery.empty) {
        const referrerDoc = referrerQuery.docs[0];
        referredByUid = referrerDoc.id;

        // 추천인에게 +2 토큰
        await referrerDoc.ref.update({
          tokens: FieldValue.increment(2),
        });

        // 신규 가입자 보너스 +2 (기본 3 + 보너스 2 = 5)
        baseTokens += 2;
      }
    }

    const newUser = {
      uid,
      email: email || "",
      displayName: name || "",
      photoURL: picture || "",
      tokens: baseTokens,
      totalUsed: 0,
      isAdmin,
      referralCode: uuidv4().slice(0, 8),
      referredBy: referredByUid,
      createdAt: FieldValue.serverTimestamp(),
    };

    await userRef.set(newUser);

    return NextResponse.json({ success: true, isNew: true, tokens: baseTokens });
  } catch (error) {
    console.error("[Register] 에러:", error);
    return NextResponse.json(
      { error: "유저 등록 실패" },
      { status: 500 }
    );
  }
}
