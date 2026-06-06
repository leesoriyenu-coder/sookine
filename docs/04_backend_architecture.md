# 🏗️ Backend Architecture — 숙이네국수 홈페이지

**문서 버전**: v1.1 (역순 검증 반영)  
**최종 수정일**: 2026-06-06  
**기술 스택**: Supabase (PostgreSQL + Edge Functions + Storage) + Vercel (Next.js API Routes)  
**문서 목적**: 백엔드 엔지니어가 Supabase 프로젝트와 서버사이드 로직을 완전하게 구축할 수 있는 아키텍처 설계

---

## 1. 아키텍처 개요

### 1.1 시스템 구성도

```
┌─────────────────────────────────────────────────────────────────┐
│                         Vercel (Next.js)                        │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │ SSG/ISR Pages│  │ API Routes   │  │ Middleware            │ │
│  │ (공개 페이지) │  │ /api/revalidate│ │ (관리자 경로 보호)    │ │
│  └──────┬───────┘  └──────┬───────┘  └───────────────────────┘ │
│         │                  │                                    │
└─────────┼──────────────────┼────────────────────────────────────┘
          │                  │
          ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Supabase Platform                         │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │ PostgreSQL   │  │ Edge Functions│  │ Storage               │ │
│  │ (RLS 적용)   │  │ (관리자 API)  │  │ (이미지)              │ │
│  │              │  │              │  │                       │ │
│  │ - store_info │  │ - /admin/*   │  │ - menu-images/        │ │
│  │ - menus      │  │              │  │ - side-dish-images/   │ │
│  │ - notices    │  │              │  │                       │ │
│  │ - side_dishes│  │              │  │                       │ │
│  │ - admin_     │  │              │  │                       │ │
│  │   sessions   │  │              │  │                       │ │
│  └──────────────┘  └──────────────┘  └───────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 데이터 흐름 패턴

| 흐름 | 경로 | 설명 |
|------|------|------|
| **공개 읽기** | Next.js SSG/ISR → Supabase Client (anon key) → PostgreSQL (RLS) | 빌드/재생성 시 DB 조회, 사용자는 캐시된 HTML 수신 |
| **관리자 쓰기** | 브라우저 → Supabase Edge Function → PostgreSQL (service_role) | 인증 검증 후 DB 수정 |
| **캐시 무효화** | Edge Function → Next.js API Route (`/api/revalidate`) | 데이터 수정 후 페이지 재생성 |
| **이미지 업로드** | 브라우저 → Edge Function → Supabase Storage | 인증 검증 후 이미지 저장 |

---

## 2. Supabase 프로젝트 구조

### 2.1 디렉토리 구조

```
supabase/
├── config.toml                          # Supabase CLI 프로젝트 설정
├── migrations/
│   └── 20260606000000_initial_schema.sql  # 초기 스키마 마이그레이션
├── seed.sql                             # 시드 데이터
└── functions/
    ├── _shared/                         # Edge Functions 공유 모듈
    │   ├── cors.ts                      # CORS 헤더 유틸
    │   ├── auth.ts                      # 세션 인증 미들웨어
    │   ├── response.ts                  # 표준 응답 빌더
    │   ├── validation.ts               # 입력 유효성 검증
    │   └── supabase-client.ts           # Supabase 서비스 클라이언트 팩토리
    │
    ├── admin-login/
    │   └── index.ts                     # POST /admin/login
    │
    ├── admin-logout/
    │   └── index.ts                     # POST /admin/logout
    │
    ├── admin-verify/
    │   └── index.ts                     # GET /admin/verify
    │
    ├── admin-store-info/
    │   └── index.ts                     # GET, PATCH /admin/store-info
    │
    ├── admin-store-status/
    │   └── index.ts                     # PATCH /admin/store-status
    │
    ├── admin-menus/
    │   └── index.ts                     # GET, POST /admin/menus
    │
    ├── admin-menu-detail/
    │   └── index.ts                     # PATCH, DELETE /admin/menus/{id}
    │
    ├── admin-menus-reorder/
    │   └── index.ts                     # PATCH /admin/menus/reorder
    │
    ├── admin-notices/
    │   └── index.ts                     # GET, POST /admin/notices
    │
    ├── admin-notice-detail/
    │   └── index.ts                     # PATCH, DELETE /admin/notices/{id}
    │
    ├── admin-side-dishes/
    │   └── index.ts                     # GET, POST /admin/side-dishes
    │
    ├── admin-side-dish-detail/
    │   └── index.ts                     # PATCH, DELETE /admin/side-dishes/{id}
    │
    ├── admin-side-dishes-reorder/
    │   └── index.ts                     # PATCH /admin/side-dishes/reorder
    │
    ├── admin-upload/
    │   └── index.ts                     # POST /admin/upload
    │
    └── admin-revalidate/
        └── index.ts                     # POST /admin/revalidate
