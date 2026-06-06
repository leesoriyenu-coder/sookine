# 📊 Database Model — 숙이네국수 홈페이지

**문서 버전**: v1.1 (역순 검증 반영)  
**최종 수정일**: 2026-06-06  
**기술 스택**: Supabase (PostgreSQL 15+)  
**문서 목적**: 엔지니어가 Supabase 프로젝트에 테이블을 즉시 생성할 수 있는 수준의 완전한 DB 스키마 정의

---

## 1. 설계 원칙

- **단일 행 설정 패턴**: `store_info`처럼 설정성 테이블은 단일 행으로 운영하며 `CHECK` 제약으로 행 수 제한
- **Soft Delete 배제**: 규모가 작은 서비스이므로 `is_visible`로 노출 제어, 물리 삭제 허용
- **UUID v4 PK**: 모든 테이블의 기본키는 `gen_random_uuid()`로 자동 생성
- **Timestamp 자동화**: `created_at`은 `DEFAULT now()`, `updated_at`은 트리거로 자동 갱신
- **RLS (Row Level Security)**: 모든 테이블에 활성화, 공개 읽기 + 관리자 쓰기 패턴 적용

---

## 2. ER 다이어그램

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│  store_info  │     │    menus     │     │   side_dishes    │
│  (단일 행)    │     │              │     │                  │
│──────────────│     │──────────────│     │──────────────────│
│ id (PK)      │     │ id (PK)      │     │ id (PK)          │
│ status       │     │ name         │     │ name             │
│ open_time    │     │ price        │     │ image_url        │
│ break_start  │     │ description  │     │ sort_order       │
│ break_end    │     │ image_url    │     │ is_visible       │
│ close_time   │     │ is_signature │     │ created_at       │
│ last_order   │     │ is_seasonal  │     │ updated_at       │
│ regular_holiday│   │ is_visible   │     └──────────────────┘
│ phone        │     │ category     │
│ address_road │     │ note         │     ┌──────────────────┐
│ address_jibun│     │ sort_order   │     │     notices      │
│ parking_info │     │ created_at   │     │──────────────────│
│ payment_methods│   │ updated_at   │     │ id (PK)          │
│ caution_notes│     └──────────────┘     │ title            │
│ slogan       │                          │ content          │
│ updated_at   │                          │ is_urgent        │
└──────────────┘                          │ is_visible       │
                                          │ created_at       │
