import { StoreInfo } from "@/types/store";
import { Menu } from "@/types/menu";
import { Notice } from "@/types/notice";
import { SideDish } from "@/types/side-dish";

// 초기 데이터 정의
const INITIAL_STORE_INFO: StoreInfo = {
  id: "store-info-id",
  status: "open",
  open_time: "11:40",
  break_start: "14:00",
  break_end: "17:00",
  close_time: "20:00",
  last_order: "19:30",
  regular_holiday: "매주 일요일",
  phone: "055-742-4472",
  address_road: "경상남도 진주시 신안로 161",
  address_jibun: "진주시 이현동 29-29",
  parking_info: "전용 주차장은 없습니다. 이현상가 근처 또는 골목 주차를 이용해 주세요. ⚠️ 가게 앞 도로는 주차단속 구간입니다.",
  payment_methods: ["카드", "계좌이체", "진주사랑상품권", "지역화폐"],
  caution_notes: ["재료 소진 시 조기마감 가능", "사장님 혼자 운영 → 반찬 셀프"],
  slogan: "엄마가 정성스럽게 차려주는 집밥 한 상차림",
  created_at: new Date("2026-06-06T00:00:00.000Z").toISOString(),
  updated_at: new Date("2026-06-06T00:00:00.000Z").toISOString(),
};

const INITIAL_MENUS: Menu[] = [
  {
    id: "menu-1",
    name: "갈치조림",
    price: 14000,
    description: "매콤하고 깊은 맛의 특제 양념으로 졸여낸 대표 밥도둑 갈치조림",
    image_url: null,
    image_path: null,
    is_signature: true,
    is_seasonal: false,
    is_visible: true,
    category: "signature",
    note: "2인분부터 주문 · 공기밥 포함",
    sort_order: 1,
    created_at: new Date("2026-06-06T00:00:00.000Z").toISOString(),
    updated_at: new Date("2026-06-06T00:00:00.000Z").toISOString(),
  },
  {
    id: "menu-2",
    name: "두루치기",
    price: 12000,
    description: "불향 가득하고 매콤 달콤하게 볶아낸 국내산 돼지고기 두루치기",
    image_url: null,
    image_path: null,
    is_signature: true,
    is_seasonal: false,
    is_visible: true,
    category: "signature",
    note: "공기밥 포함",
    sort_order: 2,
    created_at: new Date("2026-06-06T00:00:00.000Z").toISOString(),
    updated_at: new Date("2026-06-06T00:00:00.000Z").toISOString(),
  },
  {
    id: "menu-3",
    name: "생멸치쌈밥",
    price: 14000,
    description: "남해안 싱싱한 생멸치를 시래기와 함께 자작하게 끓여낸 쌈밥",
    image_url: null,
    image_path: null,
    is_signature: false,
    is_seasonal: true,
    is_visible: true,
    category: "seasonal",
    note: "2인분부터 주문 · 공기밥 포함",
    sort_order: 3,
    created_at: new Date("2026-06-06T00:00:00.000Z").toISOString(),
    updated_at: new Date("2026-06-06T00:00:00.000Z").toISOString(),
  },
  {
    id: "menu-4",
    name: "동태탕",
    price: 12000,
    description: "시원하고 칼칼한 국물 맛이 일품인 든든한 동태탕",
    image_url: null,
    image_path: null,
    is_signature: false,
    is_seasonal: true,
    is_visible: true,
    category: "seasonal",
    note: "공기밥 포함",
    sort_order: 4,
    created_at: new Date("2026-06-06T00:00:00.000Z").toISOString(),
    updated_at: new Date("2026-06-06T00:00:00.000Z").toISOString(),
  },
  {
    id: "menu-5",
    name: "낙지볶음",
    price: 12000,
    description: "통통한 낙지를 아삭한 채소와 함께 매콤하게 볶아낸 낙지볶음",
    image_url: null,
    image_path: null,
    is_signature: false,
    is_seasonal: false,
    is_visible: true,
    category: "regular",
    note: "공기밥 포함",
    sort_order: 5,
    created_at: new Date("2026-06-06T00:00:00.000Z").toISOString(),
    updated_at: new Date("2026-06-06T00:00:00.000Z").toISOString(),
  },
  {
    id: "menu-6",
    name: "김치찌개",
    price: 12000,
    description: "푹 익은 묵은지와 돼지고기를 아낌없이 넣어 끓인 찌개",
    image_url: null,
    image_path: null,
    is_signature: false,
    is_seasonal: false,
    is_visible: true,
    category: "regular",
    note: "공기밥 포함",
    sort_order: 6,
    created_at: new Date("2026-06-06T00:00:00.000Z").toISOString(),
    updated_at: new Date("2026-06-06T00:00:00.000Z").toISOString(),
  },
  {
    id: "menu-7",
    name: "된장찌개",
    price: 12000,
    description: "구수한 재래식 된장에 신선한 야채와 두부를 넣은 된장찌개",
    image_url: null,
    image_path: null,
    is_signature: false,
    is_seasonal: false,
    is_visible: true,
    category: "regular",
    note: "공기밥 포함",
    sort_order: 7,
    created_at: new Date("2026-06-06T00:00:00.000Z").toISOString(),
    updated_at: new Date("2026-06-06T00:00:00.000Z").toISOString(),
  },
];

