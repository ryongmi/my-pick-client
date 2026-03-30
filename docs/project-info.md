# MyPick Client - 프로젝트 정보

## 📖 프로젝트 개요

MyPick Client는 크리에이터/유튜버 팬들을 위한 통합 콘텐츠 허브 서비스의 **프론트엔드 애플리케이션**입니다.

### 🎯 핵심 목표
- **멀티 크리에이터 관리**: 여러 크리에이터의 콘텐츠를 하나의 대시보드에서 통합 관리
- **개인화된 경험**: AI 기반 맞춤형 콘텐츠 큐레이션 및 추천
- **실시간 업데이트**: 새로운 영상 업로드 즉시 알림 및 피드 반영
- **커뮤니티 허브**: 같은 취향의 팬들과의 소통 및 상호작용

### 🎮 주요 사용자층
- **VTuber 팬**: 홀로라이브, 니지산지 등 가상 유튜버 팬덤
- **K-POP 팬**: 아이돌 개인 채널 및 그룹 활동 추적
- **게임 스트리머 팬**: 특정 게임/스트리머 콘텐츠 집중 관리
- **일반 크리에이터 팬**: 다양한 분야의 인플루언서 팔로우

## 🛠 기술 스택 & 아키텍처

### 프론트엔드 프레임워크
```yaml
핵심 기술:
  - Next.js 15: React 기반 풀스택 프레임워크
  - TypeScript: 완전한 타입 안전성
  - React 19: 최신 React 기능 및 훅 활용

라우팅:
  - App Router: Next.js 15의 최신 라우팅 시스템
  - 파일 기반 라우팅: 직관적인 페이지 구조
  - 레이아웃 중첩: 효율적인 UI 구성
```

### 스타일링 & UI 시스템
```yaml
스타일링:
  - Tailwind CSS 4.0: 유틸리티 우선 CSS 프레임워크
  - CSS Variables: 다이나믹 테마 지원
  - 반응형 디자인: 모바일 우선 접근법

컴포넌트:
  - Headless UI: 접근성 우선 컴포넌트
  - Radix UI: 고급 UI 프리미티브
  - Lucide React: 일관된 아이콘 시스템
  - Framer Motion: 부드러운 애니메이션
```

### 상태 관리 & 데이터
```yaml
상태 관리:
  - Zustand: 경량 전역 상태 관리
  - React Context: 컴포넌트 간 상태 공유
  - Local Storage: 사용자 설정 영속화

서버 상태:
  - TanStack Query v5: 서버 상태 관리 및 캐싱
  - Optimistic Updates: 즉시 UI 반영
  - Background Refetch: 자동 데이터 동기화
  - Infinite Queries: 무한 스크롤 구현
```

### 폼 & 검증
```yaml
폼 관리:
  - React Hook Form: 성능 최적화된 폼 라이브러리
  - Zod: 런타임 스키마 검증
  - Type-safe: 완전한 타입 안전성

검증 레이어:
  - Client-side: 즉시 사용자 피드백
  - Server-side: 보안 및 데이터 무결성
  - Schema-first: API 계약 기반 개발
```

### 개발 도구 & 품질
```yaml
코드 품질:
  - Biome: 통합 린팅 및 포매팅 (ESLint + Prettier 대체)
  - TypeScript 5.4+: 최신 타입 기능
  - Strict Mode: 엄격한 타입 검사

테스팅:
  - Vitest: 빠른 단위 테스트
  - Testing Library: 컴포넌트 테스트
  - MSW: API 모킹
  - Playwright: E2E 테스트 (선택적)
```

## 📁 상세 프로젝트 구조

