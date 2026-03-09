"use client";

// ============================================
// 배경 변경 툴 페이지
// - 사진 업로드 → 배경 선택/직접 입력 → 변환 → 결과
// ============================================

import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import ImageUploader from "@/components/ImageUploader";
import PaymentModal from "@/components/PaymentModal";
import { UploadResponse } from "@/types";
import { BACKGROUND_PRESETS } from "@/lib/background-data";

interface BackgroundResult {
  id: string;
  sourceImageUrl: string;
  resultImageUrl: string;
  backgroundName: string;
  processingTimeMs?: number;
}

export default function BackgroundToolPage() {
  const { user, userData } = useAuth();

  const [sourceImage, setSourceImage] = useState<UploadResponse | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BackgroundResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentReason, setPaymentReason] = useState<"empty" | "charge">("charge");

  const canTransform =
    user &&
    sourceImage &&
    selectedPresetId &&
    !loading;

  const handleTransform = useCallback(async () => {
    if (!sourceImage || !user) return;
    if (!selectedPresetId) return;

    // 토큰 체크 (관리자 제외)
    if (userData && !userData.isAdmin && userData.tokens < 1) {
      setPaymentReason("empty");
      setPaymentOpen(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const idToken = await user.getIdToken();

      const res = await fetch("/api/tools/background", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          sourceBase64: sourceImage.base64Data,
          sourceMimeType: sourceImage.mimeType,
          presetId: selectedPresetId,
        }),
      });

      const json = await res.json();

      if (!json.success) {
        if (json.error === "TOKEN_EMPTY") {
          setPaymentReason("empty");
          setPaymentOpen(true);
          return;
        }
        setError(json.error || "변환에 실패했습니다.");
        return;
      }

      setResults((prev) => [json.data, ...prev]);
    } catch {
      setError("서버와 통신할 수 없습니다. 네트워크 연결을 확인해주세요.");
    } finally {
      setLoading(false);
    }
  }, [sourceImage, selectedPresetId, user, userData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Header
        onOpenPayment={() => {
          setPaymentReason("charge");
          setPaymentOpen(true);
        }}
      />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* 뒤로가기 */}
        <a
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-violet-600 transition-colors mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          메인으로
        </a>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8">
          {/* ===== 왼쪽: 입력 영역 ===== */}
          <div className="space-y-6">
            {/* 서비스 소개 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-2">
              <h2 className="text-lg font-bold text-gray-800">
                AI 배경 무드 변경
              </h2>
              <p className="text-sm text-gray-500">
                마인크래프트, 레고, 클레이 등 다양한 스타일로 배경 무드를 바꿔보세요.
                인물은 그대로 유지하면서 배경만 변환합니다.
              </p>
              {!user && (
                <p className="text-xs text-violet-600 font-medium">
                  구글 로그인 후 이용할 수 있어요!
                </p>
              )}
            </div>

            {/* Step 1: 사진 업로드 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <ImageUploader
                category="input"
                label="1. 사진 업로드"
                guide="인물이 포함된 사진을 올려주세요. 배경이 잘 보이는 사진이 좋아요."
                onUpload={setSourceImage}
              />
            </div>

            {/* Step 2: 배경 선택 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
              <label className="text-sm font-semibold text-gray-700">
                2. 스타일 선택
              </label>

              {/* 프리셋 카드 */}
              <div className="grid grid-cols-2 gap-3">
                {BACKGROUND_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setSelectedPresetId(preset.id);
                    }}
                    className={`
                      p-4 rounded-xl border-2 text-left transition-all
                      ${
                        selectedPresetId === preset.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }
                    `}
                  >
                    <p className="font-medium text-gray-800 text-sm">{preset.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 변환 버튼 */}
            <button
              onClick={handleTransform}
              disabled={!canTransform}
              className={`
                w-full py-4 rounded-2xl text-base font-bold transition-all
                ${
                  canTransform
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 hover:shadow-xl"
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
                  AI가 스타일을 변환 중이에요...
                </span>
              ) : !user ? (
                "로그인 후 변환하기"
              ) : userData && !userData.isAdmin && userData.tokens < 1 ? (
                "토큰 충전 후 변환하기"
              ) : (
                <>
                  스타일 변환하기
                  {userData && !userData.isAdmin && (
                    <span className="text-xs opacity-75 ml-2">(토큰 1개 사용)</span>
                  )}
                </>
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
                <li>- 업로드한 사진은 스타일 변환 목적에만 사용됩니다.</li>
                <li>- 처리 완료 후 서버에서 자동 삭제되며, 장기 보관하지 않습니다.</li>
                <li>- 타인의 사진을 무단으로 업로드하는 행위는 금지됩니다.</li>
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
                <div key={result.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-700">
                      스타일: {result.backgroundName}
                    </p>
                    {result.processingTimeMs && (
                      <p className="text-xs text-gray-400">
                        처리 시간: {(result.processingTimeMs / 1000).toFixed(1)}초
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-0.5">
                    <div className="relative">
                      <img
                        src={result.sourceImageUrl}
                        alt="원본"
                        className="w-full aspect-square object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full">
                        원본
                      </span>
                    </div>
                    <div
                      className="relative cursor-pointer"
                      onClick={() => {
                        try {
                          const [header, base64] = result.resultImageUrl.split(",");
                          const mimeMatch = header.match(/:(.*?);/);
                          const mime = mimeMatch ? mimeMatch[1] : "image/png";
                          const binary = atob(base64);
                          const bytes = new Uint8Array(binary.length);
                          for (let i = 0; i < binary.length; i++) {
                            bytes[i] = binary.charCodeAt(i);
                          }
                          const blob = new Blob([bytes], { type: mime });
                          const blobUrl = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = blobUrl;
                          a.download = `background-${result.id}.png`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
                        } catch {
                          window.open(result.resultImageUrl, "_blank");
                        }
                      }}
                      title="클릭하면 다운로드됩니다"
                    >
                      <img
                        src={result.resultImageUrl}
                        alt="결과"
                        className="w-full aspect-square object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-blue-500/80 text-white text-[10px] px-2 py-0.5 rounded-full">
                        결과
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 text-center py-2">
                    결과 이미지를 클릭하면 다운로드할 수 있어요
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="border-t border-gray-100 mt-16">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center">
          <p className="text-xs text-gray-400">
            뚝딱 AI 에디터 - 사진 무드 변환 AI 툴
          </p>
          <p className="text-[10px] text-gray-300 mt-1">
            결과 이미지는 참고용이며 실제와 차이가 있을 수 있습니다.
          </p>
        </div>
      </footer>

      <PaymentModal
        isOpen={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        reason={paymentReason}
      />
    </div>
  );
}
