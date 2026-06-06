# 🎨 Design System — 숙이네국수 홈페이지

**문서 버전**: v1.1  
**최종 수정일**: 2026-06-06  
**디자인 컨셉**: "오래된 식탁 위의 따뜻한 한 끼"  
**문서 목적**: 프론트엔드 엔지니어가 일관된 UI를 구축할 수 있는 완전한 디자인 토큰 및 컴포넌트 가이드

---

## 1. 설계 원칙

| 원칙 | 설명 |
|------|------|
| **일관성** | 모든 페이지에서 동일한 디자인 토큰과 컴포넌트를 사용 |
| **접근성** | WCAG 2.1 AA 기준 충족 (색상 대비 4.5:1 이상, 터치 타겟 44×44px) |
| **모바일 퍼스트** | 모바일 → 태블릿 → 데스크탑 순서로 설계 |
| **노포 감성** | 화려함보다 정갈함, 차가움보다 따뜻함 |
| **성능** | 폰트 최소화, 이미지 최적화, CSS 변수 기반 토큰 시스템 |

---

## 2. 디자인 토큰

### 2.1 컬러 시스템

> 모든 컬러는 CSS Custom Properties로 정의. 라이트모드 단일 운영.

#### 2.1.1 기본 컬러

| 토큰명 | HEX | RGB | 용도 |
|--------|-----|-----|------|
| `--color-bg-primary` | `#FAF7F2` | 250, 247, 242 | 메인 배경 (한지색) |
| `--color-bg-secondary` | `#FFFFFF` | 255, 255, 255 | 카드/섹션 배경 |
| `--color-bg-tertiary` | `#F0EBE3` | 240, 235, 227 | 교차 섹션 배경 (연한 베이지) |
| `--color-text-primary` | `#1C1C1E` | 28, 28, 30 | 주요 텍스트 (묵색) |
| `--color-text-secondary` | `#78716C` | 120, 113, 108 | 보조 텍스트 (회갈색) |
| `--color-text-tertiary` | `#A8A29E` | 168, 162, 158 | 비활성/힌트 텍스트 |
| `--color-accent` | `#D4A853` | 212, 168, 83 | 강조색 (황토 금색) |
| `--color-accent-hover` | `#C49A47` | 196, 154, 71 | 강조색 호버 |
| `--color-cta` | `#C4553A` | 196, 85, 58 | CTA 버튼/대표 배지 (고춧가루 붉은색) |
| `--color-cta-hover` | `#B34A32` | 179, 74, 50 | CTA 호버 |
| `--color-cta-active` | `#A3402B` | 163, 64, 43 | CTA 활성 |
| `--color-seasonal` | `#6B8E5A` | 107, 142, 90 | 시즌 메뉴 배지 (올리브 그린) |
| `--color-seasonal-hover` | `#5E7E4F` | 94, 126, 79 | 시즌 배지 호버 |
| `--color-border` | `#E7E0D8` | 231, 224, 216 | 카드 테두리/구분선 (연한 모래색) |
| `--color-border-light` | `#F0EBE3` | 240, 235, 227 | 미세 구분선 |

#### 2.1.2 상태 컬러 (영업 상태 배지)

| 토큰명 | HEX | 용도 |
|--------|-----|------|
| `--color-status-open` | `#16A34A` | 영업중 🟢 |
| `--color-status-open-bg` | `#F0FDF4` | 영업중 배지 배경 |
| `--color-status-break` | `#CA8A04` | 브레이크타임 🟡 |
| `--color-status-break-bg` | `#FEFCE8` | 브레이크타임 배지 배경 |
| `--color-status-closed` | `#DC2626` | 마감 🔴 |
| `--color-status-closed-bg` | `#FEF2F2` | 마감 배지 배경 |
| `--color-status-holiday` | `#525252` | 휴무 ⚫ |
| `--color-status-holiday-bg` | `#F5F5F5` | 휴무 배지 배경 |

#### 2.1.3 관리자 페이지 전용 컬러

| 토큰명 | HEX | 용도 |
|--------|-----|------|
| `--color-admin-bg` | `#FAFAFA` | 관리자 배경 |
| `--color-admin-sidebar` | `#1C1C1E` | 사이드바 배경 |
| `--color-admin-success` | `#16A34A` | 저장 성공 |
| `--color-admin-error` | `#DC2626` | 에러/삭제 |
| `--color-admin-warning` | `#F59E0B` | 경고 |

