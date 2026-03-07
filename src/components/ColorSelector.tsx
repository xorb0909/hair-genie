"use client";

// ============================================
// ColorSelector - 염색 색상 선택 컴포넌트
// - 토글 ON/OFF + 색상 버튼 선택
// ============================================

import { HairColor } from "@/types";
import { HAIR_COLORS } from "@/lib/style-data";

interface ColorSelectorProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  selectedColorId: string | null;
  onSelectColor: (colorId: string) => void;
}

export default function ColorSelector({
  enabled,
  onToggle,
  selectedColorId,
  onSelectColor,
}: ColorSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* 토글 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-700">
            염색도 바꾸기
          </p>
          <p className="text-xs text-gray-400">
            원하는 염색 색상이 있으면 활성화해주세요
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => onToggle(!enabled)}
          className={`
            relative w-11 h-6 rounded-full transition-colors
            ${enabled ? "bg-violet-500" : "bg-gray-300"}
          `}
        >
          <span
            className={`
              absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full
              transition-transform shadow-sm
              ${enabled ? "translate-x-5" : "translate-x-0"}
            `}
          />
        </button>
      </div>

      {/* 색상 선택 버튼 (토글 ON 시에만 표시) */}
      {enabled && (
        <div className="animate-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-4 gap-2">
            {HAIR_COLORS.map((color) => (
              <button
                key={color.id}
                type="button"
                onClick={() => onSelectColor(color.id)}
                className={`
                  flex flex-col items-center gap-1.5 py-2.5 px-2 rounded-xl border-2
                  transition-all text-center
                  ${
                    selectedColorId === color.id
                      ? "border-violet-500 bg-violet-50 shadow-sm"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }
                `}
              >
                {/* 색상 원형 표시 */}
                <div
                  className={`
                    w-6 h-6 rounded-full border-2
                    ${selectedColorId === color.id ? "border-violet-400" : "border-gray-300"}
                  `}
                  style={{ backgroundColor: color.hexCode }}
                />
                <span className="text-xs font-medium text-gray-600 leading-tight">
                  {color.nameKo}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