```
mypick-client/
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── (auth)/                   # 인증 관련 페이지 그룹
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── layout.tsx
│   │   ├── (main)/                   # 메인 애플리케이션
│   │   │   ├── dashboard/           # 대시보드 페이지
│   │   │   ├── creators/            # 크리에이터 관리
│   │   │   ├── community/           # 커뮤니티 기능
│   │   │   ├── profile/             # 사용자 프로필
│   │   │   ├── settings/            # 설정 페이지
│   │   │   └── layout.tsx
│   │   ├── admin/                    # 관리자 전용 영역
│   │   ├── api/                      # API 라우트 (서버 기능)
│   │   ├── globals.css              # 전역 스타일
│   │   ├── layout.tsx               # 루트 레이아웃
│   │   ├── loading.tsx              # 글로벌 로딩
│   │   ├── error.tsx                # 글로벌 에러
│   │   ├── not-found.tsx            # 404 페이지
│   │   └── page.tsx                 # 홈페이지
│   │
│   ├── components/                   # 재사용 가능한 컴포넌트
│   │   ├── ui/                      # 기본 UI 컴포넌트
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── modal.tsx
│   │   │   ├── dropdown.tsx
│   │   │   ├── toast.tsx
│   │   │   └── index.ts
│   │   ├── features/                # 기능별 컴포넌트
│   │   │   ├── auth/               # 인증 관련
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   └── AuthGuard.tsx
│   │   │   ├── creator/            # 크리에이터 관련
│   │   │   │   ├── CreatorCard.tsx
│   │   │   │   ├── CreatorList.tsx
│   │   │   │   ├── CreatorSearch.tsx
│   │   │   │   └── SubscribeButton.tsx
│   │   │   ├── content/            # 콘텐츠 관련
│   │   │   │   ├── VideoCard.tsx
│   │   │   │   ├── VideoPlayer.tsx
│   │   │   │   ├── FeedTimeline.tsx
│   │   │   │   └── ContentFilter.tsx
│   │   │   ├── community/          # 커뮤니티 관련
│   │   │   │   ├── CommentSection.tsx
│   │   │   │   ├── DiscussionThread.tsx
│   │   │   │   └── WatchParty.tsx
│   │   │   ├── notification/       # 알림 관련
│   │   │   │   ├── NotificationBell.tsx
│   │   │   │   ├── NotificationList.tsx
│   │   │   │   └── NotificationSettings.tsx
│   │   │   └── analytics/          # 분석 관련
│   │   │       ├── UserStats.tsx
│   │   │       ├── CreatorInsights.tsx
│   │   │       └── TrendChart.tsx
│   │   ├── layout/                 # 레이아웃 컴포넌트
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Navigation.tsx
│   │   │   └── MobileMenu.tsx
│   │   └── providers/              # 컨텍스트 프로바이더
│   │       ├── QueryProvider.tsx
│   │       ├── ThemeProvider.tsx
│   │       ├── AuthProvider.tsx
│   │       └── Providers.tsx
│   │
│   ├── lib/                         # 핵심 라이브러리 및 유틸리티
│   │   ├── api/                    # API 관련
│   │   │   ├── client.ts           # API 클라이언트 설정
│   │   │   ├── endpoints.ts        # API 엔드포인트
│   │   │   ├── types.ts            # API 타입 정의
│   │   │   └── queries/            # TanStack Query 쿼리
│   │   │       ├── auth.ts
│   │   │       ├── creators.ts
│   │   │       ├── content.ts
│   │   │       └── notifications.ts
│   │   ├── auth/                   # 인증 관련
│   │   │   ├── config.ts           # 인증 설정
│   │   │   ├── provider.ts         # 인증 프로바이더
│   │   │   └── utils.ts            # 인증 유틸리티
│   │   ├── utils/                  # 범용 유틸리티
│   │   │   ├── cn.ts               # 클래스명 유틸리티
│   │   │   ├── format.ts           # 포매팅 함수
│   │   │   ├── validation.ts       # 검증 함수
│   │   │   └── constants.ts        # 상수 정의
│   │   ├── hooks/                  # 커스텀 훅
│   │   │   ├── useAuth.ts
│   │   │   ├── useLocalStorage.ts
│   │   │   ├── useDebounce.ts
│   │   │   ├── useIntersection.ts
│   │   │   └── useWebSocket.ts
│   │   └── validations/            # Zod 스키마
│   │       ├── auth.ts
│   │       ├── creator.ts
│   │       ├── content.ts
│   │       └── user.ts
│   │
│   ├── stores/                      # Zustand 스토어
│   │   ├── auth.ts                 # 인증 상태
│   │   ├── ui.ts                   # UI 상태 (테마, 사이드바 등)
│   │   ├── creators.ts             # 크리에이터 관련 상태
│   │   ├── notifications.ts        # 알림 상태
│   │   └── preferences.ts          # 사용자 설정
│   │
│   ├── types/                       # TypeScript 타입 정의
│   │   ├── api.ts                  # API 응답 타입
│   │   ├── auth.ts                 # 인증 관련 타입
│   │   ├── creator.ts              # 크리에이터 타입
│   │   ├── content.ts              # 콘텐츠 타입
│   │   ├── user.ts                 # 사용자 타입
│   │   ├── ui.ts                   # UI 관련 타입
│   │   └── index.ts                # 통합 타입 내보내기
│   │
│   ├── styles/                      # 스타일 관련
│   │   ├── globals.css             # 전역 CSS
│   │   ├── components.css          # 컴포넌트 스타일
│   │   └── themes.css              # 테마 변수
│   │
│   └── constants/                   # 상수 정의
│       ├── api.ts                  # API 관련 상수
│       ├── routes.ts               # 라우트 상수
│       ├── ui.ts                   # UI 관련 상수
│       └── index.ts
│
├── public/                          # 정적 파일
│   ├── icons/                      # 아이콘 파일
│   ├── images/                     # 이미지 파일
│   ├── favicon.ico
│   └── manifest.json
│
├── docs/                           # 프로젝트 문서
│   ├── deployment.md               # 배포 가이드
│   ├── development.md              # 개발 가이드
│   ├── components.md               # 컴포넌트 문서
│   └── api.md                      # API 연동 가이드
│
├── __tests__/                      # 테스트 파일
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── setup.ts
│
├── .env.local                      # 로컬 환경 변수
├── .env.example                    # 환경 변수 예시
├── next.config.js                  # Next.js 설정
├── tailwind.config.js              # Tailwind 설정
├── biome.json                      # Biome 설정
├── vitest.config.ts               # Vitest 설정
├── tsconfig.json                   # TypeScript 설정
├── package.json                    # 패키지 설정
└── README.md                       # 프로젝트 설명
```

