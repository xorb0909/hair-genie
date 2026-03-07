// ============================================
// POST /api/upload - 이미지 업로드 API
// - 파일 검증 (크기, 타입) 후 base64로 변환하여 반환
// - Vercel 서버리스 환경 호환 (파일시스템 사용 안 함)
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { ApiResponse, UploadResponse } from "@/types";

// 허용되는 이미지 타입
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
// 최대 파일 크기: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    // 파일 존재 여부 검증
    if (!file) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "파일이 선택되지 않았습니다." },
        { status: 400 }
      );
    }

    // 파일 타입 검증
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json<ApiResponse<null>>(
        {
          success: false,
          error: "지원하지 않는 파일 형식입니다. JPG, PNG, WebP만 가능합니다.",
        },
        { status: 400 }
      );
    }

    // 파일 크기 검증
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "파일 크기는 10MB 이하여야 합니다." },
        { status: 400 }
      );
    }

    // 파일을 base64로 변환
    const bytes = await file.arrayBuffer();
    const base64Data = Buffer.from(bytes).toString("base64");
    const fileId = uuidv4();

    // 응답: base64 데이터와 data URL 반환
    const dataUrl = `data:${file.type};base64,${base64Data}`;

    const response: UploadResponse = {
      id: fileId,
      url: dataUrl,
      originalName: file.name,
      base64Data,
      mimeType: file.type,
    };

    return NextResponse.json<ApiResponse<UploadResponse>>({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("[Upload] 업로드 실패:", error);
    return NextResponse.json<ApiResponse<null>>(
      { success: false, error: "파일 업로드 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