---

### 2.2 타이포그래피

#### 2.2.1 폰트 패밀리

| 토큰명 | 서체 | Fallback | 용도 |
|--------|------|----------|------|
| `--font-display` | `'Nanum Pen Script'` | `cursive` | 식당명/로고 (손글씨 느낌) |
| `--font-heading` | `'Pretendard'` | `'Apple SD Gothic Neo', sans-serif` | 제목 (H1~H3) |
| `--font-body` | `'Pretendard'` | `'Apple SD Gothic Neo', sans-serif` | 본문 텍스트 |
| `--font-quote` | `'KoPub Batang'` | `'Nanum Myeongjo', serif` | 사장님 인용구 |
| `--font-mono` | `'Inter'` | `'Roboto Mono', monospace` | 가격/시간 숫자 |

#### 2.2.2 폰트 크기 스케일

> `rem` 기반, `html { font-size: 16px }` 기준

| 토큰명 | 크기 (rem) | px 환산 | 용도 |
|--------|-----------|---------|------|
| `--text-xs` | 0.75 | 12px | 캡션, 타임스탬프 |
| `--text-sm` | 0.875 | 14px | 보조 텍스트, 배지 |
| `--text-base` | 1 | 16px | 본문 기본 |
| `--text-lg` | 1.125 | 18px | 강조 본문 |
| `--text-xl` | 1.25 | 20px | 소제목 (H4) |
| `--text-2xl` | 1.5 | 24px | 섹션 부제 (H3) |
| `--text-3xl` | 1.875 | 30px | 섹션 제목 (H2) |
| `--text-4xl` | 2.25 | 36px | 페이지 제목 (H1) |
| `--text-5xl` | 3 | 48px | 히어로 식당명 |
| `--text-6xl` | 3.75 | 60px | 히어로 식당명 (데스크탑) |

#### 2.2.3 폰트 굵기

| 토큰명 | 값 | 용도 |
|--------|----|------|
| `--font-regular` | 400 | 본문 |
| `--font-medium` | 500 | 강조 본문 |
| `--font-semibold` | 600 | 소제목 |
| `--font-bold` | 700 | 제목 |

#### 2.2.4 줄 높이

| 토큰명 | 값 | 용도 |
|--------|----|------|
| `--leading-tight` | 1.25 | 제목 |
| `--leading-normal` | 1.5 | 본문 기본 |
| `--leading-relaxed` | 1.75 | 스토리/인용구 |
| `--leading-loose` | 2 | 넓은 줄간격 |

#### 2.2.5 자간

| 토큰명 | 값 | 용도 |
|--------|----|------|
| `--tracking-tight` | -0.01em | 큰 제목 |
| `--tracking-normal` | 0 | 기본 |
| `--tracking-wide` | 0.025em | 배지/라벨 |
| `--tracking-wider` | 0.05em | 대문자 캡션 |

---

### 2.3 공간 (Spacing)

> 4px 기반 스케일. `0.25rem` 단위.

| 토큰명 | 값 | px 환산 |
|--------|----|---------|
| `--space-0` | 0 | 0 |
| `--space-1` | 0.25rem | 4px |
| `--space-2` | 0.5rem | 8px |
| `--space-3` | 0.75rem | 12px |
| `--space-4` | 1rem | 16px |
| `--space-5` | 1.25rem | 20px |
| `--space-6` | 1.5rem | 24px |
| `--space-8` | 2rem | 32px |
| `--space-10` | 2.5rem | 40px |
| `--space-12` | 3rem | 48px |
| `--space-16` | 4rem | 64px |
| `--space-20` | 5rem | 80px |
| `--space-24` | 6rem | 96px |

### 2.4 섹션 간격

| 토큰명 | 모바일 | 태블릿 | 데스크탑 | 용도 |
|--------|--------|--------|----------|------|
| `--section-padding-y` | 3rem | 4rem | 5rem | 섹션 상하 패딩 |
| `--section-padding-x` | 1rem | 2rem | 0 | 섹션 좌우 패딩 |
| `--section-gap` | 0 | 0 | 0 | 섹션 간 간격 (교차 배경이므로 0) |

---

### 2.5 레이아웃

#### 2.5.1 컨테이너

