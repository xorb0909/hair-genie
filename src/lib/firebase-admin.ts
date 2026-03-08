// ============================================
// Firebase Admin SDK (서버사이드 전용)
// - 토큰 차감, 결제 처리 등 보안이 필요한 작업
// - 환경변수 미설정 시 안전하게 처리
// ============================================

import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { getFirestore, Firestore } from "firebase-admin/firestore";

function getAdminApp(): App {
  if (getApps().length > 0) {
    return getApps()[0];
  }

  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey || privateKey === "여기에_입력") {
    return initializeApp({ projectId: projectId || "hair-genie-placeholder" });
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });
}

let _adminAuth: Auth | null = null;
let _adminDb: Firestore | null = null;

export function getAdminAuth(): Auth {
  if (!_adminAuth) {
    _adminAuth = getAuth(getAdminApp());
  }
  return _adminAuth;
}

export function getAdminDb(): Firestore {
  if (!_adminDb) {
    _adminDb = getFirestore(getAdminApp());
  }
  return _adminDb;
}

// 편의를 위한 export (lazy 초기화)
export const adminAuth = new Proxy({} as Auth, {
  get(_, prop) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (getAdminAuth() as any)[prop];
  },
});

export const adminDb = new Proxy({} as Firestore, {
  get(_, prop) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (getAdminDb() as any)[prop];
  },
});
