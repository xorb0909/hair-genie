"use client";

// ============================================
// ImageUploader - 이미지 업로드 컴포넌트
// - 드래그&드롭 / 클릭으로 이미지 선택
// - 미리보기 표시
// - 가이드 문구 표시
// ============================================

import { useCallback, useRef, useState } from "react";
import { UploadResponse } from "@/types";

interface ImageUploaderProps {
  /** 업로드 카테고리 */
  category: "input" | "style" | "color";
  /** 라벨 */
  label: string;
  /** 가이드 문구 */
  guide: string;
  /** 업로드 완료 콜백 */
  onUpload: (result: UploadResponse) => void;
  /** 비활성화 여부 */
  disabled?: boolean;
}

export default function ImageUploader({
  category,
  label,
  guide,
  onUpload,
  disabled = false,
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      // 클라이언트 측 검증
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        setError("JPG, PNG, WebP 파일만 업로드할 수 있습니다.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("파일 크기는 10MB 이하여야 합니다.");
        return;
      }

      // 미리보기 생성
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      setFileName(file.name);

      // 서버에 업로드
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("category", category);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const json = await res.json();

        if (!json.success) {
          setError(json.error || "업로드에 실패했습니다.");
          setPreview(null);
          return;
        }

        onUpload(json.data);
      } catch {
        setError("네트워크 오류가 발생했습니다. 다시 시도해주세요.");
        setPreview(null);
      } finally {
        setUploading(false);
      }
    },
    [category, onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile, disabled]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="flex flex-col gap-2">
      {/* 라벨 */}
      <label className="text-sm font-semibold text-gray-700">{label}</label>

      {/* 업로드 영역 */}
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-4
          flex flex-col items-center justify-center
          min-h-[200px] cursor-pointer transition-all
          ${disabled ? "opacity-50 cursor-not-allowed bg-gray-50" : "hover:border-violet-400 hover:bg-violet-50/30"}
          ${preview ? "border-violet-400 bg-violet-50/20" : "border-gray-300"}
          ${uploading ? "animate-pulse" : ""}
        `}
        onClick={() => !disabled && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {/* 미리보기 이미지 */}
        {preview ? (
          <img
            src={preview}
            alt="업로드된 이미지 미리보기"
            className="max-h-[180px] rounded-lg object-contain"
          />
        ) : (
          <>
            {/* 아이콘 */}
            <svg
              className="w-10 h-10 text-gray-400 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 16v-8m0 0l-3 3m3-3l3 3M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1"
              />
            </svg>
            <p className="text-sm text-gray-500 text-center">
              클릭하거나 이미지를 드래그해주세요
            </p>
          </>
        )}

        {/* 업로드 중 표시 */}
        {uploading && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-xl">
            <div className="flex items-center gap-2 text-violet-600">
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
              <span className="text-sm font-medium">업로드 중...</span>
            </div>
          </div>
        )}

        {/* 숨겨진 파일 input */}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleChange}
          disabled={disabled}
        />
      </div>

      {/* 파일명 */}
      {fileName && !error && (
        <p className="text-xs text-gray-400 truncate">{fileName}</p>
      )}

      {/* 가이드 문구 */}
      <p className="text-xs text-gray-400">{guide}</p>

      {/* 에러 메시지 */}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
