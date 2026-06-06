"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { adminLogin, adminLogout, verifySession } from "../admin-api/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 초기화 시 쿠키/Storage 세션 토큰 확인 및 검증
  useEffect(() => {
    const checkAuth = async () => {
      // 1. 브라우저에서 쿠키 추출
      const match = document.cookie.match(/(^| )sookine_session_token=([^;]+)/);
      const token = match ? match[2] : "";

      if (token) {
        // 서버/Mock에 세션 확인
        const res = await verifySession(token);
        if (res.success && res.data?.valid) {
          setIsAuthenticated(true);
        } else {
          // 세션 만료 시 쿠키 만료 처리
          document.cookie = "sookine_session_token=; path=/; max-age=0";
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (password: string): Promise<boolean> => {
    setIsLoading(true);
    const res = await adminLogin(password);
    
    if (res.success && res.data) {
      const token = res.data.session_token;
      
      // 미들웨어 보호를 위해 document.cookie에 저장
      document.cookie = `sookine_session_token=${token}; path=/; max-age=86400; SameSite=Lax`;
      
      setIsAuthenticated(true);
      setIsLoading(false);
      return true;
    } else {
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await adminLogout();
    
    // 쿠키 제거
    document.cookie = "sookine_session_token=; path=/; max-age=0; SameSite=Lax";
    
    setIsAuthenticated(false);
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
