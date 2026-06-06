"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/useToast";
import { 
  adminGetMenus, 
  createMenu, 
  updateMenu, 
  deleteMenu, 
  reorderMenus 
} from "@/lib/admin-api/menus";
import { uploadImage } from "@/lib/admin-api/upload";
import { revalidatePaths } from "@/lib/admin-api/revalidate";
import { Menu, MenuCategory } from "@/types/menu";
import { Button } from "@/components/common/Button/Button";
import { Card } from "@/components/common/Card/Card";
import { Badge } from "@/components/common/Badge/Badge";
import styles from "../admin.module.css";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Upload, 
  Image as ImageIcon,
  X 
} from "lucide-react";

export default function AdminMenusPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 폼 및 모달 상태
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<MenuCategory>("regular");
  const [note, setNote] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [isSignature, setIsSignature] = useState(false);
  const [isSeasonal, setIsSeasonal] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  
  const [uploading, setUploading] = useState(false);

  // 삭제 확인 다이얼로그 상태
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // 1. 인증 체크
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // 2. 데이터 조회
  const fetchMenus = async () => {
    setLoading(true);
    const res = await adminGetMenus();
    if (res.success && res.data) {
      setMenus(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMenus();
    }
  }, [isAuthenticated]);

  // 3. 폼 초기화
  const resetForm = () => {
    setEditingMenu(null);
    setName("");
    setPrice("");
    setDescription("");
    setCategory("regular");
    setNote("");
    setImageUrl("");
    setImagePath("");
    setIsSignature(false);
    setIsSeasonal(false);
    setIsVisible(true);
  };

  // 4. 추가/수정 모달 열기
  const openFormModal = (menu: Menu | null = null) => {
    resetForm();
    if (menu) {
      setEditingMenu(menu);
      setName(menu.name);
      setPrice(menu.price);
      setDescription(menu.description || "");
      setCategory(menu.category);
      setNote(menu.note || "");
      setImageUrl(menu.image_url || "");
      setImagePath(menu.image_path || "");
      setIsSignature(menu.is_signature);
      setIsSeasonal(menu.is_seasonal);
      setIsVisible(menu.is_visible);
    }
    setIsFormOpen(true);
  };

  // 5. 카테고리 변경 시 플래그 연동 규칙
  const handleCategoryChange = (cat: MenuCategory) => {
    setCategory(cat);
    if (cat === "signature") {
      setIsSignature(true);
      setIsSeasonal(false);
    } else if (cat === "seasonal") {
      setIsSignature(false);
      setIsSeasonal(true);
    } else {
      setIsSignature(false);
      setIsSeasonal(false);
    }
  };

  // 6. 이미지 업로드 처리
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 6.1 클라이언트단 사전 유효성 검사 (5MB 제한 및 포맷 확인)
    if (file.size > 5 * 1024 * 1024) {
      showToast("이미지 크기는 최대 5MB를 초과할 수 없습니다.", "error");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      showToast("JPG, PNG, WebP 형식의 이미지만 업로드 가능합니다.", "error");
      return;
    }

    setUploading(true);
    const res = await uploadImage(file, "menu-images");
    if (res.success && res.data) {
      setImageUrl(res.data.url);
      setImagePath(res.data.path);
      showToast("이미지가 업로드되었습니다.", "success");
    } else {
      showToast(res.error?.message || "이미지 업로드 실패", "error");
    }
    setUploading(false);
  };

  // 7. 폼 제출 (저장)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price === "") {
      showToast("메뉴명과 가격은 필수 입력 항목입니다.", "error");
      return;
    }

    const payload = {
      name,
      price: Number(price),
      description: description || null,
      image_url: imageUrl || null,
      image_path: imagePath || null,
      is_signature: isSignature,
      is_seasonal: isSeasonal,
      is_visible: isVisible,
      category,
      note: note || null,
      sort_order: editingMenu ? editingMenu.sort_order : menus.length + 1,
    };

    let res;
    if (editingMenu) {
      res = await updateMenu(editingMenu.id, payload);
    } else {
      res = await createMenu(payload);
    }

    if (res.success) {
      showToast(editingMenu ? "메뉴 정보가 수정되었습니다." : "새 메뉴가 등록되었습니다.", "success");
      setIsFormOpen(false);
      resetForm();
      fetchMenus();
      await revalidatePaths(["/"]);
    } else {
      showToast(res.error?.message || "저장 실패", "error");
    }
  };

  // 8. 노출 여부 바로 변경 (토글 스위치)
  const handleToggleVisible = async (menu: Menu) => {
    const nextVal = !menu.is_visible;
    const res = await updateMenu(menu.id, { is_visible: nextVal });
    if (res.success) {
      showToast(`[${menu.name}] 노출 상태가 변경되었습니다.`, "success");
      fetchMenus();
      await revalidatePaths(["/"]);
    }
  };

  // 9. 순서 변경 처리 (Up/Down)
  const handleMove = async (index: number, direction: "up" | "down") => {
    const newMenus = [...menus];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newMenus.length) return;

    // Swap sort_order
    const tempOrder = newMenus[index].sort_order;
    newMenus[index].sort_order = newMenus[targetIdx].sort_order;
    newMenus[targetIdx].sort_order = tempOrder;

    // API 호출을 위한 매핑 생성
    const reorderPayload = [
      { id: newMenus[index].id, sort_order: newMenus[index].sort_order },
      { id: newMenus[targetIdx].id, sort_order: newMenus[targetIdx].sort_order }
    ];

    const res = await reorderMenus(reorderPayload);
    if (res.success) {
      showToast("메뉴 순서가 조정되었습니다.", "success");
      fetchMenus();
      await revalidatePaths(["/"]);
    } else {
      showToast("순서 변경 실패", "error");
    }
  };

  // 10. 삭제 확정 처리
  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;

    const res = await deleteMenu(deleteTargetId);
    if (res.success) {
      showToast("메뉴가 정상적으로 삭제되었습니다.", "success");
      setDeleteTargetId(null);
      fetchMenus();
      await revalidatePaths(["/"]);
    } else {
      showToast(res.error?.message || "삭제 실패", "error");
    }
  };

  if (authLoading || !isAuthenticated) return null;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>차림표(메뉴) 관리</h1>
        <Button variant="admin" onClick={() => openFormModal()}>
          <Plus size={16} style={{ marginRight: "6px" }} />
          새 메뉴 등록
        </Button>
      </div>

      {/* 메뉴 리스트 테이블/카드 */}
      <Card style={{ padding: 0, overflow: "visible" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--color-text-secondary)" }}>
            메뉴 목록을 가져오는 중...
          </div>
        ) : menus.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--color-text-secondary)" }}>
            등록된 메뉴가 없습니다. 우상단 버튼을 눌러 새 메뉴를 등록하세요.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "var(--text-sm)" }}>
              <thead>
                <tr style={{ backgroundColor: "var(--color-bg-tertiary)", borderBottom: "var(--border-default)" }}>
                  <th style={{ padding: "12px 16px", width: "80px", textAlign: "center" }}>순서</th>
                  <th style={{ padding: "12px 16px", width: "80px" }}>사진</th>
                  <th style={{ padding: "12px 16px" }}>메뉴명</th>
                  <th style={{ padding: "12px 16px", width: "100px" }}>분류</th>
                  <th style={{ padding: "12px 16px", width: "120px" }}>가격(원)</th>
                  <th style={{ padding: "12px 16px", width: "150px", textAlign: "center" }}>홈페이지 노출</th>
                  <th style={{ padding: "12px 16px", width: "150px", textAlign: "center" }}>관리</th>
                </tr>
              </thead>
              <tbody>
                {menus.map((menu, index) => (
                  <tr 
                    key={menu.id} 
                    style={{ 
                      borderBottom: "var(--border-default)", 
                      opacity: menu.is_visible ? 1 : 0.6,
                      backgroundColor: menu.is_visible ? "transparent" : "#fbfbfc"
                    }}
                  >
                    {/* 순서 변경 버튼 */}
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      <div style={{ display: "flex", justifyContent: "center", gap: "4px" }}>
                        <button 
                          onClick={() => handleMove(index, "up")} 
                          disabled={index === 0}
                          style={{ padding: "2px", opacity: index === 0 ? 0.3 : 1, cursor: index === 0 ? "default" : "pointer" }}
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button 
                          onClick={() => handleMove(index, "down")} 
                          disabled={index === menus.length - 1}
                          style={{ padding: "2px", opacity: index === menus.length - 1 ? 0.3 : 1, cursor: index === menus.length - 1 ? "default" : "pointer" }}
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>
                    </td>
                    
                    {/* 썸네일 */}
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ width: "44px", height: "44px", borderRadius: "6px", backgroundColor: "var(--color-bg-tertiary)", overflow: "hidden", display: "flex", alignItems: "center", justifyItems: "center" }}>
                        {menu.image_url ? (
                          <img src={menu.image_url} alt={menu.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <ImageIcon size={16} style={{ margin: "auto", color: "var(--color-text-tertiary)" }} />
                        )}
                      </div>
                    </td>

                    {/* 메뉴명 및 비고 */}
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontWeight: "var(--font-bold)", display: "flex", alignItems: "center", gap: "8px" }}>
                        {menu.name}
                        {menu.is_signature && <Badge variant="signature">대표</Badge>}
                        {menu.is_seasonal && <Badge variant="seasonal">시즌</Badge>}
                      </div>
                      {menu.note && <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginTop: "2px" }}>비고: {menu.note}</div>}
                    </td>

                    {/* 카테고리 명칭 */}
                    <td style={{ padding: "12px 16px" }}>
                      {menu.category === "signature" && "대표 식사"}
                      {menu.category === "seasonal" && "시즌 한정"}
                      {menu.category === "regular" && "상시 식사"}
                    </td>

                    {/* 가격 */}
                    <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", fontWeight: "var(--font-bold)" }}>
                      {menu.price.toLocaleString()}
                    </td>

                    {/* 노출 여부 토글 */}
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      <button 
                        onClick={() => handleToggleVisible(menu)}
                        style={{
                          padding: "4px 12px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "var(--font-bold)",
                          cursor: "pointer",
                          backgroundColor: menu.is_visible ? "var(--color-status-open-bg)" : "var(--color-bg-tertiary)",
                          color: menu.is_visible ? "var(--color-status-open)" : "var(--color-text-tertiary)",
                          border: menu.is_visible ? "1px solid rgba(22, 163, 74, 0.2)" : "1px solid var(--color-border)"
                        }}
                      >
                        {menu.is_visible ? "노출중" : "숨김"}
                      </button>
                    </td>

                    {/* 관리 버튼 */}
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                        <button 
                          onClick={() => openFormModal(menu)} 
                          style={{ color: "var(--color-accent)", cursor: "pointer", display: "flex", alignItems: "center", gap: "2px" }}
                          title="수정"
                        >
                          <Pencil size={14} />
                          수정
                        </button>
                        <button 
                          onClick={() => setDeleteTargetId(menu.id)} 
                          style={{ color: "var(--color-admin-error)", cursor: "pointer", display: "flex", alignItems: "center", gap: "2px" }}
                          title="삭제"
                        >
                          <Trash2 size={14} />
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* --- 메뉴 편집/추가 모달 (MenuForm) --- */}
      {isFormOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: "var(--z-modal)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px"
        }}>
          <div style={{
            backgroundColor: "var(--color-bg-secondary)",
            borderRadius: "var(--radius-lg)",
            padding: "24px",
            width: "100%",
            maxWidth: "500px",
            boxShadow: "var(--shadow-xl)",
            position: "relative",
            maxHeight: "90vh",
            overflowY: "auto"
          }}>
            <button 
              onClick={() => setIsFormOpen(false)}
              style={{ position: "absolute", top: "16px", right: "16px", cursor: "pointer" }}
            >
              <X size={20} />
            </button>
            
            <h2 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-bold)", marginBottom: "20px" }}>
              {editingMenu ? "메뉴 정보 수정" : "새 메뉴 등록"}
            </h2>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* 메뉴명 */}
              <div className={styles.formGroup}>
                <label className={styles.label}>메뉴명</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>

              {/* 가격 */}
              <div className={styles.formGroup}>
                <label className={styles.label}>가격(원)</label>
                <input 
                  type="number" 
                  className={styles.input} 
                  value={price} 
                  onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))} 
                  required 
                />
              </div>

              {/* 카테고리 선택 */}
              <div className={styles.formGroup}>
                <label className={styles.label}>메뉴 분류</label>
                <select 
                  className={styles.input}
                  value={category} 
                  onChange={(e) => handleCategoryChange(e.target.value as MenuCategory)}
                >
                  <option value="regular">일반 식사 메뉴 (상시)</option>
                  <option value="signature">대표 메뉴 (🔥 불꽃 배지)</option>
                  <option value="seasonal">시즌 한정 메뉴 (🌿 새싹 배지)</option>
                </select>
              </div>

              {/* 비고 */}
              <div className={styles.formGroup}>
                <label className={styles.label}>비고 (예: 2인분부터 주문, 공기밥 포함)</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={note} 
                  onChange={(e) => setNote(e.target.value)} 
                  placeholder="예: 공기밥 무료 리필"
                />
              </div>

              {/* 한 줄 설명 */}
              <div className={styles.formGroup}>
                <label className={styles.label}>한 줄 설명</label>
                <textarea 
                  className={styles.input} 
                  style={{ height: "70px", padding: "10px", resize: "none" }}
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                />
              </div>

              {/* 이미지 업로드 */}
              <div className={styles.formGroup}>
                <label className={styles.label}>메뉴 사진</label>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <div style={{ width: "64px", height: "64px", border: "1px dashed var(--color-border)", borderRadius: "6px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {imageUrl ? (
                      <img src={imageUrl} alt="미리보기" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <ImageIcon size={20} style={{ color: "var(--color-text-tertiary)" }} />
                    )}
                  </div>
                  
                  <div style={{ flexGrow: 1 }}>
                    <label style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      border: "1px solid var(--color-border)",
                      fontSize: "12px",
                      fontWeight: "var(--font-bold)",
                      cursor: "pointer",
                      backgroundColor: "var(--color-bg-tertiary)"
                    }}>
                      <Upload size={14} />
                      {uploading ? "업로드 중..." : "사진 선택"}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        disabled={uploading}
                        style={{ display: "none" }} 
                      />
                    </label>
                    {imageUrl && (
                      <button 
                        type="button"
                        onClick={() => { setImageUrl(""); setImagePath(""); }}
                        style={{ marginLeft: "8px", fontSize: "11px", color: "var(--color-admin-error)", cursor: "pointer" }}
                      >
                        삭제
                      </button>
                    )}
                    <p style={{ fontSize: "11px", color: "var(--color-text-tertiary)", marginTop: "4px" }}>
                      5MB 이하 JPG/PNG/WebP
                    </p>
                  </div>
                </div>
              </div>

              {/* 노출 여부 스위치 */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
                <input 
                  type="checkbox" 
                  id="form-visible" 
                  checked={isVisible} 
                  onChange={(e) => setIsVisible(e.target.checked)} 
                  style={{ width: "16px", height: "16px", cursor: "pointer" }}
                />
                <label htmlFor="form-visible" style={{ fontSize: "var(--text-sm)", cursor: "pointer", fontWeight: "var(--font-semibold)" }}>
                  홈페이지 메뉴판에 즉시 노출하기
                </label>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <Button 
                  type="button" 
                  variant="secondary" 
                  fullWidth 
                  onClick={() => setIsFormOpen(false)}
                >
                  취소
                </Button>
                <Button 
                  type="submit" 
                  variant="admin" 
                  fullWidth
                >
                  저장하기
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- 삭제 확인 모달 (ConfirmDialog) --- */}
      {deleteTargetId && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: "var(--z-modal)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "16px"
        }}>
          <div style={{
            backgroundColor: "var(--color-bg-secondary)",
            borderRadius: "var(--radius-xl)",
            padding: "24px",
            width: "100%",
            maxWidth: "400px",
            boxShadow: "var(--shadow-xl)",
            textAlign: "center"
          }}>
            <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-bold)", marginBottom: "12px", color: "var(--color-text-primary)" }}>
              정말 메뉴를 삭제하시겠습니까?
            </h3>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginBottom: "24px" }}>
              메뉴를 삭제하면 복구할 수 없습니다. 홈페이지에서 임시 비노출하려면 테이블에서 '노출중' 상태를 눌러 비활성화 처리하세요.
            </p>
            
            <div style={{ display: "flex", gap: "12px" }}>
              <Button 
                variant="secondary" 
                fullWidth 
                onClick={() => setDeleteTargetId(null)}
              >
                취소
              </Button>
              <Button 
                variant="danger" 
                fullWidth 
                onClick={handleDeleteConfirm}
              >
                삭제하기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