## 🚀 핵심 기능 구현

### 1. 개인화 대시보드
```typescript
// 맞춤형 피드 관리
interface PersonalizedDashboard {
  // 실시간 피드
  liveFeed: {
    recentUploads: CreatorVideo[];      // 최신 업로드
    continueWatching: WatchProgress[];   // 시청 중인 영상
    trendingNow: TrendingContent[];      // 실시간 트렌딩
  };
  
  // AI 추천 시스템
  recommendations: {
    forYou: RecommendedVideo[];          // 개인 맞춤 추천
    basedOnHistory: HistoryBasedRec[];   // 시청 기록 기반
    fromFollowing: SocialRec[];          // 팔로잉 기반
  };
  
  // 커스터마이징
  layout: DashboardLayout;               // 레이아웃 설정
  filters: ContentFilter[];             // 콘텐츠 필터
  priorities: CreatorPriority[];        // 크리에이터 우선순위
}
```

### 2. 크리에이터 관리 시스템
```typescript
// 크리에이터 구독 및 관리
interface CreatorManagement {
  // 구독 관리
  subscriptions: {
    creators: SubscribedCreator[];       // 구독 중인 크리에이터
    categories: CreatorCategory[];       // 카테고리별 분류
    notifications: NotificationSetting[]; // 알림 설정
  };
  
  // 발견 및 추가
  discovery: {
    trending: TrendingCreator[];         // 트렌딩 크리에이터
    recommended: RecommendedCreator[];   // 추천 크리에이터
    search: SearchResult[];              // 검색 결과
  };
  
  // 상호작용
  interactions: {
    favorites: FavoriteCreator[];        // 즐겨찾기
    watchHistory: WatchHistory[];        // 시청 기록
    engagementStats: EngagementMetrics[]; // 참여도 통계
  };
}
```

### 3. 실시간 알림 시스템
```typescript
// WebSocket 기반 실시간 업데이트
interface RealTimeNotifications {
  // 알림 타입
  types: {
    newUpload: NewUploadNotification;    // 새 영상 업로드
    liveStream: LiveStreamNotification;  // 라이브 스트림 시작
    community: CommunityNotification;    // 커뮤니티 활동
    milestone: MilestoneNotification;    // 마일스톤 달성
  };
  
  // 개인화 설정
  preferences: {
    timing: NotificationTiming;          // 알림 시간 최적화
    priority: PriorityLevel;             // 우선순위 설정
    channels: DeliveryChannel[];         // 전달 채널
  };
  
  // 배치 처리
  batching: {
    digest: DigestNotification;          // 요약 알림
    realTime: InstantNotification;       // 즉시 알림
    scheduled: ScheduledNotification;    // 예약 알림
  };
}
```

