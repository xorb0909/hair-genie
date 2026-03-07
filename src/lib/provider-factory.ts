// ============================================
// Provider Factory - 환경에 따라 적절한 Provider를 생성
// - TRANSFORM_PROVIDER 환경변수로 제어
// - "mock" → MockProvider (기본값, 개발용)
// - "gemini" → GeminiProvider (Gemini API 연동)
// ============================================

import { HairTransformProvider } from "./hair-transform-provider";
import { MockProvider } from "./mock-provider";
import { GeminiProvider } from "./gemini-provider";

let providerInstance: HairTransformProvider | null = null;

export function getProvider(): HairTransformProvider {
  if (providerInstance) return providerInstance;

  const providerType = process.env.TRANSFORM_PROVIDER || "mock";

  switch (providerType) {
    case "gemini":
      providerInstance = new GeminiProvider();
      break;
    case "mock":
    default:
      providerInstance = new MockProvider();
      break;
  }

  console.log(`[Provider] ${providerInstance.name} 활성화됨`);
  return providerInstance;
}
