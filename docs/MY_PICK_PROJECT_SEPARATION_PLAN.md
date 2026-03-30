# mypick 프로젝트 분리 계획서

## 📋 개요

mypick-client를 사용자 페이지와 관리자 페이지로 분리하여 확장성, 보안성, 유지보수성을 향상시키는 프로젝트입니다. 현재 하나의 프로젝트에서 라우팅으로 구분되어 있는 구조를 독립적인 두 개의 프로젝트로 분리합니다.

### 목표
- **확장성**: 각 사용자 그룹에 최적화된 독립적인 개발 및 배포
- **보안성**: 관리자 기능의 완전한 분리로 보안 향상
- **유지보수성**: 코드 중복 최소화 및 공통 컴포넌트 재사용
- **성능**: 각 프로젝트별 최적화된 번들 크기

## 🔍 현재 상태 분석

### 프로젝트 구조 현황
```
mypick-client/
├── src/
│   ├── app/
│   │   ├── (admin)/        # 관리자 페이지 (분리 대상)
│   │   ├── (auth)/         # 인증 페이지 (공통)
│   │   └── (main)/         # 사용자 페이지 (유지)
│   ├── components/
│   │   ├── admin/          # 관리자 컴포넌트 (분리 대상)
│   │   ├── auth/           # 인증 컴포넌트 (공통)
│   │   ├── layout/         # 레이아웃 컴포넌트 (부분 분리)
│   │   ├── main/           # 사용자 컴포넌트 (유지)
│   │   ├── ui/             # UI 컴포넌트 (공통)
│   │   └── video/          # 비디오 컴포넌트 (사용자)
│   ├── store/slices/       # Redux 상태 (부분 분리)
│   ├── lib/                # API 클라이언트 및 유틸리티 (공통)
│   └── types/              # 타입 정의 (공통)
```

### 기능별 분류

#### 🟢 사용자 전용 기능 (mypick-web)
- **페이지**: 메인 대시보드, 크리에이터 탐색, 비디오 시청, 프로필 관리
- **컴포넌트**: 
  - `components/main/` - 메인 대시보드 컴포넌트
  - `components/video/` - 비디오 플레이어 및 관련 컴포넌트
  - `components/layout/header.tsx` - 사용자 헤더
  - `components/layout/sidebar.tsx` - 사용자 사이드바
- **상태 관리**:
  - `contentSlice.ts` - 콘텐츠 상태
  - `creatorSlice.ts` - 크리에이터 상태
  - `videoDetailSlice.ts` - 비디오 상세 상태
  - `notificationSlice.ts` - 알림 상태

#### 🔴 관리자 전용 기능 (mypick-admin)
- **페이지**: 관리자 대시보드, 사용자 관리, 크리에이터 관리, 콘텐츠 관리
- **컴포넌트**:
  - `components/admin/` - 모든 관리자 컴포넌트
  - `components/layout/admin-header.tsx` - 관리자 헤더
  - `components/layout/admin-sidebar.tsx` - 관리자 사이드바
- **상태 관리**:
  - `adminSlice.ts` - 관리자 기능 상태
  - `userManagementSlice.ts` - 사용자 관리 상태
  - `creatorApplicationSlice.ts` - 크리에이터 신청 관리

#### 🟡 공통 기능 (공유 라이브러리)
- **인증 시스템**: 로그인, 회원가입, 토큰 관리
- **UI 컴포넌트**: Button, Card, Input, Badge 등
- **API 클라이언트**: HTTP 클라이언트, 인터셉터
- **타입 정의**: 공통 인터페이스 및 타입
- **유틸리티**: 케이스 변환, 문자열 처리 등
- **공통 상태**: 
  - `authSlice.ts` - 인증 상태
  - `uiSlice.ts` - UI 상태 (테마, 모바일 메뉴 등)

## 📦 공유 라이브러리 패키지 설계

### @krgeobuk/mypick-ui
```typescript
// UI 컴포넌트 라이브러리
export {
  Button,
  Card,
  Input,
  Badge,
  Separator,
  Modal,
  Toast,
  LoadingSpinner,
  Pagination,
  Table,
  SearchFilters
} from './components';

export * from './types/ui';
```