### 4. 커뮤니티 상호작용
```typescript
// 팬 커뮤니티 플랫폼
interface CommunityFeatures {
  // 토론 및 댓글
  discussions: {
    videoThreads: DiscussionThread[];    // 영상별 토론
    generalChat: CommunityChat[];        // 일반 채팅
    polls: CommunityPoll[];              // 투표 기능
  };
  
  // 이벤트 및 활동
  events: {
    watchParties: WatchParty[];          // 단체 시청
    challenges: FanChallenge[];          // 팬 챌린지
    meetups: VirtualMeetup[];            // 가상 모임
  };
  
  // 소셜 기능
  social: {
    friends: FriendConnection[];         // 친구 연결
    sharing: ContentShare[];             // 콘텐츠 공유
    collaboration: Collaboration[];       // 협업 기능
  };
}
```

## 🎨 디자인 시스템

### 컬러 팔레트
```css
:root {
  /* Primary Colors */
  --primary-50: #eff6ff;
  --primary-500: #3b82f6;
  --primary-900: #1e3a8a;
  
  /* Secondary Colors */
  --secondary-50: #f8fafc;
  --secondary-500: #64748b;
  --secondary-900: #0f172a;
  
  /* Accent Colors */
  --accent-purple: #8b5cf6;
  --accent-pink: #ec4899;
  --accent-green: #10b981;
  
  /* Semantic Colors */
  --success: #22c55e;
  --warning: #f59e0b;
  --error: #ef4444;
  --info: #06b6d4;
}
```

### 타이포그래피 스케일
```css
.text-scale {
  /* Display */
  --display-2xl: 4.5rem;   /* 72px */
  --display-xl: 3.75rem;   /* 60px */
  --display-lg: 3rem;      /* 48px */
  
  /* Headings */
  --heading-xl: 2.25rem;   /* 36px */
  --heading-lg: 1.875rem;  /* 30px */
  --heading-md: 1.5rem;    /* 24px */
  --heading-sm: 1.25rem;   /* 20px */
  
  /* Body */
  --body-xl: 1.125rem;     /* 18px */
  --body-lg: 1rem;         /* 16px */
  --body-md: 0.875rem;     /* 14px */
  --body-sm: 0.75rem;      /* 12px */
}
```

### 간격 및 레이아웃
```css
.spacing-scale {
  /* Spacing Scale (based on 4px) */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-4: 1rem;      /* 16px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-24: 6rem;     /* 96px */
}
```

## 🔧 개발 워크플로우

### 개발 환경 설정
```bash
# 프로젝트 클론
git clone https://github.com/your-org/mypick-client.git
cd mypick-client

# 의존성 설치 (pnpm 권장)
pnpm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일 편집

# 개발 서버 시작
pnpm dev
```

### 주요 명령어
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build", 
    "start": "next start",
    "lint": "biome check .",
    "lint:fix": "biome check --apply .",
    "format": "biome format --write .",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "e2e": "playwright test",
    "analyze": "ANALYZE=true next build"
  }
}
```

### Git 워크플로우
```bash
# 기능 브랜치 생성
git checkout -b feature/new-feature

# 개발 및 커밋
git add .
git commit -m "feat: 새로운 기능 추가"

# 푸시 및 PR 생성
git push origin feature/new-feature
# GitHub에서 Pull Request 생성
```

## 📱 반응형 디자인 전략

### 브레이크포인트 시스템
```typescript
const breakpoints = {
  sm: '640px',   // 모바일 (세로)
  md: '768px',   // 태블릿 (세로)
  lg: '1024px',  // 태블릿 (가로) / 작은 데스크톱
  xl: '1280px',  // 데스크톱
  '2xl': '1536px' // 대형 데스크톱
} as const;
```

### 모바일 우선 접근법
```tsx
// 반응형 컴포넌트 예시
const ResponsiveLayout = () => (
  <div className="
    grid grid-cols-1 gap-4
    md:grid-cols-2 md:gap-6
    lg:grid-cols-3 lg:gap-8
    xl:grid-cols-4
  ">
    {/* 모바일: 1열, 태블릿: 2열, 데스크톱: 3-4열 */}
  </div>
);
```

### 적응형 UI 패턴
```tsx
// 화면 크기에 따른 컴포넌트 전환
const AdaptiveNavigation = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return isMobile ? <MobileMenu /> : <DesktopNavigation />;
};
```

## 🔒 보안 및 성능

### 보안 조치
```typescript
// API 요청 보안
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 인증 토큰 자동 추가
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터 - 에러 처리
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthToken();
      redirect('/login');
    }
    return Promise.reject(error);
  }
);
```

### 성능 최적화
```typescript
// 이미지 최적화
import Image from 'next/image';

const OptimizedImage = ({ src, alt }: ImageProps) => (
  <Image
    src={src}
    alt={alt}
    fill
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,..."
  />
);

