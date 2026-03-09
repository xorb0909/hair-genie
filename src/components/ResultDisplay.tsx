"use client";

// ============================================
// ResultDisplay - 변환 결과 비교 UI
// - 원본 + 결과 3장 나란히 표시
// - 각 결과 이미지 개별 다운로드
// ============================================

import { TransformResult } from "@/types";

interface ResultDisplayProps {
  result: TransformResult;
}

export default function ResultDisplay({ result }: ResultDisplayProps) {
  const handleDownload = async (imageUrl: string, index: number) => {
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `hairstyle-result-${result.id.slice(0, 8)}-${index + 1}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Blob 실패 시 새 탭으로 열기 (모바일 폴백)
      window.open(imageUrl, "_blank");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-800">변환 결과</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            {result.styleName}
            {result.colorName && ` + ${result.colorName}`}
          </p>
        </div>
        {result.processingTimeMs && (
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
            {(result.processingTimeMs / 1000).toFixed(1)}초
          </span>
        )}
      </div>

      {/* 이미지 그리드: 원본 + 결과 3장 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* 원본 */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-500 text-center">원본</p>
          <div className="aspect-[3/4] bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
            <img
              src={result.sourceImageUrl}
              alt="원본 사진"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 결과 이미지들 */}
        {result.results.map((item, i) => (
          <div key={item.id} className="space-y-2">
            <p className="text-xs font-medium text-violet-500 text-center">
              결과 {i + 1}
            </p>
            <div
              className="aspect-[3/4] bg-gray-50 rounded-xl overflow-hidden
                         ring-2 ring-violet-200 cursor-pointer hover:ring-violet-400 transition-all"
              onClick={() => handleDownload(item.resultImageUrl, i)}
              title="클릭하면 다운로드됩니다"
            >
              <img
                src={item.resultImageUrl}
                alt={`변환 결과 ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ))}

        {/* 결과가 아직 없을 때 플레이스홀더 */}
        {result.results.length === 0 &&
          [1, 2, 3].map((n) => (
            <div key={n} className="space-y-2">
              <p className="text-xs font-medium text-gray-400 text-center">
                결과 {n}
              </p>
              <div className="aspect-[3/4] bg-gray-100 rounded-xl flex items-center justify-center">
                <span className="text-xs text-gray-400">처리 중...</span>
              </div>
            </div>
          ))}
      </div>

      {/* 이미지 클릭 안내 */}
      {result.results.length > 0 && (
        <p className="text-xs text-gray-400 text-center">
          결과 이미지를 클릭하면 다운로드할 수 있어요
        </p>
      )}

      {/* 안내 문구 */}
      <p className="text-[10px] text-gray-400 text-center">
        결과 이미지는 참고용이며 실제 시술 결과와 차이가 있을 수 있습니다.
      </p>
    </div>
  );
}