const INITIAL_SIDE_DISHES: SideDish[] = [
  {
    id: "side-1",
    name: "오징어초무침",
    description: "새콤달콤한 양념에 쫄깃한 오징어와 야채를 무친 반찬",
    image_url: null,
    image_path: null,
    sort_order: 1,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "side-2",
    name: "데친알배추",
    description: "달큰한 알배추를 가볍게 데쳐 젓갈과 함께 먹는 쌈찬",
    image_url: null,
    image_path: null,
    sort_order: 2,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "side-3",
    name: "갈치속젓",
    description: "구수하고 깊은 바다향이 나는 감칠맛 가득한 갈치속젓",
    image_url: null,
    image_path: null,
    sort_order: 3,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "side-4",
    name: "토란국",
    description: "부드러운 토란을 넣어 삼삼하고 시원하게 끓여낸 맑은 국",
    image_url: null,
    image_path: null,
    sort_order: 4,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "side-5",
    name: "방아부추전",
    description: "진한 방아잎 향과 쫄깃한 반죽이 매력적인 부추전",
    image_url: null,
    image_path: null,
    sort_order: 5,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "side-6",
    name: "나물류",
    description: "새벽 시장에서 공수한 신선한 계절 채소 나물 무침",
    image_url: null,
    image_path: null,
    sort_order: 6,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "side-7",
    name: "생선구이",
    description: "겉은 바삭하고 속은 촉촉하게 구워낸 고소한 생선구이",
    image_url: null,
    image_path: null,
    sort_order: 7,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "side-8",
    name: "과일사라다",
    description: "달콤한 마요네즈 소스에 신선한 사과와 사라다 채소를 버무린 찬",
    image_url: null,
    image_path: null,
    sort_order: 8,
    is_visible: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const INITIAL_NOTICES: Notice[] = [
  {
    id: "notice-1",
    title: "풍자 또간집 진주편 방영 안내 및 주차 유의사항",
    content: "안녕하세요, 숙이네국수입니다. 유튜브 또간집 방영 이후 많은 고객님들께서 저희 매장을 방문해주셔서 대단히 감사드립니다.\n\n저희 가게는 사장님 혼자 운영하시는 작은 노포 식당으로, 별도의 전용 주차장이 마련되어 있지 않습니다. 이현상가 주변 혹은 인근 골목의 안전한 곳에 주차를 부탁드립니다.\n\n⚠️ 특히 매장 앞 도로변은 상시 불법 주정차 단속 구간이오니 과태료가 부과되지 않도록 각별히 유의해주시기 바랍니다.\n\n앞으로도 매 순간 정성스럽고 따뜻한 집밥 한 상차림으로 보답하겠습니다. 대단히 감사합니다.",
    is_urgent: false,
    is_visible: true,
    created_at: new Date("2026-06-05T12:00:00.000Z").toISOString(),
    updated_at: new Date("2026-06-05T12:00:00.000Z").toISOString(),
  },
  {
    id: "notice-2",
    title: "6월 정기 휴무일 안내",
    content: "안녕하세요, 숙이네국수입니다. 6월 정기 휴무일 관련 안내를 드립니다.\n\n저희 숙이네국수는 [매주 일요일] 정기 휴무입니다.\n\n출장이나 재료 소진 등으로 인한 비정기 임시 휴무가 있을 시에는 매 홈페이지 상단의 긴급 띠 배너를 통해 실시간으로 안내해 드릴 예정입니다.\n\n고객님들의 헛걸음을 최소화하기 위해 방문하시기 전에 미리 매장 전화(055-742-4472)로 확인 전화를 주시면 더욱 좋습니다.\n\n건강한 6월 보내시길 바랍니다. 감사합니다.",
    is_urgent: false,
    is_visible: true,
    created_at: new Date("2026-06-01T09:00:00.000Z").toISOString(),
    updated_at: new Date("2026-06-01T09:00:00.000Z").toISOString(),
  },
];

// 메모리 데이터 세션 (SSR 서버 환경용)
let memoryStoreInfo = { ...INITIAL_STORE_INFO };
let memoryMenus = [...INITIAL_MENUS];
let memorySideDishes = [...INITIAL_SIDE_DISHES];
let memoryNotices = [...INITIAL_NOTICES];
let memorySessionToken = "";

const KEYS = {
  STORE_INFO: "sookine_store_info",
  MENUS: "sookine_menus",
  SIDE_DISHES: "sookine_side_dishes",
  NOTICES: "sookine_notices",
  SESSION_TOKEN: "sookine_session_token",
};

// localStorage 사용 가능 여부 체크
const isClient = typeof window !== "undefined";

function getLocalStorage<T>(key: string, fallback: T): T {
  if (!isClient) return fallback;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(error);
    return fallback;
  }
}

function setLocalStorage<T>(key: string, value: T) {
  if (!isClient) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    // 타 탭/페이지에 상태 반영을 위한 스토리지 이벤트 수동 발송
    window.dispatchEvent(new Event("storage"));
  } catch (error) {
    console.error(error);
  }
}

