"use client";

// ============================================
// 메인 페이지 - Hair Genie
// - 성별 선택 → 사진 업로드 → 스타일 선택 → 염색 선택 → 변환 → 결과 비교
// ============================================

import { useState, useCallback } from "react";
import GenderSelector from "@/components/GenderSelector";
import ImageUploader from "@/components/ImageUploader";
import StyleSelector from "@/components/StyleSelector";
import ColorSelector from "@/components/ColorSelector";
import ResultDisplay from "@/components/ResultDisplay";
import { Gender, TransformResult, UploadResponse } from "@/types";

export default function Home() {
  // === 상태 관리 ===
  const [gender, setGender] = useState<Gender>("male");
  const [sourceImage, setSourceImage] = useState<UploadResponse | null>(null);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [customStyleText, setCustomStyleText] = useState("");
  const [enableColor, setEnableColor] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<TransformResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 성별 변경 시 스타일 선택 초기화
  const handleGenderChange = useCallback((newGender: Gender) => {
    setGender(newGender);
    setSelectedStyleId(null);
    setCustomStyleText("");
  }, []);

  // 변환 가능 여부 체크
  const canTransform =
    sourceImage &&
    selectedStyleId &&
    (selectedStyleId !== "custom" || customStyleText.trim().length > 0) &&
    (!enableColor || selectedColorId) &&
    !loading;

  // 변환 실행
  const handleTransform = useCallback(async () => {
    if (!sourceImage || !selectedStyleId) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gender,
          sourceImageId: sourceImage.id,
          styleId: selectedStyleId,
          customStyleText:
            selectedStyleId === "custom" ? customStyleText.trim() : undefined,
          enableColor,
          colorId: enableColor ? selectedColorId : undefined,
          resultCount: 3,
        }),
      });

      const json = await res.json();

      if (!json.success) {
        setError(json.error || "변환에 실패했습니다.");
        return;
      }

      // 새 결과를 맨 앞에 추가
      setResults((prev) => [json.data, ...prev]);
    } catch {
      setError("서버와 통신할 수 없습니다. 네트워크 연결을 확인해주세요.");
    } finally {
      setLoading(false);
    }
  }, [sourceImage, selectedStyleId, customStyleText, enableColor, selectedColorId, gender]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-fuchsia-50">
      {/* 헤더 */}
      <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">
            <span className="text-violet-600">Hair</span> Genie
          </h1>
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
            MVP v0.2
          </span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8">
          {/* ===== 왼쪽: 입력 영역 ===== */}
          <div className="space-y-6">
            {/* 서비스 소개 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-2">
              <h2 className="text-lg font-bold text-gray-800">
                AI 헤어스타일 가상 체험
              </h2>
              <p className="text-sm text-gray-500">
                내 사진에 원하는 헤어스타일을 입혀보세요.
                스타일을 선택하면 AI가 자연스럽게 합성해드립니다.
              </p>
            </div>

            {/* Step 1: 성별 선택 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <GenderSelector value={gender} onChange={handleGenderChange} />
            </div>

            {/* Step 2: 사진 업로드 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <ImageUploader
                category="input"
                label="1. 내 사진 업로드"
                guide="정면 얼굴 사진을 올려주세요. 머리카락이 잘 보이는 사진이 좋아요."
                onUpload={setSourceImage}
              />
            </div>

            {/* Step 3: 스타일 선택 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <StyleSelector
                gender={gender}
                selectedStyleId={selectedStyleId}
                customText={customStyleText}
                onSelectStyle={setSelectedStyleId}
                onCustomTextChange={setCustomStyleText}
              />
            </div>

            {/* Step 4: 염색 선택 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <ColorSelector
                enabled={enableColor}
                onToggle={setEnableColor}
                selectedColorId={selectedColorId}
                onSelectColor={setSelectedColorId}
              />
            </div>

            {/* 변환 버튼 */}
            <button
              onClick={handleTransform}
              disabled={!canTransform}
              className={`
                w-full py-4 rounded-2xl text-base font-bold transition-all
                ${
                  canTransform
                    ? "bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-200 hover:shadow-xl"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  AI가 헤어스타일을 합성 중이에요...
                </span>
              ) : (
                "헤어스타일 변환하기"
              )}
            </button>

            {/* 에러 메시지 */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* 프라이버시 안내 */}
            <div className="bg-gray-50 rounded-xl p-4 space-y-1">
              <p className="text-xs font-medium text-gray-500">
                개인정보 처리 안내
              </p>
              <ul className="text-[10px] text-gray-400 space-y-0.5">
                <li>
                  - 업로드한 사진은 헤어스타일 변환 목적에만 사용됩니다.
                </li>
                <li>
                  - 처리 완료 후 서버에서 자동 삭제되며, 장기 보관하지 않습니다.
                </li>
<li>
                  - 타인의 사진을 무단으로 업로드하는 행위는 금지됩니다.
                </li>
              </ul>
            </div>
          </div>

          {/* ===== 오른쪽: 결과 영역 ===== */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-800">결과</h2>

            {results.length === 0 && !loading ? (
              <div className="bg-white rounded-2xl border border-gray-200 p-12 flex flex-col items-center justify-center text-center">
                <svg
                  className="w-16 h-16 text-gray-200 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm text-gray-400">
                  사진을 업로드하고 스타일을 선택한 뒤
                  <br />
                  변환 버튼을 누르면 결과가 표시됩니다.
                </p>
              </div>
            ) : (
              results.map((result) => (
                <ResultDisplay key={result.id} result={result} />
              ))
            )}
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="border-t border-gray-100 mt-16">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center">
          <p className="text-xs text-gray-400">
            Hair Genie - AI 헤어스타일 가상 체험 서비스 (MVP)
          </p>
          <p className="text-[10px] text-gray-300 mt-1">
            결과 이미지는 참고용이며 실제 시술 결과와 차이가 있을 수 있습니다.
          </p>
        </div>
      </footer>
    </div>
  );
}
