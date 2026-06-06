# 🖥️ Frontend Architecture — 숙이네국수 홈페이지

**문서 버전**: v1.1 (역순 검증 반영)  
**최종 수정일**: 2026-06-06  
**기술 스택**: Next.js 14+ (App Router), React 18+, Vanilla CSS, TypeScript  
**문서 목적**: 프론트엔드 엔지니어가 프로젝트를 완전하게 구축할 수 있는 파일 구조, 컴포넌트 설계, 상태 관리, 라우팅 등의 아키텍처 명세

---

## 1. 아키텍처 원칙

| 원칙 | 설명 |
|------|------|
| **App Router 기반** | Next.js 14+ App Router 사용, Server/Client Component 명확 분리 |
| **서버 컴포넌트 우선** | 데이터 페칭은 서버 컴포넌트에서 수행, 클라이언트 컴포넌트는 인터랙션만 담당 |
| **모듈 분리** | 페이지 / 컴포넌트 / 라이브러리 / 타입의 명확한 책임 분리 |
| **CSS 변수 기반 스타일링** | Vanilla CSS + CSS Custom Properties 기반 디자인 토큰 시스템 |
| **타입 안전성** | TypeScript strict 모드, DB 스키마 기반 자동 타입 생성 |
| **컴포넌트 재사용** | Atomic Design 패턴에서 영감 받은 계층적 컴포넌트 구조 |

---

## 2. 프로젝트 파일 구조