| 토큰명 | 값 | 용도 |
|--------|----|------|
| `--container-max` | 1200px | 최대 콘텐츠 너비 |
| `--container-narrow` | 800px | 좁은 콘텐츠 (스토리 섹션) |
| `--container-padding` | 1rem (모바일) / 2rem (태블릿+) | 좌우 여백 |

#### 2.5.2 반응형 Breakpoint

| 토큰명 | 값 | 대상 |
|--------|----|------|
| `--bp-sm` | 640px | 소형 모바일 분기 |
| `--bp-md` | 768px | 태블릿 분기 |
| `--bp-lg` | 1024px | 데스크탑 분기 |
| `--bp-xl` | 1280px | 대형 데스크탑 |

#### 2.5.3 그리드

| 용도 | 모바일 | 태블릿 | 데스크탑 |
|------|--------|--------|----------|
| 메뉴 카드 (대표) | 1열 | 2열 | 2열 |
| 메뉴 카드 (상시) | 1열 | 2열 | 3열 |
| 기본찬 갤러리 | 가로 스크롤 | 가로 스크롤 | 4열 그리드 |
| 안내 정보 카드 | 1열 | 2열 | 2열 |
| 공지사항 | 1열 | 1열 | 1열 |

---

### 2.6 테두리 및 그림자

#### 2.6.1 Border Radius

| 토큰명 | 값 | 용도 |
|--------|----|------|
| `--radius-sm` | 4px | 인풋, 작은 요소 |
| `--radius-md` | 8px | 버튼, 배지 |
| `--radius-lg` | 12px | 카드 |
| `--radius-xl` | 16px | 큰 카드, 모달 |
| `--radius-full` | 9999px | pill 형태 배지, 아바타 |

#### 2.6.2 Box Shadow

| 토큰명 | 값 | 용도 |
|--------|----|------|
| `--shadow-sm` | `0 1px 2px rgba(28,28,30,0.04)` | 미세한 입체감 |
| `--shadow-md` | `0 2px 8px rgba(28,28,30,0.06)` | 카드 기본 |
| `--shadow-lg` | `0 4px 16px rgba(28,28,30,0.08)` | 카드 호버, 드롭다운 |
| `--shadow-xl` | `0 8px 32px rgba(28,28,30,0.12)` | 모달, 플로팅 버튼 |

#### 2.6.3 Border

| 토큰명 | 값 | 용도 |
|--------|----|------|
| `--border-default` | `1px solid var(--color-border)` | 카드 테두리 |
| `--border-light` | `1px solid var(--color-border-light)` | 미세 구분선 |
| `--border-accent` | `4px solid var(--color-accent)` | 인용구 좌측 라인 |

---

### 2.7 애니메이션

#### 2.7.1 Transition

| 토큰명 | 값 | 용도 |
|--------|----|------|
| `--transition-fast` | `150ms ease` | 색상 변화, 미세 호버 |
| `--transition-normal` | `250ms ease` | 일반 호버, 포커스 |
| `--transition-slow` | `400ms ease` | 섹션 진입, 페이드 |

#### 2.7.2 키프레임 애니메이션

| 이름 | 설명 | 적용 대상 |
|------|------|----------|
| `fadeInUp` | 아래에서 위로 페이드인 (translateY 20px → 0, opacity 0 → 1) | 섹션 진입 시 콘텐츠 |
| `fadeIn` | 단순 페이드인 (opacity 0 → 1) | 페이지 로딩 |
| `slideDown` | 위에서 아래로 슬라이드 (translateY -100% → 0) | 긴급 배너 |
| `bounce` | 반복 바운스 | 스크롤 유도 화살표 |
| `pulse` | 반복 펄스 (opacity 1 → 0.7 → 1) | 영업 상태 도트 |
| `shimmer` | 로딩 스켈레톤 반짝임 | 이미지 로딩 중 |

#### 2.7.3 스크롤 애니메이션

- **트리거**: Intersection Observer API (viewport 진입 시)
- **임계값**: 요소가 20% 이상 보일 때 애니메이션 시작
- **적용 대상**: 각 섹션의 제목, 카드, 타임라인 항목
- **한 번만 실행**: 재스크롤 시 재생하지 않음

---

### 2.8 Z-Index 스케일