### @krgeobuk/mypick-common
```typescript
// 공통 타입, 인터페이스, 유틸리티
export type {
  User,
  Creator,
  Content,
  Platform,
  ApiResponse,
  PaginatedResponse,
  ContentFilter,
  SearchResult
} from './types';

export {
  caseConverter,
  stringUtils,
  formValidation,
  security
} from './utils';

export * from './constants';
```

### @krgeobuk/mypick-auth
```typescript
// 인증 관련 컴포넌트 및 훅
export {
  AuthProvider,
  AuthGuard,
  SessionManager,
  TokenExpirationWarning
} from './components';

export {
  useAuth,
  useTokenRefresh,
  useTokenMonitor
} from './hooks';

export { authSlice } from './store';
```

### @krgeobuk/mypick-http
```typescript
// HTTP 클라이언트 및 API 서비스
export { ApiClient } from './client';
export {
  authApi,
  userApi,
  creatorApi,
  contentApi,
  notificationApi,
  adminApi
} from './services';
```

## 🗂️ 프로젝트 분리 전략

### 1단계: 공유 라이브러리 생성 ✅
**예상 소요시간**: 1-2주

#### 작업 내용
1. **@krgeobuk/mypick-ui 패키지 생성**
   ```bash
   # shared-lib/packages/mypick-ui 생성
   pnpm create-package @krgeobuk/mypick-ui
   ```
   - 기존 `components/ui/` 컴포넌트 이전
   - Tailwind CSS 스타일 포함
   - Storybook 설정 (선택사항)

2. **@krgeobuk/mypick-common 패키지 생성**
   ```bash
   # shared-lib/packages/mypick-common 생성
   pnpm create-package @krgeobuk/mypick-common
   ```
   - `types/index.ts` 이전
   - `lib/utils.ts` 유틸리티 함수 이전
   - 공통 상수 및 열거형 이전

3. **@krgeobuk/mypick-auth 패키지 생성**
   ```bash
   # shared-lib/packages/mypick-auth 생성
   pnpm create-package @krgeobuk/mypick-auth
   ```
   - `components/auth/` 컴포넌트 이전
   - `hooks/useAuth.ts` 관련 훅 이전
   - `store/slices/authSlice.ts` 이전

4. **@krgeobuk/mypick-http 패키지 생성**
   ```bash
   # shared-lib/packages/mypick-http 생성
   pnpm create-package @krgeobuk/mypick-http
   ```
   - `lib/api.ts` API 클라이언트 이전
   - API 서비스 함수들 모듈화

#### 검증 기준
- [ ] 모든 패키지가 빌드 성공
- [ ] 타입 검사 통과
- [ ] 기존 mypick-client에서 공유 라이브러리 사용 가능

### 2단계: 관리자 프로젝트 분리 🚀
**예상 소요시간**: 2-3주

#### mypick-admin 프로젝트 생성
```bash
# 프로젝트 루트에서
npx create-next-app@latest mypick-admin --typescript --tailwind --eslint --app --src-dir
```

#### 관리자 기능 이전
1. **페이지 이전**
   - `app/(admin)/` → `mypick-admin/src/app/`
   - 라우팅 구조 재구성

2. **컴포넌트 이전**
   - `components/admin/` → `mypick-admin/src/components/admin/`
   - `components/layout/admin-*` → `mypick-admin/src/components/layout/`

3. **상태 관리 이전**
   - `adminSlice.ts` → `mypick-admin/src/store/slices/`
   - `userManagementSlice.ts` → `mypick-admin/src/store/slices/`
   - `creatorApplicationSlice.ts` → `mypick-admin/src/store/slices/`

4. **공유 라이브러리 의존성 추가**
   ```json
   {
     "dependencies": {
       "@krgeobuk/mypick-ui": "workspace:*",
       "@krgeobuk/mypick-common": "workspace:*",
       "@krgeobuk/mypick-auth": "workspace:*",
       "@krgeobuk/mypick-http": "workspace:*"
     }
   }
   ```

