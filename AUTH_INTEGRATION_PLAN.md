# my-pick 서비스 인증 통합 개선 계획서

## 📋 프로젝트 개요

### krgeobuk 생태계 현황
krgeobuk-infra는 마이크로서비스 아키텍처 기반의 통합 플랫폼으로, 다음 핵심 서비스들로 구성되어 있습니다:

- **auth-server**: OAuth, JWT 기반 사용자 인증 서비스
- **authz-server**: RBAC 기반 역할/권한 관리 서비스  
- **portal-client**: 통합 관리 포털 (Next.js 15)
- **my-pick-client**: 크리에이터 팬 허브 서비스 (Next.js 14)

### my-pick 서비스 위치
my-pick은 krgeobuk 도메인의 서브도메인(`my-pick.krgeobuk.com`)으로 운영될 예정이며, 기존 인증 인프라와의 원활한 통합이 필요한 상황입니다.

## 🔍 현재 상황 분석

### 기존 인증 방식의 문제점

#### 1. 중복 개발 문제
- portal-client에 로그인/회원가입 UI가 구현되어 있음
- my-pick-client에서 동일한 기능을 다시 개발해야 하는 상황
- 향후 추가 서비스마다 인증 UI 중복 개발 필요

#### 2. 일관성 부족
- 서비스별로 다른 인증 UX
- 사용자가 서비스마다 별도 로그인 필요
- 브랜딩 및 디자인 일관성 부족

#### 3. 유지보수 복잡성
- 인증 관련 보안 업데이트 시 모든 서비스 개별 수정 필요
- 정책 변경 시 다중 수정 포인트
- 코드 중복으로 인한 버그 발생 가능성

## 🎯 새로운 아키텍처 제안

### 공유 컴포넌트 패키지 기반 통합 인증

#### 핵심 개념
모든 클라이언트 서비스가 공통의 인증 컴포넌트 패키지를 사용하여 일관된 인증 경험을 제공하는 아키텍처

```
@krgeobuk/auth-components (공유 패키지)
├── LoginForm.tsx         # 로그인 폼 컴포넌트
├── RegisterForm.tsx      # 회원가입 폼 컴포넌트
├── AuthProvider.tsx      # 인증 컨텍스트 프로바이더
├── useAuth.tsx          # 인증 관리 훅
├── AuthModal.tsx        # 모달 래퍼 컴포넌트
└── types.ts             # 인증 관련 타입 정의
```

#### 적용 서비스
- **portal-client**: 기존 인증 페이지를 공유 컴포넌트로 교체
- **my-pick-client**: 공유 컴포넌트를 사용한 인증 구현
- **향후 서비스**: 즉시 인증 기능 적용 가능

## 🚀 구현 로드맵

### 1단계: @krgeobuk/auth-components 패키지 생성

#### 작업 내용
- shared-lib 모노레포에 새로운 패키지 추가
- 기존 portal-client의 인증 로직을 재사용 가능한 컴포넌트로 분리
- TypeScript 타입 정의 및 API 인터페이스 설계

#### 주요 컴포넌트 설계

```typescript
// LoginForm.tsx
interface LoginFormProps {
  onSuccess: (token: string, user: User) => void;
  onError: (error: AuthError) => void;
  customTheme?: AuthTheme;
}

// AuthProvider.tsx  
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
}

// useAuth.tsx
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

#### 예상 기간: 2-3주

### 2단계: auth-server API 단순화

#### 현재 API 구조
```typescript
// 리다이렉트 기반 (기존)
POST /api/auth/login → 302 Redirect + Set-Cookie

// JSON 응답 기반 (추가 필요)
POST /api/auth/login-api → JSON Response
```

#### 새로운 통합 API 구조
```typescript
// 모든 클라이언트가 동일하게 사용
POST /api/auth/login → JSON Response
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": { ... },
    "expiresIn": 3600
  }
}