```

---

## 3. Edge Functions 상세 설계

### 3.1 공유 모듈 (`_shared/`)

#### 3.1.1 `cors.ts` — CORS 처리

**역할**: 모든 Edge Function에 일관된 CORS 헤더 제공

**허용 Origin**:
- `https://sukinenoodle.kr` (프로덕션)
- `http://localhost:3000` (로컬 개발)
- `*.vercel.app` 패턴 (프리뷰 배포)

**내보내기**:
- `corsHeaders(origin: string): Headers` — 요청 Origin에 따라 CORS 헤더 반환
- `handleOptions(req: Request): Response` — OPTIONS 프리플라이트 처리

---

#### 3.1.2 `auth.ts` — 인증 미들웨어

**역할**: 세션 토큰 검증

**로직**:
1. `Authorization` 헤더에서 `Bearer {token}` 추출
2. `admin_sessions` 테이블에서 토큰 조회
3. `expires_at > now()` 확인
4. 유효하지 않으면 401 응답 반환

**내보내기**:
- `verifySession(req: Request, supabase: SupabaseClient): Promise<boolean>` — 세션 유효성 반환
- `getSessionToken(req: Request): string | null` — 헤더에서 토큰 추출

---

#### 3.1.3 `response.ts` — 표준 응답 빌더

**역할**: API 명세의 표준 응답 구조 생성

**내보내기**:
- `successResponse(data: T, status?: number): Response`
- `errorResponse(code: string, message: string, status: number): Response`
- `paginatedResponse(data: T[], total: number, limit: number, offset: number): Response`

---

#### 3.1.4 `validation.ts` — 입력 검증

**역할**: 요청 Body 필드별 유효성 검증

**내보내기**:
- `validateRequired(body: object, fields: string[]): ValidationResult`
- `validateTimeFormat(value: string): boolean` — HH:MM 형식 검증
- `validateMenuInput(body: object): ValidationResult` — 메뉴 비즈니스 규칙 검증
- `validateFileUpload(file: File): ValidationResult` — 파일 크기/타입 검증

**`ValidationResult` 타입**: `{ valid: boolean, errors: { field: string, message: string }[] }`

---

#### 3.1.5 `supabase-client.ts` — Supabase 클라이언트 팩토리

**역할**: Edge Function 내부에서 사용할 Supabase 클라이언트 생성

**내보내기**:
- `createServiceClient(): SupabaseClient` — `SUPABASE_SERVICE_ROLE_KEY`로 인증된 클라이언트 (RLS 우회)

---

### 3.2 인증 함수

#### 3.2.1 `admin-login/index.ts`

**HTTP 메서드**: POST  
**처리 흐름**:

1. CORS 프리플라이트 처리
2. 요청 Body에서 `password` 추출
3. 환경변수 `ADMIN_PASSWORD_HASH` (bcrypt)와 비교
4. 일치 시:
   - `crypto.randomUUID()` 기반 세션 토큰 생성
   - `admin_sessions` 테이블에 토큰 + 만료시간(24h) 저장
   - 성공 응답 반환 (토큰 + 만료시간)
