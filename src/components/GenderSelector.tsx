"use client";

// ============================================
// GenderSelector - 성별 선택 컴포넌트
// ============================================

import { Gender } from "@/types";

interface GenderSelectorProps {
  value: Gender;
  onChange: (gender: Gender) => void;
}

export default function GenderSelector({ value, onChange }: GenderSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-gray-700">성별 선택</label>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onChange("male")}
          className={`
            flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all
            ${
              value === "male"
                ? "border-violet-500 bg-violet-50 text-violet-700"
                : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
            }
          `}
        >
          남성
        </button>
        <button
          type="button"
          onClick={() => onChange("female")}
          className={`
            flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all
            ${
              value === "female"
                ? "border-violet-500 bg-violet-50 text-violet-700"
                : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
            }
          `}
        >
          여성
        </button>
      </div>
    </div>
  );
}
