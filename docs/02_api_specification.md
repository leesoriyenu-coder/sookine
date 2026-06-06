# 🔌 API Specification — 숙이네국수 홈페이지

**문서 버전**: v1.1 (역순 검증 반영)  
**최종 수정일**: 2026-06-06  
**기술 스택**: Supabase Edge Functions (Deno) + Supabase Client SDK  
**문서 목적**: 프론트엔드/백엔드 엔지니어가 API를 즉시 구현하고 연동할 수 있는 완전한 인터페이스 명세

---

## 1. API 설계 원칙

### 1.1 아키텍처 방식

- **공개 데이터 조회**: Supabase Client SDK를 통한 직접 DB 조회 (RLS로 보호)
- **관리자 데이터 변경**: Supabase Edge Functions를 통한 인증 + 비즈니스 로직 처리
- **인증 방식**: 커스텀 세션 토큰 (Bearer Token) — Supabase Auth 미사용

### 1.2 표준 응답 구조

모든 Edge Function API는 아래 표준 구조를 따른다.

#### 성공 응답

```
{
  "success": true,
  "data": <T>,
  "meta": {
    "timestamp": "2026-06-06T02:40:00.000Z"
  }
}
```

#### 에러 응답

```
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "사용자 친화적 한국어 메시지"
  },
  "meta": {
    "timestamp": "2026-06-06T02:40:00.000Z"
  }
}
```

### 1.3 표준 에러 코드

| HTTP 상태 | 에러 코드 | 설명 |
|-----------|----------|------|
| 400 | `INVALID_REQUEST` | 필수 필드 누락 또는 유효성 검증 실패 |
| 401 | `UNAUTHORIZED` | 인증 토큰 누락 또는 만료 |
| 403 | `FORBIDDEN` | 권한 없음 |
| 404 | `NOT_FOUND` | 리소스 미존재 |
| 409 | `CONFLICT` | 중복 또는 충돌 |
| 422 | `VALIDATION_ERROR` | 비즈니스 규칙 위반 |
| 429 | `RATE_LIMITED` | 요청 제한 초과 (Rate Limiting) |
| 500 | `INTERNAL_ERROR` | 서버 내부 오류 |

### 1.4 공통 헤더

| 헤더 | 값 | 대상 |
|------|-----|------|
| `Content-Type` | `application/json` | 모든 요청/응답 |
| `Authorization` | `Bearer {session_token}` | 관리자 API만 |
| `apikey` | Supabase anon key | Supabase Client 직접 호출 시 |

### 1.5 페이지네이션 (공지사항)

공지사항 목록 조회 시 커서 기반 페이지네이션 적용.

```
{
  "success": true,
  "data": [...],
  "meta": {
    "timestamp": "...",
    "pagination": {
      "total": 15,
      "limit": 5,
      "offset": 0,
      "has_next": true
    }
  }
}
```

---

## 2. 공개 API (Supabase Client 직접 조회)

> 프론트엔드에서 `@supabase/supabase-js` SDK로 직접 호출. RLS 정책에 의해 `is_visible = true` 데이터만 반환.

### 2.1 매장 정보 조회

**호출 방식**: Supabase Client SDK  
**테이블**: `store_info`  
**SDK 메서드**: `supabase.from('store_info').select('*').single()`

**응답 필드**:

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | string | UUID |
| `status` | string | 영업 상태: `open` / `break` / `closed` / `holiday` |
| `open_time` | string | 오픈 시간 (HH:MM) |
| `break_start` | string | 브레이크타임 시작 |
| `break_end` | string | 브레이크타임 종료 |
| `close_time` | string | 마감 시간 |
| `last_order` | string | 라스트오더 시간 |
| `regular_holiday` | string | 정기 휴무일 |
| `phone` | string | 전화번호 |
| `address_road` | string | 도로명 주소 |
| `address_jibun` | string | 지번 주소 |
| `parking_info` | string | 주차 안내 |
| `payment_methods` | string[] | 결제 수단 |
| `caution_notes` | string[] | 유의사항 |
| `slogan` | string | 슬로건 |
| `updated_at` | string | 최종 수정 시각 (ISO 8601) |

---

### 2.2 메뉴 목록 조회

**호출 방식**: Supabase Client SDK  
**테이블**: `menus`  
**SDK 메서드**: `supabase.from('menus').select('*').eq('is_visible', true).order('sort_order', { ascending: true })`

