"use client";

// ============================================
// 관리자 페이지 - 유저 관리 + 통계
// - isAdmin 체크
// - 유저 목록 + 토큰 수동 지급/차감
// - 전체 사용량 통계
// ============================================

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useCallback } from "react";
import Header from "@/components/Header";

interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  tokens: number;
  totalUsed: number;
  isAdmin: boolean;
  createdAt: string | null;
}

interface Stats {
  totalUsers: number;
  totalApiCalls: number;
  todayApiCalls: number;
  totalRevenue: number;
  totalPayments: number;
  dailyStats: Record<string, number>;
}

export default function AdminPage() {
  const { user, userData, loading } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loadingData, setLoadingData] = useState(true);

  // 토큰 조정 모달
  const [adjustModal, setAdjustModal] = useState<{
    uid: string;
    name: string;
  } | null>(null);
  const [adjustAmount, setAdjustAmount] = useState("");
  const [adjustReason, setAdjustReason] = useState("");

  const fetchData = useCallback(async () => {
    if (!user) return;

    try {
      const idToken = await user.getIdToken();
      const headers = { Authorization: `Bearer ${idToken}` };

      const [usersRes, statsRes] = await Promise.all([
        fetch("/api/admin/users", { headers }),
        fetch("/api/admin/stats", { headers }),
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users);
      }
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error("관리자 데이터 로드 실패:", error);
    } finally {
      setLoadingData(false);
    }
  }, [user]);

  useEffect(() => {
    if (user && userData?.isAdmin) {
      fetchData();
    } else if (!loading) {
      setLoadingData(false);
    }
  }, [user, userData, loading, fetchData]);

  const handleAdjustTokens = async () => {
    if (!adjustModal || !adjustAmount || !user) return;

    const amount = parseInt(adjustAmount);
    if (isNaN(amount) || amount === 0) return;

    const idToken = await user.getIdToken();
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        targetUid: adjustModal.uid,
        amount,
        reason: adjustReason,
      }),
    });

    if (res.ok) {
      setAdjustModal(null);
      setAdjustAmount("");
      setAdjustReason("");
      fetchData();
    } else {
      alert("토큰 조정 실패");
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!userData?.isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
        <Header onOpenPayment={() => {}} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-xl font-bold text-gray-800">접근 권한 없음</p>
            <p className="text-sm text-gray-500 mt-2">관리자만 접근할 수 있습니다.</p>
            <a href="/" className="text-sm text-violet-600 mt-4 inline-block hover:underline">
              홈으로 돌아가기
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
      <Header onOpenPayment={() => {}} />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">관리자 대시보드</h2>

        {/* 통계 카드 */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            <StatCard label="전체 유저" value={stats.totalUsers} unit="명" />
            <StatCard label="전체 API 호출" value={stats.totalApiCalls} unit="회" />
            <StatCard label="오늘 API 호출" value={stats.todayApiCalls} unit="회" color="violet" />
            <StatCard
              label="총 결제 수익"
              value={stats.totalRevenue.toLocaleString()}
              unit="원"
              color="green"
            />
            <StatCard label="결제 건수" value={stats.totalPayments} unit="건" />
          </div>
        )}

        {/* 일별 사용량 */}
        {stats && Object.keys(stats.dailyStats).length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">
              최근 7일 API 호출
            </h3>
            <div className="flex items-end gap-2 h-32">
              {Object.entries(stats.dailyStats).map(([date, count]) => {
                const maxCount = Math.max(...Object.values(stats.dailyStats));
                const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
                return (
                  <div key={date} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs text-gray-600 font-medium">{count}</span>
                    <div
                      className="w-full bg-violet-400 rounded-t"
                      style={{ height: `${Math.max(height, 4)}%` }}
                    />
                    <span className="text-[10px] text-gray-400">
                      {date.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 유저 목록 */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">
              유저 목록 ({users.length}명)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-4 py-3 text-xs text-gray-500 font-medium">유저</th>
                  <th className="text-center px-4 py-3 text-xs text-gray-500 font-medium">토큰</th>
                  <th className="text-center px-4 py-3 text-xs text-gray-500 font-medium">사용량</th>
                  <th className="text-center px-4 py-3 text-xs text-gray-500 font-medium">가입일</th>
                  <th className="text-center px-4 py-3 text-xs text-gray-500 font-medium">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.uid} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-800">
                          {u.displayName || "이름 없음"}
                          {u.isAdmin && (
                            <span className="ml-1 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                              관리자
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-400">{u.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center font-medium text-violet-600">
                      {u.tokens}
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600">
                      {u.totalUsed}
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-gray-400">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString("ko") : "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() =>
                          setAdjustModal({
                            uid: u.uid,
                            name: u.displayName || u.email,
                          })
                        }
                        className="text-xs text-violet-600 hover:text-violet-800 font-medium"
                      >
                        토큰 조정
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <a
          href="/"
          className="block text-center text-sm text-gray-500 hover:text-violet-600 transition-colors"
        >
          ← 홈으로 돌아가기
        </a>
      </main>

      {/* 토큰 조정 모달 */}
      {adjustModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4 p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-800">토큰 조정</h3>
            <p className="text-sm text-gray-500">대상: {adjustModal.name}</p>

            <input
              type="number"
              value={adjustAmount}
              onChange={(e) => setAdjustAmount(e.target.value)}
              placeholder="양수: 지급 / 음수: 차감"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-violet-400 focus:outline-none"
            />
            <input
              type="text"
              value={adjustReason}
              onChange={(e) => setAdjustReason(e.target.value)}
              placeholder="사유 (선택)"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:border-violet-400 focus:outline-none"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setAdjustModal(null)}
                className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium"
              >
                취소
              </button>
              <button
                onClick={handleAdjustTokens}
                className="flex-1 py-3 rounded-xl bg-violet-600 text-white text-sm font-bold"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  unit,
  color = "gray",
}: {
  label: string;
  value: number | string;
  unit: string;
  color?: string;
}) {
  const colorClasses =
    color === "violet"
      ? "bg-violet-50 text-violet-600"
      : color === "green"
      ? "bg-green-50 text-green-600"
      : "bg-gray-50 text-gray-600";

  return (
    <div className={`rounded-xl p-4 text-center ${colorClasses}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-gray-500 mt-1">
        {label} ({unit})
      </p>
    </div>
  );
}