```
sookine/
├── .env.local                           # 로컬 환경변수
├── .env.production                      # 프로덕션 환경변수
├── next.config.js                       # Next.js 설정
├── tsconfig.json                        # TypeScript 설정
├── package.json
│
├── public/
│   ├── fonts/                           # 로컬 폰트 파일
│   │   ├── PretendardVariable.woff2
│   │   ├── NanumPenScript-Regular.woff2
│   │   └── KoPubBatang-Light.woff2
│   ├── images/
│   │   ├── hero-desktop.webp           # 히어로 배경 (데스크탑)
│   │   ├── hero-mobile.webp            # 히어로 배경 (모바일)
│   │   ├── og-image.jpg                # Open Graph 이미지
│   │   └── favicon.ico
│   └── robots.txt
│
├── supabase/                            # Supabase 프로젝트 (Backend Architecture 참조)
│   ├── config.toml
│   ├── migrations/
│   ├── seed.sql
│   └── functions/
│
├── src/
│   ├── app/                             # App Router 페이지
│   │   ├── layout.tsx                   # 루트 레이아웃
│   │   ├── page.tsx                     # 메인 페이지 (/)
│   │   ├── globals.css                  # 글로벌 스타일 + CSS 변수 토큰
│   │   ├── not-found.tsx                # 404 페이지
│   │   ├── error.tsx                    # 전역 에러 경계
│   │   │
│   │   ├── admin/                       # 관리자 페이지
│   │   │   ├── layout.tsx               # 관리자 레이아웃 (사이드바 포함)
│   │   │   ├── page.tsx                 # 관리자 대시보드 (/admin)
│   │   │   ├── login/
│   │   │   │   └── page.tsx             # 로그인 페이지 (/admin/login)
│   │   │   ├── menus/
│   │   │   │   └── page.tsx             # 메뉴 관리 (/admin/menus)
│   │   │   ├── notices/
│   │   │   │   └── page.tsx             # 공지사항 관리 (/admin/notices)
│   │   │   ├── side-dishes/
│   │   │   │   └── page.tsx             # 기본찬 관리 (/admin/side-dishes)
│   │   │   ├── store-info/
│   │   │   │   └── page.tsx             # 매장정보 관리 (/admin/store-info)
│   │   │   ├── error.tsx                # 관리자 영역 에러 경계
│   │   │   └── admin.module.css         # 관리자 공통 스타일
│   │   │
│   │   └── api/
│   │       └── revalidate/
│   │           └── route.ts             # ISR 재검증 API
│   │
│   ├── components/                      # 컴포넌트
│   │   ├── common/                      # 공통 UI 컴포넌트
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   └── Button.module.css
│   │   │   ├── Card/
│   │   │   │   ├── Card.tsx
│   │   │   │   └── Card.module.css
│   │   │   ├── Badge/
│   │   │   │   ├── Badge.tsx
│   │   │   │   └── Badge.module.css
│   │   │   ├── StatusBadge/
│   │   │   │   ├── StatusBadge.tsx
│   │   │   │   └── StatusBadge.module.css
│   │   │   ├── Lightbox/
│   │   │   │   ├── Lightbox.tsx
│   │   │   │   └── Lightbox.module.css
│   │   │   ├── Skeleton/
│   │   │   │   ├── Skeleton.tsx
│   │   │   │   └── Skeleton.module.css
│   │   │   ├── Toast/
│   │   │   │   ├── Toast.tsx
│   │   │   │   ├── Toast.module.css
│   │   │   │   └── ToastProvider.tsx
│   │   │   ├── ScrollReveal/
│   │   │   │   └── ScrollReveal.tsx
│   │   │   └── Container/
│   │   │       ├── Container.tsx
│   │   │       └── Container.module.css
│   │   │
│   │   ├── sections/                    # 메인 페이지 섹션 컴포넌트
│   │   │   ├── HeroSection/
│   │   │   │   ├── HeroSection.tsx
│   │   │   │   ├── HeroSection.module.css
│   │   │   │   └── UrgentBanner.tsx
│   │   │   ├── StorySection/
│   │   │   │   ├── StorySection.tsx
│   │   │   │   ├── StorySection.module.css
│   │   │   │   ├── Timeline.tsx
│   │   │   │   └── Timeline.module.css
│   │   │   ├── MenuSection/
│   │   │   │   ├── MenuSection.tsx
│   │   │   │   ├── MenuSection.module.css
│   │   │   │   ├── MenuCardSignature.tsx
│   │   │   │   ├── MenuCardRegular.tsx
│   │   │   │   ├── SideDishGallery.tsx
│   │   │   │   └── SideDishGallery.module.css
│   │   │   ├── InfoSection/
│   │   │   │   ├── InfoSection.tsx
│   │   │   │   ├── InfoSection.module.css
│   │   │   │   └── InfoCard.tsx
│   │   │   ├── LocationSection/
│   │   │   │   ├── LocationSection.tsx
│   │   │   │   ├── LocationSection.module.css
│   │   │   │   └── NaverMap.tsx
│   │   │   ├── NoticeSection/
│   │   │   │   ├── NoticeSection.tsx
│   │   │   │   ├── NoticeSection.module.css
│   │   │   │   └── NoticeCard.tsx
│   │   │   └── Footer/
│   │   │       ├── Footer.tsx
│   │   │       └── Footer.module.css
│   │   │
│   │   ├── admin/                       # 관리자 전용 컴포넌트
│   │   │   ├── AdminSidebar/
│   │   │   │   ├── AdminSidebar.tsx
│   │   │   │   └── AdminSidebar.module.css
│   │   │   ├── AdminHeader/
│   │   │   │   ├── AdminHeader.tsx
│   │   │   │   └── AdminHeader.module.css
│   │   │   ├── StatusToggle/
│   │   │   │   ├── StatusToggle.tsx
│   │   │   │   └── StatusToggle.module.css
│   │   │   ├── MenuForm/
│   │   │   │   ├── MenuForm.tsx
│   │   │   │   └── MenuForm.module.css
│   │   │   ├── MenuList/
│   │   │   │   ├── MenuList.tsx
│   │   │   │   └── MenuList.module.css
│   │   │   ├── NoticeForm/
│   │   │   │   ├── NoticeForm.tsx
│   │   │   │   └── NoticeForm.module.css
│   │   │   ├── NoticeList/
│   │   │   │   ├── NoticeList.tsx
│   │   │   │   └── NoticeList.module.css
│   │   │   ├── SideDishForm/
│   │   │   │   ├── SideDishForm.tsx
│   │   │   │   └── SideDishForm.module.css
│   │   │   ├── SideDishList/
│   │   │   │   ├── SideDishList.tsx
│   │   │   │   └── SideDishList.module.css
│   │   │   ├── StoreInfoForm/
│   │   │   │   ├── StoreInfoForm.tsx
│   │   │   │   └── StoreInfoForm.module.css
│   │   │   ├── ImageUploader/
│   │   │   │   ├── ImageUploader.tsx
│   │   │   │   └── ImageUploader.module.css
│   │   │   ├── SortableList/
│   │   │   │   ├── SortableList.tsx
│   │   │   │   └── SortableList.module.css
│   │   │   ├── ConfirmDialog/
│   │   │   │   ├── ConfirmDialog.tsx
│   │   │   │   └── ConfirmDialog.module.css
│   │   │   └── LoginForm/
│   │   │       ├── LoginForm.tsx
│   │   │       └── LoginForm.module.css
│   │   │
│   │   └── layout/                      # 레이아웃 컴포넌트
│   │       └── FloatingCallButton/
│   │           ├── FloatingCallButton.tsx
│   │           └── FloatingCallButton.module.css
│   │
│   ├── lib/                             # 라이브러리 / 유틸리티
│   │   ├── supabase/
│   │   │   ├── client.ts                # 브라우저용 Supabase 클라이언트
│   │   │   └── server.ts                # 서버용 Supabase 클라이언트
│   │   ├── api/
│   │   │   ├── store.ts                 # 매장 정보 조회 함수
│   │   │   ├── menus.ts                 # 메뉴 조회 함수
│   │   │   ├── notices.ts               # 공지사항 조회 함수
│   │   │   └── side-dishes.ts           # 기본찬 조회 함수
│   │   ├── admin-api/
│   │   │   ├── client.ts                # 관리자 API 클라이언트 (Edge Function 호출)
│   │   │   ├── auth.ts                  # 로그인/로그아웃/검증 API
│   │   │   ├── store.ts                 # 매장 관리 API
│   │   │   ├── menus.ts                 # 메뉴 관리 API
│   │   │   ├── notices.ts               # 공지사항 관리 API
│   │   │   ├── side-dishes.ts           # 기본찬 관리 API
│   │   │   ├── upload.ts               # 이미지 업로드 API
│   │   │   └── revalidate.ts           # 캐시 무효화 API
│   │   ├── utils/
│   │   │   ├── format.ts               # 포맷 유틸 (가격, 시간, 날짜)
│   │   │   ├── cn.ts                    # className 병합 유틸
│   │   │   └── constants.ts            # 상수 정의
│   │   └── hooks/
│   │       ├── useAuth.ts               # 관리자 인증 상태 훅
│   │       ├── useToast.ts              # 토스트 알림 훅
│   │       ├── useScrollReveal.ts       # 스크롤 애니메이션 훅
│   │       ├── useLightbox.ts           # 라이트박스 상태 훅
│   │       └── useMediaQuery.ts         # 반응형 미디어 쿼리 훅
│   │
│   ├── middleware.ts                    # Next.js Middleware (관리자 경로 보호)
│   │
│   └── types/
│       ├── database.ts                  # Supabase 자동 생성 DB 타입
│       ├── store.ts                     # StoreInfo 타입
│       ├── menu.ts                      # Menu, GroupedMenus 타입
│       ├── notice.ts                    # Notice 타입
│       ├── side-dish.ts                 # SideDish 타입
│       ├── api.ts                       # API 응답 표준 타입 (ApiResponse, PaginatedResponse)
│       └── admin.ts                     # 관리자 관련 타입 (Session, LoginRequest 등)
│
├── docs/                                # 설계 문서
│   ├── 01_database_model.md
│   ├── 02_api_specification.md
│   ├── 03_design_system.md
│   ├── 04_backend_architecture.md
│   └── 05_frontend_architecture.md
│
└── PRD.md                               # 제품 요구사항 문서
```

