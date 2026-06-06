"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/useToast";
import { getStoreInfo } from "@/lib/api/store";
import { updateStoreInfo } from "@/lib/admin-api/store";
import { revalidatePaths } from "@/lib/admin-api/revalidate";
import { StoreInfo, StoreStatus } from "@/types/store";
import { Button } from "@/components/common/Button/Button";
import { Card } from "@/components/common/Card/Card";
import styles from "../admin.module.css";
import { Plus, Trash2, Save, RefreshCw } from "lucide-react";

export default function AdminStoreInfoPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 매장 정보 상태 필드
  const [status, setStatus] = useState<StoreStatus>("open");
  const [openTime, setOpenTime] = useState("11:40");
  const [breakStart, setBreakStart] = useState("14:00");
  const [breakEnd, setBreakEnd] = useState("17:00");
  const [closeTime, setCloseTime] = useState("20:00");
  const [lastOrder, setLastOrder] = useState("19:30");
  const [regularHoliday, setRegularHoliday] = useState("매주 일요일");
  const [phone, setPhone] = useState("055-742-4472");
  const [addressRoad, setAddressRoad] = useState("경상남도 진주시 신안로 161");
  const [addressJibun, setAddressJibun] = useState("진주시 이현동 29-29");
  const [parkingInfo, setParkingInfo] = useState("");
  const [slogan, setSlogan] = useState("");
  
  // 동적 배열 폼 상태 (결제 수단, 유의사항)
  const [paymentMethods, setPaymentMethods] = useState<string[]>([]);
  const [newPayment, setNewPayment] = useState("");
  
  const [cautionNotes, setCautionNotes] = useState<string[]>([]);
  const [newCaution, setNewCaution] = useState("");

  // 1. 인증 체크
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // 2. 데이터 조회
  const loadData = async () => {
    setLoading(true);
    try {
      const info = await getStoreInfo();
      if (info) {
        setStatus(info.status);
        setOpenTime(info.open_time);
        setBreakStart(info.break_start);
        setBreakEnd(info.break_end);
        setCloseTime(info.close_time);
        setLastOrder(info.last_order || "");
        setRegularHoliday(info.regular_holiday || "");
        setPhone(info.phone);
        setAddressRoad(info.address_road);
        setAddressJibun(info.address_jibun || "");
        setParkingInfo(info.parking_info || "");
        setSlogan(info.slogan || "");
        setPaymentMethods(info.payment_methods || []);
        setCautionNotes(info.caution_notes || []);
      }
    } catch (e) {
      showToast("매장 정보를 불러오지 못했습니다.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // 3. 결제 수단 추가/삭제
  const addPaymentMethod = () => {
    if (!newPayment.trim()) return;
    if (paymentMethods.includes(newPayment.trim())) {
      showToast("이미 등록된 결제 수단입니다.", "error");
      return;
    }
    setPaymentMethods([...paymentMethods, newPayment.trim()]);
    setNewPayment("");
  };

  const removePaymentMethod = (index: number) => {
    setPaymentMethods(paymentMethods.filter((_, idx) => idx !== index));
  };

  // 4. 유의사항 추가/삭제
  const addCautionNote = () => {
    if (!newCaution.trim()) return;
    if (cautionNotes.includes(newCaution.trim())) {
      showToast("이미 등록된 유의사항입니다.", "error");
      return;
    }
    setCautionNotes([...cautionNotes, newCaution.trim()]);
    setNewCaution("");
  };

  const removeCautionNote = (index: number) => {
    setCautionNotes(cautionNotes.filter((_, idx) => idx !== index));
  };

  // 5. 전체 저장
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!openTime || !closeTime || !phone || !addressRoad) {
      showToast("필수 항목(* 표시)을 모두 채워주세요.", "error");
      return;
    }

    // 5.1 전화번호 유효성 검사 (하이픈 포함 여부 및 국번 체크)
    const phoneRegex = /^(0[2-8][0-9]?|01[016789]|050[2-8]|070|080)-[0-9]{3,4}-[0-9]{4}$/;
    if (!phoneRegex.test(phone)) {
      showToast("올바른 전화번호 형식으로 입력해 주세요. (예: 055-742-4472)", "error");
      return;
    }

    // 5.2 영업/휴게 시간 관계 유효성 검사
    const toMinutes = (timeStr: string) => {
      if (!timeStr) return 0;
      const [h, m] = timeStr.split(":").map(Number);
      return h * 60 + m;
    };

    const openMin = toMinutes(openTime);
    const closeMin = toMinutes(closeTime);
    const breakStartMin = toMinutes(breakStart);
    const breakEndMin = toMinutes(breakEnd);

    if (closeMin <= openMin) {
      showToast("마감 시간은 오픈 시간보다 늦어야 합니다.", "error");
      return;
    }

    if (breakStartMin < openMin || breakStartMin > closeMin) {
      showToast("쉬는 시간 시작은 영업 시간(오픈 ~ 마감) 내에 있어야 합니다.", "error");
      return;
    }

    if (breakEndMin < openMin || breakEndMin > closeMin) {
      showToast("쉬는 시간 종료는 영업 시간(오픈 ~ 마감) 내에 있어야 합니다.", "error");
      return;
    }

    if (breakEndMin <= breakStartMin) {
      showToast("쉬는 시간 종료는 시작 시간보다 늦어야 합니다.", "error");
      return;
    }

    setSaving(true);
    
    const payload: Partial<StoreInfo> = {
      status,
      open_time: openTime,
      break_start: breakStart,
      break_end: breakEnd,
      close_time: closeTime,
      last_order: lastOrder || null,
      regular_holiday: regularHoliday || null,
      phone,
      address_road: addressRoad,
      address_jibun: addressJibun || null,
      parking_info: parkingInfo || null,
      slogan: slogan || null,
      payment_methods: paymentMethods,
      caution_notes: cautionNotes,
    };

    const res = await updateStoreInfo(payload);
    if (res.success) {
      showToast("매장 기본 설정이 성공적으로 저장되었습니다.", "success");
      await revalidatePaths(["/"]);
    } else {
      showToast(res.error?.message || "저장 실패", "error");
    }
    setSaving(false);
  };

  // 엔터 입력에 의한 의도치 않은 전체 폼 저장 방지
  const handleFormKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    const target = e.target as HTMLElement;
    if (e.key === "Enter" && target.tagName === "INPUT") {
      e.preventDefault();
    }
  };

  if (authLoading || !isAuthenticated) return null;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>매장 정보 및 기본 설정</h1>
        <Button variant="secondary" onClick={loadData} disabled={loading || saving}>
          <RefreshCw size={16} style={{ marginRight: "6px" }} />
          새로고침
        </Button>
      </div>

      {loading ? (
        <div style={{ padding: "40px", textAlign: "center", color: "var(--color-text-secondary)" }}>
          매장 기본 정보를 불러오는 중...
        </div>
      ) : (
        <form 
          onSubmit={handleSave} 
          onKeyDown={handleFormKeyDown}
          style={{ display: "flex", flexDirection: "column", gap: "24px" }}
        >
          
          {/* 1. 기본 인포 카드 (전화번호, 주소, 슬로건) */}
          <Card>
            <h3 style={{ fontSize: "var(--text-base)", fontWeight: "var(--font-bold)", marginBottom: "16px", color: "var(--color-cta)" }}>
              📍 매장 기본 연락 정보
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className={styles.formGroup}>
                <label className={styles.label}>슬로건 (메인화면 상단 노출)</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={slogan} 
                  onChange={(e) => setSlogan(e.target.value)} 
                  placeholder="예: 엄마가 정성스럽게 차려주는 집밥 한 상차림"
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>매장 전화번호 *</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>도로명 주소 *</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={addressRoad} 
                  onChange={(e) => setAddressRoad(e.target.value)} 
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>지번 주소</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={addressJibun} 
                  onChange={(e) => setAddressJibun(e.target.value)} 
                />
              </div>
            </div>
          </Card>

          {/* 2. 영업 및 휴게 시간 (Time Input 사용) */}
          <Card>
            <h3 style={{ fontSize: "var(--text-base)", fontWeight: "var(--font-bold)", marginBottom: "16px", color: "var(--color-cta)" }}>
              ⏰ 매장 운영 시간 설정
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
              <div className={styles.formGroup}>
                <label className={styles.label}>영업 개시 시간 (오픈) *</label>
                <input 
                  type="time" 
                  className={styles.input} 
                  value={openTime} 
                  onChange={(e) => setOpenTime(e.target.value)} 
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>브레이크타임 시작 *</label>
                <input 
                  type="time" 
                  className={styles.input} 
                  value={breakStart} 
                  onChange={(e) => setBreakStart(e.target.value)} 
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>브레이크타임 종료 *</label>
                <input 
                  type="time" 
                  className={styles.input} 
                  value={breakEnd} 
                  onChange={(e) => setBreakEnd(e.target.value)} 
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>라스트오더 시간</label>
                <input 
                  type="time" 
                  className={styles.input} 
                  value={lastOrder} 
                  onChange={(e) => setLastOrder(e.target.value)} 
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>영업 마감 시간 *</label>
                <input 
                  type="time" 
                  className={styles.input} 
                  value={closeTime} 
                  onChange={(e) => setCloseTime(e.target.value)} 
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>정기 휴무일 안내 문구</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={regularHoliday} 
                  onChange={(e) => setRegularHoliday(e.target.value)} 
                  placeholder="예: 매주 일요일"
                />
              </div>
            </div>
          </Card>

          {/* 3. 주차 및 안내 카드 */}
          <Card>
            <h3 style={{ fontSize: "var(--text-base)", fontWeight: "var(--font-bold)", marginBottom: "16px", color: "var(--color-cta)" }}>
              🚗 주차 정보 안내
            </h3>
            <div className={styles.formGroup} style={{ margin: 0 }}>
              <label className={styles.label}>주차 상세 설명</label>
              <textarea 
                className={styles.input} 
                style={{ height: "80px", padding: "10px", resize: "vertical" }}
                value={parkingInfo} 
                onChange={(e) => setParkingInfo(e.target.value)} 
                placeholder="예: 전용 주차장은 없습니다. 이현상가 근처 골목 주차를 이용해 주세요."
              />
            </div>
          </Card>

          {/* 4. 동적 목록 (결제 방식 및 유의사항) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            {/* 결제 방식 */}
            <Card style={{ display: "flex", flexDirection: "column" }}>
              <h3 style={{ fontSize: "var(--text-base)", fontWeight: "var(--font-bold)", marginBottom: "16px", color: "var(--color-cta)" }}>
                💳 결제 수단 관리
              </h3>
              
              <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={newPayment} 
                  onChange={(e) => setNewPayment(e.target.value)} 
                  placeholder="예: 진주사랑상품권"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPaymentMethod())}
                />
                <Button type="button" variant="secondary" onClick={addPaymentMethod}>
                  <Plus size={16} />
                </Button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", flexGrow: 1 }}>
                {paymentMethods.length === 0 ? (
                  <p style={{ fontSize: "12px", color: "var(--color-text-tertiary)", textAlign: "center", padding: "12px 0" }}>
                    등록된 결제 수단이 없습니다.
                  </p>
                ) : (
                  paymentMethods.map((method, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 12px", backgroundColor: "var(--color-bg-primary)", borderRadius: "6px" }}>
                      <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-medium)" }}>{method}</span>
                      <button 
                        type="button" 
                        onClick={() => removePaymentMethod(idx)} 
                        style={{ color: "var(--color-admin-error)", cursor: "pointer" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* 이용 유의사항 */}
            <Card style={{ display: "flex", flexDirection: "column" }}>
              <h3 style={{ fontSize: "var(--text-base)", fontWeight: "var(--font-bold)", marginBottom: "16px", color: "var(--color-cta)" }}>
                ⚠️ 매장 이용 유의사항
              </h3>
              
              <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={newCaution} 
                  onChange={(e) => setNewCaution(e.target.value)} 
                  placeholder="예: 반찬 셀프 운영"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCautionNote())}
                />
                <Button type="button" variant="secondary" onClick={addCautionNote}>
                  <Plus size={16} />
                </Button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", flexGrow: 1 }}>
                {cautionNotes.length === 0 ? (
                  <p style={{ fontSize: "12px", color: "var(--color-text-tertiary)", textAlign: "center", padding: "12px 0" }}>
                    등록된 유의사항이 없습니다.
                  </p>
                ) : (
                  cautionNotes.map((note, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 12px", backgroundColor: "var(--color-bg-primary)", borderRadius: "6px" }}>
                      <span style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-medium)" }}>{note}</span>
                      <button 
                        type="button" 
                        onClick={() => removeCautionNote(idx)} 
                        style={{ color: "var(--color-admin-error)", cursor: "pointer" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px", marginBottom: "40px" }}>
            <Button 
              type="submit" 
              variant="admin" 
              loading={saving}
              style={{ width: "200px" }}
            >
              <Save size={16} style={{ marginRight: "8px" }} />
              기본 설정 저장하기
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