| 토큰명 | 값 | 용도 |
|--------|----|------|
| `--z-base` | 0 | 기본 |
| `--z-above` | 10 | 겹침 요소 |
| `--z-sticky` | 100 | 스티키 헤더 (관리자) |
| `--z-banner` | 200 | 긴급 배너 |
| `--z-floating` | 300 | 플로팅 전화 버튼 |
| `--z-overlay` | 400 | 오버레이 배경 |
| `--z-modal` | 500 | 모달/라이트박스 |
| `--z-toast` | 600 | 토스트 알림 |

---

## 3. 컴포넌트 명세

### 3.1 영업 상태 배지 (StatusBadge)

| 속성 | 설명 |
|------|------|
| **변형** | `open`, `break`, `closed`, `holiday` |
| **구조** | 상태 도트(8px 원형) + 상태 텍스트 |
| **레이아웃** | pill 형태, `display: inline-flex`, `align-items: center`, `gap: 6px` |
| **패딩** | `4px 12px` |
| **폰트** | `--font-body`, `--text-sm`, `--font-medium` |
| **테두리** | `border-radius: var(--radius-full)` |
| **도트 애니메이션** | `open` 상태일 때 `pulse` 애니메이션 적용 |

| 상태 | 도트 색상 | 텍스트 | 배경 |
|------|----------|--------|------|
| `open` | `--color-status-open` | "영업중" | `--color-status-open-bg` |
| `break` | `--color-status-break` | "브레이크타임" | `--color-status-break-bg` |
| `closed` | `--color-status-closed` | "오늘 마감" | `--color-status-closed-bg` |
| `holiday` | `--color-status-holiday` | "휴무" | `--color-status-holiday-bg` |

---

### 3.2 카드 (Card)

| 속성 | 값 |
|------|-----|
| **배경** | `--color-bg-secondary` |
| **테두리** | `var(--border-default)` |
| **모서리** | `var(--radius-lg)` |
| **그림자** | `var(--shadow-md)` |
| **그림자 (호버)** | `var(--shadow-lg)` |
| **패딩** | `--space-6` |
| **전환** | `var(--transition-normal)` (box-shadow, transform) |
| **호버 효과** | `transform: translateY(-2px)` + 그림자 확대 |

**변형**:
- `Card.Default` — 안내 정보, 공지사항
- `Card.Menu` — 메뉴 카드 (이미지 상단, 텍스트 하단)
- `Card.MenuSignature` — 대표 메뉴 카드 (큰 사이즈, 배지 포함)
- `Card.SideDish` — 기본찬 카드 (정사각 이미지 + 이름만)

---

### 3.3 버튼 (Button)

#### 3.3.1 변형

| 변형 | 배경 | 텍스트 | 테두리 | 용도 |
|------|------|--------|--------|------|
| `primary` | `--color-cta` | `#FFFFFF` | 없음 | CTA (전화하기, 길찾기) |
| `secondary` | `transparent` | `--color-cta` | `1px solid --color-cta` | 보조 액션 |
| `ghost` | `transparent` | `--color-text-secondary` | 없음 | 더보기, 부가 링크 |
| `admin` | `--color-accent` | `#FFFFFF` | 없음 | 관리자 저장/확인 |
| `danger` | `--color-admin-error` | `#FFFFFF` | 없음 | 관리자 삭제 |

#### 3.3.2 크기

| 크기 | 높이 | 패딩 (좌우) | 폰트 크기 |
|------|------|------------|----------|
| `sm` | 36px | 12px | `--text-sm` |
| `md` | 44px | 16px | `--text-base` |
| `lg` | 52px | 24px | `--text-lg` |

#### 3.3.3 공통 속성

| 속성 | 값 |
|------|-----|
| **모서리** | `var(--radius-md)` |
| **폰트 굵기** | `--font-semibold` |
| **전환** | `var(--transition-fast)` |
| **호버** | 밝기 -8% 어둡게 |
| **Active** | 밝기 -12% 어둡게 |
| **Disabled** | opacity 0.5, cursor not-allowed |
| **포커스** | `outline: 2px solid var(--color-accent)`, `outline-offset: 2px` |

---

### 3.4 배지 (Badge)

| 변형 | 배경 | 텍스트 | 아이콘 | 용도 |
|------|------|--------|--------|------|
| `signature` | `--color-cta` | `#FFFFFF` | 🔥 | 대표 메뉴 |
| `seasonal` | `--color-seasonal` | `#FFFFFF` | 🌿 | 시즌 메뉴 |
| `urgent` | `--color-admin-error` | `#FFFFFF` | ⚠️ | 긴급 공지 |

