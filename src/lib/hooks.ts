"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserRole } from "./mock-data";

export interface SessionUser {
  name: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  user: SessionUser | null;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      login: (email, pass) => {
        // Simple mock login validation
        if (email === "kevin@superadmin.io" && pass === "admin123") {
          set({
            user: {
              name: "Kevin Hartono",
              email: "kevin@superadmin.io",
              role: "super_admin",
            },
          });
          return true;
        }
        return false;
      },
      logout: () => set({ user: null }),
    }),
    {
      name: "auth-store",
    }
  )
);

export function useAdminSession() {
  const user = useAuthStore((s) => s.user);
  return user || { name: "", email: "", role: "viewer" as UserRole };
}