---

## 3. 페이지 설계

### 3.1 메인 페이지 (`/`)

**렌더링**: ISR (Incremental Static Regeneration)  
**`revalidate`**: 300초 (5분)  
**컴포넌트 타입**: Server Component (Root)

**데이터 페칭** (서버 사이드, 빌드/재생성 시점):

| 함수 | 데이터 | 대상 섹션 |
|------|--------|----------|
| `getStoreInfo()` | 매장 정보 | Hero, Info |
| `getMenusByCategory()` | 카테고리별 메뉴 | Menu |
| `getUrgentNotice()` | 긴급 공지 | Hero (배너) |
| `getNotices(5, 0)` | 최근 공지 5건 | Notice |
| `getSideDishes()` | 기본찬 목록 | Menu (갤러리) |

**섹션 렌더링 순서**:

1. `UrgentBanner` — 긴급 공지 있을 때만 조건부 렌더링
2. `HeroSection` — 식당명, 슬로건, 영업 상태, 배경 이미지
3. `StorySection` — 타임라인, 사장님 한마디
4. `MenuSection` — 대표/시즌/상시 메뉴, 기본찬 갤러리
5. `InfoSection` — 영업시간, 주차, 결제, 유의사항
6. `LocationSection` — 네이버 지도, 주소, 전화
7. `NoticeSection` — 공지사항 카드 리스트
8. `Footer` — 연락처, 주소, 저작권
9. `FloatingCallButton` — 모바일 하단 고정 (Client Component)