5. 불일치 시: 401 에러 응답

**보안 고려**:
- 비밀번호 비교 시 타이밍 공격 방지 (bcrypt 자체 지원)
- IP 기반 Rate Limiting: 동일 IP에서 분당 5회 초과 시 429 반환

**환경변수 의존**: `ADMIN_PASSWORD_HASH`

---

#### 3.2.2 `admin-logout/index.ts`

**HTTP 메서드**: POST  
**처리 흐름**:

1. 세션 토큰 추출
2. `admin_sessions` 테이블에서 해당 토큰 레코드 삭제
3. 성공 응답 반환

---

#### 3.2.3 `admin-verify/index.ts`

**HTTP 메서드**: GET  
**처리 흐름**:

1. 세션 토큰 추출
2. `admin_sessions` 테이블에서 조회
3. 유효하면 `{ valid: true, expires_at }` 반환
4. 무효하면 401 에러

---

### 3.3 데이터 관리 함수

#### 3.3.1 `admin-store-info/index.ts`

**HTTP 메서드**: GET, PATCH  
**라우팅**: HTTP 메서드로 분기

**GET 처리**:
1. 인증 검증
2. `store_info` 단일 행 조회
3. 전체 필드 반환

**PATCH 처리**:
1. 인증 검증
2. 요청 Body 파싱
3. 시간 필드 유효성 검증 (`break_end > break_start`, `close_time > open_time`)
4. `store_info` 업데이트 (전달된 필드만)
5. 수정된 전체 객체 반환

---

#### 3.3.2 `admin-store-status/index.ts`

**HTTP 메서드**: PATCH  
**처리 흐름**:

1. 인증 검증
2. `status` 값 유효성 검증 (`open`, `break`, `closed`, `holiday`)
3. `store_info.status` 단일 필드 업데이트
4. `{ status, updated_at }` 반환

**설계 의도**: 관리자 대시보드의 영업 상태 토글 버튼 전용. `store-info` PATCH보다 간소한 입력으로 빠른 조작 지원.

---

#### 3.3.3 `admin-menus/index.ts`

**HTTP 메서드**: GET, POST  
**라우팅**: HTTP 메서드로 분기

**GET 처리**:
1. 인증 검증
2. `menus` 전체 조회 (`is_visible` 필터 없음, `sort_order` 정렬)
3. 배열 반환

**POST 처리**:
1. 인증 검증
2. 필수 필드 검증 (`name`, `price`, `category`)
3. 비즈니스 규칙 검증 (`is_signature`/`is_seasonal`과 `category` 정합성)
4. `menus` 테이블에 INSERT
5. 생성된 레코드 반환

---

#### 3.3.4 `admin-menu-detail/index.ts`

**HTTP 메서드**: PATCH, DELETE  
**경로 파라미터**: `id` (URL 파싱으로 추출)

**PATCH 처리**:
1. 인증 검증
2. URL에서 `id` 추출
3. 대상 메뉴 존재 확인 (없으면 404)
4. 비즈니스 규칙 검증
5. 해당 레코드 UPDATE
6. 수정된 레코드 반환

**DELETE 처리**:
1. 인증 검증
2. 대상 메뉴 존재 확인
3. 연결된 이미지가 있으면 `image_path` 필드를 사용하여 Storage에서 삭제 (`supabase.storage.from(bucket).remove([path])`)
4. 레코드 물리 삭제
5. 삭제 확인 응답

---

#### 3.3.5 `admin-menus-reorder/index.ts`

**HTTP 메서드**: PATCH  
**처리 흐름**:

1. 인증 검증
2. `orders` 배열 파싱 (`[{ id, sort_order }]`)
3. 배열이 비어있으면 400
4. 트랜잭션 내에서 각 레코드의 `sort_order` 업데이트
5. 변경 건수 반환

**트랜잭션**: Supabase RPC 호출 또는 개별 UPDATE 반복 (레코드 수가 적으므로 허용)

