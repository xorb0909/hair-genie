// ============================================
// 헤어스타일 변환 서비스 - 타입 정의
// Gemini API 기반으로 재설계
// ============================================

/** 성별 */
export type Gender = "male" | "female";

/** 변환 요청 상태 */
export type TransformStatus =
  | "pending"    // 대기 중
  | "processing" // 처리 중
  | "completed"  // 완료
  | "failed";    // 실패

/** 헤어스타일 정의 */
export interface HairStyle {
  id: string;           // 스타일 고유 ID (예: "two_block")
  nameKo: string;       // 한국어 이름 (예: "투블럭")
  nameEn: string;       // 영문 이름 (예: "Two-block haircut")
  gender: Gender;       // 대상 성별
  prompt: string;       // Gemini에 보낼 프롬프트 설명
}

/** 염색 색상 정의 */
export interface HairColor {
  id: string;           // 색상 ID (예: "ash_brown")
  nameKo: string;       // 한국어 이름 (예: "애쉬 브라운")
  nameEn: string;       // 영문 이름
  hexCode: string;      // UI 표시용 대표 색상 코드
  prompt: string;       // Gemini에 보낼 색상 프롬프트
}

/** 프론트엔드 → 백엔드 변환 요청 */
export interface TransformRequest {
  gender: Gender;
  sourceImageId: string;         // 본인 사진 ID
  styleId: string;               // 선택한 헤어스타일 ID
  customStyleText?: string;      // 직접 입력한 스타일 설명 (styleId가 "custom"일 때)
  enableColor: boolean;          // 염색 기능 ON/OFF
  colorId?: string;              // 선택한 염색 색상 ID
  resultCount?: number;          // 결과 생성 개수 (기본 3)
}

/** 변환 결과 (단일) */
export interface TransformResultItem {
  id: string;
  resultImageUrl: string;        // 결과 사진 URL
}

/** 변환 결과 (전체) */
export interface TransformResult {
  id: string;
  status: TransformStatus;
  sourceImageUrl: string;        // 원본 사진 URL
  styleName: string;             // 적용된 스타일명
  colorName?: string;            // 적용된 색상명
  results: TransformResultItem[]; // 결과 이미지들 (3장)
  createdAt: string;
  processingTimeMs?: number;     // 처리 소요 시간 (ms)
  errorMessage?: string;         // 에러 메시지
}

/** 파일 업로드 응답 */
export interface UploadResponse {
  id: string;
  url: string;
  originalName: string;
  base64Data: string;    // base64 인코딩된 이미지 데이터
  mimeType: string;      // image/jpeg, image/png, image/webp
}

/** API 공통 응답 래퍼 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
