"use client";

// ============================================
// AuthContext - Firebase 인증 + 유저 데이터 관리
// - 구글 로그인/로그아웃
// - Firestore 유저 데이터 실시간 구독
// - 토큰 잔액 등 유저 정보 제공
// ============================================

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  User,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, googleProvider, db } from "@/lib/firebase";

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  tokens: number;
  totalUsed: number;
  isAdmin: boolean;
  referralCode: string;
  referredBy: string | null;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signInWithGoogle: (referralCode?: string | null) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserData: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
  signInWithGoogle: async () => {},
  logout: async () => {},
  refreshUserData: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshUserData = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  // Firebase Auth 상태 감시
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        setUserData(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Firestore 유저 데이터 실시간 구독
  useEffect(() => {
    if (!user) return;

    const unsubscribe = onSnapshot(
      doc(db, "users", user.uid),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData({
            uid: data.uid,
            email: data.email,
            displayName: data.displayName,
            photoURL: data.photoURL,
            tokens: data.tokens ?? 0,
            totalUsed: data.totalUsed ?? 0,
            isAdmin: data.isAdmin ?? false,
            referralCode: data.referralCode ?? "",
            referredBy: data.referredBy ?? null,
            createdAt: data.createdAt?.toDate?.() ?? new Date(),
          });
        }
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, refreshTrigger]);

  // 구글 로그인
  const signInWithGoogle = useCallback(
    async (referralCode?: string | null) => {
      try {
        const result = await signInWithPopup(auth, googleProvider);
        const firebaseUser = result.user;

        // 서버에서 유저 등록/조회 처리
        const idToken = await firebaseUser.getIdToken();
        await fetch("/api/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ referralCode: referralCode || null }),
        });
      } catch (error) {
        console.error("로그인 실패:", error);
        throw error;
      }
    },
    []
  );

  // 로그아웃
  const logout = useCallback(async () => {
    await signOut(auth);
    setUserData(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, userData, loading, signInWithGoogle, logout, refreshUserData }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
