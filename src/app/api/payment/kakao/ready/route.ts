// ============================================
// POST /api/payment/kakao/ready - 카카오페이 결제 준비
// - 카카오페이 API에 결제 준비 요청
// - tid, redirect URL 반환
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-helpers";

const TOKEN_PACKAGES: Record<string, { tokens: number; price: number; label: string }> = {
  token_10: { tokens: 10, price: 1000, label: "토큰 10개" },
  token_30: { tokens: 30, price: 2500, label: "토큰 30개" },
  token_100: { tokens: 100, price: 7000, label: "토큰 100개" },
};

export async function POST(request: NextRequest) {
  const decoded = await verifyAuth(request);
  if (!decoded) {
    return NextResponse.json({ error: "인증 필요" }, { status: 401 });
  }

  try {
    const { packageId } = await request.json();
    const pkg = TOKEN_PACKAGES[packageId];

    if (!pkg) {
      return NextResponse.json({ error: "잘못된 패키지" }, { status: 400 });
    }

    const secretKey = process.env.KAKAO_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json({ error: "결제 설정 오류" }, { status: 500 });
    }

    const orderId = `${packageId}_${decoded.uid.slice(0, 8)}_${Date.now()}`;
    const origin = request.headers.get("origin") || request.headers.get("referer")?.replace(/\/$/, "") || "https://hair-genie-wine.vercel.app";

    const res = await fetch("https://open-api.kakaopay.com/online/v1/payment/ready", {
      method: "POST",
      headers: {
        Authorization: `SECRET_KEY ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cid: "TC0ONETIME", // 테스트용 CID
        partner_order_id: orderId,
        partner_user_id: decoded.uid,
        item_name: `Hair Genie ${pkg.label}`,
        quantity: 1,
        total_amount: pkg.price,
        tax_free_amount: 0,
        approval_url: `${origin}/payment/success?orderId=${encodeURIComponent(orderId)}`,
        cancel_url: `${origin}/payment/fail?code=CANCEL&message=${encodeURIComponent("결제가 취소되었습니다.")}`,
        fail_url: `${origin}/payment/fail?code=FAIL&message=${encodeURIComponent("결제에 실패했습니다.")}`,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[KakaoPay] 결제 준비 실패:", data);
      return NextResponse.json(
        { error: data.msg || "결제 준비 실패" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      tid: data.tid,
      redirectUrl: data.next_redirect_pc_url,
      redirectMobileUrl: data.next_redirect_mobile_url,
      orderId,
    });
  } catch (error) {
    console.error("[KakaoPay] 에러:", error);
    return NextResponse.json({ error: "결제 준비 실패" }, { status: 500 });
  }
}