// 동적 임포트로 코드 분할
const DynamicComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false,
});

// 메모이제이션
const ExpensiveComponent = memo(({ data }: Props) => {
  const memoizedValue = useMemo(() => 
    heavyCalculation(data), [data]
  );
  
  return <div>{memoizedValue}</div>;
});
```

## 🧪 테스트 전략

### 테스트 피라미드
```
        ┌─────────────┐
        │   E2E Tests │ (소수의 핵심 플로우)
        └─────────────┘
      ┌───────────────────┐
      │ Integration Tests │ (컴포넌트 상호작용)
      └───────────────────┘
  ┌─────────────────────────┐
  │     Unit Tests          │ (개별 함수/컴포넌트)
  └─────────────────────────┘
```

### 테스트 예시
```typescript
// 컴포넌트 테스트
describe('CreatorCard', () => {
  test('구독 버튼 클릭 시 상태 변경', async () => {
    const mockCreator = createMockCreator();
    render(<CreatorCard creator={mockCreator} />);
    
    const subscribeButton = screen.getByRole('button', { name: /구독/i });
    await userEvent.click(subscribeButton);
    
    expect(screen.getByText(/구독중/i)).toBeInTheDocument();
  });
});

// 훅 테스트
describe('useCreatorSubscription', () => {
  test('구독 성공 시 쿼리 무효화', async () => {
    const { result } = renderHook(() => useCreatorSubscription());
    
    await act(async () => {
      await result.current.mutateAsync({
        creatorId: 'test-id',
        action: 'subscribe'
      });
    });
    
    expect(result.current.isSuccess).toBe(true);
  });
});
```

## 📊 모니터링 및 분석

### 성능 모니터링
```typescript
// Web Vitals 추적
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: Metric) {
  // Google Analytics, Vercel Analytics 등으로 전송
  gtag('event', metric.name, {
    value: Math.round(metric.value),
    event_category: 'Web Vitals',
  });
}

getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);
```

### 사용자 행동 추적
```typescript
// 커스텀 이벤트 추적
const trackUserEvent = (eventName: string, properties?: Record<string, any>) => {
  // 사용자 행동 분석
  analytics.track(eventName, {
    timestamp: new Date().toISOString(),
    url: window.location.href,
    ...properties,
  });
};

// 사용 예시
trackUserEvent('video_watched', {
  creatorId: 'creator-123',
  videoId: 'video-456',
  watchDuration: 150,
});
```

## 🚀 배포 및 DevOps

### 배포 파이프라인
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test
      - run: pnpm build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
```

### 환경별 설정
```typescript
// 환경별 설정 관리
const config = {
  development: {
    apiUrl: 'http://localhost:4000',
    wsUrl: 'ws://localhost:4000',
    logLevel: 'debug',
  },
  staging: {
    apiUrl: 'https://api-staging.mypick.app',
    wsUrl: 'wss://api-staging.mypick.app',
    logLevel: 'info',
  },
  production: {
    apiUrl: 'https://api.mypick.app',
    wsUrl: 'wss://api.mypick.app',
    logLevel: 'error',
  },
} as const;

export const getConfig = () => config[process.env.NODE_ENV as keyof typeof config];
```

## 🔮 향후 개발 계획

### Phase 1: 핵심 기능 완성 (1-3개월)
- 기본 크리에이터 관리 시스템
- YouTube API 통합
- 개인화 대시보드
- 실시간 알림 시스템

### Phase 2: 고급 기능 추가 (3-6개월)
- AI 기반 추천 시스템
- 커뮤니티 기능
- 모바일 앱 (React Native)
- 고급 분석 대시보드

### Phase 3: 플랫폼 확장 (6-12개월)
- 멀티 플랫폼 지원 (Twitter, Instagram)
- 크리에이터 도구
- API 개방
- 엔터프라이즈 기능

## 🤝 기여 및 협업

### 개발 참여 방법
1. 이슈 확인 및 할당
2. 기능 브랜치 생성
3. 개발 및 테스트
4. Pull Request 제출
5. 코드 리뷰 및 머지

### 코드 리뷰 가이드라인
- 코드 품질 및 일관성 확인
- 테스트 커버리지 검증
- 성능 영향 검토
- 보안 취약점 점검
- 접근성 기준 준수

---

> **MyPick Client**는 크리에이터 팬덤 문화의 중심에서 팬들에게 최고의 경험을 제공하기 위해 지속적으로 발전하고 있습니다. 🚀