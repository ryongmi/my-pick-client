# MyPick Frontend

MyPick 프로젝트의 프론트엔드 애플리케이션입니다. Next.js 14와 Redux Toolkit을 사용하여 구축된 크리에이터 통합 대시보드입니다.

## 🚀 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit + Redux Persist
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Form Handling**: React Hook Form + Zod
- **Animation**: Framer Motion

## 📦 주요 기능

- 크리에이터 통합 대시보드
- YouTube 및 Twitter 콘텐츠 통합 뷰
- 실시간 알림 시스템
- 사용자 프로필 관리
- 관리자 페이지
- 반응형 디자인
- 다크/라이트 테마 지원

## 🛠 개발 환경 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local.example` 파일을 `.env.local`로 복사하고 필요한 환경 변수를 설정하세요:

```bash
cp .env.local.example .env.local
```

```env
# API 설정
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# YouTube API
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key_here

# Twitter API
NEXT_PUBLIC_TWITTER_API_KEY=your_twitter_api_key_here
NEXT_PUBLIC_TWITTER_API_SECRET=your_twitter_api_secret_here
NEXT_PUBLIC_TWITTER_BEARER_TOKEN=your_twitter_bearer_token_here
```

### 3. 개발 서버 실행

```bash
npm run dev
```

개발 서버가 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

## 📁 프로젝트 구조

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈페이지
│   └── globals.css        # 글로벌 스타일
├── components/            # React 컴포넌트
│   ├── ui/               # 기본 UI 컴포넌트
│   ├── layout/           # 레이아웃 컴포넌트
│   ├── dashboard/        # 대시보드 컴포넌트
│   └── providers.tsx     # Redux Provider
├── store/                # Redux 상태 관리
│   ├── index.ts          # Store 설정
│   └── slices/           # Redux Slices
├── hooks/                # 커스텀 훅
│   └── redux.ts          # Redux 훅
├── lib/                  # 유틸리티 라이브러리
│   ├── api.ts            # API 클라이언트
│   └── utils.ts          # 헬퍼 함수
├── types/                # TypeScript 타입 정의
│   └── index.ts
└── utils/                # 기타 유틸리티
```

## 🔧 스크립트

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 린팅
npm run lint

# 타입 체크
npm run type-check
```

## 🎨 주요 컴포넌트

### 레이아웃
- `Header`: 상단 네비게이션 바
- `Sidebar`: 크리에이터 목록 사이드바

### 대시보드
- `MainContent`: 메인 콘텐츠 타임라인
- `AdminView`: 관리자 페이지
- `ProfileView`: 사용자 프로필 페이지

### Redux Slices
- `authSlice`: 사용자 인증 상태
- `uiSlice`: UI 상태 관리
- `creatorSlice`: 크리에이터 데이터
- `contentSlice`: 콘텐츠 데이터
- `notificationSlice`: 알림 관리
- `adminSlice`: 관리자 기능

## 🌐 API 연동

백엔드 API와의 통신을 위해 Axios 기반의 API 클라이언트를 사용합니다:

```typescript
import { apiClient } from '@/lib/api';

// 예시: 크리에이터 목록 가져오기
const creators = await apiClient.get('/creators');
```

## 🔒 인증

JWT 토큰 기반 인증을 사용하며, Redux Persist를 통해 인증 상태를 유지합니다.

## 📱 반응형 디자인

Tailwind CSS를 사용하여 모바일부터 데스크톱까지 모든 디바이스에서 최적화된 UI를 제공합니다.

## 🎯 상태 관리

Redux Toolkit을 사용하여 애플리케이션 상태를 관리하며, 주요 기능들은 다음과 같습니다:

- **낙관적 업데이트**: 좋아요, 북마크 등의 즉시 반응
- **캐싱**: API 응답 캐싱으로 성능 최적화
- **지속성**: Redux Persist로 상태 유지

## 🔧 개발 도구

- **ESLint**: 코드 품질 관리
- **Prettier**: 코드 포매팅
- **TypeScript**: 타입 안전성
- **Tailwind CSS**: 스타일링

## 📦 빌드 및 배포

### 개발 빌드
```bash
npm run build
```

### Docker 빌드
```bash
docker build -t mypick-frontend:latest .
```

### 환경별 설정
- **개발환경**: `npm run dev`
- **프로덕션**: `npm run build && npm run start`

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 새로운 기능 브랜치를 생성합니다 (`git checkout -b feature/amazing-feature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/amazing-feature`)
5. Pull Request를 생성합니다

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.

## 🐛 버그 리포트 및 기능 요청

버그를 발견하거나 새로운 기능을 제안하고 싶으시면 [Issues](https://github.com/your-username/mypick-frontend/issues)에 등록해주세요.

## 📞 연락처

프로젝트 관련 문의: [your-email@example.com](mailto:your-email@example.com)