---

#### 3.3.6 `admin-notices/index.ts`

**HTTP 메서드**: GET, POST

**GET 처리**:
1. 인증 검증
2. 쿼리 파라미터에서 `limit`, `offset` 추출
3. `notices` 전체 조회 + count (페이지네이션)
4. 표준 페이지네이션 응답 반환

**POST 처리**:
1. 인증 검증
2. 필수 필드 검증 (`title`, `content`)
3. `is_urgent = true`이면 기존 긴급 공지 `is_urgent` 해제
4. INSERT
5. 생성 레코드 반환

---

#### 3.3.7 `admin-notice-detail/index.ts`

**HTTP 메서드**: PATCH, DELETE  
**구조**: `admin-menu-detail`과 동일 패턴

**PATCH 추가 로직**: `is_urgent = true` 설정 시 기존 긴급 공지 자동 해제

---

#### 3.3.8 `admin-side-dishes/index.ts`, `admin-side-dish-detail/index.ts`, `admin-side-dishes-reorder/index.ts`

**구조**: 메뉴 관리 함수와 동일 패턴. 비즈니스 규칙 검증 단순화 (category/signature/seasonal 없음).

---

### 3.4 이미지 업로드 함수

#### `admin-upload/index.ts`

**HTTP 메서드**: POST  
**Content-Type**: `multipart/form-data`

**처리 흐름**:

1. 인증 검증
2. FormData에서 `file`, `bucket` 추출
3. 파일 검증:
   - 크기: 5MB 이하
   - MIME: `image/jpeg`, `image/png`, `image/webp`
   - `bucket`: `menu-images` 또는 `side-dish-images`
4. 파일명 생성: `{uuid}.{확장자}` (원본 파일명 비사용, UUID로 대체)
5. Supabase Storage에 업로드
6. 공개 URL 및 Storage path 반환 (프론트엔드에서 `image_url`과 `image_path`를 함께 저장)

**이미지 처리**: 서버에서는 원본 저장만 수행. 이미지 최적화(리사이즈, WebP 변환)는 Supabase Image Transformation에 위임.

---

### 3.5 캐시 무효화 함수

#### `admin-revalidate/index.ts`

**HTTP 메서드**: POST  
**처리 흐름**:

1. 인증 검증
2. 요청 Body에서 `paths` 배열 추출 (기본값: `["/"]`)
3. 각 경로에 대해 Next.js API Route 호출:
   - `GET https://{vercel-domain}/api/revalidate?secret={REVALIDATION_SECRET}&path={path}`
4. 결과 집계하여 반환

**환경변수 의존**: `NEXT_REVALIDATION_SECRET`, `NEXT_PUBLIC_SITE_URL`

**연동 흐름**: 관리자 데이터 수정 API → 자동으로 이 함수 호출 여부는 프론트엔드 레이어에서 결정 (3.7 참조)

---

## 4. Next.js 서버사이드 설계

### 4.1 API Routes 구조

```
src/app/api/
└── revalidate/
    └── route.ts          # GET /api/revalidate — ISR 재검증 엔드포인트
```

#### `route.ts` 상세

**처리 흐름**:

1. 쿼리 파라미터에서 `secret`, `path` 추출
2. `secret`이 `REVALIDATION_SECRET` 환경변수와 불일치하면 401
3. `revalidatePath(path)` 호출
4. 성공 응답

---

### 4.2 데이터 페칭 레이어

```
src/lib/
├── supabase/
│   ├── client.ts          # 브라우저용 Supabase 클라이언트 (anon key)
│   └── server.ts          # 서버용 Supabase 클라이언트 (SSG/ISR 데이터 페칭)
│
└── api/
    ├── store.ts           # 매장 정보 조회 함수
    ├── menus.ts           # 메뉴 조회 함수
    ├── notices.ts         # 공지사항 조회 함수
    └── side-dishes.ts     # 기본찬 조회 함수
```

