export interface SideDish {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  image_path: string | null;
  sort_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface SideDishFormData {
  name: string;
  description: string;
  image_url: string;
  image_path: string;
  sort_order: number;
  is_visible: boolean;
}
