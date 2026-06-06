export type StoreStatus = "open" | "break" | "closed" | "holiday";

export interface StoreInfo {
  id: string;
  status: StoreStatus;
  open_time: string;
  break_start: string;
  break_end: string;
  close_time: string;
  last_order: string | null;
  regular_holiday: string | null;
  phone: string;
  address_road: string;
  address_jibun: string | null;
  parking_info: string | null;
  payment_methods: string[];
  caution_notes: string[];
  slogan: string | null;
  created_at: string;
  updated_at: string;
}
