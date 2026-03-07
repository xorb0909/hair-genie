// ============================================
// POST /api/upload - 이미지 업로드 API
// - 사용자 사진, 스타일 레퍼런스, 색상 레퍼런스 업로드 처리
// - 파일 검증 (크기, 타입) 후 로컬 저장
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
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
    // category: "input" (본인 사진), "style" (스타일 레퍼런스), "color" (색상 레퍼런스)
    const category = (formData.get("category") as string) || "input";

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

    // 카테고리 검증
    const validCategories = ["input", "style", "color"];
    if (!validCategories.includes(category)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, error: "잘못된 카테고리입니다." },
        { status: 400 }
      );
    }

    // 저장 디렉토리 결정
    const uploadDir = path.join(process.cwd(), "uploads", category === "style" ? "input" : category);
    await mkdir(uploadDir, { recursive: true });

    // 안전한 파일명 생성 (UUID + 원래 확장자)
    const ext = path.extname(file.name).toLowerCase();
    const safeExts = [".jpg", ".jpeg", ".png", ".webp"];
    const finalExt = safeExts.includes(ext) ? ext : ".png";
    const fileId = uuidv4();
    const fileName = `${fileId}${finalExt}`;
    const filePath = path.join(uploadDir, fileName);

    // 파일 저장
    const bytes = await file.arrayBuffer();
    await writeFile(filePath, Buffer.from(bytes));

    // 응답: 파일 ID와 접근 URL 반환
    const response: UploadResponse = {
      id: fileId,
      url: `/api/images/${category === "style" ? "input" : category}/${fileName}`,
      originalName: file.name,
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
