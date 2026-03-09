// ============================================
// POST /api/tools/background - 배경 변경 API
// - 업로드된 사진(base64) + 배경 프리셋/커스텀 프롬프트로 Gemini 변환
// - 토큰 잔액 확인 + 차감 (서버사이드)
// - 관리자는 토큰 차감 없이 무제한
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { ApiResponse } from "@/types";
import { verifyAuth } from "@/lib/auth-helpers";
import { adminDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { BACKGROUND_PRESETS } from "@/lib/background-data";
import { GoogleGenAI } from "@google/genai";

interface BackgroundResult {
  id: string;
  sourceImageUrl: string;
  resultImageUrl: string;
  backgroundName: string;
  processingTimeMs?: number;
}

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
    const { sourceBase64, sourceMimeType, presetId, customPrompt } = body;

    // 필수 파라미터 검증
    if (!sourceBase64 || !sourceMimeType) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "사진이 필요합니다." },
        { status: 400 }
      );
    }

    // 배경 프롬프트 결정
    let backgroundPrompt: string;
    let backgroundName: string;

    if (presetId) {
      const preset = BACKGROUND_PRESETS.find((p) => p.id === presetId);
      if (!preset) {
        return NextResponse.json<ApiResponse<null>>(
          { success: false, error: "존재하지 않는 배경 프리셋입니다." },
          { status: 400 }
        );
      }
      backgroundPrompt = preset.prompt;
      backgroundName = preset.name;
    } else if (customPrompt && customPrompt.trim().length > 0) {
      backgroundPrompt = customPrompt.trim();
      backgroundName = "직접 입력";
    } else {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "배경을 선택하거나 직접 입력해주세요." },
        { status: 400 }
      );
    }

    // Gemini API 호출
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY 환경변수가 설정되지 않았습니다.");
    }

    const client = new GoogleGenAI({ apiKey });
    const startTime = Date.now();

    const prompt =
      `Change the background of this photo to: ${backgroundPrompt}. ` +
      `Keep the subject (person) completely intact and natural-looking. ` +
      `Make the composite realistic with proper lighting and shadows.`;

    console.log(`[Background] 프롬프트: ${prompt}`);

    const response = await client.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: sourceMimeType,
                data: sourceBase64,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    const processingTimeMs = Date.now() - startTime;

    // 안전 필터 체크
    const finishReason = response.candidates?.[0]?.finishReason as string | undefined;
    if (finishReason === "SAFETY" || finishReason === "BLOCKED") {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "안전 필터에 의해 차단되었습니다. 다른 사진으로 시도해주세요." },
        { status: 400 }
      );
    }

    // 응답에서 이미지 추출
    const parts = response.candidates?.[0]?.content?.parts;
    let resultDataUrl: string | null = null;

    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          const mimeType = part.inlineData.mimeType || "image/png";
          resultDataUrl = `data:${mimeType};base64,${part.inlineData.data}`;
          break;
        }
      }
    }

    if (!resultDataUrl) {
      throw new Error(
        "Gemini API에서 이미지를 생성하지 못했습니다. 다른 사진으로 다시 시도해주세요."
      );
    }

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
      toolId: "background",
      backgroundName,
      resultCount: 1,
      processingTimeMs,
      isAdmin,
      createdAt: FieldValue.serverTimestamp(),
    });

    const sourceDataUrl = `data:${sourceMimeType};base64,${sourceBase64}`;

    const result: BackgroundResult = {
      id: uuidv4(),
      sourceImageUrl: sourceDataUrl,
      resultImageUrl: resultDataUrl,
      backgroundName,
      processingTimeMs,
    };

    return NextResponse.json<ApiResponse<BackgroundResult>>({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("[Background] 변환 실패:", error);
    const message =
      error instanceof Error ? error.message : "배경 변경 중 오류가 발생했습니다.";
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