┌──────────────────┐                      │ updated_at       │
│  admin_sessions  │                      └──────────────────┘
│──────────────────│
│ id (PK)          │
│ session_token    │
│ expires_at       │
│ created_at       │
└──────────────────┘
```

---

## 3. 테이블 상세 정의

### 3.1 `store_info` — 매장 기본 정보

> 단일 행으로 운영. 매장의 모든 설정 정보를 하나의 레코드에 저장.

| 컬럼명 | 타입 | 제약조건 | 기본값 | 설명 |
|--------|------|----------|--------|------|
| `id` | `UUID` | PK | `gen_random_uuid()` | 고유 식별자 |
| `status` | `TEXT` | NOT NULL, CHECK | `'open'` | 영업 상태. 허용값: `open`, `break`, `closed`, `holiday` |
| `open_time` | `TIME` | NOT NULL | `'11:40'` | 오픈 시간 |
| `break_start` | `TIME` | NOT NULL | `'14:00'` | 브레이크타임 시작 |
| `break_end` | `TIME` | NOT NULL | `'17:00'` | 브레이크타임 종료 |
| `close_time` | `TIME` | NOT NULL | `'20:00'` | 마감 시간 |
| `last_order` | `TIME` | | `'19:30'` | 라스트오더 시간 |
| `regular_holiday` | `TEXT` | | `'일요일'` | 정기 휴무일 텍스트 (예: "매주 일요일", "일요일, 공휴일") |
| `phone` | `TEXT` | NOT NULL | `'055-742-4472'` | 전화번호 |
| `address_road` | `TEXT` | NOT NULL | `'경상남도 진주시 신안로 161'` | 도로명 주소 |
| `address_jibun` | `TEXT` | | `'진주시 이현동 29-29'` | 지번 주소 |
| `parking_info` | `TEXT` | | | 주차 안내 텍스트 |
| `payment_methods` | `TEXT[]` | | `'{카드,계좌이체,진주사랑상품권}'` | 결제 수단 배열 |
| `caution_notes` | `TEXT[]` | | | 유의사항 배열 |
| `slogan` | `TEXT` | | `'엄마가 정성스럽게 차려주는 집밥 한 상차림'` | 슬로건 |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | 생성 시각 |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | 최종 수정 시각 |

**CHECK 제약조건**:
- `status IN ('open', 'break', 'closed', 'holiday')`
- 단일 행 보장: 별도 트리거로 INSERT 시 기존 행이 있으면 거부

**인덱스**: 없음 (단일 행이므로 불필요)

---

### 3.2 `menus` — 메뉴

| 컬럼명 | 타입 | 제약조건 | 기본값 | 설명 |
|--------|------|----------|--------|------|
| `id` | `UUID` | PK | `gen_random_uuid()` | 고유 식별자 |
| `name` | `TEXT` | NOT NULL | | 메뉴명 (예: "갈치조림") |
| `price` | `INTEGER` | NOT NULL, CHECK >= 0 | | 가격 (원 단위, 1인 기준) |
| `description` | `TEXT` | | | 한 줄 설명 |
| `image_url` | `TEXT` | | | Supabase Storage 이미지 공개 URL |
| `image_path` | `TEXT` | | | Supabase Storage 내 경로 (예: `menu-images/{uuid}.webp`). 이미지 삭제 시 사용 |
| `is_signature` | `BOOLEAN` | NOT NULL | `false` | 대표 메뉴 여부 (🔥 배지) |
| `is_seasonal` | `BOOLEAN` | NOT NULL | `false` | 시즌 메뉴 여부 (🌿 배지) |
| `is_visible` | `BOOLEAN` | NOT NULL | `true` | 홈페이지 노출 여부 |
| `category` | `TEXT` | NOT NULL, CHECK | `'regular'` | 분류. 허용값: `signature`, `seasonal`, `regular` |
| `note` | `TEXT` | | | 비고 (예: "2인분부터 주문", "공기밥 포함") |
| `sort_order` | `INTEGER` | NOT NULL | `0` | 표시 순서 (오름차순) |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | 생성 시각 |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | 최종 수정 시각 |

**CHECK 제약조건**:
- `price >= 0`
- `category IN ('signature', 'seasonal', 'regular')`

**인덱스**:
- `idx_menus_visible_sort` — `(is_visible, sort_order)`: 공개 메뉴 정렬 조회 최적화
- `idx_menus_category` — `(category)`: 카테고리별 필터링

**비즈니스 규칙**:
- `is_signature = true`이면 `category`는 반드시 `'signature'`
- `is_seasonal = true`이면 `category`는 반드시 `'seasonal'`
- 시즌 종료 시 `is_visible = false`로 비노출 처리 (삭제하지 않음)

---

### 3.3 `notices` — 공지사항

| 컬럼명 | 타입 | 제약조건 | 기본값 | 설명 |
|--------|------|----------|--------|------|
| `id` | `UUID` | PK | `gen_random_uuid()` | 고유 식별자 |
| `title` | `TEXT` | NOT NULL | | 공지 제목 |
| `content` | `TEXT` | NOT NULL | | 공지 내용 |
| `is_urgent` | `BOOLEAN` | NOT NULL | `false` | 긴급 배너 노출 여부 (히어로 섹션 띠 배너) |
| `is_visible` | `BOOLEAN` | NOT NULL | `true` | 노출 여부 |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | 생성 시각 |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | 최종 수정 시각 |

**인덱스**:
- `idx_notices_visible_created` — `(is_visible, created_at DESC)`: 공개 공지 최신순 조회
- `idx_notices_urgent` — `(is_urgent) WHERE is_urgent = true AND is_visible = true`: 긴급 배너 빠른 조회

---

### 3.4 `side_dishes` — 기본찬 (밑반찬)

| 컬럼명 | 타입 | 제약조건 | 기본값 | 설명 |
|--------|------|----------|--------|------|
| `id` | `UUID` | PK | `gen_random_uuid()` | 고유 식별자 |
| `name` | `TEXT` | NOT NULL | | 반찬명 (예: "오징어초무침") |
| `description` | `TEXT` | | | 한 줄 설명 (확장용, 선택적) |
| `image_url` | `TEXT` | | | Supabase Storage 이미지 공개 URL |
| `image_path` | `TEXT` | | | Supabase Storage 내 경로. 이미지 삭제 시 사용 |
| `sort_order` | `INTEGER` | NOT NULL | `0` | 표시 순서 (오름차순) |
| `is_visible` | `BOOLEAN` | NOT NULL | `true` | 노출 여부 |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | 생성 시각 |
| `updated_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | 최종 수정 시각 |

