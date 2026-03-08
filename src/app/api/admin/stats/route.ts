// ============================================
// GET /api/admin/stats - 전체 사용량 통계
// - 일별 API 호출 수, 수익 등
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { verifyAuth, isAdmin } from "@/lib/auth-helpers";
import { adminDb } from "@/lib/firebase-admin";

export async function GET(request: NextRequest) {
  const decoded = await verifyAuth(request);
  if (!decoded || !(await isAdmin(decoded.uid))) {
    return NextResponse.json({ error: "관리자 권한 필요" }, { status: 403 });
  }

  // 전체 유저 수
  const usersSnap = await adminDb.collection("users").get();
  const totalUsers = usersSnap.size;

  // 전체 사용량
  const usageSnap = await adminDb.collection("usageHistory").get();
  const totalApiCalls = usageSnap.size;

  // 오늘 사용량
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayUsageSnap = await adminDb
    .collection("usageHistory")
    .where("createdAt", ">=", today)
    .get();
  const todayApiCalls = todayUsageSnap.size;

  // 전체 결제 수익
  const paymentsSnap = await adminDb
    .collection("payments")
    .where("status", "==", "completed")
    .get();

  let totalRevenue = 0;
  let totalPayments = 0;
  paymentsSnap.forEach((doc) => {
    totalRevenue += doc.data().amount || 0;
    totalPayments++;
  });

  // 최근 7일간 일별 사용량
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const recentUsageSnap = await adminDb
    .collection("usageHistory")
    .where("createdAt", ">=", sevenDaysAgo)
    .orderBy("createdAt", "asc")
    .get();

  const dailyStats: Record<string, number> = {};
  recentUsageSnap.forEach((doc) => {
    const date = doc.data().createdAt?.toDate?.();
    if (date) {
      const key = date.toISOString().split("T")[0];
      dailyStats[key] = (dailyStats[key] || 0) + 1;
    }
  });

  return NextResponse.json({
    totalUsers,
    totalApiCalls,
    todayApiCalls,
    totalRevenue,
    totalPayments,
    dailyStats,
  });
}
