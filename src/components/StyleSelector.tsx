"use client";

// ============================================
// StyleSelector - 헤어스타일 선택 컴포넌트
// - 성별에 맞는 스타일 버튼 목록 표시
// - "직접 입력" 옵션으로 텍스트 입력 가능
// ============================================

import { useState } from "react";
import { Gender, HairStyle } from "@/types";
import { getStylesByGender } from "@/lib/style-data";

interface StyleSelectorProps {
  gender: Gender;
  selectedStyleId: string | null;
  customText: string;
  onSelectStyle: (styleId: string) => void;
  onCustomTextChange: (text: string) => void;
}

export default function StyleSelector({
  gender,
  selectedStyleId,
  customText,
  onSelectStyle,
  onCustomTextChange,
}: StyleSelectorProps) {
  const styles = getStylesByGender(gender);
  const isCustom = selectedStyleId === "custom";

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-semibold text-gray-700">
        헤어스타일 선택
      </label>

      {/* 스타일 버튼 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {styles.map((style) => (
          <button
            key={style.id}
            type="button"
            onClick={() => onSelectStyle(style.id)}
            className={`
              py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all text-center
              ${
                selectedStyleId === style.id
                  ? "border-violet-500 bg-violet-50 text-violet-700 shadow-sm"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }
            `}
          >
            {style.nameKo}
          </button>
        ))}

        {/* 직접 입력 버튼 */}
        <button
          type="button"
          onClick={() => onSelectStyle("custom")}
          className={`
            py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all text-center
            ${
              isCustom
                ? "border-violet-500 bg-violet-50 text-violet-700 shadow-sm"
                : "border-dashed border-gray-300 bg-white text-gray-500 hover:border-gray-400"
            }
          `}
        >
          직접 입력
        </button>
      </div>

      {/* 직접 입력 텍스트 박스 */}
      {isCustom && (
        <div className="animate-in slide-in-from-top-2 duration-200">
          <textarea
            value={customText}
            onChange={(e) => onCustomTextChange(e.target.value)}
            placeholder="원하는 헤어스타일을 설명해주세요 (예: 앞머리 있는 단발, 옆머리 긴 투블럭)"
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm
                       placeholder:text-gray-400 focus:border-violet-400 focus:outline-none
                       resize-none transition-colors"
            rows={2}
          />
          <p className="text-xs text-gray-400 mt-1">
            구체적으로 설명할수록 더 좋은 결과를 얻을 수 있어요.
          </p>
        </div>
      )}
    </div>
  );
}