#### 보안 강화
1. **관리자 전용 인증 가드**
   ```typescript
   // mypick-admin/src/middleware.ts
   export function middleware(request: NextRequest) {
     // 관리자 권한 검증 로직
   }
   ```

2. **환경 변수 분리**
   ```bash
   # mypick-admin/.env.local
   NEXT_PUBLIC_API_URL=https://api.mypick.com
   NEXT_PUBLIC_ADMIN_DOMAIN=admin.mypick.com
   ```

#### 검증 기준
- [ ] 관리자 기능 완전 동작
- [ ] 사용자 페이지에서 관리자 코드 완전 제거
- [ ] 독립적인 빌드 및 배포 가능

### 3단계: 사용자 프로젝트 정리 및 리네이밍 🔄
**예상 소요시간**: 1주

#### 관리자 기능 제거
1. **불필요한 파일 삭제**
   ```bash
   rm -rf src/app/\(admin\)
   rm -rf src/components/admin
   rm src/components/layout/admin-*
   rm src/store/slices/adminSlice.ts
   rm src/store/slices/userManagementSlice.ts
   rm src/store/slices/creatorApplicationSlice.ts
   ```

2. **공유 라이브러리 의존성 추가**
   ```json
   {
     "dependencies": {
       "@krgeobuk/mypick-ui": "workspace:*",
       "@krgeobuk/mypick-common": "workspace:*",
       "@krgeobuk/mypick-auth": "workspace:*",
       "@krgeobuk/mypick-http": "workspace:*"
     }
   }
   ```

3. **Import 경로 업데이트**
   ```typescript
   // Before
   import { Button } from '@/components/ui/button';
   import { User } from '@/types';
   
   // After
   import { Button } from '@krgeobuk/mypick-ui';
   import { User } from '@krgeobuk/mypick-common';
   ```

#### 점진적 리네이밍
1. **패키지명 업데이트**
   ```json
   // package.json
   {
     "name": "mypick-web",
   }
   ```

2. **문서 및 설정 파일 업데이트**
   - README.md
   - CLAUDE.md
   - Docker 설정
   - CI/CD 설정

#### 검증 기준
- [ ] 사용자 기능 완전 동작
- [ ] 번들 크기 감소 확인
- [ ] 성능 개선 확인

### 4단계: 배포 및 인프라 구성 🚀
**예상 소요시간**: 1-2주

#### Docker 설정
```dockerfile
# mypick-web/Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

```dockerfile
# mypick-admin/Dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3001
CMD ["node", "server.js"]
```

#### Docker Compose 설정
```yaml
# docker-compose.yml
version: '3.8'
services:
  mypick-web:
    build: ./mypick-web
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8200
    networks:
      - msa-network

  mypick-admin:
    build: ./mypick-admin
    ports:
      - "3001:3001"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8200
      - NEXT_PUBLIC_ADMIN_DOMAIN=admin.mypick.local
    networks:
      - msa-network

networks:
  msa-network:
    external: true
```

#### CI/CD 파이프라인
```yaml
# .github/workflows/deploy-web.yml
name: Deploy mypick-web
on:
  push:
    branches: [main]
    paths: ['mypick-web/**']
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and Deploy
        run: |
          cd mypick-web
          npm ci
          npm run build
          # 배포 스크립트
```

```yaml
# .github/workflows/deploy-admin.yml
name: Deploy mypick-admin
on:
  push:
    branches: [main]
    paths: ['mypick-admin/**']
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and Deploy
        run: |
          cd mypick-admin
          npm ci
          npm run build
          # 배포 스크립트