**응답 필드** (배열):

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | string | UUID |
| `name` | string | 메뉴명 |
| `price` | number | 가격 (원) |
| `description` | string \| null | 한 줄 설명 |
| `image_url` | string \| null | 이미지 URL |
| `is_signature` | boolean | 대표 메뉴 여부 |
| `is_seasonal` | boolean | 시즌 메뉴 여부 |
| `category` | string | 분류: `signature` / `seasonal` / `regular` |
| `note` | string \| null | 비고 |
| `image_path` | string \| null | Storage 내 경로 (이미지 삭제용) |
| `sort_order` | number | 정렬 순서 |

**프론트엔드 그룹핑 로직**: `category` 필드를 기준으로 대표/시즌/상시 메뉴 분리 렌더링

---

### 2.3 공지사항 목록 조회

**호출 방식**: Supabase Client SDK  
**테이블**: `notices`  
**SDK 메서드**: `supabase.from('notices').select('*', { count: 'exact' }).eq('is_visible', true).order('created_at', { ascending: false }).range(offset, offset + limit - 1)`

**요청 파라미터** (프론트엔드 변수):

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|----------|------|------|--------|------|
| `limit` | number | 아니오 | 5 | 조회 건수 |
| `offset` | number | 아니오 | 0 | 오프셋 |

**응답 필드** (배열):

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | string | UUID |
| `title` | string | 제목 |
| `content` | string | 내용 |
| `is_urgent` | boolean | 긴급 배너 여부 |
| `created_at` | string | 생성 시각 (ISO 8601) |

---

### 2.4 긴급 공지 조회

**호출 방식**: Supabase Client SDK  
**테이블**: `notices`  
**SDK 메서드**: `supabase.from('notices').select('id, title, content').eq('is_urgent', true).eq('is_visible', true).order('created_at', { ascending: false }).limit(1)`

**응답**: 긴급 공지 단일 객체 또는 null. 히어로 섹션 띠 배너에 사용.

---

### 2.5 기본찬 목록 조회

**호출 방식**: Supabase Client SDK  
**테이블**: `side_dishes`  
**SDK 메서드**: `supabase.from('side_dishes').select('*').eq('is_visible', true).order('sort_order', { ascending: true })`

**응답 필드** (배열):

| 필드 | 타입 | 설명 |
|------|------|------|
| `id` | string | UUID |
| `name` | string | 반찬명 |
| `description` | string \| null | 한 줄 설명 |
| `image_url` | string \| null | 이미지 URL |
| `image_path` | string \| null | Storage 내 경로 |
| `sort_order` | number | 정렬 순서 |

---

## 3. 관리자 API (Supabase Edge Functions)

> 모든 관리자 API는 Edge Function으로 구현. 세션 토큰 인증 필수.  
> 베이스 URL: `https://{project-ref}.supabase.co/functions/v1`

### 3.1 인증

#### POST `/admin/login`

관리자 로그인. 비밀번호 검증 후 세션 토큰 발급.

**요청 Body**:

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `password` | string | ✅ | 관리자 비밀번호 |

**성공 응답** (200):

```
{
  "success": true,
  "data": {
    "session_token": "abc123...",
    "expires_at": "2026-06-07T02:40:00.000Z"
  }
}
```

**에러 응답** (401):

```
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "비밀번호가 올바르지 않습니다."
  }
}
```

**비밀번호 저장**: Supabase 환경변수 `ADMIN_PASSWORD_HASH` (bcrypt 해시)  
**세션 유효기간**: 24시간  
**보안**: bcrypt 비교, 토큰은 `crypto.randomUUID()` 생성 후 DB 저장

---

#### POST `/admin/logout`

세션 만료 처리.

**헤더**: `Authorization: Bearer {session_token}`

**성공 응답** (200):

```
{
  "success": true,
  "data": {
    "message": "로그아웃되었습니다."
  }
}
```

---

#### GET `/admin/verify`

세션 토큰 유효성 검증. 페이지 진입 시 인증 확인용.

**헤더**: `Authorization: Bearer {session_token}`

**성공 응답** (200):

```
{
  "success": true,
  "data": {
    "valid": true,
    "expires_at": "2026-06-07T02:40:00.000Z"
  }
}
```

**에러 응답** (401): 토큰 만료 또는 무효

---

### 3.2 매장 정보 관리

#### GET `/admin/store-info`

매장 정보 전체 조회 (관리자용, `is_visible` 필터 없음).

**헤더**: `Authorization: Bearer {session_token}`

**성공 응답** (200): `store_info` 테이블의 전체 컬럼

---

#### PATCH `/admin/store-info`

매장 정보 부분 수정.

**헤더**: `Authorization: Bearer {session_token}`

