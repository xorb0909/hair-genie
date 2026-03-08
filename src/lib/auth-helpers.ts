// ============================================
// 서버사이드 인증 헬퍼
// - Firebase ID 토큰 검증
// - 관리자 권한 확인
// ============================================

import { adminAuth, adminDb } from "./firebase-admin";

export async function verifyAuth(request: Request) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  try {
    const token = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(token);
    return decoded;
  } catch {
    return null;
  }
}

export async function isAdmin(uid: string): Promise<boolean> {
  const userDoc = await adminDb.collection("users").doc(uid).get();
  return userDoc.exists && userDoc.data()?.isAdmin === true;
}
