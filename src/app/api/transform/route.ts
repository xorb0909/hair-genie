// ============================================
// POST /api/transform - 헤어스타일 변환 API
// - 업로드된 사진 + 스타일/색상 선택으로 Gemini 변환 실행
// - Provider 패턴으로 AI 엔진 추상화
// ============================================

import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { existsSync } from "fs";
import { v4 as uuidv4 } from "uuid";
import { getProvider } from "@/lib/provider-factory";
import { findStyleById, findColorById } from "@/lib/style-data";
import { ApiResponse, TransformResult, TransformResultItem } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sourceImageId,
      styleId,
      customStyleText,
      enableColor,
      colorId,
      resultCount = 3,
    } = body;

    // 필수 파라미터 검증
    if (!sourceImageId) {
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

    // 파일 경로 확인
    const uploadsDir = path.join(process.cwd(), "uploads");
    const sourcePath = findFileById(path.join(uploadsDir, "input"), sourceImageId);

    if (!sourcePath) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "본인 사진을 찾을 수 없습니다. 다시 업로드해주세요." },
        { status: 404 }
      );
    }

    // Provider를 통해 변환 실행
    const provider = getProvider();
    const output = await provider.transform({
      sourcePath,
      stylePrompt,
      styleName,
      colorPrompt,
      colorName,
      resultCount: Math.min(resultCount, 5), // 최대 5장으로 제한
    });

    // 결과 URL 생성
    const resultItems: TransformResultItem[] = output.resultPaths.map(
      (resultPath) => ({
        id: uuidv4(),
        resultImageUrl: `/api/images/output/${path.basename(resultPath)}`,
      })
    );

    const result: TransformResult = {
      id: uuidv4(),
      status: "completed",
      sourceImageUrl: `/api/images/input/${path.basename(sourcePath)}`,
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

/**
 * uploads 디렉토리에서 ID로 시작하는 파일을 찾는 헬퍼
 */
function findFileById(dir: string, fileId: string): string | null {
  const extensions = [".jpg", ".jpeg", ".png", ".webp"];
  for (const ext of extensions) {
    const filePath = path.join(dir, `${fileId}${ext}`);
    if (existsSync(filePath)) return filePath;
  }
  return null;
}