POST /api/auth/register → JSON Response
POST /api/auth/logout → JSON Response
POST /api/auth/refresh → JSON Response
```

#### 변경 사항
- 기존 리다이렉트 로직 제거
- JSON 기반 API 응답으로 통일
- CORS 정책 업데이트 (my-pick 도메인 추가)

#### 예상 기간: 1-2주

### 3단계: portal-client 리팩터링

#### 변경 내용
```typescript
// Before: 독립적인 인증 페이지
/app/auth/login/page.tsx
/app/auth/register/page.tsx

// After: 공유 컴포넌트 기반 모달 인증
import { AuthModal, AuthProvider } from '@krgeobuk/auth-components';

function PortalApp() {
  return (
    <AuthProvider apiUrl="https://auth.krgeobuk.com">
      <Layout>
        {!isAuthenticated && <AuthModal />}
        {/* 기존 포털 컨텐츠 */}
      </Layout>
    </AuthProvider>
  );
}
```

#### 마이그레이션 가이드
1. 기존 인증 페이지 백업
2. @krgeobuk/auth-components 패키지 설치
3. AuthProvider로 앱 래핑
4. 기존 인증 로직을 공유 컴포넌트로 교체
5. 라우팅 구조 간소화

#### 예상 기간: 2-3주

### 4단계: my-pick-client 통합

#### 구현 계획
```typescript
// my-pick-client/src/app/layout.tsx
import { AuthProvider } from '@krgeobuk/auth-components';

export default function MyPickLayout({ children }) {
  return (
    <AuthProvider 
      apiUrl="https://auth.krgeobuk.com"
      theme={{
        primaryColor: '#ff6b6b',  // my-pick 브랜드 컬러
        fontFamily: 'Pretendard'
      }}
    >
      <MyPickApp>{children}</MyPickApp>
    </AuthProvider>
  );
}

// my-pick-client/src/components/auth/LoginModal.tsx
import { LoginForm } from '@krgeobuk/auth-components';

function MyPickLoginModal() {
  const { login } = useAuth();
  
  return (
    <Modal>
      <LoginForm 
        onSuccess={(token, user) => {
          // my-pick 특화 로직
          redirectToUserDashboard(user);
        }}
        customTheme={myPickTheme}
      />
    </Modal>
  );
}
```

#### my-pick 특화 기능
- 크리에이터 관련 추가 사용자 정보 수집
- my-pick 브랜딩에 맞는 테마 적용
- 소셜 로그인 옵션 커스터마이징

#### 예상 기간: 1-2주

## 🛠 기술적 세부사항

### 토큰 관리 전략

#### JWT 토큰 흐름
```
1. 사용자 로그인 시도
2. auth-server에서 JWT 토큰 발급
3. 클라이언트에서 토큰 저장 (httpOnly cookie + localStorage)
4. API 요청 시 Authorization 헤더에 토큰 포함
5. 토큰 만료 시 자동 갱신 또는 재로그인 유도
```

#### 보안 고려사항
- httpOnly 쿠키를 통한 XSS 방지
- CSRF 토큰을 통한 CSRF 공격 방지
- 토큰 만료 시간 적절히 설정 (access: 1시간, refresh: 2주)
- 로그아웃 시 토큰 블랙리스트 처리

### 컴포넌트 설계 원칙

#### 1. 재사용성
- 모든 서비스에서 사용 가능한 범용 컴포넌트
- Props를 통한 커스터마이징 지원
- 테마 시스템을 통한 브랜딩 적용

#### 2. 확장성
- 새로운 인증 방식 추가 가능한 구조
- 플러그인 아키텍처 고려
- 다국어 지원 준비

#### 3. 접근성
- WCAG 2.1 가이드라인 준수
- 키보드 네비게이션 지원
- 스크린 리더 호환성

### API 설계 가이드

#### RESTful API 원칙
```typescript
// 인증 관련 엔드포인트
POST   /api/auth/login       # 로그인
POST   /api/auth/register    # 회원가입
POST   /api/auth/logout      # 로그아웃
POST   /api/auth/refresh     # 토큰 갱신
GET    /api/auth/me          # 현재 사용자 정보
PUT    /api/auth/password    # 비밀번호 변경

