export type MenuCategory = "signature" | "seasonal" | "regular";

export interface Menu {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
  image_path: string | null;
  is_signature: boolean;
  is_seasonal: boolean;
  is_visible: boolean;
  category: MenuCategory;
  note: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface GroupedMenus {
  signature: Menu[];
  seasonal: Menu[];
  regular: Menu[];
}

export interface MenuFormData {
  name: string;
  price: number;
  description: string;
  image_url: string;
  image_path: string;
  is_signature: boolean;
  is_seasonal: boolean;
  is_visible: boolean;
  category: MenuCategory;
  note: string;
  sort_order: number;
}