```

## 📊 리스크 분석 및 대응 방안

### 높은 리스크 ⚠️

#### 1. 공유 라이브러리 버전 불일치
**위험도**: 높음
**대응 방안**: 
- Semantic Versioning 엄격 적용
- 공유 라이브러리 변경 시 모든 의존 프로젝트 테스트
- Lerna 또는 pnpm workspace 활용한 버전 동기화

#### 2. 상태 관리 복잡도 증가
**위험도**: 중간
**대응 방안**:
- Redux Toolkit 및 RTK Query 활용
- 각 프로젝트별 독립적인 상태 관리
- 공통 상태는 최소화하고 명확한 경계 설정

### 중간 리스크 ⚡

#### 3. 개발 환경 복잡도
**위험도**: 중간
**대응 방안**:
- Docker Compose를 통한 통합 개발 환경
- 공유 라이브러리 hot reload 지원
- 개발자 가이드 문서 작성

#### 4. 배포 파이프라인 복잡도
**위험도**: 중간
**대응 방안**:
- 각 프로젝트별 독립적인 CI/CD
- Blue-Green 배포 전략 적용
- 롤백 계획 수립

## 📈 성과 지표

### 개발 효율성
- [ ] 코드 중복률 < 20%
- [ ] 빌드 시간 단축 > 30%
- [ ] 개발자 온보딩 시간 단축 > 50%

### 성능 지표
- [ ] 사용자 페이지 번들 크기 감소 > 40%
- [ ] 관리자 페이지 로딩 시간 개선 > 30%
- [ ] 첫 화면 렌더링 시간 개선 > 25%

### 보안 지표
- [ ] 관리자 기능 완전 분리 확인
- [ ] 사용자 페이지에서 관리자 API 접근 불가
- [ ] 보안 취약점 스캔 통과

## 📋 체크리스트

### Phase 1: 공유 라이브러리 생성
- [ ] @krgeobuk/mypick-ui 패키지 생성 및 컴포넌트 이전
- [ ] @krgeobuk/mypick-common 패키지 생성 및 타입/유틸리티 이전
- [ ] @krgeobuk/mypick-auth 패키지 생성 및 인증 관련 코드 이전
- [ ] @krgeobuk/mypick-http 패키지 생성 및 API 클라이언트 이전
- [ ] 모든 패키지 빌드 및 타입 검사 통과
- [ ] 기존 프로젝트에서 공유 라이브러리 사용 확인

### Phase 2: 관리자 프로젝트 분리
- [ ] mypick-admin 프로젝트 생성
- [ ] 관리자 페이지 및 컴포넌트 이전
- [ ] 관리자 상태 관리 이전
- [ ] 공유 라이브러리 의존성 설정
- [ ] 관리자 전용 보안 설정
- [ ] 독립적인 빌드 및 실행 확인

### Phase 3: 사용자 프로젝트 정리
- [ ] 관리자 관련 코드 완전 제거
- [ ] 공유 라이브러리 의존성 설정
- [ ] Import 경로 업데이트
- [ ] mypick-client → mypick-web 리네이밍
- [ ] 기능 동작 및 성능 확인

### Phase 4: 배포 및 인프라
- [ ] 각 프로젝트별 Docker 설정
- [ ] Docker Compose 통합 설정
- [ ] CI/CD 파이프라인 구성
- [ ] 도메인 및 라우팅 설정
- [ ] 프로덕션 배포 테스트

### Phase 5: 검증 및 최적화
- [ ] 모든 기능 동작 확인
- [ ] 성능 지표 측정 및 최적화
- [ ] 보안 검증 및 취약점 점검
- [ ] 문서 업데이트 및 팀 교육
- [ ] 모니터링 및 로그 설정

## 🔗 관련 문서

- [현재 mypick-client CLAUDE.md](./mypick-client/CLAUDE.md)
- [공유 라이브러리 가이드](./shared-lib/CLAUDE.md)
- [krgeobuk 인프라 아키텍처](./CLAUDE.md)

## 📞 연락처 및 지원

프로젝트 분리 과정에서 이슈나 질문이 있을 경우:
1. GitHub Issues에 등록
2. 팀 Slack 채널에서 논의
3. 정기 미팅에서 진행 상황 공유

---

**작성일**: 2025-08-04  
**버전**: 1.0  
**작성자**: Claude Code Assistant  
**검토자**: 개발팀