---

### 3.2 관리자 로그인 페이지 (`/admin/login`)

**렌더링**: CSR (Client-Side Rendering)  
**컴포넌트 타입**: Client Component (`'use client'`)  
**인증 상태**: 미인증

**동작**:
1. 비밀번호 입력 폼 표시
2. 로그인 API 호출
3. 성공 시 세션 토큰을 `localStorage`에 저장
4. `/admin` 대시보드로 리다이렉트
5. 이미 인증된 상태면 자동 리다이렉트

---

### 3.3 관리자 대시보드 (`/admin`)

**렌더링**: CSR  
**컴포넌트 타입**: Client Component  
**인증 상태**: 인증 필수

**구성**:
- 현재 영업 상태 표시 + 4개 토글 버튼 (영업중/브레이크타임/마감/휴무)
- 최근 공지사항 요약 (3건)
- 각 관리 페이지로의 바로가기 카드

---

### 3.4 메뉴 관리 (`/admin/menus`)

**렌더링**: CSR  
**컴포넌트 타입**: Client Component  
**인증 상태**: 인증 필수

**기능**:
- 전체 메뉴 목록 (비노출 포함, 비노출 항목 시각적 구분)
- 메뉴 추가 폼 (모달 또는 인라인)
- 메뉴 수정 (인라인 편집 또는 모달)
- 메뉴 삭제 (확인 다이얼로그)
- 드래그 앤 드롭 순서 변경
- 대표 메뉴/시즌 메뉴 토글
- 이미지 업로드 및 미리보기
- 노출 ON/OFF 토글

---

### 3.5 공지사항 관리 (`/admin/notices`)

**렌더링**: CSR  
**컴포넌트 타입**: Client Component  
**인증 상태**: 인증 필수

**기능**:
- 전체 공지 목록 (페이지네이션)
- 새 공지 작성 폼
- 공지 수정/삭제
- 긴급 배너 ON/OFF 토글 (활성 긴급 공지 하이라이트)
- 노출 ON/OFF 토글

---

### 3.6 기본찬 관리 (`/admin/side-dishes`)

**렌더링**: CSR  
**컴포넌트 타입**: Client Component  
**인증 상태**: 인증 필수

**기능**:
- 전체 기본찬 목록
- 추가/수정/삭제
- 이미지 업로드
- 드래그 앤 드롭 순서 변경
- 노출 ON/OFF 토글

---

### 3.7 매장정보 관리 (`/admin/store-info`)

**렌더링**: CSR  
**컴포넌트 타입**: Client Component  
**인증 상태**: 인증 필수

**기능**:
- 매장 정보 전체 폼 (시간, 주소, 전화, 주차, 결제, 유의사항, 슬로건)
- 시간 입력은 `<input type="time">` 활용
- 결제 수단/유의사항은 동적 배열 입력 (추가/삭제 가능)
- 저장 시 유효성 검증 + 즉시 반영 확인

---

## 4. 컴포넌트 상세 설계

### 4.1 Server/Client 분류

#### Server Components (SSR/SSG 렌더링)

| 컴포넌트 | 이유 |
|----------|------|
| `HeroSection` | 정적 데이터 표시, SEO |
| `StorySection` | 완전 정적 콘텐츠 |
| `MenuSection` | DB 데이터 표시, SEO |
| `InfoSection` | DB 데이터 표시, SEO |
| `LocationSection` (래퍼) | 주소/전화 정적 렌더링 |
| `NoticeSection` | DB 데이터 표시 |
| `Footer` | 완전 정적 |
| `Container` | 레이아웃 래퍼 |

#### Client Components (`'use client'`)

| 컴포넌트 | 이유 |
|----------|------|
| `NaverMap` | 외부 JS SDK 의존, DOM 조작 |
| `Lightbox` | 사용자 인터랙션, 상태 관리 |
| `FloatingCallButton` | `useMediaQuery` 의존 |
| `ScrollReveal` | Intersection Observer API 사용 |
| `UrgentBanner` | 닫기 버튼 인터랙션 |
| `SideDishGallery` | 가로 스크롤 인터랙션 |
| `Toast`, `ToastProvider` | 전역 상태 관리 |
| `admin/*` 전체 | 폼 상태, API 호출, 인터랙션 |

---

### 4.2 주요 컴포넌트 Props 인터페이스

#### HeroSection