// OAuth 관련 엔드포인트  
GET    /api/oauth/google     # Google OAuth 시작
GET    /api/oauth/naver      # Naver OAuth 시작
POST   /api/oauth/callback   # OAuth 콜백 처리
```

#### 응답 형식 표준화
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId: string;
  };
}
```

## 🎉 예상 효과 및 이점

### 개발 효율성
- **80% 개발 시간 단축**: 새로운 서비스 추가 시 인증 부분 즉시 완성
- **중복 코드 제거**: 인증 관련 코드 중앙화로 유지보수 부담 감소
- **일관된 품질**: 검증된 컴포넌트 재사용으로 버그 발생률 감소

### 사용자 경험 개선
- **매끄러운 인증**: 페이지 리다이렉트 없는 모달 기반 인증
- **통합 세션**: 한 번 로그인으로 모든 krgeobuk 서비스 이용 가능
- **일관된 UI/UX**: 모든 서비스에서 동일한 인증 경험

### 보안 강화
- **중앙화된 보안 정책**: 한 곳에서 보안 업데이트 시 전체 서비스 적용
- **표준화된 토큰 관리**: 검증된 JWT 토큰 처리 방식
- **통합 로그 관리**: 모든 인증 활동의 중앙 집중식 모니터링

### 확장성 확보
- **새로운 서비스 빠른 추가**: 인증 부분은 패키지 설치만으로 완성
- **다양한 인증 방식 지원**: OAuth, SAML 등 추가 인증 방식 쉽게 확장
- **마이크로서비스 아키텍처 지원**: 서비스 간 독립성 유지하면서 인증 통합

## 📈 마이그레이션 가이드

### 단계별 적용 전략

#### Phase 1: 병렬 개발 (4주)
```
Week 1-2: @krgeobuk/auth-components 패키지 개발
Week 3-4: auth-server API 리팩터링
```

#### Phase 2: 점진적 마이그레이션 (6주)
```
Week 5-7: portal-client 마이그레이션
Week 8-9: my-pick-client 통합
Week 10: 테스트 및 최적화
```

#### Phase 3: 안정화 및 최적화 (2주)
```
Week 11: 성능 테스트 및 튜닝
Week 12: 문서화 및 배포
```

### 호환성 고려사항

#### 기존 시스템과의 호환성
- 기존 JWT 토큰 형식 유지
- 데이터베이스 스키마 변경 최소화
- 기존 OAuth 플로우와의 호환성 보장

#### 브라우저 지원
- 모던 브라우저 (Chrome 90+, Firefox 88+, Safari 14+)
- 모바일 브라우저 완전 지원
- IE 지원 제외 (EOL)

### 롤백 계획
각 단계별로 롤백 가능한 구조로 설계:
1. **패키지 레벨**: 이전 버전으로 다운그레이드 가능
2. **서비스 레벨**: 기존 인증 방식으로 즉시 복원 가능
3. **데이터 레벨**: 기존 사용자 데이터 완전 보존

## 📚 참고 자료

### 기술 문서
- [JWT RFC 7519](https://tools.ietf.org/html/rfc7519)
- [OAuth 2.0 RFC 6749](https://tools.ietf.org/html/rfc6749)
- [Next.js Authentication Patterns](https://nextjs.org/docs/authentication)

### 내부 문서
- `krgeobuk-infra/CLAUDE.md`: 전체 아키텍처 가이드
- `auth-server/CLAUDE.md`: 인증 서버 개발 가이드
- `portal-client/CLAUDE.md`: 프론트엔드 개발 표준

---

**문서 버전**: 1.0  
**작성일**: 2025-07-26  
**검토자**: krgeobuk 개발팀  
**다음 검토일**: 2025-08-26