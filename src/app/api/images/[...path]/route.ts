// ============================================
// GET /api/images/[category]/[filename] - 이미지 서빙 API
// - uploads 폴더의 이미지를 안전하게 서빙
// - 경로 탐색(path traversal) 공격 방지
// ============================================

import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

const MIME_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const segments = (await params).path;

    // 경로 탐색 공격 방지: ".."이 포함된 세그먼트 차단
    if (segments.some((s) => s.includes(".."))) {
      return NextResponse.json({ error: "잘못된 경로" }, { status: 400 });
    }

    // 허용된 카테고리만 접근 가능
    const allowedCategories = ["input", "output", "color"];
    if (!allowedCategories.includes(segments[0])) {
      return NextResponse.json({ error: "잘못된 카테고리" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "uploads", ...segments);
    const ext = path.extname(filePath).toLowerCase();
    const mimeType = MIME_TYPES[ext];

    if (!mimeType) {
      return NextResponse.json(
        { error: "지원하지 않는 파일 형식" },
        { status: 400 }
      );
    }

    const fileBuffer = await readFile(filePath);
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "이미지를 찾을 수 없습니다." },
      { status: 404 }
    );
  }
}