| Prop | 타입 | 설명 |
|------|------|------|
| `storeInfo` | `StoreInfo` | 매장 정보 (상태, 슬로건) |
| `urgentNotice` | `Notice \| null` | 긴급 공지 |

#### MenuSection

| Prop | 타입 | 설명 |
|------|------|------|
| `groupedMenus` | `GroupedMenus` | `{ signature: Menu[], seasonal: Menu[], regular: Menu[] }` |
| `sideDishes` | `SideDish[]` | 기본찬 목록 |

#### InfoSection

| Prop | 타입 | 설명 |
|------|------|------|
| `storeInfo` | `StoreInfo` | 영업시간, 주차, 결제 등 |

#### LocationSection

| Prop | 타입 | 설명 |
|------|------|------|
| `addressRoad` | `string` | 도로명 주소 |
| `addressJibun` | `string` | 지번 주소 |
| `phone` | `string` | 전화번호 |

#### NoticeSection

| Prop | 타입 | 설명 |
|------|------|------|
| `notices` | `Notice[]` | 공지사항 배열 (최대 5개) |
| `totalCount` | `number` | 전체 공지 수 |

#### StatusBadge

| Prop | 타입 | 설명 |
|------|------|------|
| `status` | `'open' \| 'break' \| 'closed' \| 'holiday'` | 영업 상태 |
| `size` | `'sm' \| 'md' \| 'lg'` | 배지 크기 (기본값: `md`) |

#### Button

