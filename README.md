# Hair Genie - AI 헤어스타일 가상 체험 서비스

사용자가 본인 사진과 원하는 헤어스타일 레퍼런스 사진을 업로드하면,
**얼굴은 유지하고 머리 스타일만 바꿔서** 결과를 보여주는 웹서비스입니다.

## 기술 스택

- **프론트엔드**: Next.js 14 (App Router, TypeScript, Tailwind CSS)
- **백엔드**: Next.js API Routes
- **AI 엔진**: HairFastGAN (Google Colab T4 GPU)
- **연동**: ngrok (Colab - 백엔드 터널링)

## 프로젝트 구조

```
hair-genie/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── upload/route.ts      # 이미지 업로드 API
│   │   │   ├── transform/route.ts   # 헤어 변환 API
│   │   │   ├── health/route.ts      # 서버 상태 확인
│   │   │   └── images/[...path]/route.ts  # 이미지 서빙
│   │   ├── layout.tsx
│   │   └── page.tsx                 # 메인 페이지
│   ├── components/
│   │   ├── GenderSelector.tsx
│   │   ├── ImageUploader.tsx
│   │   └── ResultDisplay.tsx
│   ├── lib/
│   │   ├── hair-transform-provider.ts  # Provider 인터페이스
│   │   ├── mock-provider.ts            # 개발용 Mock
│   │   ├── hairfastgan-provider.ts     # Colab 연동
│   │   └── provider-factory.ts         # Provider 팩토리
│   └── types/
│       └── index.ts                 # 타입 정의
├── colab/
│   └── HairFastGAN_Server.ipynb     # Colab 서버 노트북
├── uploads/                         # 업로드된 이미지 (gitignore)
├── .env.example                     # 환경변수 템플릿
└── .env.local                       # 로컬 환경변수
```

## 실행 방법

### 1단계: 로컬 개발 서버 (Mock 모드)

```bash
# 프로젝트 디렉토리로 이동
cd hair-genie

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 http://localhost:3000 접속

> Mock 모드에서는 원본 이미지가 그대로 결과로 반환됩니다.
> AI 변환 없이 전체 UI/UX 흐름을 테스트할 수 있습니다.

### 2단계: Colab + ngrok 연동 (실제 AI 변환)

#### Colab 서버 실행

1. `colab/HairFastGAN_Server.ipynb`를 Google Colab에 업로드
2. **런타임 유형을 T4 GPU로 설정** (런타임 > 런타임 유형 변경 > T4 GPU)
3. 셀을 순서대로 실행
4. ngrok 가입 후 Authtoken을 노트북에 입력
5. 마지막 셀에서 출력되는 **ngrok URL** 복사

#### 로컬 서버 연동

1. `.env.local` 파일 수정:
```
TRANSFORM_PROVIDER=hairfastgan
COLAB_SERVER_URL=https://xxxx-xx-xx-xxx-xx.ngrok-free.app
```

2. 개발 서버 재시작:
```bash
npm run dev
```

3. 연결 확인:
```
http://localhost:3000/api/health
```

## 환경변수

| 변수명 | 설명 | 기본값 |
|--------|------|--------|
| `TRANSFORM_PROVIDER` | AI 엔진 선택 (`mock` / `hairfastgan`) | `mock` |
| `COLAB_SERVER_URL` | Colab ngrok 터널 URL | (비어있음) |

## 개발 로드맵

- [x] 1단계: MockProvider + 전체 UI (성별/업로드/결과 비교/다운로드)
- [ ] 2단계: 이미지 업로드/삭제 흐름 완성
- [ ] 3단계: Colab + ngrok HairFastGAN 서버
- [ ] 4단계: 프론트 - 백엔드 - Colab 통합 테스트
- [ ] 5단계: 염색 기능 (Color Transfer)
- [ ] 6단계: 결과 품질 개선

## 주의사항

- Colab 무료 세션은 최대 약 12시간 유지됩니다
- ngrok 무료 플랜은 동시 1개 터널만 지원합니다
- 업로드된 이미지는 서버에 임시 저장 후 삭제됩니다