**공통 속성**: `--radius-full`, 패딩 `4px 10px`, `--text-xs`, `--font-medium`, `--tracking-wide`

---

### 3.5 인용구 블록 (Blockquote)

| 속성 | 값 |
|------|-----|
| **좌측 라인** | `var(--border-accent)` (4px, `--color-accent`) |
| **패딩** | 좌 `--space-6`, 상하 `--space-4` |
| **서체** | `var(--font-quote)` |
| **스타일** | `font-style: italic` |
| **폰트 크기** | `--text-lg` |
| **줄 높이** | `--leading-relaxed` |
| **텍스트 색상** | `--color-text-primary` |
| **배경** | `--color-bg-tertiary` (선택적) |

---

### 3.6 긴급 배너 (UrgentBanner)

| 속성 | 값 |
|------|-----|
| **위치** | 히어로 섹션 최상단, 전체 너비 |
| **배경** | `--color-cta` |
| **텍스트** | `#FFFFFF`, `--text-sm`, `--font-medium` |
| **패딩** | `--space-3` 상하, `--space-4` 좌우 |
| **정렬** | `text-align: center` |
| **진입 애니메이션** | `slideDown` 300ms |
| **닫기** | 우측 X 버튼 (선택적) |
| **아이콘** | ⚠️ 좌측에 표시 |

---

### 3.7 플로팅 전화 버튼 (FloatingCallButton)

| 속성 | 값 |
|------|-----|
| **노출 조건** | 모바일/태블릿 (< 1024px)에서만 표시 |
| **위치** | `position: fixed`, `bottom: 20px`, `right: 20px` |
| **크기** | 56×56px |
| **배경** | `--color-cta` |
| **아이콘** | 📞 (24px, 흰색) |
| **모서리** | `border-radius: 50%` |
| **그림자** | `var(--shadow-xl)` |
| **z-index** | `var(--z-floating)` |
| **호버** | 밝기 -8%, scale(1.05) |
| **Active** | scale(0.95) |

---

### 3.8 타임라인 (Timeline)

| 속성 | 값 |
|------|-----|
| **레이아웃** | 세로 타임라인 (모바일 친화적) |
| **중앙선** | 좌측 `--color-border`, 2px 실선 |
| **노드** | 12px 원형, `--color-accent` 채움 |
| **카드** | 좌측선 우측에 위치, `--space-6` 좌측 마진 |
| **애니메이션** | 스크롤 진입 시 `fadeInUp` 순차 실행 (각 항목 100ms 딜레이) |
| **텍스트 톤** | 세피아 느낌, `--color-text-secondary` 배경 위 `--color-text-primary` |

---

### 3.9 라이트박스 (Lightbox)

| 속성 | 값 |
|------|-----|
| **트리거** | 메뉴/기본찬 이미지 클릭 |
| **오버레이** | `rgba(28,28,30,0.85)` |
| **z-index** | `var(--z-modal)` |
| **이미지** | 최대 `90vw × 90vh`, `object-fit: contain` |
| **닫기** | 우상단 X 버튼 + 오버레이 클릭 + ESC 키 |
| **애니메이션** | `fadeIn` 200ms (진입), `fadeOut` 150ms (퇴장) |
| **접근성** | `role="dialog"`, `aria-modal="true"`, 포커스 트래핑 |

---

### 3.10 네이버 지도 (NaverMap)

| 속성 | 값 |
|------|-----|
| **높이** | 모바일 300px / 태블릿 400px / 데스크탑 450px |
| **너비** | 100% (컨테이너 너비) |
| **마커** | 숙이네국수 위치 마커 (커스텀 아이콘 권장) |
| **줌 레벨** | 기본 16 |
| **모서리** | `var(--radius-lg)` |
| **로딩** | 스켈레톤 + shimmer 애니메이션 |

---

### 3.11 입력 필드 (Input) — 관리자 전용

| 속성 | 값 |
|------|-----|
| **높이** | 44px |
| **테두리** | `1px solid var(--color-border)` |
| **모서리** | `var(--radius-sm)` |
| **포커스** | `border-color: var(--color-accent)`, `box-shadow: 0 0 0 2px rgba(212,168,83,0.2)` |
| **에러** | `border-color: var(--color-admin-error)` |
| **패딩** | `0 --space-3` |
| **폰트** | `--font-body`, `--text-base` |
| **Placeholder** | `--color-text-tertiary` |