#### 4.2.1 `supabase/server.ts`

- `createServerClient()`: 서버 컴포넌트 / SSG에서 사용
- anon key 사용 (RLS 적용)
- 빌드 시점 및 ISR 재생성 시점에서 호출

#### 4.2.2 `supabase/client.ts`

- `createBrowserClient()`: 클라이언트 컴포넌트에서 사용
- 관리자 페이지의 실시간 데이터 조회에 활용
- 싱글톤 패턴으로 인스턴스 관리

#### 4.2.3 데이터 조회 함수 (`api/*.ts`)

각 함수는 Supabase 쿼리를 캡슐화하며 타입 안전성을 보장.

| 함수명 | 파일 | 반환 타입 | 설명 |
|--------|------|----------|------|
| `getStoreInfo()` | `store.ts` | `StoreInfo` | 매장 정보 단일 객체 |
| `getMenus()` | `menus.ts` | `Menu[]` | 공개 메뉴 목록 (정렬됨) |
| `getMenusByCategory()` | `menus.ts` | `GroupedMenus` | 카테고리별 그룹핑된 메뉴 |
| `getNotices(limit, offset)` | `notices.ts` | `PaginatedResult<Notice>` | 공지사항 페이지네이션 |
| `getUrgentNotice()` | `notices.ts` | `Notice \| null` | 긴급 공지 단일 |
| `getSideDishes()` | `side-dishes.ts` | `SideDish[]` | 공개 기본찬 목록 |

---

### 4.3 ISR (Incremental Static Regeneration) 전략

| 페이지 | 렌더링 방식 | `revalidate` | 설명 |
|--------|------------|-------------|------|
| `/` (메인) | ISR | 300초 (5분) | 관리자 수정 시 On-Demand Revalidation으로 즉시 반영 |
| `/admin/*` | CSR | 해당 없음 | 관리자 페이지는 항상 실시간 데이터 |

**On-Demand Revalidation 흐름**:
1. 관리자가 데이터 수정
2. 프론트엔드에서 수정 API 호출 성공 후 `admin-revalidate` Edge Function 호출
3. Edge Function이 Next.js `/api/revalidate` 호출
4. 다음 사용자 요청 시 새 페이지 제공

---

## 5. 환경변수 목록

### 5.1 Supabase Edge Functions

| 변수명 | 설명 | 예시 |
|--------|------|------|
| `SUPABASE_URL` | Supabase 프로젝트 URL | `https://xxxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | 서비스 롤 키 (RLS 우회) | `eyJ...` |
| `ADMIN_PASSWORD_HASH` | 관리자 비밀번호 bcrypt 해시 | `$2b$10$...` |
| `NEXT_REVALIDATION_SECRET` | 캐시 재검증 시크릿 | `my-secret-token` |
| `NEXT_PUBLIC_SITE_URL` | 사이트 URL | `https://sukinenoodle.kr` |

### 5.2 Next.js (Vercel)

| 변수명 | 설명 | 공개 여부 |
|--------|------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Public |
| `REVALIDATION_SECRET` | 캐시 재검증 시크릿 | Private |
| `NEXT_PUBLIC_NAVER_MAP_CLIENT_ID` | 네이버 지도 클라이언트 ID | Public |

---

## 6. 보안 설계

### 6.1 인증 보안

| 항목 | 구현 |
|------|------|
| **비밀번호 저장** | bcrypt 해시 (cost factor 10) — 환경변수 저장 |
| **세션 토큰** | `crypto.randomUUID()` — 충분한 엔트로피 |
| **세션 만료** | 24시간 TTL |
| **만료 세션 정리** | Supabase Cron (pg_cron) 또는 로그인 시 정리 |

### 6.2 RLS 보안

| 정책 | 설명 |
|------|------|
| 공개 테이블 SELECT | `is_visible = true` 조건으로 비공개 데이터 노출 차단 |
| 모든 테이블 INSERT/UPDATE/DELETE | anon 키로 직접 수정 불가 |
| 관리자 수정 | Edge Function 내부에서 `service_role` 키 사용 |

