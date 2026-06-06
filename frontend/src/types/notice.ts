export interface Notice {
  id: string;
  title: string;
  content: string;
  is_urgent: boolean;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface NoticeFormData {
  title: string;
  content: string;
  is_urgent: boolean;
  is_visible: boolean;
}