**요청 Body** (모든 필드 선택적):

| 필드 | 타입 | 유효성 검증 |
|------|------|------------|
| `status` | string | `open`, `break`, `closed`, `holiday` 중 하나 |
| `open_time` | string | HH:MM 형식 |
| `break_start` | string | HH:MM 형식 |
| `break_end` | string | HH:MM 형식, `break_start`보다 이후 |
| `close_time` | string | HH:MM 형식, `open_time`보다 이후 |
| `last_order` | string | HH:MM 형식 |
| `regular_holiday` | string | 자유 텍스트 |
| `phone` | string | 전화번호 형식 |
| `address_road` | string | 비어있지 않은 문자열 |
| `address_jibun` | string | 자유 텍스트 |
| `parking_info` | string | 자유 텍스트 |
| `payment_methods` | string[] | 비어있지 않은 배열 |
| `caution_notes` | string[] | 문자열 배열 |
| `slogan` | string | 자유 텍스트 |

**성공 응답** (200):

```
{
  "success": true,
  "data": { /* 수정된 store_info 전체 객체 */ }
}
```

---

#### PATCH `/admin/store-status`

영업 상태만 빠르게 변경하는 단축 API. 관리자 대시보드 토글 버튼용.

**헤더**: `Authorization: Bearer {session_token}`

**요청 Body**:

| 필드 | 타입 | 필수 | 유효성 검증 |
|------|------|------|------------|
| `status` | string | ✅ | `open`, `break`, `closed`, `holiday` 중 하나 |

**성공 응답** (200):

```
{
  "success": true,
  "data": {
    "status": "break",
    "updated_at": "2026-06-06T05:00:00.000Z"
  }
}
```

---

### 3.3 메뉴 관리

#### GET `/admin/menus`

전체 메뉴 목록 조회 (비노출 포함).

**헤더**: `Authorization: Bearer {session_token}`

**성공 응답** (200):

```
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "갈치조림",
      "price": 14000,
      "description": null,
      "image_url": "https://...",
      "is_signature": true,
      "is_seasonal": false,
      "is_visible": true,
      "category": "signature",
      "note": "2인분부터 주문 · 공기밥 포함",
      "sort_order": 1,
      "created_at": "...",
      "updated_at": "..."
    }
  ]
}
```

---

#### POST `/admin/menus`

새 메뉴 추가.

**헤더**: `Authorization: Bearer {session_token}`

**요청 Body**:

| 필드 | 타입 | 필수 | 유효성 검증 |
|------|------|------|------------|
| `name` | string | ✅ | 1~50자 |
| `price` | number | ✅ | 0 이상 정수 |
| `description` | string | 아니오 | 최대 200자 |
| `image_url` | string | 아니오 | URL 형식 |
| `is_signature` | boolean | 아니오 | 기본값 `false` |
| `is_seasonal` | boolean | 아니오 | 기본값 `false` |
| `is_visible` | boolean | 아니오 | 기본값 `true` |
| `category` | string | ✅ | `signature`, `seasonal`, `regular` 중 하나 |
| `note` | string | 아니오 | 최대 100자 |
| `sort_order` | number | 아니오 | 기본값 0 |

**비즈니스 규칙 검증**:
- `is_signature = true`이면 `category`는 `signature`이어야 함
- `is_seasonal = true`이면 `category`는 `seasonal`이어야 함
- 위반 시 422 `VALIDATION_ERROR` 반환

**성공 응답** (201):

```
{
  "success": true,
  "data": { /* 생성된 메뉴 전체 객체 */ }
}
```

---

#### PATCH `/admin/menus/{id}`

메뉴 수정.

**헤더**: `Authorization: Bearer {session_token}`  
**경로 파라미터**: `id` — 메뉴 UUID

**요청 Body**: POST와 동일 필드 (모두 선택적)

**성공 응답** (200): 수정된 메뉴 전체 객체  
**에러 응답** (404): 메뉴 미존재

---

#### DELETE `/admin/menus/{id}`

메뉴 삭제 (물리 삭제).

**헤더**: `Authorization: Bearer {session_token}`  
**경로 파라미터**: `id` — 메뉴 UUID

**성공 응답** (200):

```
{
  "success": true,
  "data": {
    "message": "메뉴가 삭제되었습니다.",
    "deleted_id": "uuid"
  }
}
```

---

#### PATCH `/admin/menus/reorder`

메뉴 순서 일괄 변경. 관리자 드래그 앤 드롭 정렬용.

**헤더**: `Authorization: Bearer {session_token}`

