// ============================================
// GET /api/health - 서버 상태 확인 API
// - Provider 연결 상태 포함
// ============================================

import { NextResponse } from "next/server";
import { getProvider } from "@/lib/provider-factory";

export async function GET() {
  const provider = getProvider();
  const providerHealthy = await provider.healthCheck();

  return NextResponse.json({
    status: "ok",
    provider: {
      name: provider.name,
      healthy: providerHealthy,
    },
    timestamp: new Date().toISOString(),
  });
}
