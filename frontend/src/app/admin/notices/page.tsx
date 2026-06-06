"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/lib/hooks/useToast";
import { 
  adminGetNotices, 
  createNotice, 
  updateNotice, 
  deleteNotice 
} from "@/lib/admin-api/notices";
import { revalidatePaths } from "@/lib/admin-api/revalidate";
import { Notice } from "@/types/notice";
import { Button } from "@/components/common/Button/Button";
import { Card } from "@/components/common/Card/Card";
import styles from "../admin.module.css";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  AlertTriangle, 
  X, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";

export default function AdminNoticesPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [notices, setNotices] = useState<Notice[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  
  const LIMIT = 10;

  // 폼 및 모달 상태
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // 삭제 확인 다이얼로그 상태
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // 1. 인증 체크
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // 2. 데이터 조회
  const fetchNotices = async (currentPage: number) => {
    setLoading(true);
    const offset = (currentPage - 1) * LIMIT;
    const res = await adminGetNotices(LIMIT, offset);
    if (res.success && res.data) {
      setNotices(res.data);
      setTotal(res.meta.pagination?.total || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotices(page);
    }
  }, [isAuthenticated, page]);

  // 3. 폼 초기화
  const resetForm = () => {
    setEditingNotice(null);
    setTitle("");
    setContent("");
    setIsUrgent(false);
    setIsVisible(true);
  };

  // 4. 추가/수정 모달 열기
  const openFormModal = (notice: Notice | null = null) => {
    resetForm();
    if (notice) {
      setEditingNotice(notice);
      setTitle(notice.title);
      setContent(notice.content);
      setIsUrgent(notice.is_urgent);
      setIsVisible(notice.is_visible);
    }
    setIsFormOpen(true);
  };

  // 5. 폼 제출 (저장)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      showToast("제목과 내용을 입력해 주세요.", "error");
      return;
    }

    const payload = {
      title,
      content,
      is_urgent: isUrgent,
      is_visible: isVisible,
    };

    let res;
    if (editingNotice) {
      res = await updateNotice(editingNotice.id, payload);
    } else {
      res = await createNotice(payload);
    }

    if (res.success) {
      showToast(editingNotice ? "공지사항이 수정되었습니다." : "공지사항이 등록되었습니다.", "success");
      setIsFormOpen(false);
      resetForm();
      fetchNotices(page);
      await revalidatePaths(["/"]);
    } else {
      showToast(res.error?.message || "저장 실패", "error");
    }
  };

  // 6. 노출 상태 토글
  const handleToggleVisible = async (notice: Notice) => {
    const nextVal = !notice.is_visible;
    const res = await updateNotice(notice.id, { is_visible: nextVal });
    if (res.success) {
      showToast("공지 노출 상태가 변경되었습니다.", "success");
      fetchNotices(page);
      await revalidatePaths(["/"]);
    }
  };

  // 7. 긴급 공지(띠 배너) 상태 바로 토글
  const handleToggleUrgent = async (notice: Notice) => {
    const nextVal = !notice.is_urgent;
    
    // 만약 긴급으로 설정하려는데 노출 상태가 숨김 상태라면 먼저 경고
    if (nextVal && !notice.is_visible) {
      showToast("숨겨진 공지는 긴급 공지로 설정할 수 없습니다. 노출 처리를 먼저 하세요.", "error");
      return;
    }

    const res = await updateNotice(notice.id, { is_urgent: nextVal });
    if (res.success) {
      showToast(nextVal ? "긴급 공지 띠 배너가 활성화되었습니다." : "긴급 공지 설정이 해제되었습니다.", "success");
      fetchNotices(page);
      await revalidatePaths(["/"]);
    } else {
      showToast(res.error?.message || "긴급 상태 설정 실패", "error");
    }
  };

  // 8. 삭제 처리
  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;

    const res = await deleteNotice(deleteTargetId);
    if (res.success) {
      showToast("공지사항이 삭제되었습니다.", "success");
      setDeleteTargetId(null);
      // 만약 마지막 페이지의 단일 항목을 삭제한 경우 이전 페이지로 이동
      const maxPages = Math.ceil((total - 1) / LIMIT);
      if (page > maxPages && page > 1) {
        setPage(page - 1);
      } else {
        fetchNotices(page);
      }
      await revalidatePaths(["/"]);
    } else {
      showToast(res.error?.message || "삭제 실패", "error");
    }
  };

  const totalPages = Math.ceil(total / LIMIT);

  if (authLoading || !isAuthenticated) return null;

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>공지사항 관리</h1>
        <Button variant="admin" onClick={() => openFormModal()}>
          <Plus size={16} style={{ marginRight: "6px" }} />
          공지 작성
        </Button>
      </div>

      <Card style={{ padding: 0, overflow: "visible" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--color-text-secondary)" }}>
            소식을 가져오는 중...
          </div>
        ) : notices.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--color-text-secondary)" }}>
            등록된 공지사항이 없습니다. 새 소식을 작성해 단골들에게 알려보세요.
          </div>
        ) : (
          <div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "var(--text-sm)" }}>
                <thead>
                  <tr style={{ backgroundColor: "var(--color-bg-tertiary)", borderBottom: "var(--border-default)" }}>
                    <th style={{ padding: "12px 16px", width: "130px" }}>작성일</th>
                    <th style={{ padding: "12px 16px" }}>제목</th>
                    <th style={{ padding: "12px 16px", width: "140px", textAlign: "center" }}>긴급 배너 지정</th>
                    <th style={{ padding: "12px 16px", width: "120px", textAlign: "center" }}>노출 상태</th>
                    <th style={{ padding: "12px 16px", width: "150px", textAlign: "center" }}>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {notices.map((notice) => (
                    <tr 
                      key={notice.id} 
                      style={{ 
                        borderBottom: "var(--border-default)",
                        opacity: notice.is_visible ? 1 : 0.6,
                        backgroundColor: notice.is_visible ? "transparent" : "#fbfbfc"
                      }}
                    >
                      {/* 작성일 */}
                      <td style={{ padding: "12px 16px", fontFamily: "var(--font-mono)", color: "var(--color-text-secondary)" }}>
                        {new Date(notice.created_at).toLocaleDateString()}
                      </td>

                      {/* 제목 */}
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ fontWeight: "var(--font-bold)", display: "flex", alignItems: "center", gap: "8px" }}>
                          {notice.is_urgent && (
                            <span style={{ color: "var(--color-admin-error)", display: "flex", alignItems: "center" }}>
                              <AlertTriangle size={14} />
                            </span>
                          )}
                          {notice.title}
                        </div>
                        <div style={{ 
                          fontSize: "12px", 
                          color: "var(--color-text-secondary)", 
                          marginTop: "2px", 
                          maxWidth: "400px", 
                          overflow: "hidden", 
                          textOverflow: "ellipsis", 
                          whiteSpace: "nowrap" 
                        }}>
                          {notice.content}
                        </div>
                      </td>

                      {/* 긴급 지정 토글 */}
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <button 
                          onClick={() => handleToggleUrgent(notice)}
                          style={{
                            padding: "4px 10px",
                            borderRadius: "12px",
                            fontSize: "11px",
                            fontWeight: "var(--font-bold)",
                            cursor: "pointer",
                            backgroundColor: notice.is_urgent ? "var(--color-status-closed-bg)" : "var(--color-bg-primary)",
                            color: notice.is_urgent ? "var(--color-status-closed)" : "var(--color-text-tertiary)",
                            border: notice.is_urgent ? "1px solid rgba(220, 38, 38, 0.2)" : "1px solid var(--color-border)"
                          }}
                        >
                          {notice.is_urgent ? "⚠️ 긴급배너 지정됨" : "일반"}
                        </button>
                      </td>

                      {/* 노출 여부 토글 */}
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <button 
                          onClick={() => handleToggleVisible(notice)}
                          style={{
                            padding: "4px 12px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "var(--font-bold)",
                            cursor: "pointer",
                            backgroundColor: notice.is_visible ? "var(--color-status-open-bg)" : "var(--color-bg-tertiary)",
                            color: notice.is_visible ? "var(--color-status-open)" : "var(--color-text-tertiary)",
                            border: notice.is_visible ? "1px solid rgba(22, 163, 74, 0.2)" : "1px solid var(--color-border)"
                          }}
                        >
                          {notice.is_visible ? "노출중" : "숨김"}
                        </button>
                      </td>

                      {/* 관리 버튼 */}
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        <div style={{ display: "flex", justifyContent: "center", gap: "8px" }}>
                          <button 
                            onClick={() => openFormModal(notice)} 
                            style={{ color: "var(--color-accent)", cursor: "pointer", display: "flex", alignItems: "center", gap: "2px" }}
                          >
                            <Pencil size={14} />
                            수정
                          </button>
                          <button 
                            onClick={() => setDeleteTargetId(notice.id)} 
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

            {/* --- 페이지네이션 (Pagination) --- */}
            {totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", padding: "16px", borderTop: "var(--border-default)" }}>
                <button 
                  onClick={() => setPage((p) => Math.max(p - 1, 1))} 
                  disabled={page === 1}
                  style={{ display: "inline-flex", padding: "6px", border: "1px solid var(--color-border)", borderRadius: "6px", cursor: page === 1 ? "default" : "pointer", opacity: page === 1 ? 0.3 : 1 }}
                >
                  <ChevronLeft size={16} />
                </button>
                <span style={{ fontSize: "14px", fontWeight: "var(--font-semibold)" }}>
                  {page} / {totalPages}
                </span>
                <button 
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))} 
                  disabled={page === totalPages}
                  style={{ display: "inline-flex", padding: "6px", border: "1px solid var(--color-border)", borderRadius: "6px", cursor: page === totalPages ? "default" : "pointer", opacity: page === totalPages ? 0.3 : 1 }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* --- 공지 추가/수정 모달 (NoticeForm) --- */}
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
            maxWidth: "600px",
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
              {editingNotice ? "공지사항 수정" : "새 공지사항 등록"}
            </h2>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* 제목 */}
              <div className={styles.formGroup}>
                <label className={styles.label}>공지 제목</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required 
                  placeholder="예: 6월 임시 휴무 일정 안내"
                />
              </div>

              {/* 내용 */}
              <div className={styles.formGroup}>
                <label className={styles.label}>공지 상세 내용</label>
                <textarea 
                  className={styles.input} 
                  style={{ height: "180px", padding: "12px", resize: "vertical", lineHeight: "1.5" }}
                  value={content} 
                  onChange={(e) => setContent(e.target.value)} 
                  required
                  placeholder="상세한 일정을 문장형으로 작성해주세요."
                />
              </div>

              {/* 긴급 배너 체크 */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
                <input 
                  type="checkbox" 
                  id="form-urgent" 
                  checked={isUrgent} 
                  onChange={(e) => setIsUrgent(e.target.checked)} 
                  style={{ width: "16px", height: "16px", cursor: "pointer" }}
                />
                <label htmlFor="form-urgent" style={{ fontSize: "var(--text-sm)", cursor: "pointer", fontWeight: "var(--font-bold)", color: "var(--color-admin-error)" }}>
                  ⚠️ 긴급 배너로 활성화 (메인 화면 맨 위에 빨간색 띠 배너로 노출)
                </label>
              </div>

              {/* 노출 여부 체크 */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input 
                  type="checkbox" 
                  id="form-visible" 
                  checked={isVisible} 
                  onChange={(e) => setIsVisible(e.target.checked)} 
                  style={{ width: "16px", height: "16px", cursor: "pointer" }}
                />
                <label htmlFor="form-visible" style={{ fontSize: "var(--text-sm)", cursor: "pointer", fontWeight: "var(--font-semibold)" }}>
                  공지사항 목록에 노출하기
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

      {/* --- 삭제 확인 다이얼로그 (ConfirmDialog) --- */}
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
              정말 공지사항을 삭제하시겠습니까?
            </h3>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)", marginBottom: "24px" }}>
              선택한 소식이 목록에서 영구 삭제됩니다. 복구할 수 없으니 신중히 결정해 주세요.
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