**요청 Body**:

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `orders` | array | ✅ | `{ id: string, sort_order: number }[]` |

**유효성 검증**:
- `orders` 배열이 비어있으면 400
- 존재하지 않는 `id`가 포함되면 404

**성공 응답** (200):

```
{
  "success": true,
  "data": {
    "message": "메뉴 순서가 변경되었습니다.",
    "updated_count": 7
  }
}
```

---

### 3.4 공지사항 관리

#### GET `/admin/notices`

전체 공지사항 목록 조회 (비노출 포함). 페이지네이션 지원.

**헤더**: `Authorization: Bearer {session_token}`

**쿼리 파라미터**:

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|----------|------|------|--------|------|
| `limit` | number | 아니오 | 20 | 조회 건수 (최대 50) |
| `offset` | number | 아니오 | 0 | 오프셋 |

**성공 응답** (200): 표준 페이지네이션 응답 구조

---

#### POST `/admin/notices`

새 공지사항 작성.

**헤더**: `Authorization: Bearer {session_token}`

**요청 Body**:

| 필드 | 타입 | 필수 | 유효성 검증 |
|------|------|------|------------|
| `title` | string | ✅ | 1~100자 |
| `content` | string | ✅ | 1~2000자 |
| `is_urgent` | boolean | 아니오 | 기본값 `false` |
| `is_visible` | boolean | 아니오 | 기본값 `true` |

**비즈니스 규칙**:
- `is_urgent = true` 설정 시, 기존 긴급 공지의 `is_urgent`를 자동으로 `false`로 변경 (활성 긴급 공지는 항상 1개)

**성공 응답** (201): 생성된 공지사항 전체 객체

---

#### PATCH `/admin/notices/{id}`

공지사항 수정.

**헤더**: `Authorization: Bearer {session_token}`  
**경로 파라미터**: `id` — 공지 UUID

**요청 Body**: POST와 동일 필드 (모두 선택적)

**비즈니스 규칙**: `is_urgent = true` 설정 시 기존 긴급 공지 자동 해제

**성공 응답** (200): 수정된 공지사항 전체 객체

---

#### DELETE `/admin/notices/{id}`

공지사항 삭제 (물리 삭제).

**헤더**: `Authorization: Bearer {session_token}`  
**경로 파라미터**: `id` — 공지 UUID

**성공 응답** (200):

```
{
  "success": true,
  "data": {
    "message": "공지사항이 삭제되었습니다.",
    "deleted_id": "uuid"
  }
}
```

---

### 3.5 기본찬 관리

#### GET `/admin/side-dishes`

전체 기본찬 목록 조회 (비노출 포함).

**헤더**: `Authorization: Bearer {session_token}`

**성공 응답** (200): 기본찬 배열 (전체 필드)

---

#### POST `/admin/side-dishes`

새 기본찬 추가.

**헤더**: `Authorization: Bearer {session_token}`

**요청 Body**:

| 필드 | 타입 | 필수 | 유효성 검증 |
|------|------|------|------------|
| `name` | string | ✅ | 1~30자 |
| `image_url` | string | 아니오 | URL 형식 |
| `sort_order` | number | 아니오 | 기본값 0 |
| `is_visible` | boolean | 아니오 | 기본값 `true` |

**성공 응답** (201): 생성된 기본찬 전체 객체

---

#### PATCH `/admin/side-dishes/{id}`

기본찬 수정.

**헤더**: `Authorization: Bearer {session_token}`  
**경로 파라미터**: `id` — 기본찬 UUID

**요청 Body**: POST와 동일 필드 (모두 선택적)

**성공 응답** (200): 수정된 기본찬 전체 객체

---

#### DELETE `/admin/side-dishes/{id}`

기본찬 삭제 (물리 삭제).

**헤더**: `Authorization: Bearer {session_token}`  
**경로 파라미터**: `id` — 기본찬 UUID

**성공 응답** (200): 삭제 확인 메시지

---

#### PATCH `/admin/side-dishes/reorder`

기본찬 순서 일괄 변경.

**헤더**: `Authorization: Bearer {session_token}`

**요청 Body**:

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `orders` | array | ✅ | `{ id: string, sort_order: number }[]` |

**성공 응답** (200): 변경 완료 메시지 + 변경 건수

---

### 3.6 이미지 업로드

#### POST `/admin/upload`

Supabase Storage에 이미지 업로드.

**헤더**: `Authorization: Bearer {session_token}`, `Content-Type: multipart/form-data`

**요청 Body** (FormData):

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `file` | File | ✅ | 이미지 파일 |
| `bucket` | string | ✅ | `menu-images` 또는 `side-dish-images` |

