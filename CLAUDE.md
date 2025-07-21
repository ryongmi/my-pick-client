# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

my-pick-client는 크리에이터/유튜버 팬들을 위한 통합 콘텐츠 허브의 프론트엔드 애플리케이션입니다. Next.js 14 App Router와 Redux Toolkit을 사용하여 구축된 현대적인 React 애플리케이션입니다.

## 핵심 명령어

### 개발 환경
```bash
# 개발 서버 시작
npm run dev

# 타입 검사
npm run type-check

# 린팅 및 포매팅
npm run lint
npm run lint:fix

# 프로덕션 빌드
npm run build
npm run start
```

### Docker 개발
```bash
# 개발 환경 Docker 실행
docker-compose -f docker-compose.dev.yml up -d

# 프로덕션 빌드 및 실행
docker build -t mypick-frontend:latest .
docker run -p 3000:3000 mypick-frontend:latest
```

## 아키텍처 개요

### 기술 스택
- **Next.js 14** (App Router) + **TypeScript**
- **Redux Toolkit** + **Redux Persist** (상태 관리)
- **Tailwind CSS** (스타일링)
- **React Hook Form** + **Zod** (폼 관리)
- **Axios** (HTTP 클라이언트)

### 프로젝트 구조
```
src/
├── app/                    # Next.js App Router (페이지)
├── components/             # React 컴포넌트
│   ├── ui/                # 기본 UI 컴포넌트
│   ├── layout/            # 레이아웃 컴포넌트
│   └── dashboard/         # 대시보드 컴포넌트
├── store/                 # Redux 상태 관리
│   └── slices/           # Redux 슬라이스들
├── hooks/                 # 커스텀 훅
├── lib/                   # 유틸리티 및 API 클라이언트
└── types/                 # TypeScript 타입 정의
```

## 상태 관리 아키텍처

### Redux Store 구조
6개의 주요 슬라이스로 구성:
- **authSlice**: 사용자 인증 상태 (JWT 토큰, 사용자 정보)
- **uiSlice**: UI 상태 (테마, 모바일 메뉴, 로딩)
- **creatorSlice**: 크리에이터 관련 상태
- **contentSlice**: 콘텐츠 및 필터 상태
- **notificationSlice**: 알림 관리
- **adminSlice**: 관리자 기능

### 상태 영속화 전략
```typescript
// Redux Persist 설정
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'ui'], // auth, ui만 영속화
  blacklist: ['content', 'notification'] // 세션별 리셋
};
```

## API 통합 패턴

### API 클라이언트 구조
```typescript
// 중앙화된 API 클라이언트 (lib/api.ts)
- 자동 토큰 주입
- 401 에러 시 자동 로그아웃
- 응답 인터셉터로 에러 처리
- 모듈별 API 엔드포인트 (authApi, userApi, creatorApi 등)
```

### 인증 플로우
```typescript
// JWT 토큰 기반 인증
- 로그인 시 토큰 저장 (Redux + localStorage)
- API 요청마다 자동 헤더 주입
- 토큰 만료 시 자동 로그아웃 처리
```

## 컴포넌트 설계 원칙

### UI 컴포넌트 계층
1. **Primitives** (`components/ui/`): Button, Input, Card 등
2. **Layout** (`components/layout/`): Header, Sidebar
3. **Features** (`components/dashboard/`): 기능별 컴포넌트

### 반응형 디자인 패턴
```typescript
// Tailwind breakpoints 활용
sm: '640px'   // 모바일
md: '768px'   // 태블릿  
lg: '1024px'  // 데스크톱
xl: '1280px'  // 대형 데스크톱
```

## 테마 시스템

### CSS Variables 기반 테마
```css
:root {
  --background: white;
  --foreground: black;
  /* ... 기타 테마 변수들 */
}

[data-theme="dark"] {
  --background: black;
  --foreground: white;
  /* ... 다크 테마 변수들 */
}
```

## 타입 안전성

### TypeScript 설정
- **Strict Mode** 활성화
- **Path Aliases**: `@/*` 패턴으로 깔끔한 import
- **모든 컴포넌트와 함수의 타입 정의**

### 주요 타입 인터페이스
```typescript
// types/index.ts에서 중앙 관리
User, Creator, Video, Notification, ApiResponse 등
```

## 개발 워크플로우

### 코드 스타일
- **ESLint** + **Prettier**로 일관된 코드 스타일
- **Conventional Commits** 메시지 권장
- **컴포넌트명**: PascalCase
- **파일명**: kebab-case 또는 PascalCase (컴포넌트)

### 브랜치 전략
```bash
main          # 프로덕션 브랜치
develop       # 개발 브랜치
feature/*     # 기능 개발 브랜치
hotfix/*      # 긴급 수정 브랜치
```

## 성능 최적화

### Next.js 최적화 설정
```javascript
// next.config.js
output: 'standalone'  // Docker 최적화
images: { ... }       # 이미지 최적화 설정
```

### Bundle 최적화
- **Tree Shaking** 지원
- **Dynamic Imports** for code splitting
- **Memoization** in Redux selectors

## 환경 설정

### 필수 환경 변수
```bash
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_YOUTUBE_API_KEY=your_api_key
```

### 개발 환경 설정
1. `.env.local.example`을 `.env.local`로 복사
2. 필요한 API 키 설정
3. 백엔드 서버 URL 설정

## 디버깅 및 모니터링

### 개발 도구
- **Redux DevTools** 통합
- **Next.js DevTools** 활용
- **Console 로깅**: 개발 환경에서만 활성화

### 에러 처리
```typescript
// API 에러 처리 패턴
try {
  const response = await api.get('/endpoint');
} catch (error) {
  console.error('API Error:', error);
  // Redux에서 에러 상태 업데이트
}
```

## 주의사항

### 상태 관리
- **Redux 슬라이스**: 기능별로 명확히 분리
- **비동기 액션**: createAsyncThunk 사용
- **불변성**: Immer를 통한 안전한 상태 업데이트

### API 통합
- **토큰 갱신**: 401 에러 시 자동 처리
- **에러 핸들링**: 사용자 친화적 메시지 제공
- **로딩 상태**: 각 API 호출마다 적절한 로딩 UI

### 성능
- **메모이제이션**: 무거운 계산이나 컴포넌트 렌더링
- **이미지 최적화**: Next.js Image 컴포넌트 사용
- **번들 크기**: 불필요한 라이브러리 import 지양