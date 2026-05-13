"use client";

// Simulates the session hook — returns the current super admin user.
// In production, this would be replaced by a real auth session provider.
export function useAdminSession() {
  return {
    name: "Kevin Hartono",
    email: "kevin@superadmin.io",
    role: "super_admin" as const,
  };
}