**유효성 검증**:
- 파일 크기: 최대 5MB
- MIME 타입: `image/jpeg`, `image/png`, `image/webp`만 허용
- `bucket`은 허용 목록에 포함되어야 함

**성공 응답** (201):

```
{
  "success": true,
  "data": {
    "url": "https://{project-ref}.supabase.co/storage/v1/object/public/menu-images/{uuid}.webp",
    "path": "menu-images/{uuid}.webp"
  }
}
```

**에러 응답** (400): 파일 크기 초과 또는 MIME 타입 불일치

---

### 3.7 캐시 무효화

#### POST `/admin/revalidate`

Next.js ISR 캐시 재생성 트리거. 관리자가 데이터 수정 후 호출.

**헤더**: `Authorization: Bearer {session_token}`

**요청 Body**:

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `paths` | string[] | 아니오 | 재검증할 경로 배열 (기본값: `["/"]`) |

**성공 응답** (200):

```
{
  "success": true,
  "data": {
    "revalidated": ["/"],
    "message": "캐시가 갱신되었습니다."
  }
}
```

**구현 방식**: Next.js On-Demand Revalidation API (`/api/revalidate`) 호출

**자동 호출 정책**: 프론트엔드 `admin-api/client.ts`에서 다음 API 호출 성공 후 자동으로 revalidate를 호출한다:
- `PATCH /admin/store-info` — 매장 정보 수정 후
- `PATCH /admin/store-status` — 영업 상태 변경 후
- `POST/PATCH/DELETE /admin/menus/*` — 메뉴 변경 후
- `POST/PATCH/DELETE /admin/notices/*` — 공지 변경 후
- `POST/PATCH/DELETE /admin/side-dishes/*` — 기본찬 변경 후
- `PATCH /admin/menus/reorder`, `PATCH /admin/side-dishes/reorder` — 순서 변경 후

---

## 4. Next.js API Routes (Internal)

> Vercel 서버에서 실행되는 내부 API. 외부 직접 호출 불가.

### 4.1 GET `/api/revalidate`

ISR 재검증 엔드포인트. Edge Function에서 호출.

**쿼리 파라미터**:

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| `secret` | string | ✅ | 재검증 시크릿 키 |
| `path` | string | ✅ | 재검증 경로 |

**보안**: 환경변수 `REVALIDATION_SECRET`와 비교

---

## 5. Supabase Realtime (선택적 확장)

> Phase 1에서는 미구현. 향후 실시간 영업 상태 반영이 필요할 때 활용.

| 채널 | 테이블 | 이벤트 | 용도 |
|------|--------|--------|------|
| `store-status` | `store_info` | `UPDATE` | 영업 상태 변경 실시간 반영 |
| `urgent-notice` | `notices` | `INSERT`, `UPDATE` | 긴급 공지 실시간 노출 |

---

## 6. API 호출 흐름도

### 6.1 공개 페이지 로딩

```
[사용자 브라우저] → [Next.js SSG/ISR] → [Supabase DB (RLS anon)]
                                        ├─ store_info.select()
                                        ├─ menus.select()
                                        ├─ notices.select()
                                        └─ side_dishes.select()
```

### 6.2 관리자 데이터 수정

```
[관리자 브라우저] → [Edge Function (인증 검증)]
                    ├─ session_token 검증
                    ├─ 유효성 검증
                    ├─ DB 수정 (service_role)
                    └─ Next.js revalidate 호출
                         └─ ISR 캐시 재생성
```

### 6.3 이미지 업로드 + 메뉴 수정

```
[관리자] → POST /admin/upload → Storage URL 반환
         → PATCH /admin/menus/{id} (image_url에 URL 포함)
         → POST /admin/revalidate
```

---

## 7. Rate Limiting

| 대상 | 제한 | 구현 |
|------|------|------|
| 공개 API (anon) | Supabase 기본 제한 (초당 100 요청) | Supabase 인프라 |
| 관리자 로그인 | 분당 5회 | Edge Function 내부 로직 (IP 기반) |
| 이미지 업로드 | 분당 10회 | Edge Function 내부 로직 |

---

## 8. CORS 설정

| 출처 | 허용 메서드 | 대상 |
|------|------------|------|
| `https://sukinenoodle.kr` | GET, POST, PATCH, DELETE | 프로덕션 |
| `http://localhost:3000` | GET, POST, PATCH, DELETE | 로컬 개발 |
| Vercel Preview URL | GET, POST, PATCH, DELETE | 프리뷰 배포 |
