# MyPick 서비스 특화 사용자 관리 기능 요구사항

## 📋 프로젝트 개요

MyPick 서비스는 YouTube 크리에이터들을 위한 콘텐츠 관리 플랫폼입니다. 
전역 사용자 역할/권한 관리는 portal-client에서 담당하므로, my-pick-client의 사용자 관리는 **MyPick 서비스에 특화된 기능**에 집중합니다.

## 🎯 현재 상태 분석

### ✅ 현재 구현된 기능
- 기본 사용자 인증 (로그인/회원가입/로그아웃)
- 역할 기반 접근 제어 (user, admin, premium)
- Redux 상태 관리 구조 준비
- 5개 목 데이터 사용자
- 크리에이터 관리 시스템 (완성도 높음 - 참고 가능)

### ❌ 부족한 기능
- 사용자 관리 UI (현재 플레이스홀더만 존재)
- MyPick 서비스 특화 사용자 정보 관리
- 크리에이터 활동 모니터링
- YouTube API 사용량 관리
- 콘텐츠 업로드 통계

## 🚀 구현 계획 (3단계)

### 1단계: 핵심 MyPick 사용자 정보 관리 (우선 구현)

#### 🎬 MyPick 사용자 프로필
- **기본 정보**: 이름, 이메일, 가입일, 프로필 이미지
- **서비스 상태**: MyPick 서비스 사용 활성/비활성
- **사용자 타입**: 일반 사용자 / 크리에이터 구분
- **계정 설정**: 알림 설정, 선호 카테고리

#### 🎥 크리에이터 등록 현황
- **신청 상태 관리**: 대기/승인/거부 상태 표시
- **크리에이터 승인/거부**: 관리자 권한으로 상태 변경
- **크리에이터 프로필**: 채널명, 구독자 수, 주요 콘텐츠 카테고리
- **활동 요약**: 최근 업로드, 총 콘텐츠 수

#### 📊 기본 콘텐츠 통계
- **업로드 콘텐츠 수**: 총 업로드 영상 개수
- **조회수 통계**: 총 조회수, 평균 조회수
- **상호작용**: 좋아요, 댓글 수 요약
- **최근 활동**: 마지막 업로드 날짜, 최근 로그인

### 2단계: 플랫폼 연동 및 사용량 관리 (단기 목표)

#### 🔗 플랫폼 연동 상태
- **YouTube 계정 연동**: 연동 상태, 채널 정보
- **인증 토큰 관리**: 토큰 유효성, 만료일, 재연동 필요 여부
- **연동 오류 처리**: 오류 로그, 재연동 버튼
- **API 권한 확인**: 필요 권한 보유 여부

#### 📈 YouTube API 사용량
- **API 호출 통계**: 일별/월별 호출 수
- **할당량 관리**: 사용량 대비 한도, 남은 할당량
- **사용 패턴**: 주요 사용 API 종류, 피크 시간대
- **제한 관리**: 개별 사용자 API 사용 제한 설정

#### 🛠️ 서비스 제어 기능
- **업로드 권한 관리**: 개별 사용자 업로드 허용/제한
- **기능 접근 제어**: 특정 기능 사용 제한 (예: 고급 분석)
- **일시 정지**: 계정 일시 정지/해제
- **사용량 알림**: 과도한 사용 시 경고 및 제한

### 3단계: 분석 및 지원 도구 (장기 목표)

#### 📊 사용자 행동 분석
- **접속 패턴**: 로그인 빈도, 주요 사용 시간대
- **기능 사용 통계**: 각 기능별 사용 빈도
- **체류 시간**: 평균 세션 시간, 페이지별 체류 시간
- **사용자 여정**: 주요 사용 플로우 분석

#### 🎯 콘텐츠 업로드 패턴
- **업로드 빈도**: 주별/월별 업로드 패턴
- **선호 시간대**: 주로 업로드하는 시간대
- **콘텐츠 카테고리**: 주요 업로드 카테고리 분포
- **성과 분석**: 업로드 후 성과 추적

#### 📞 사용자 지원 시스템
- **문의 이력**: 사용자별 문의사항 및 답변 이력
- **이슈 트래킹**: 기술적 문제, 사용 문의 등 분류
- **빠른 지원**: 일반적인 문제 해결 도구
- **FAQ 연계**: 자주 묻는 질문 및 답변

#### 📈 MyPick 서비스 대시보드
- **사용자 현황**: 총 사용자, 활성 사용자, 신규 가입자
- **크리에이터 통계**: 크리에이터 수, 신청 대기 수
- **서비스 성과**: 업로드 수, API 사용량, 서비스 만족도
- **성장 지표**: 월별 성장률, 사용자 참여도

## 🛠️ 기술적 구현 가이드

### Redux 상태 구조 활용
```typescript
interface UserManagementState {
  // 기본 사용자 정보
  users: MyPickUser[];
  selectedUser: MyPickUser | null;
  
  // 크리에이터 관련
  creatorApplications: CreatorApplication[];
  creatorStats: CreatorStats[];
  
  // API 사용량
  apiUsage: ApiUsageStats[];
  
  // 필터링 및 검색
  filters: {
    userType: 'all' | 'user' | 'creator';
    status: 'all' | 'active' | 'inactive';
    search: string;
  };
  
  // 로딩 상태
  isLoading: boolean;
}
```

### UI 컴포넌트 패턴
- **기존 크리에이터 관리 UI 패턴 활용**: 테이블, 모달, 필터 컴포넌트
- **일관된 디자인**: Tailwind CSS 클래스 재사용
- **반응형 디자인**: 모바일/태블릿 대응
- **접근성**: ARIA 레이블, 키보드 네비게이션

### API 연동 준비
```typescript
// MyPick 특화 사용자 타입
interface MyPickUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  userType: 'user' | 'creator';
  serviceStatus: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLoginAt: string;
  
  // MyPick 특화 정보
  youtubeConnected: boolean;
  channelId?: string;
  channelName?: string;
  subscriberCount?: number;
  videoCount: number;
  totalViews: number;
  apiUsageThisMonth: number;
}
```

## 📋 우선순위 가이드

### 즉시 구현 필요 (High Priority)
1. 사용자 목록 테이블 및 검색
2. 크리에이터 신청 승인/거부 기능
3. 기본 콘텐츠 통계 표시

### 단기 목표 (Medium Priority)
1. YouTube API 사용량 모니터링
2. 플랫폼 연동 상태 관리
3. 사용자별 서비스 제어

### 장기 목표 (Low Priority)
1. 상세 사용자 행동 분석
2. 고급 대시보드 기능
3. 사용자 지원 시스템

## 🔗 참고 자료

- **기존 크리에이터 관리**: `/src/app/(main)/admin/creators/` 참고
- **Redux 구조**: `/src/store/slices/adminSlice.ts` 참고
- **UI 컴포넌트**: `/src/components/ui/` 재사용
- **Mock API**: `/src/data/mockApi.ts` 패턴 활용

---

이 문서는 MyPick 서비스 특화 사용자 관리 기능의 구현 가이드라인입니다. 
portal-client의 전역 사용자 관리와 중복되지 않으면서, MyPick 서비스의 핵심 가치인 YouTube 콘텐츠 관리에 특화된 기능들로 구성되었습니다.