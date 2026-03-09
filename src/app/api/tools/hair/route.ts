// ============================================
// POST /api/tools/hair - 헤어스타일 변환 API
// - 업로드된 사진(base64) + 스타일/색상 선택으로 Gemini 변환 실행
// - 토큰 잔액 확인 + 차감 (서버사이드)
// - 관리자는 토큰 차감 없이 무제한
// - Vercel 서버리스 호환 (파일시스템 사용 안 함)
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getProvider } from "@/lib/provider-factory";
import { findStyleById, findColorById } from "@/lib/style-data";
import { ApiResponse, TransformResult, TransformResultItem } from "@/types";
import { verifyAuth } from "@/lib/auth-helpers";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(request: NextRequest) {
  try {
    // === 인증 확인 ===
    const decoded = await verifyAuth(request);
    if (!decoded) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    // === 유저 데이터 조회 ===
    const userRef = adminDb.collection("users").doc(decoded.uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "유저 정보를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const userData = userDoc.data()!;
    const isAdmin = userData.isAdmin === true;

    // === 토큰 잔액 확인 (관리자 제외) ===
    if (!isAdmin && (userData.tokens ?? 0) < 1) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "TOKEN_EMPTY" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      sourceBase64,
      sourceMimeType,
      styleId,
      customStyleText,
      enableColor,
      colorId,
      resultCount = 3,
    } = body;

    // 필수 파라미터 검증
    if (!sourceBase64 || !sourceMimeType) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "본인 사진이 필요합니다." },
        { status: 400 }
      );
    }
    if (!styleId) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "헤어스타일을 선택해주세요." },
        { status: 400 }
      );
    }

    // 스타일 프롬프트 결정
    let stylePrompt: string;
    let styleName: string;

    if (styleId === "custom") {
      if (!customStyleText || customStyleText.trim().length === 0) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: "직접 입력 시 스타일 설명을 작성해주세요." },
          { status: 400 }
        );
      }
      stylePrompt = customStyleText.trim();
      styleName = "직접 입력";
    } else {
      const style = findStyleById(styleId);
      if (!style) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: "존재하지 않는 헤어스타일입니다." },
          { status: 400 }
        );
      }
      stylePrompt = style.prompt;
      styleName = style.nameKo;
    }

    // 색상 프롬프트 결정
    let colorPrompt: string | undefined;
    let colorName: string | undefined;

    if (enableColor && colorId) {
      const color = findColorById(colorId);
      if (!color) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: "존재하지 않는 염색 색상입니다." },
          { status: 400 }
        );
      }
      colorPrompt = color.prompt;
      colorName = color.nameKo;
    }

    // Provider를 통해 변환 실행
    const provider = getProvider();
    const output = await provider.transform({
      sourceBase64,
      sourceMimeType,
      stylePrompt,
      styleName,
      colorPrompt,
      colorName,
      resultCount: Math.min(resultCount, 5),
    });

    // === 변환 성공 시 토큰 차감 (관리자 제외) ===
    if (!isAdmin) {
      await userRef.update({
        tokens: FieldValue.increment(-1),
        totalUsed: FieldValue.increment(1),
      });
    }

    // === 사용 내역 기록 ===
    await adminDb.collection("usageHistory").add({
      uid: decoded.uid,
      toolId: "hair",
      styleId,
      styleName,
      colorId: colorId || null,
      colorName: colorName || null,
      resultCount: output.resultDataUrls.length,
      processingTimeMs: output.processingTimeMs,
      isAdmin,
      createdAt: FieldValue.serverTimestamp(),
    });

    // 결과 구성
    const sourceDataUrl = `data:${sourceMimeType};base64,${sourceBase64}`;

    const resultItems: TransformResultItem[] = output.resultDataUrls.map(
      (dataUrl) => ({
        id: uuidv4(),
        resultImageUrl: dataUrl,
      })
    );

    const result: TransformResult = {
      id: uuidv4(),
      status: "completed",
      sourceImageUrl: sourceDataUrl,
      styleName,
      colorName,
      results: resultItems,
      createdAt: new Date().toISOString(),
      processingTimeMs: output.processingTimeMs,
    };

    return NextResponse.json<ApiResponse<TransformResult>>({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("[Transform] 변환 실패:", error);
    const message =
      error instanceof Error ? error.message : "헤어스타일 변환 중 오류가 발생했습니다.";
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
