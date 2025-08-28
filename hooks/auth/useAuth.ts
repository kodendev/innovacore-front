"use client";

import { decodeToken, JwtPayload } from "@/utils/auth"; // ✅ usa tu interfaz aquí
import { useState, useEffect } from "react";

export const useAuth = () => {
  const [user, setUser] = useState<JwtPayload | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      const decoded = decodeToken(token);
      if (decoded) setUser(decoded);
    }
  }, []);

  return { user, setUser };
};
