# MyPick Frontend - Mock 데이터로 테스트하기

현재 백엔드 서버가 없는 상태에서 프론트엔드가 제대로 동작하는지 확인할 수 있도록 Mock 데이터를 구성했습니다.

## 🚀 빠른 시작

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

### 3. 브라우저에서 확인
- http://localhost:3000

## 🧪 테스트 계정

Mock 데이터에는 다음 테스트 계정들이 준비되어 있습니다:

### 일반 사용자
- **이메일**: `user@example.com`
- **비밀번호**: `password123`
- **권한**: 일반 사용자

### 관리자
- **이메일**: `admin@example.com`
- **비밀번호**: `password123`
- **권한**: 관리자 (관리자 페이지 접근 가능)

### 프리미엄 사용자
- **이메일**: `premium@example.com`
- **비밀번호**: `password123`
- **권한**: 프리미엄 사용자

## 📁 Mock 데이터 구조

```
src/data/
├── users.ts          # 사용자 데이터 및 인증 관련
├── creators.ts       # 크리에이터 데이터 (Ado, 히카킨, 葛葉)
├── content.ts        # YouTube/Twitter 콘텐츠 데이터
├── notifications.ts  # 알림 데이터
└── admin.ts          # 관리자 관련 데이터
```

## 🎯 테스트 가능한 기능

### ✅ 사용자 기능
- [x] 로그인/로그아웃
- [x] 프로필 관리
- [x] 크리에이터 팔로우/언팔로우
- [x] 콘텐츠 좋아요/북마크
- [x] 플랫폼별 필터링 (YouTube/Twitter)
- [x] 크리에이터별 필터링
- [x] 알림 확인 및 읽음 처리

### ✅ 관리자 기능
- [x] 대시보드 통계 확인
- [x] 사용자 관리
- [x] 크리에이터 승인/거절
- [x] 시스템 모니터링

### ✅ UI/UX 기능
- [x] 반응형 디자인
- [x] 다크/라이트 테마
- [x] 사이드바 토글
- [x] 드롭다운 메뉴
- [x] 로딩 상태
- [x] 에러 처리

## 🔧 Mock API 동작 방식

실제 API 호출 대신 `src/lib/mockApi.ts`에서 시뮬레이션합니다:

```typescript
// 실제 API 호출 (주석 처리됨)
// const response = await authApi.login(credentials);

// Mock API 호출 (현재 사용 중)
const response = await mockAuthApi.login(credentials);
```

### 특징
- **실제 네트워크 지연 시뮬레이션**: `setTimeout`으로 API 응답 지연
- **에러 처리**: 잘못된 로그인 정보 시 에러 발생
- **상태 관리**: 북마크, 좋아요 등의 상태 변경 지원
- **실시간 업데이트**: 낙관적 업데이트로 즉시 UI 반영

## 📱 테스트 시나리오

### 1. 기본 로그인 플로우
1. `/login` 페이지에서 테스트 계정으로 로그인
2. 메인 대시보드로 자동 이동
3. 사용자 정보가 헤더에 표시되는지 확인

### 2. 콘텐츠 상호작용
1. YouTube/Twitter 콘텐츠 확인
2. 좋아요 버튼 클릭 → 즉시 UI 반영
3. 북마크 버튼 클릭 → 상태 변경
4. 플랫폼 필터 테스트

### 3. 크리에이터 관리
1. 사이드바에서 크리에이터 필터링
2. Ado, 히카킨 등 개별 크리에이터 선택
3. 팔로우/언팔로우 기능 테스트

### 4. 관리자 기능 (admin 계정으로 로그인)
1. 프로필 드롭다운에서 "관리자 페이지" 선택
2. 대시보드 통계 확인
3. 사용자 관리 페이지 탐색
4. 크리에이터 승인/거절 테스트

### 5. 알림 시스템
1. 헤더의 알림 아이콘 클릭
2. 읽지 않은 알림 확인
3. "모두 읽음" 기능 테스트

## 🐛 알려진 제한사항

1. **실제 YouTube/Twitter 임베드 없음**: 썸네일과 메타데이터만 표시
2. **실시간 알림 없음**: 새로고침 시에만 알림 업데이트
3. **파일 업로드 없음**: 프로필 이미지 등은 placeholder 사용
4. **검색 기능 제한**: 제목/설명 기준 단순 검색만 지원

## 🔄 백엔드 연동 준비

Mock API를 실제 API로 전환할 때:

1. `src/store/slices/` 파일들에서 주석 해제:
```typescript
// 주석 해제
const response = await authApi.login(credentials);

// 주석 처리
// const response = await mockAuthApi.login(credentials);
```

2. 환경 변수 설정:
```env
NEXT_PUBLIC_API_URL=http://your-backend-url
```

3. API 응답 형식이 다르면 타입 정의 수정

## 📊 성능 확인

Mock 데이터로도 다음을 확인할 수 있습니다:
- Redux 상태 관리 동작
- 컴포넌트 리렌더링 최적화
- 메모리 사용량
- 번들 크기
- 로딩 성능

## 🎨 UI/UX 테스트

다양한 화면 크기에서 테스트:
- **데스크톱**: 1920px 이상
- **태블릿**: 768px - 1024px  
- **모바일**: 320px - 768px

브라우저 호환성:
- Chrome/Edge (최신 버전)
- Firefox (최신 버전)
- Safari (최신 버전)

이제 백엔드 없이도 MyPick 프론트엔드의 모든 기능을 테스트할 수 있습니다! 🎉