**인덱스**:
- `idx_side_dishes_visible_sort` — `(is_visible, sort_order)`: 공개 반찬 정렬 조회

---

### 3.5 `admin_sessions` — 관리자 세션

> 단일 비밀번호 인증 기반. Supabase Auth를 사용하지 않고 커스텀 세션 관리.

| 컬럼명 | 타입 | 제약조건 | 기본값 | 설명 |
|--------|------|----------|--------|------|
| `id` | `UUID` | PK | `gen_random_uuid()` | 고유 식별자 |
| `session_token` | `TEXT` | NOT NULL, UNIQUE | | 세션 토큰 (SHA-256 해시) |
| `expires_at` | `TIMESTAMPTZ` | NOT NULL | | 만료 시각 (기본 24시간) |
| `created_at` | `TIMESTAMPTZ` | NOT NULL | `now()` | 생성 시각 |

**인덱스**:
- `idx_admin_sessions_token` — `(session_token)`: 토큰 기반 세션 검증
- `idx_admin_sessions_expires` — `(expires_at)`: 만료 세션 정리용

**정리 정책**: `expires_at < now()`인 레코드는 주기적 정리
- **방식 1 (권장)**: Supabase pg_cron 확장 활용 — 매시간 `DELETE FROM admin_sessions WHERE expires_at < now()` 실행
- **방식 2 (대안)**: 로그인 Edge Function에서 로그인 처리 전 `DELETE FROM admin_sessions WHERE expires_at < now()` 선실행
- **pg_cron 스케줄**: `0 * * * *` (매시간 정각)

---

## 4. Supabase Storage 버킷

| 버킷명 | 공개 여부 | 용도 | 파일 제한 |
|--------|----------|------|----------|
| `menu-images` | Public | 메뉴 사진 | 최대 5MB, `image/*` MIME 타입 |
| `side-dish-images` | Public | 기본찬 사진 | 최대 5MB, `image/*` MIME 타입 |

**이미지 경로 규칙**: `{bucket}/{uuid}.{ext}` (예: `menu-images/a1b2c3d4.webp`)

**이미지 최적화**: Supabase Image Transformation 활용
- 목록용 썸네일: `width=400, quality=80`
- 라이트박스 원본: `width=1200, quality=90`

---

## 5. RLS (Row Level Security) 정책

모든 테이블에 RLS 활성화. 관리자 인증은 Edge Function에서 세션 토큰 검증 후 `service_role` 키로 DB 접근.

### 5.1 공통 패턴

| 테이블 | SELECT (anon) | INSERT/UPDATE/DELETE (anon) | service_role |
|--------|--------------|----------------------------|--------------|
| `store_info` | ✅ 허용 | ❌ 차단 | ✅ 전체 허용 |
| `menus` | ✅ `is_visible = true` 조건 | ❌ 차단 | ✅ 전체 허용 |
| `notices` | ✅ `is_visible = true` 조건 | ❌ 차단 | ✅ 전체 허용 |
| `side_dishes` | ✅ `is_visible = true` 조건 | ❌ 차단 | ✅ 전체 허용 |
| `admin_sessions` | ❌ 차단 | ❌ 차단 | ✅ 전체 허용 |

### 5.2 정책 명명 규칙

- `{table}_select_public` — 공개 읽기
- `{table}_all_service` — service_role 전체 접근

---

## 6. 자동화 트리거

### 6.1 `updated_at` 자동 갱신 트리거

모든 테이블(`admin_sessions` 제외)에 적용.