---

### 3.12 토스트 알림 (Toast) — 관리자 전용

| 속성 | 값 |
|------|-----|
| **위치** | `position: fixed`, 상단 중앙, `top: 20px` |
| **z-index** | `var(--z-toast)` |
| **배경** | 성공: `--color-admin-success` / 에러: `--color-admin-error` |
| **텍스트** | `#FFFFFF`, `--text-sm` |
| **패딩** | `--space-3` 상하, `--space-6` 좌우 |
| **모서리** | `var(--radius-md)` |
| **지속시간** | 3초 후 자동 사라짐 |
| **진입** | `slideDown` 300ms |
| **퇴장** | `fadeOut` 200ms |

---

### 3.13 스켈레톤 로더 (Skeleton)

| 속성 | 값 |
|------|-----|
| **배경** | `--color-bg-tertiary` |
| **애니메이션** | `shimmer` (좌 → 우 그라데이션 반복) |
| **모서리** | 원본 요소와 동일 |
| **적용 대상** | 이미지 로딩, 텍스트 블록 로딩, 카드 로딩 |

---

### 3.14 확인 다이얼로그 (ConfirmDialog) — 관리자 전용

| 속성 | 값 |
|------|-----|
| **오버레이** | `rgba(28,28,30,0.5)` |
| **z-index** | `var(--z-modal)` |
| **다이얼로그 배경** | `--color-bg-secondary` |
| **너비** | 최대 400px, 좌우 `--space-6` 패딩 |
| **모서리** | `var(--radius-xl)` |
| **그림자** | `var(--shadow-xl)` |
| **제목** | `--font-heading`, `--text-lg`, `--font-bold` |
| **내용** | `--font-body`, `--text-base`, `--color-text-secondary` |
| **버튼 영역** | `display: flex`, `gap: --space-3`, 우측 정렬 |
| **취소 버튼** | Button `secondary` 변형 |
| **확인 버튼** | Button `danger` 변형 (삭제 시) |
| **애니메이션** | `fadeIn` 200ms (진입) |
| **접근성** | `role="alertdialog"`, `aria-modal="true"`, 포커스 트래핑, ESC 키 닫기 |

---

### 3.15 이미지 업로더 (ImageUploader) — 관리자 전용

| 속성 | 값 |
|------|-----|
| **드래그 영역** | 점선 테두리 `2px dashed var(--color-border)`, `var(--radius-lg)` |
| **드래그 영역 크기** | 너비 100%, 높이 160px |
| **드래그 영역 배경** | `--color-bg-tertiary` |
| **드래그 호버** | 테두리 `--color-accent`, 배경 `rgba(212,168,83,0.05)` |
| **안내 텍스트** | "이미지를 끌어다 놓거나 클릭하여 선택하세요", `--color-text-tertiary`, `--text-sm` |
| **안내 아이콘** | `Upload` (Lucide), 32px, `--color-text-tertiary` |
| **미리보기** | 업로드된 이미지 썼네일 120×120px, `object-fit: cover`, `var(--radius-md)` |
| **프로그레스 바** | 높이 4px, 배경 `--color-border`, 채움 `--color-accent`, `var(--radius-full)` |
| **파일 제한 안내** | "5MB 이하, JPG/PNG/WebP", `--color-text-tertiary`, `--text-xs` |

---

### 3.16 토글 스위치 (ToggleSwitch) — 관리자 전용

| 속성 | 값 |
|------|-----|
| **트랙 크기** | 너비 44px, 높이 24px |
| **트랙 배경 (OFF)** | `--color-border` |
| **트랙 배경 (ON)** | `--color-accent` |
| **썸 크기** | 20×20px |
| **썸 배경** | `#FFFFFF` |
| **썸 그림자** | `var(--shadow-sm)` |
| **모서리** | `var(--radius-full)` (트랙, 썸 모두) |
| **전환** | `var(--transition-fast)` |
| **용도** | 메뉴/공지/기본찬 노출 ON/OFF, 대표/시즌 메뉴 토글, 긴급 배너 ON/OFF |
| **레이블** | 좌측 레이블 텍스트, `--text-sm`, `--font-medium` |
| **접근성** | `role="switch"`, `aria-checked` |

---

