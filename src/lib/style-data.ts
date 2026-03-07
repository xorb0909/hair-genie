// ============================================
// 헤어스타일 & 염색 색상 데이터
// - 스타일별 프롬프트 매핑 테이블
// - 남/여 구분, 한국어↔영어 매핑
// ============================================

import { HairStyle, HairColor } from "@/types";

// ===== 남성 헤어스타일 =====
export const MALE_STYLES: HairStyle[] = [
  {
    id: "two_block",
    nameKo: "투블럭",
    nameEn: "Two-block haircut",
    gender: "male",
    prompt: "a modern Korean two-block haircut with short sides and back, longer textured top hair",
  },
  {
    id: "comma_perm",
    nameKo: "가르마펌",
    nameEn: "Comma perm",
    gender: "male",
    prompt: "a Korean comma perm hairstyle with a center or side part, soft comma-shaped bangs falling naturally",
  },
  {
    id: "down_perm",
    nameKo: "다운펌",
    nameEn: "Down perm",
    gender: "male",
    prompt: "a Korean down perm hairstyle with flat, naturally falling straight hair, clean and neat look",
  },
  {
    id: "long_hair_male",
    nameKo: "장발",
    nameEn: "Long hair",
    gender: "male",
    prompt: "medium-long flowing hair past the ears, natural and slightly wavy, modern Asian male long hairstyle",
  },
  {
    id: "regent",
    nameKo: "리젠트",
    nameEn: "Regent cut",
    gender: "male",
    prompt: "a classic regent cut hairstyle with volume on top swept back, short tapered sides, clean and sharp look",
  },
  {
    id: "slick_back",
    nameKo: "슬릭백",
    nameEn: "Slick back",
    gender: "male",
    prompt: "a slicked back hairstyle with all hair combed back smoothly, glossy finish, clean forehead visible",
  },
  {
    id: "buzz_cut",
    nameKo: "버즈컷",
    nameEn: "Buzz cut",
    gender: "male",
    prompt: "a very short buzz cut hairstyle, uniformly cropped close to the scalp, clean military-style look",
  },
  {
    id: "textured_crop",
    nameKo: "텍스쳐드 크롭",
    nameEn: "Textured crop",
    gender: "male",
    prompt: "a textured crop haircut with choppy layered fringe on forehead, short faded sides, modern trendy look",
  },
];

// ===== 여성 헤어스타일 =====
export const FEMALE_STYLES: HairStyle[] = [
  {
    id: "short_bob",
    nameKo: "단발",
    nameEn: "Short bob",
    gender: "female",
    prompt: "a clean Korean short bob haircut at chin length, straight and sleek with blunt ends",
  },
  {
    id: "layered_cut",
    nameKo: "레이어드컷",
    nameEn: "Layered cut",
    gender: "female",
    prompt: "a Korean layered cut with face-framing layers, medium to long length with natural movement and volume",
  },
  {
    id: "wave_perm",
    nameKo: "웨이브펌",
    nameEn: "Wave perm",
    gender: "female",
    prompt: "a soft wave perm hairstyle with loose S-shaped waves throughout, medium-long length, romantic and feminine",
  },
  {
    id: "hippie_perm",
    nameKo: "히피펌",
    nameEn: "Hippie perm",
    gender: "female",
    prompt: "a Korean hippie perm with natural messy curls and waves, effortless bohemian look, medium-long length",
  },
  {
    id: "volume_perm",
    nameKo: "볼륨펌",
    nameEn: "Volume perm",
    gender: "female",
    prompt: "a volume perm with big bouncy curls adding fullness and body, root volume lift, glamorous look",
  },
  {
    id: "build_perm",
    nameKo: "빌드펌",
    nameEn: "Build perm",
    gender: "female",
    prompt: "a Korean build perm with structured defined curls, medium length, natural body and shape",
  },
  {
    id: "long_straight",
    nameKo: "긴 생머리",
    nameEn: "Long straight hair",
    gender: "female",
    prompt: "long straight sleek hair flowing past shoulders, shiny and healthy-looking, classic Korean beauty style",
  },
  {
    id: "short_cut",
    nameKo: "숏컷",
    nameEn: "Short pixie cut",
    gender: "female",
    prompt: "a short pixie cut hairstyle, cropped close with textured top, modern and chic feminine look",
  },
];

// ===== 염색 색상 =====
export const HAIR_COLORS: HairColor[] = [
  {
    id: "black",
    nameKo: "블랙",
    nameEn: "Natural black",
    hexCode: "#1a1a1a",
    prompt: "natural black hair color",
  },
  {
    id: "dark_brown",
    nameKo: "다크브라운",
    nameEn: "Dark brown",
    hexCode: "#3d2b1f",
    prompt: "dark brown hair color",
  },
  {
    id: "ash_brown",
    nameKo: "애쉬 브라운",
    nameEn: "Ash brown",
    hexCode: "#8b7d6b",
    prompt: "cool-toned ash brown hair color with subtle grey undertone",
  },
  {
    id: "chestnut",
    nameKo: "밤색",
    nameEn: "Chestnut brown",
    hexCode: "#954535",
    prompt: "warm chestnut brown hair color",
  },
  {
    id: "blonde",
    nameKo: "블론드",
    nameEn: "Blonde",
    hexCode: "#d4a853",
    prompt: "golden blonde hair color",
  },
  {
    id: "ash_grey",
    nameKo: "애쉬 그레이",
    nameEn: "Ash grey",
    hexCode: "#9e9e9e",
    prompt: "cool ash grey silver hair color",
  },
  {
    id: "burgundy",
    nameKo: "버건디",
    nameEn: "Burgundy",
    hexCode: "#800020",
    prompt: "deep burgundy wine red hair color",
  },
  {
    id: "pink_brown",
    nameKo: "핑크브라운",
    nameEn: "Pink brown",
    hexCode: "#b5727d",
    prompt: "soft pink brown hair color with warm rosy undertone",
  },
];

// ===== 헬퍼 함수 =====

/** 성별에 맞는 스타일 목록 반환 */
export function getStylesByGender(gender: "male" | "female"): HairStyle[] {
  return gender === "male" ? MALE_STYLES : FEMALE_STYLES;
}

/** ID로 스타일 찾기 */
export function findStyleById(id: string): HairStyle | undefined {
  return [...MALE_STYLES, ...FEMALE_STYLES].find((s) => s.id === id);
}

/** ID로 색상 찾기 */
export function findColorById(id: string): HairColor | undefined {
  return HAIR_COLORS.find((c) => c.id === id);
}