**트리거 함수명**: `fn_update_timestamp()`  
**동작**: `UPDATE` 이벤트 발생 시 `NEW.updated_at = now()` 설정  
**적용 대상**: `store_info`, `menus`, `notices`, `side_dishes`

### 6.2 `store_info` 단일 행 보장 트리거

**트리거 함수명**: `fn_prevent_store_info_insert()`  
**동작**: `INSERT` 시 기존 행이 1개 이상이면 예외 발생  
**적용 대상**: `store_info`

---

## 7. 초기 시드 데이터

### 7.1 `store_info` 초기 데이터

| 필드 | 값 |
|------|-----|
| status | `open` |
| open_time | `11:40` |
| break_start | `14:00` |
| break_end | `17:00` |
| close_time | `20:00` |
| last_order | `19:30` |
| regular_holiday | `매주 일요일` |
| phone | `055-742-4472` |
| address_road | `경상남도 진주시 신안로 161` |
| address_jibun | `진주시 이현동 29-29` |
| parking_info | `전용 주차장은 없습니다. 이현상가 근처 또는 골목 주차를 이용해 주세요. ⚠️ 가게 앞 도로는 주차단속 구간입니다.` |
| payment_methods | `{카드,계좌이체,진주사랑상품권,지역화폐}` |
| caution_notes | `{재료 소진 시 조기마감 가능,사장님 혼자 운영 → 반찬 셀프}` |
| slogan | `엄마가 정성스럽게 차려주는 집밥 한 상차림` |

### 7.2 `menus` 초기 데이터

| name | price | category | is_signature | is_seasonal | note | sort_order |
|------|-------|----------|-------------|-------------|------|-----------|
| 갈치조림 | 14000 | signature | true | false | 2인분부터 주문 · 공기밥 포함 | 1 |
| 두루치기 | 12000 | signature | true | false | 공기밥 포함 | 2 |
| 생멸치쌈밥 | 14000 | seasonal | false | true | 2인분부터 주문 · 공기밥 포함 | 3 |
| 동태탕 | 12000 | seasonal | false | true | 공기밥 포함 | 4 |
| 낙지볶음 | 12000 | regular | false | false | 공기밥 포함 | 5 |
| 김치찌개 | 12000 | regular | false | false | 공기밥 포함 | 6 |
| 된장찌개 | 12000 | regular | false | false | 공기밥 포함 | 7 |

### 7.3 `side_dishes` 초기 데이터

| name | sort_order |
|------|-----------|
| 오징어초무침 | 1 |
| 데친알배추 | 2 |
| 갈치속젓 | 3 |
| 토란국 | 4 |
| 방아부추전 | 5 |
| 나물류 | 6 |
| 생선구이 | 7 |
| 과일사라다 | 8 |

---

## 8. 마이그레이션 전략

### 8.1 버전 관리

- 마이그레이션 파일 경로: `supabase/migrations/`
- 네이밍 규칙: `{YYYYMMDDHHMMSS}_{description}.sql`
- 초기 마이그레이션: `20260606000000_initial_schema.sql`
- 시드 데이터: `supabase/seed.sql`

### 8.2 향후 스키마 변경 가이드라인

- 컬럼 추가: `ALTER TABLE ... ADD COLUMN ... DEFAULT ...` (NOT NULL 컬럼은 반드시 DEFAULT 포함)
- 컬럼 삭제: 즉시 삭제하지 않고 1) 코드에서 참조 제거 → 2) 배포 → 3) 컬럼 삭제의 2단계 수행
- 테이블 추가: 새 마이그레이션 파일 생성 + RLS 정책 반드시 포함

---

## 9. 성능 고려사항

| 항목 | 전략 |
|------|------|
| **쿼리 최적화** | 공개 페이지는 최대 4개 테이블만 조회. 각 테이블 최대 수십 행 수준으로 인덱스만으로 충분 |
| **캐싱** | Next.js ISR/SSG + `revalidate`로 DB 부하 최소화. 관리자 수정 시 Revalidation API 호출 |
| **Connection Pooling** | Supabase 기본 PgBouncer 활용 (별도 설정 불필요) |
| **Storage CDN** | Supabase Storage 기본 CDN으로 이미지 전송 최적화 |
