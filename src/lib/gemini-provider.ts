// ============================================
// GeminiProvider - Google Gemini API로 헤어스타일 변환
// - 사용자 사진 + 텍스트 프롬프트로 머리 영역만 편집
// - 얼굴/배경은 유지, 헤어스타일만 변경
// - 결과 N장 생성 (API를 N회 호출)
// ============================================

import {
  HairTransformProvider,
  HairTransformInput,
  HairTransformOutput,
} from "./hair-transform-provider";
import { GoogleGenAI, Type } from "@google/genai";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export class GeminiProvider implements HairTransformProvider {
  readonly name = "GeminiProvider";
  private client: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GEMINI_API_KEY 환경변수가 설정되지 않았습니다. " +
          "https://aistudio.google.com 에서 API 키를 발급받고 .env.local에 설정해주세요."
      );
    }
    this.client = new GoogleGenAI({ apiKey });
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.models.generateContent({
        model: "gemini-2.0-flash",
        contents: "Hello",
      });
      return !!response.text;
    } catch {
      return false;
    }
  }

  async transform(input: HairTransformInput): Promise<HairTransformOutput> {
    const startTime = Date.now();

    // 출력 디렉토리 확보
    const outputDir = path.join(process.cwd(), "uploads", "output");
    await mkdir(outputDir, { recursive: true });

    // 원본 이미지를 Base64로 읽기
    const imageBuffer = await readFile(input.sourcePath);
    const base64Image = imageBuffer.toString("base64");

    // 확장자로 MIME 타입 결정
    const ext = path.extname(input.sourcePath).toLowerCase();
    const mimeType =
      ext === ".png"
        ? "image/png"
        : ext === ".webp"
          ? "image/webp"
          : "image/jpeg";

    // 프롬프트 조합
    const prompt = this.buildPrompt(input);
    console.log(`[GeminiProvider] 프롬프트: ${prompt}`);

    // N장 생성 (각각 독립적으로 API 호출)
    const resultPaths: string[] = [];

    for (let i = 0; i < input.resultCount; i++) {
      try {
        console.log(
          `[GeminiProvider] 결과 ${i + 1}/${input.resultCount} 생성 중...`
        );

        const response = await this.client.models.generateContent({
          model: "gemini-2.5-flash-image",
          contents: [
            {
              role: "user",
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType,
                    data: base64Image,
                  },
                },
              ],
            },
          ],
          config: {
            responseModalities: ["TEXT", "IMAGE"],
          },
        });

        // 전체 응답 구조 로깅 (디버깅용)
        console.log(
          `[GeminiProvider] 응답 candidates 수:`,
          response.candidates?.length ?? 0
        );

        if (response.candidates?.[0]?.finishReason) {
          console.log(
            `[GeminiProvider] finishReason:`,
            response.candidates[0].finishReason
          );
        }

        // 안전 필터로 차단된 경우
        const finishReason = response.candidates?.[0]?.finishReason as string | undefined;
        if (finishReason === "SAFETY" || finishReason === "BLOCKED") {
          console.error(
            `[GeminiProvider] 결과 ${i + 1}: 안전 필터에 의해 차단됨`
          );
          continue;
        }

        // 응답에서 이미지 파트 찾기
        const parts = response.candidates?.[0]?.content?.parts;
        if (!parts || parts.length === 0) {
          console.error(
            `[GeminiProvider] 결과 ${i + 1}: 응답에 parts가 없습니다.`,
            JSON.stringify(response.candidates?.[0] ?? "no candidate", null, 2)
          );
          continue;
        }

        console.log(
          `[GeminiProvider] parts 수: ${parts.length}, 타입:`,
          parts.map((p) =>
            p.inlineData ? `image(${p.inlineData.mimeType})` : `text`
          )
        );

        let saved = false;
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            const resultFileName = `result_${uuidv4()}.png`;
            const resultPath = path.join(outputDir, resultFileName);
            const resultBuffer = Buffer.from(part.inlineData.data, "base64");
            await writeFile(resultPath, resultBuffer);
            resultPaths.push(resultPath);
            saved = true;
            console.log(
              `[GeminiProvider] 결과 ${i + 1} 저장 완료: ${resultFileName} (${resultBuffer.length} bytes)`
            );
            break;
          }
        }

        if (!saved) {
          const textParts = parts
            .filter((p) => p.text)
            .map((p) => p.text)
            .join(" ");
          console.error(
            `[GeminiProvider] 결과 ${i + 1}: 이미지 없음. 텍스트 응답:`,
            textParts || "(없음)"
          );
        }
      } catch (err: unknown) {
        const errMsg =
          err instanceof Error ? err.message : JSON.stringify(err);
        console.error(
          `[GeminiProvider] 결과 ${i + 1} 생성 실패:`,
          errMsg
        );

        // 할당량 초과 체크
        if (errMsg.includes("429") || errMsg.includes("quota")) {
          throw new Error(
            "오늘 Gemini API 사용 한도에 도달했어요. 내일 다시 시도해주세요."
          );
        }
      }
    }

    if (resultPaths.length === 0) {
      throw new Error(
        "Gemini API에서 이미지를 생성하지 못했습니다. " +
          "얼굴이 잘 보이는 정면 사진으로 다시 시도해주세요."
      );
    }

    return {
      resultPaths,
      processingTimeMs: Date.now() - startTime,
    };
  }

  /**
   * 스타일/색상 정보를 조합해서 Gemini용 프롬프트를 생성
   */
  private buildPrompt(input: HairTransformInput): string {
    const colorDesc = input.colorPrompt || "";

    const hairDescription = colorDesc
      ? `${input.stylePrompt} with ${colorDesc}`
      : input.stylePrompt;

    // 간결하고 명확한 프롬프트 (너무 길면 오히려 안전 필터에 걸릴 수 있음)
    return (
      `Change this person's hairstyle to: ${hairDescription}. ` +
      `Keep the face, expression, skin, background, and clothing exactly the same. ` +
      `Only change the hair. Output a realistic photo.`
    );
  }
}