### 6.3 API 보안

| 항목 | 구현 |
|------|------|
| **CORS** | 허용 Origin 화이트리스트 |
| **Rate Limiting** | 로그인: IP당 분 5회, 업로드: IP당 분 10회 |
| **입력 검증** | 모든 사용자 입력 서버 측 유효성 검증 |
| **파일 업로드** | MIME 타입 화이트리스트 + 파일 크기 제한 |
| **SQL Injection** | Supabase SDK 파라미터 바인딩 (직접 SQL 미사용) |
| **Revalidation** | 시크릿 키 검증 |

---

## 7. 에러 처리 전략

### 7.1 Edge Function 에러 처리

**패턴**: 각 함수의 최상위에서 try-catch로 감싸고 표준 에러 응답 반환

| 단계 | 에러 유형 | HTTP 상태 | 에러 코드 |
|------|----------|----------|----------|
| CORS | 허용되지 않은 Origin | 403 | `FORBIDDEN` |
| 인증 | 토큰 누락 | 401 | `UNAUTHORIZED` |
| 인증 | 토큰 만료 | 401 | `UNAUTHORIZED` |
| 유효성 검증 | 필수 필드 누락 | 400 | `INVALID_REQUEST` |
| 비즈니스 규칙 | 규칙 위반 | 422 | `VALIDATION_ERROR` |
| DB 조회 | 리소스 미존재 | 404 | `NOT_FOUND` |
| DB 수정 | 제약조건 위반 | 409 | `CONFLICT` |
| 기타 | 예상치 못한 에러 | 500 | `INTERNAL_ERROR` |

### 7.2 로깅

- Edge Function 내부에서 `console.error()`로 에러 로깅
- Supabase Dashboard > Edge Function Logs에서 확인
- 프로덕션 에러에는 내부 상세를 노출하지 않고 일반 메시지 반환

---

## 8. 데이터베이스 운영

### 8.1 백업

- Supabase Pro Plan: 일일 자동 백업 (7일 보존)
- 중요 스키마 변경 전 수동 백업 권장

### 8.2 모니터링

| 항목 | 도구 |
|------|------|
| DB 성능 | Supabase Dashboard > Database > Query Performance |
| Edge Function 로그 | Supabase Dashboard > Edge Functions > Logs |
| 스토리지 용량 | Supabase Dashboard > Storage |
| API 호출 횟수 | Supabase Dashboard > Reports |

### 8.3 스케일링 고려

현재 규모(소규모 식당 홈페이지)에서는 Supabase Free/Pro Plan으로 충분. 향후 트래픽 증가 시:

| 항목 | 현재 | 확장 방안 |
|------|------|----------|
| DB 커넥션 | PgBouncer 기본 | 커넥션 풀 크기 조정 |
| Edge Function 응답 | Deno 기본 | 함수별 메모리/타임아웃 조정 |
| Storage | 기본 CDN | Cloudinary 전환 고려 |
| ISR 캐시 | Vercel Edge Network | revalidate 시간 조정 |

---

## 9. 개발 환경 설정

### 9.1 로컬 개발 도구

| 도구 | 용도 |
|------|------|
| Supabase CLI | 로컬 DB, Edge Functions 개발/테스트 |
| Docker | Supabase 로컬 인스턴스 실행 |
| Deno | Edge Functions 로컬 실행 |

### 9.2 로컬 실행 순서

1. `supabase start` — 로컬 Supabase 인스턴스 시작
2. `supabase db reset` — 마이그레이션 + 시드 데이터 적용
3. `supabase functions serve` — Edge Functions 로컬 서빙
4. Next.js 개발 서버와 연동

### 9.3 배포 순서

1. `supabase db push` — 마이그레이션 적용 (프로덕션)
2. `supabase functions deploy` — Edge Functions 배포
3. Vercel 자동 배포 (Git push 트리거)