export const mockStorage = {
  getStoreInfo(): StoreInfo {
    if (isClient) {
      return getLocalStorage<StoreInfo>(KEYS.STORE_INFO, INITIAL_STORE_INFO);
    }
    return memoryStoreInfo;
  },

  saveStoreInfo(info: StoreInfo): StoreInfo {
    const updated = { ...info, updated_at: new Date().toISOString() };
    if (isClient) {
      setLocalStorage(KEYS.STORE_INFO, updated);
    } else {
      memoryStoreInfo = updated;
    }
    return updated;
  },

  getMenus(): Menu[] {
    if (isClient) {
      return getLocalStorage<Menu[]>(KEYS.MENUS, INITIAL_MENUS).sort((a, b) => a.sort_order - b.sort_order);
    }
    return memoryMenus.sort((a, b) => a.sort_order - b.sort_order);
  },

  saveMenus(menus: Menu[]): Menu[] {
    if (isClient) {
      setLocalStorage(KEYS.MENUS, menus);
    } else {
      memoryMenus = menus;
    }
    return menus;
  },

  getSideDishes(): SideDish[] {
    if (isClient) {
      return getLocalStorage<SideDish[]>(KEYS.SIDE_DISHES, INITIAL_SIDE_DISHES).sort((a, b) => a.sort_order - b.sort_order);
    }
    return memorySideDishes.sort((a, b) => a.sort_order - b.sort_order);
  },

  saveSideDishes(sides: SideDish[]): SideDish[] {
    if (isClient) {
      setLocalStorage(KEYS.SIDE_DISHES, sides);
    } else {
      memorySideDishes = sides;
    }
    return sides;
  },

  getNotices(): Notice[] {
    if (isClient) {
      return getLocalStorage<Notice[]>(KEYS.NOTICES, INITIAL_NOTICES).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }
    return memoryNotices.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  saveNotices(notices: Notice[]): Notice[] {
    if (isClient) {
      setLocalStorage(KEYS.NOTICES, notices);
    } else {
      memoryNotices = notices;
    }
    return notices;
  },

  getSessionToken(): string {
    if (isClient) {
      return window.localStorage.getItem(KEYS.SESSION_TOKEN) || "";
    }
    return memorySessionToken;
  },

  saveSessionToken(token: string) {
    if (isClient) {
      if (token) {
        window.localStorage.setItem(KEYS.SESSION_TOKEN, token);
      } else {
        window.localStorage.removeItem(KEYS.SESSION_TOKEN);
      }
    } else {
      memorySessionToken = token;
    }
  }
};
