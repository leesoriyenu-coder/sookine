"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/useToast";
import { 
  adminGetSideDishes, 
  createSideDish, 
  updateSideDish, 
  deleteSideDish, 
  reorderSideDishes 
} from "@/lib/admin-api/side-dishes";
import { uploadImage } from "@/lib/admin-api/upload";
import { revalidatePaths } from "@/lib/admin-api/revalidate";
import { SideDish } from "@/types/side-dish";
import { Button } from "@/components/common/Button/Button";
import { Card } from "@/components/common/Card/Card";
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

export default function AdminSideDishesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [sideDishes, setSideDishes] = useState<SideDish[]>([]);
  const [loading, setLoading] = useState(true);

  // 폼 및 모달 상태
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<SideDish | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePath, setImagePath] = useState("");
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
  const fetchSideDishes = async () => {
    setLoading(true);
    const res = await adminGetSideDishes();
    if (res.success && res.data) {
      setSideDishes(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSideDishes();
    }
  }, [isAuthenticated]);

  // 3. 폼 초기화
  const resetForm = () => {
    setEditingDish(null);
    setName("");
    setDescription("");
    setImageUrl("");
    setImagePath("");
    setIsVisible(true);
  };

  // 4. 추가/수정 모달 열기
  const openFormModal = (dish: SideDish | null = null) => {
    resetForm();
    if (dish) {
      setEditingDish(dish);
      setName(dish.name);
      setDescription(dish.description || "");
      setImageUrl(dish.image_url || "");
      setImagePath(dish.image_path || "");
      setIsVisible(dish.is_visible);
    }
    setIsFormOpen(true);
  };

  // 5. 이미지 업로드 처리
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 5.1 클라이언트단 사전 유효성 검사 (5MB 제한 및 포맷 확인)
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
    const res = await uploadImage(file, "side-dish-images");
    if (res.success && res.data) {
      setImageUrl(res.data.url);
      setImagePath(res.data.path);
      showToast("반찬 이미지가 업로드되었습니다.", "success");
    } else {
      showToast(res.error?.message || "이미지 업로드 실패", "error");
    }
    setUploading(false);
  };

  // 6. 폼 제출 (저장)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      showToast("반찬명은 필수 입력 항목입니다.", "error");
      return;
    }

    const payload = {
      name,
      description: description || null,
      image_url: imageUrl || null,
      image_path: imagePath || null,
      is_visible: isVisible,
      sort_order: editingDish ? editingDish.sort_order : sideDishes.length + 1,
    };

    let res;
    if (editingDish) {
      res = await updateSideDish(editingDish.id, payload);
    } else {
      res = await createSideDish(payload);
    }

    if (res.success) {
      showToast(editingDish ? "기본찬이 수정되었습니다." : "새로운 기본찬이 추가되었습니다.", "success");
      setIsFormOpen(false);
      resetForm();
      fetchSideDishes();
      await revalidatePaths(["/"]);
    } else {
      showToast(res.error?.message || "저장 실패", "error");
    }
  };

  // 7. 노출 여부 변경 (토글)
  const handleToggleVisible = async (dish: SideDish) => {
    const nextVal = !dish.is_visible;
    const res = await updateSideDish(dish.id, { is_visible: nextVal });
    if (res.success) {
      showToast(`[${dish.name}] 노출 상태가 변경되었습니다.`, "success");
      fetchSideDishes();
      await revalidatePaths(["/"]);
    }
  };

  // 8. 순서 변경 처리 (Up/Down)
  const handleMove = async (index: number, direction: "up" | "down") => {
    const newDishes = [...sideDishes];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newDishes.length) return;

    // Swap sort_order
    const tempOrder = newDishes[index].sort_order;
    newDishes[index].sort_order = newDishes[targetIdx].sort_order;
    newDishes[targetIdx].sort_order = tempOrder;

    // API Payload
    const reorderPayload = [
      { id: newDishes[index].id, sort_order: newDishes[index].sort_order },
      { id: newDishes[targetIdx].id, sort_order: newDishes[targetIdx].sort_order }
    ];

    const res = await reorderSideDishes(reorderPayload);
    if (res.success) {
      showToast("밑반찬 배치 순서가 조정되었습니다.", "success");
      fetchSideDishes();
      await revalidatePaths(["/"]);
    } else {
      showToast("순서 변경 실패", "error");
    }
  };

  // 9. 삭제 처리
  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;

    const res = await deleteSideDish(deleteTargetId);
    if (res.success) {
      showToast("기본찬이 정상적으로 삭제되었습니다.", "success");
      setDeleteTargetId(null);
      fetchSideDishes();
      await revalidatePaths(["/"]);
    } else {
      showToast(res.error?.message || "삭제 실패", "error");
    }
  };

  if (authLoading || !isAuthenticated) return null;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>기본찬(밑반찬) 갤러리 관리</h1>
        <Button variant="admin" onClick={() => openFormModal()}>
          <Plus size={16} style={{ marginRight: "6px" }} />
          새 반찬 추가
        </Button>
      </div>

      <Card style={{ padding: 0, overflow: "visible" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--color-text-secondary)" }}>
            반찬 목록을 불러오는 중...
          </div>
        ) : sideDishes.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--color-text-secondary)" }}>
            등록된 기본찬이 없습니다. 메인화면 갤러리에 띄울 신선한 밑반찬들을 추가하세요.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "var(--text-sm)" }}>
              <thead>
                <tr style={{ backgroundColor: "var(--color-bg-tertiary)", borderBottom: "var(--border-default)" }}>
                  <th style={{ padding: "12px 16px", width: "80px", textAlign: "center" }}>순서</th>
                  <th style={{ padding: "12px 16px", width: "80px" }}>사진</th>
                  <th style={{ padding: "12px 16px" }}>반찬명</th>
                  <th style={{ padding: "12px 16px" }}>반찬 설명</th>
                  <th style={{ padding: "12px 16px", width: "120px", textAlign: "center" }}>노출 여부</th>
                  <th style={{ padding: "12px 16px", width: "150px", textAlign: "center" }}>관리</th>
                </tr>
              </thead>
              <tbody>
                {sideDishes.map((dish, index) => (
                  <tr 
                    key={dish.id} 
                    style={{ 
                      borderBottom: "var(--border-default)",
                      opacity: dish.is_visible ? 1 : 0.6,
                      backgroundColor: dish.is_visible ? "transparent" : "#fbfbfc"
                    }}
                  >
                    {/* 순서 조정 */}
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
                          disabled={index === sideDishes.length - 1}
                          style={{ padding: "2px", opacity: index === sideDishes.length - 1 ? 0.3 : 1, cursor: index === sideDishes.length - 1 ? "default" : "pointer" }}
                        >
                          <ArrowDown size={14} />
                        </button>
                      </div>
                    </td>

                    {/* 사진 */}
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ width: "44px", height: "44px", borderRadius: "6px", backgroundColor: "var(--color-bg-tertiary)", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {dish.image_url ? (
                          <img src={dish.image_url} alt={dish.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <ImageIcon size={16} style={{ color: "var(--color-text-tertiary)" }} />
                        )}
                      </div>
                    </td>

                    {/* 이름 */}
                    <td style={{ padding: "12px 16px", fontWeight: "var(--font-bold)" }}>
                      {dish.name}
                    </td>

                    {/* 설명 */}
                    <td style={{ padding: "12px 16px", color: "var(--color-text-secondary)" }}>
                      {dish.description || "-"}
                    </td>

                    {/* 노출 토글 */}
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      <button 
                        onClick={() => handleToggleVisible(dish)}
                        style={{
                          padding: "4px 12px",
                          borderRadius: "12px",
                          fontSize: "12px",
                          fontWeight: "var(--font-bold)",
                          cursor: "pointer",
                          backgroundColor: dish.is_visible ? "var(--color-status-open-bg)" : "var(--color-bg-tertiary)",
                          color: dish.is_visible ? "var(--color-status-open)" : "var(--color-text-tertiary)",
                          border: dish.is_visible ? "1px solid rgba(22, 163, 74, 0.2)" : "1px solid var(--color-border)"
                        }}
                      >
                        {dish.is_visible ? "노출중" : "숨김"}
                      </button>
                    </td>

                    {/* 관리 버튼 */}
                    <td style={{ padding: "12px 16px", textAlign: "center" }}>
                      <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                        <button 
                          onClick={() => openFormModal(dish)} 
                          style={{ color: "var(--color-accent)", cursor: "pointer", display: "flex", alignItems: "center", gap: "2px" }}
                        >
                          <Pencil size={14} />
                          수정
                        </button>
                        <button 
                          onClick={() => setDeleteTargetId(dish.id)} 
                          style={{ color: "var(--color-admin-error)", cursor: "pointer", display: "flex", alignItems: "center", gap: "2px" }}
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

      {/* --- 기본찬 추가/수정 모달 (SideDishForm) --- */}
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
              {editingDish ? "밑반찬 정보 수정" : "새 밑반찬 등록"}
            </h2>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* 반찬 이름 */}
              <div className={styles.formGroup}>
                <label className={styles.label}>반찬명</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  placeholder="예: 생선구이, 오징어초무침"
                />
              </div>

              {/* 반찬 설명 */}
              <div className={styles.formGroup}>
                <label className={styles.label}>반찬 설명</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="예: 노릇하게 구워 겉바속촉 고소한 생선구이"
                />
              </div>

              {/* 사진 업로드 */}
              <div className={styles.formGroup}>
                <label className={styles.label}>반찬 사진</label>
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

              {/* 노출 여부 */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
                <input 
                  type="checkbox" 
                  id="form-dish-visible" 
                  checked={isVisible} 
                  onChange={(e) => setIsVisible(e.target.checked)} 
                  style={{ width: "16px", height: "16px", cursor: "pointer" }}
                />
                <label htmlFor="form-dish-visible" style={{ fontSize: "var(--text-sm)", cursor: "pointer", fontWeight: "var(--font-semibold)" }}>
                  홈페이지 밑반찬 갤러리에 노출하기
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
            <h3 style={{ fontSize: "var(--text-lg)", fontWeight: "var(--font-bold)", marginBottom: "12px" }}>
              정말 밑반찬을 삭제하시겠습니까?
            </h3>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginBottom: "24px" }}>
              선택한 밑반찬이 홈페이지 갤러리에서 즉시 제외되고 데이터가 완전히 지워집니다.
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
