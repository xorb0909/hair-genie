// ============================================
// MockProvider - 개발/테스트용 더미 Provider
// - API 키 없이 동작
// - 원본 이미지를 복사해서 결과 3장으로 반환 (UI 테스트용)
// ============================================

import {
  HairTransformProvider,
  HairTransformInput,
  HairTransformOutput,
} from "./hair-transform-provider";
import { copyFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export class MockProvider implements HairTransformProvider {
  readonly name = "MockProvider";

  async healthCheck(): Promise<boolean> {
    return true;
  }

  async transform(input: HairTransformInput): Promise<HairTransformOutput> {
    const startTime = Date.now();

    // 실제 AI 처리 시간을 시뮬레이션 (2~4초 랜덤 대기)
    const delay = 2000 + Math.random() * 2000;
    await new Promise((resolve) => setTimeout(resolve, delay));

    // 출력 디렉토리 확보
    const outputDir = path.join(process.cwd(), "uploads", "output");
    await mkdir(outputDir, { recursive: true });

    // Mock: 원본 이미지를 N장 복사 (실제로는 Gemini가 변환)
    const ext = path.extname(input.sourcePath);
    const resultPaths: string[] = [];

    for (let i = 0; i < input.resultCount; i++) {
      const resultFileName = `result_${uuidv4()}${ext}`;
      const resultPath = path.join(outputDir, resultFileName);
      await copyFile(input.sourcePath, resultPath);
      resultPaths.push(resultPath);
    }

    console.log(
      `[MockProvider] ${input.resultCount}장 생성 완료` +
        ` | 스타일: ${input.styleName}` +
        (input.colorName ? ` | 색상: ${input.colorName}` : "")
    );

    return {
      resultPaths,
      processingTimeMs: Date.now() - startTime,
    };
  }
}
