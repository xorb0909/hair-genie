// ============================================
// HairTransformProvider 인터페이스
// - Gemini API 기반으로 재설계
// - 이미지 + 텍스트 프롬프트로 헤어 영역만 편집
// - MockProvider / GeminiProvider 등 교체 가능
// ============================================

export interface HairTransformInput {
  sourcePath: string;          // 사용자 본인 사진 경로
  stylePrompt: string;         // 헤어스타일 프롬프트 (영문)
  styleName: string;           // 스타일명 (한국어, 결과 표시용)
  colorPrompt?: string;        // (선택) 염색 색상 프롬프트
  colorName?: string;          // (선택) 색상명 (한국어)
  resultCount: number;         // 결과 생성 개수 (기본 3)
}

export interface HairTransformOutput {
  resultPaths: string[];       // 결과 이미지 저장 경로들
  processingTimeMs: number;    // 처리 시간
}

/**
 * 헤어 변환 Provider 인터페이스
 * 모든 헤어 변환 엔진은 이 인터페이스를 구현해야 합니다.
 */
export interface HairTransformProvider {
  /** Provider 이름 */
  readonly name: string;

  /** 서버 연결 상태 확인 */
  healthCheck(): Promise<boolean>;

  /** 헤어 변환 실행 */
  transform(input: HairTransformInput): Promise<HairTransformOutput>;
}
