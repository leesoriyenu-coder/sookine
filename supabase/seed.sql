-- 1. Insert store_info initial data
INSERT INTO store_info (
  status,
  open_time,
  break_start,
  break_end,
  close_time,
  last_order,
  regular_holiday,
  phone,
  address_road,
  address_jibun,
  parking_info,
  payment_methods,
  caution_notes,
  slogan
) VALUES (
  'open',
  '11:40',
  '14:00',
  '17:00',
  '20:00',
  '19:30',
  '매주 일요일',
  '055-742-4472',
  '경상남도 진주시 신안로 161',
  '진주시 이현동 29-29',
  '전용 주차장은 없습니다. 이현상가 근처 또는 골목 주차를 이용해 주세요. ⚠️ 가게 앞 도로는 주차단속 구간입니다.',
  '{카드,계좌이체,진주사랑상품권,지역화폐}',
  '{재료 소진 시 조기마감 가능,사장님 혼자 운영 → 반찬 셀프}',
  '엄마가 정성스럽게 차려주는 집밥 한 상차림'
);

-- 2. Insert menus initial data
INSERT INTO menus (name, price, category, is_signature, is_seasonal, note, sort_order) VALUES
('갈치조림', 14000, 'signature', true, false, '2인분부터 주문 · 공기밥 포함', 1),
('두루치기', 12000, 'signature', true, false, '공기밥 포함', 2),
('생멸치쌈밥', 14000, 'seasonal', false, true, '2인분부터 주문 · 공기밥 포함', 3),
('동태탕', 12000, 'seasonal', false, true, '공기밥 포함', 4),
('낙지볶음', 12000, 'regular', false, false, '공기밥 포함', 5),
('김치찌개', 12000, 'regular', false, false, '공기밥 포함', 6),
('된장찌개', 12000, 'regular', false, false, '공기밥 포함', 7);

-- 3. Insert side_dishes initial data
INSERT INTO side_dishes (name, sort_order) VALUES
('오징어초무침', 1),
('데친알배추', 2),
('갈치속젓', 3),
('토란국', 4),
('방아부추전', 5),
('나물류', 6),
('생선구이', 7),
('과일사라다', 8);