### 3.17 페이지네이션 (Pagination) — 관리자 전용

| 속성 | 값 |
|------|-----|
| **레이아웃** | `display: flex`, `justify-content: center`, `gap: --space-2` |
| **버튼 크기** | 36×36px |
| **버튼 배경 (기본)** | `transparent` |
| **버튼 배경 (활성)** | `--color-accent` |
| **버튼 텍스트 (기본)** | `--color-text-secondary` |
| **버튼 텍스트 (활성)** | `#FFFFFF` |
| **모서리** | `var(--radius-md)` |
| **폰트** | `--text-sm`, `--font-medium` |
| **네비게이션** | 이전/다음 화살표 + 페이지 번호 |
| **비활성** | 첫/끝 페이지에서 이전/다음 버튼 opacity 0.3 |

---

### 3.18 정렬 가능 리스트 (SortableList) — 관리자 전용

| 속성 | 값 |
|------|-----|
| **드래그 핸들** | `GripVertical` 아이콘, `--color-text-tertiary`, 좌측 위치 |
| **항목 배경** | `--color-bg-secondary` |
| **항목 테두리** | `var(--border-default)` |
| **항목 패딩** | `--space-4` 상하, `--space-4` 좌우 |
| **드래그 중 항목** | `opacity: 0.5`, `box-shadow: var(--shadow-lg)`, `cursor: grabbing` |
| **드록 위치 표시** | 2px 라인, `--color-accent` |
| **간격** | 항목 간 `--space-2` |

---

## 4. 아이콘 시스템

### 4.1 아이콘 소스

- **라이브러리**: Lucide React (MIT 라이선스, 경량, 트리 셰이킹 지원)
- **크기 규격**: 16px (sm) / 20px (md) / 24px (lg) / 32px (xl)

### 4.2 사용 아이콘 매핑

| 용도 | 아이콘 | 크기 |
|------|--------|------|
| 전화 | `Phone` | lg |
| 시간 | `Clock` | md |
| 위치 | `MapPin` | md |
| 주차 | `Car` | md |
| 결제 | `CreditCard` | md |
| 주의 | `AlertTriangle` | md |
| 닫기 | `X` | md |
| 메뉴 (모바일) | `Menu` | lg |
| 외부 링크 | `ExternalLink` | sm |
| 스크롤 화살표 | `ChevronDown` | lg |
| 편집 | `Pencil` | md |
| 삭제 | `Trash2` | md |
| 추가 | `Plus` | md |
| 저장 | `Check` | md |
| 드래그 | `GripVertical` | md |
| 로그아웃 | `LogOut` | md |

---

## 5. 이미지 가이드라인

### 5.1 이미지 비율

| 용도 | 비율 | 설명 |
|------|------|------|
| 히어로 배경 | 16:9 (데스크탑), 9:16 (모바일) | 반응형 이미지 소스셋 |
| 메뉴 카드 (대표) | 4:3 | 음식 사진 최적 비율 |
| 메뉴 카드 (상시) | 1:1 | 정사각 썸네일 |
| 기본찬 카드 | 1:1 | 정사각 |
| 스토리 타임라인 | 자유 | 옛날 사진/일러스트 |

### 5.2 이미지 최적화

| 항목 | 규격 |
|------|------|
| **포맷** | WebP (primary), JPEG (fallback) |
| **목록 썸네일** | 최대 400px 너비, 80% 품질 |
| **상세 (라이트박스)** | 최대 1200px 너비, 90% 품질 |
| **히어로 배경** | 최대 1920px 너비, 85% 품질 |
| **로딩 전략** | 히어로: eager, 나머지: lazy |
| **placeholder** | 블러 해시 또는 dominant color |

---

## 6. 접근성 (Accessibility)

| 항목 | 기준 |
|------|------|
| **색상 대비** | 일반 텍스트 4.5:1, 큰 텍스트 3:1 (WCAG AA) |
| **터치 타겟** | 최소 44×44px |
| **포커스 표시** | 모든 인터랙티브 요소에 가시적 포커스 링 |
| **키보드 네비게이션** | Tab 순서 논리적 유지 |
| **스크린 리더** | 의미 있는 `alt` 텍스트, `aria-label` 적용 |
| **모션 감소** | `prefers-reduced-motion` 미디어 쿼리로 애니메이션 비활성화 지원 |
| **언어** | `<html lang="ko">` |