| Prop | 타입 | 설명 |
|------|------|------|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'admin' \| 'danger'` | 변형 |
| `size` | `'sm' \| 'md' \| 'lg'` | 크기 |
| `fullWidth` | `boolean` | 전체 너비 채우기 |
| `loading` | `boolean` | 로딩 상태 표시 |
| `disabled` | `boolean` | 비활성화 |
| `children` | `ReactNode` | 버튼 내용 |
| `onClick` | `() => void` | 클릭 핸들러 |

#### Badge

| Prop | 타입 | 설명 |
|------|------|------|
| `variant` | `'signature' \| 'seasonal' \| 'urgent'` | 변형 |
| `children` | `ReactNode` | 배지 텍스트 |

---

### 4.3 관리자 컴포넌트 설계

#### AdminSidebar

| 항목 | 설명 |
|------|------|
| **위치** | 좌측 고정 (데스크탑), 하단 네비게이션 바 (모바일) |
| **메뉴 항목** | 대시보드, 메뉴 관리, 공지 관리, 기본찬 관리, 매장정보, 로그아웃 |
| **활성 표시** | 현재 경로에 해당하는 메뉴 하이라이트 |
| **아이콘** | Lucide React 아이콘 사용 |

#### StatusToggle

| 항목 | 설명 |
|------|------|
| **레이아웃** | 4개 상태 버튼 가로 배치 (모바일: 2×2 그리드) |
| **활성 상태** | 현재 상태 버튼 하이라이트 + 상태 도트 |
| **동작** | 클릭 시 즉시 API 호출 → 성공 시 토스트 알림 |
| **Optimistic Update** | 클릭 즉시 UI 반영, 에러 시 롤백 |

#### MenuForm

| 항목 | 설명 |
|------|------|
| **모드** | `create` (새 메뉴) / `edit` (기존 메뉴 수정) |
| **필드** | 메뉴명, 가격, 설명, 카테고리, 비고, 이미지, 대표/시즌/노출 토글 |
| **유효성 검증** | 실시간 클라이언트 검증 + 서버 검증 |
| **이미지** | `ImageUploader` 컴포넌트 포함 |
| **제출 후** | 토스트 알림 + 목록 자동 새로고침 + 캐시 재검증 호출 |

#### ImageUploader

| 항목 | 설명 |
|------|------|
| **방식** | 드래그 앤 드롭 또는 파일 선택 |
| **미리보기** | 업로드 전 로컬 미리보기 (URL.createObjectURL) |
| **진행률** | 업로드 중 프로그레스 표시 |
| **제한** | 5MB 이하, JPEG/PNG/WebP만 허용 |
| **결과** | 업로드 완료 시 `onUpload(url: string)` 콜백 호출 |

#### SortableList

| 항목 | 설명 |
|------|------|
| **기능** | 드래그 앤 드롭 순서 변경 |
| **구현** | HTML Drag and Drop API 또는 포인터 이벤트 기반 |
| **시각적 피드백** | 드래그 중 항목 반투명, 드롭 위치 표시 |
| **저장** | 드롭 완료 시 reorder API 호출 |

#### ConfirmDialog

| 항목 | 설명 |
|------|------|
| **용도** | 삭제 확인 등 위험 동작 전 사용자 확인 |
| **구조** | 오버레이 + 중앙 다이얼로그 박스 |
| **버튼** | 취소 (secondary) + 확인 (danger) |
| **접근성** | 포커스 트래핑, ESC 키 닫기, `role="alertdialog"` |

---

## 5. 상태 관리

### 5.1 상태 관리 전략

| 범위 | 방식 | 대상 |
|------|------|------|
| **서버 데이터** | Server Component props 전달 (공개 페이지) | 메인 페이지 모든 데이터 |
| **로컬 UI 상태** | React `useState` / `useReducer` | 폼 입력, 모달 열림/닫힘, 로딩 |
| **전역 UI 상태** | React Context | 토스트 알림, 라이트박스 |
| **인증 상태** | React Context + `localStorage` | 관리자 세션 토큰 |
| **관리자 서버 데이터** | `useState` + API 호출 (SWR 패턴) | 관리자 페이지 데이터 |

### 5.2 Context 목록

#### AuthContext

| 값 | 타입 | 설명 |
|-----|------|------|
| `isAuthenticated` | `boolean` | 인증 여부 |
| `isLoading` | `boolean` | 인증 확인 중 |
| `login(password)` | `(string) => Promise<boolean>` | 로그인 |
| `logout()` | `() => Promise<void>` | 로그아웃 |

**Provider 위치**: `/admin/layout.tsx`

#### ToastContext

| 값 | 타입 | 설명 |
|-----|------|------|
| `showToast(message, type)` | `(string, 'success' \| 'error') => void` | 토스트 표시 |

**Provider 위치**: `layout.tsx` (루트) — 메인 페이지에서는 사용하지 않지만 확장 대비

#### LightboxContext

| 값 | 타입 | 설명 |
|-----|------|------|
| `openLightbox(imageUrl, alt)` | `(string, string) => void` | 라이트박스 열기 |
| `closeLightbox()` | `() => void` | 라이트박스 닫기 |

**Provider 위치**: `layout.tsx` (루트)

---

## 6. 스타일링 전략

### 6.1 CSS 구조

```
globals.css                    # CSS 변수 (Design System 토큰), 리셋, 전역 타이포그래피
Component.module.css           # CSS Modules (컴포넌트 스코프)
```

### 6.2 `globals.css` 구성

| 섹션 | 내용 |
|------|------|
| **CSS Reset** | box-sizing, margin/padding 초기화, 기본 스타일 제거 |
| **CSS Custom Properties** | Design System의 모든 토큰을 `:root`에 선언 |
| **Global Typography** | `html`, `body`, `h1~h6`, `p`, `a` 기본 스타일 |
| **Utility Classes** | `.sr-only` (스크린리더 전용), `.container`, `.section` |
| **Font Face** | 로컬 폰트 `@font-face` 선언 |
| **Keyframes** | 공통 애니메이션 키프레임 정의 |

### 6.3 CSS Modules 규칙

- 파일명: `{ComponentName}.module.css`
- 클래스명: camelCase (예: `.heroSection`, `.menuCard`, `.ctaButton`)
- 반응형: 각 모듈 내부에서 `@media` 쿼리 사용
- 중복 방지: CSS 변수를 참조하여 하드코딩 배제

### 6.4 className 병합 유틸 (`cn.ts`)

여러 클래스명을 조건부로 결합하는 경량 유틸리티 함수.

**시그니처**: `cn(...classes: (string | undefined | null | false)[]): string`

---

## 7. 라우팅 및 네비게이션

### 7.1 라우트 목록

| 경로 | 페이지 | 렌더링 | 인증 |
|------|--------|--------|------|
| `/` | 메인 (원페이지) | ISR | 불필요 |
| `/admin/login` | 관리자 로그인 | CSR | 불필요 |
| `/admin` | 관리자 대시보드 | CSR | 필수 |
| `/admin/menus` | 메뉴 관리 | CSR | 필수 |
| `/admin/notices` | 공지 관리 | CSR | 필수 |
| `/admin/side-dishes` | 기본찬 관리 | CSR | 필수 |
| `/admin/store-info` | 매장정보 관리 | CSR | 필수 |

### 7.2 관리자 라우트 보호

**구현 방식**: Next.js Middleware (`middleware.ts`)

**동작**:
1. `/admin/*` 경로 (단, `/admin/login` 제외) 접근 시 실행
2. 쿠키 또는 세션 검증 (클라이언트에서 `useAuth` 훅으로도 이중 검증)
3. 미인증 시 `/admin/login`으로 리다이렉트

**Middleware 파일 위치**: `src/middleware.ts`

**매칭 설정**: `config.matcher = ['/admin/((?!login).*)']`

---

## 8. SEO 및 메타데이터

### 8.1 루트 레이아웃 메타데이터

| 항목 | 값 |
|------|-----|
| `title` | `숙이네국수 — 엄마가 정성스럽게 차려주는 집밥 한 상차림` |
| `description` | `경남 진주 신안로 로컬 맛집 숙이네국수. 갈치조림, 두루치기 등 집밥 한 상차림. 영업시간, 메뉴, 위치 안내.` |
| `keywords` | `숙이네국수, 진주맛집, 갈치조림, 두루치기, 진주 신안로, 로컬 맛집` |
| `og:type` | `website` |
| `og:image` | `/images/og-image.jpg` |
| `og:locale` | `ko_KR` |
| `twitter:card` | `summary_large_image` |

### 8.2 구조화 데이터 (JSON-LD)

메인 페이지에 `Restaurant` 타입 구조화 데이터 삽입.

| 필드 | 값 |
|------|-----|
| `@type` | `Restaurant` |
| `name` | `숙이네국수` |
| `address` | 도로명 주소 |
| `telephone` | `055-742-4472` |
| `openingHoursSpecification` | 영업시간 구조화 |
| `servesCuisine` | `Korean` |
| `priceRange` | `₩₩` |
| `menu` | 메뉴 URL 또는 인라인 |

---

## 9. 성능 최적화

### 9.1 이미지 최적화

| 전략 | 구현 |
|------|------|
| **Next.js Image** | `<Image>` 컴포넌트 사용 (자동 리사이즈, WebP 변환, lazy loading) |
| **히어로 이미지** | `priority` prop 설정, `sizes` 반응형 지정 |
| **메뉴 이미지** | `loading="lazy"`, `placeholder="blur"` |
| **Supabase Transform** | Storage URL에 `?width=400&quality=80` 파라미터 추가 |

### 9.2 폰트 최적화

| 전략 | 구현 |
|------|------|
| **Variable Font** | Pretendard Variable (단일 파일로 모든 굵기) |
| **`font-display`** | `swap` (폰트 로드 전 시스템 폰트 표시) |
| **Subset** | 한글 + 기본 라틴 + 숫자만 포함 |
| **Preload** | 히어로에 사용되는 폰트만 `<link rel="preload">` |

### 9.3 코드 분할

| 전략 | 대상 |
|------|------|
| **Route-based** | `/admin/*` 페이지는 메인 페이지와 별도 번들 (Next.js 자동) |
| **Dynamic Import** | `NaverMap`, `Lightbox` 컴포넌트 (네이버 지도 SDK 등 외부 의존) |
| **관리자 컴포넌트** | 메인 페이지 번들에 포함되지 않음 (라우트 분리로 자동) |

### 9.4 Third-party 스크립트

| 스크립트 | 로딩 전략 |
|----------|----------|
| 네이버 지도 SDK | `next/script` `strategy="lazyOnload"` |

---

## 10. 에러 처리 (프론트엔드)

### 10.1 에러 경계

| 파일 | 범위 | 동작 |
|------|------|------|
| `src/app/error.tsx` | 전역 에러 | 친화적 에러 메시지 + 재시도 버튼 |
| `src/app/admin/error.tsx` | 관리자 영역 | 에러 메시지 + 대시보드 복귀 버튼 |
| `src/app/not-found.tsx` | 404 | 메인 페이지 복귀 안내 |

### 10.2 API 에러 처리

| 에러 코드 | 프론트엔드 동작 |
|-----------|---------------|
| 401 `UNAUTHORIZED` | 로그인 페이지로 리다이렉트 + 토스트 "세션이 만료되었습니다" |
| 400 `INVALID_REQUEST` | 폼 필드별 에러 메시지 표시 |
| 422 `VALIDATION_ERROR` | 비즈니스 규칙 위반 메시지 토스트 |
| 404 `NOT_FOUND` | 토스트 "해당 항목을 찾을 수 없습니다" |
| 500 `INTERNAL_ERROR` | 토스트 "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요" |
| 네트워크 에러 | 토스트 "네트워크 연결을 확인해주세요" |

### 10.3 관리자 API 클라이언트 (`admin-api/client.ts`)

**역할**: 모든 관리자 API 호출의 중앙 허브. 표준 응답 파싱 + 에러 처리 일원화.

**기능**:
- `Authorization` 헤더 자동 주입 (localStorage에서 토큰 읽기)
- 표준 응답 구조 (`ApiResponse<T>`) 파싱
- 401 응답 시 자동 로그아웃 + 리다이렉트
- 네트워크 에러 래핑

**메서드**:
- `get<T>(path: string): Promise<ApiResponse<T>>`
- `post<T>(path: string, body: object): Promise<ApiResponse<T>>`
- `patch<T>(path: string, body: object): Promise<ApiResponse<T>>`
- `del<T>(path: string): Promise<ApiResponse<T>>`
- `upload(path: string, formData: FormData): Promise<ApiResponse<UploadResult>>`

---

## 11. 타입 시스템

### 11.1 자동 생성 타입

Supabase CLI `supabase gen types typescript` 명령으로 DB 스키마 기반 타입 자동 생성.

**출력 파일**: `src/types/database.ts`  
**갱신 시점**: DB 마이그레이션 후 재생성

### 11.2 도메인 타입

#### `store.ts`

| 타입 | 설명 |
|------|------|
| `StoreInfo` | 매장 정보 전체 타입 (DB 스키마 기반) |
| `StoreStatus` | `'open' \| 'break' \| 'closed' \| 'holiday'` 유니온 |

#### `menu.ts`

| 타입 | 설명 |
|------|------|
| `Menu` | 메뉴 단건 타입 |
| `MenuCategory` | `'signature' \| 'seasonal' \| 'regular'` 유니온 |
| `GroupedMenus` | `{ signature: Menu[], seasonal: Menu[], regular: Menu[] }` |
| `MenuFormData` | 메뉴 생성/수정 폼 입력 타입 |

#### `notice.ts`

| 타입 | 설명 |
|------|------|
| `Notice` | 공지사항 단건 타입 |
| `NoticeFormData` | 공지 생성/수정 폼 입력 타입 |

#### `side-dish.ts`

| 타입 | 설명 |
|------|------|
| `SideDish` | 기본찬 단건 타입 |
| `SideDishFormData` | 기본찬 생성/수정 폼 입력 타입 |

#### `api.ts`

| 타입 | 설명 |
|------|------|
| `ApiResponse<T>` | `{ success: true, data: T, meta: MetaInfo } \| { success: false, error: ApiError, meta: MetaInfo }` |
| `ApiError` | `{ code: string, message: string }` |
| `PaginatedResponse<T>` | `ApiResponse<T[]>` + `meta.pagination` |
| `PaginationMeta` | `{ total: number, limit: number, offset: number, has_next: boolean }` |

#### `admin.ts`

| 타입 | 설명 |
|------|------|
| `LoginRequest` | `{ password: string }` |
| `LoginResponse` | `{ session_token: string, expires_at: string }` |
| `ReorderItem` | `{ id: string, sort_order: number }` |
| `UploadResult` | `{ url: string, path: string }` |

---

## 12. 개발 워크플로우

### 12.1 개발 환경 설정

1. `npm install` — 의존성 설치
2. `.env.local` 환경변수 설정
3. `supabase start` — 로컬 Supabase 시작
4. `npm run dev` — Next.js 개발 서버 시작

### 12.2 주요 npm 스크립트

| 스크립트 | 설명 |
|----------|------|
| `dev` | Next.js 개발 서버 (3000 포트) |
| `build` | 프로덕션 빌드 |
| `start` | 프로덕션 서버 |
| `lint` | ESLint 실행 |
| `type-check` | TypeScript 타입 검사 |
| `gen:types` | Supabase DB 타입 자동 생성 |

### 12.3 의존성 목록

| 패키지 | 버전 | 용도 |
|--------|------|------|
| `next` | 14.x | 프레임워크 |
| `react` / `react-dom` | 18.x | UI 라이브러리 |
| `@supabase/supabase-js` | 2.x | Supabase 클라이언트 |
| `lucide-react` | latest | 아이콘 |
| `typescript` | 5.x | 타입 시스템 |

**의도적 미사용 라이브러리**: 상태 관리 (React 기본 사용), CSS 프레임워크 (Vanilla CSS), 폼 라이브러리 (직접 구현 — 규모가 작으므로)
