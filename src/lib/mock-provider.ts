// ============================================
// MockProvider - 개발/테스트용 더미 Provider
// - API 키 없이 동작
// - 원본 이미지를 그대로 data URL로 반환 (UI 테스트용)
// ============================================

import {
  HairTransformProvider,
  HairTransformInput,
  HairTransformOutput,
} from "./hair-transform-provider";

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

    // Mock: 원본 이미지를 그대로 N장 반환
    const dataUrl = `data:${input.sourceMimeType};base64,${input.sourceBase64}`;
    const resultDataUrls = Array(input.resultCount).fill(dataUrl);

    console.log(
      `[MockProvider] ${input.resultCount}장 생성 완료` +
        ` | 스타일: ${input.styleName}` +
        (input.colorName ? ` | 색상: ${input.colorName}` : "")
    );

    return {
      resultDataUrls,
      processingTimeMs: Date.now() - startTime,
    };
  }
}
