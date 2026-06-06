"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/common/Button/Button";
import { useToast } from "@/lib/hooks/useToast";
import styles from "../admin.module.css";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();
  const { showToast } = useToast();

  // 이미 로그인된 세션이 있는 경우 바로 대시보드로 리다이렉트
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/admin");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMsg("비밀번호를 입력해 주세요.");
      showToast("비밀번호를 입력해 주세요.", "error");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    const success = await login(password);
    if (success) {
      showToast("식당 관리 대시보드 로그인 성공!", "success");
      router.push("/admin");
    } else {
      setErrorMsg("비밀번호가 일치하지 않습니다. (데모: 1234)");
      showToast("로그인에 실패했습니다. 비밀번호를 확인해 주세요.", "error");
    }
    setSubmitting(false);
  };

  if (isLoading) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <div className="animate-pulse" style={{ color: "var(--color-text-secondary)" }}>
            세션 확인 중...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.loginTitle}>숙이네국수</h1>
        <p className={styles.loginSub}>식당 운영 관리자 페이지 로그인</p>
 
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="pin-password" className={styles.label}>
              관리자 비밀번호
            </label>
            <input
              id="pin-password"
              type="password"
              className={styles.input}
              placeholder="비밀번호 4자리를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value.replace(/[^0-9]/g, ""))}
              disabled={submitting}
              maxLength={4}
              inputMode="numeric"
              pattern="[0-9]*"
              autoFocus
            />
            {errorMsg && <p className={styles.errorText}>⚠️ {errorMsg}</p>}
          </div>

          <Button 
            type="submit" 
            variant="admin" 
            fullWidth 
            loading={submitting}
            style={{ marginTop: "var(--space-4)" }}
          >
            로그인하기
          </Button>
        </form>
      </div>
    </div>
  );
}
