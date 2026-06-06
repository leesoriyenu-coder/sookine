-- 1. extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. fn_update_timestamp trigger function
CREATE OR REPLACE FUNCTION fn_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. store_info table
CREATE TABLE store_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'break', 'closed', 'holiday')),
  open_time TIME NOT NULL DEFAULT '11:40',
  break_start TIME NOT NULL DEFAULT '14:00',
  break_end TIME NOT NULL DEFAULT '17:00',
  close_time TIME NOT NULL DEFAULT '20:00',
  last_order TIME DEFAULT '19:30',
  regular_holiday TEXT DEFAULT '매주 일요일',
  phone TEXT NOT NULL DEFAULT '055-742-4472',
  address_road TEXT NOT NULL DEFAULT '경상남도 진주시 신안로 161',
  address_jibun TEXT DEFAULT '진주시 이현동 29-29',
  parking_info TEXT,
  payment_methods TEXT[] DEFAULT '{카드,계좌이체,진주사랑상품권}',
  caution_notes TEXT[],
  slogan TEXT DEFAULT '엄마가 정성스럽게 차려주는 집밥 한 상차림',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- store_info single row constraint
CREATE OR REPLACE FUNCTION fn_prevent_store_info_insert()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM store_info) >= 1 THEN
    RAISE EXCEPTION 'store_info 테이블은 단일 행만 허용합니다.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_store_info_insert
BEFORE INSERT ON store_info
FOR EACH ROW
EXECUTE FUNCTION fn_prevent_store_info_insert();

CREATE TRIGGER trg_update_store_info_timestamp
BEFORE UPDATE ON store_info
FOR EACH ROW
EXECUTE FUNCTION fn_update_timestamp();

-- 4. menus table
CREATE TABLE menus (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  description TEXT,
  image_url TEXT,
  image_path TEXT,
  is_signature BOOLEAN NOT NULL DEFAULT false,
  is_seasonal BOOLEAN NOT NULL DEFAULT false,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  category TEXT NOT NULL DEFAULT 'regular' CHECK (category IN ('signature', 'seasonal', 'regular')),
  note TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_menus_visible_sort ON menus (is_visible, sort_order);
CREATE INDEX idx_menus_category ON menus (category);

CREATE TRIGGER trg_update_menus_timestamp
BEFORE UPDATE ON menus
FOR EACH ROW
EXECUTE FUNCTION fn_update_timestamp();

-- 5. notices table
CREATE TABLE notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_urgent BOOLEAN NOT NULL DEFAULT false,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notices_visible_created ON notices (is_visible, created_at DESC);
CREATE INDEX idx_notices_urgent ON notices (is_urgent) WHERE is_urgent = true AND is_visible = true;

CREATE TRIGGER trg_update_notices_timestamp
BEFORE UPDATE ON notices
FOR EACH ROW
EXECUTE FUNCTION fn_update_timestamp();

-- 6. side_dishes table
CREATE TABLE side_dishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  image_path TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_side_dishes_visible_sort ON side_dishes (is_visible, sort_order);

CREATE TRIGGER trg_update_side_dishes_timestamp
BEFORE UPDATE ON side_dishes
FOR EACH ROW
EXECUTE FUNCTION fn_update_timestamp();

-- 7. admin_sessions table
CREATE TABLE admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_admin_sessions_token ON admin_sessions (session_token);
CREATE INDEX idx_admin_sessions_expires ON admin_sessions (expires_at);

-- 8. Row Level Security (RLS) policies
ALTER TABLE store_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE side_dishes ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

-- Select policies for public read
CREATE POLICY store_info_select_public ON store_info FOR SELECT USING (true);
CREATE POLICY menus_select_public ON menus FOR SELECT USING (is_visible = true);
CREATE POLICY notices_select_public ON notices FOR SELECT USING (is_visible = true);
CREATE POLICY side_dishes_select_public ON side_dishes FOR SELECT USING (is_visible = true);

-- admin_sessions has RLS enabled but no public policies, meaning anonymous users cannot access it.
-- service_role automatically bypasses RLS for all tables.
