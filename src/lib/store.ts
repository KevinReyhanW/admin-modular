import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Company,
  User,
  mockCompanies,
  mockUsers,
  type ProductKey,
} from "./mock-data";

interface AdminState {
  // Companies
  companies: Company[];
  addCompany: (company: Omit<Company, "id" | "createdAt">) => void;
  updateCompany: (id: string, data: Partial<Company>) => void;
  deleteCompany: (id: string) => void;
  toggleProduct: (companyId: string, product: ProductKey) => void;

  // Users
  users: User[];
  addUser: (user: Omit<User, "id" | "createdAt">) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;
  toggleUserActive: (userId: string) => void;
}

export const useAdminStore = create<AdminState>()(
  persist(
    (set) => ({
      companies: [...mockCompanies],

      addCompany: (company) =>
        set((state) => ({
          companies: [
            ...state.companies,
            {
              ...company,
              id: `comp-${String(Date.now()).slice(-6)}`,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateCompany: (id, data) =>
        set((state) => ({
          companies: state.companies.map((c) =>
            c.id === id ? { ...c, ...data } : c
          ),
        })),

      deleteCompany: (id) =>
        set((state) => ({
          companies: state.companies.filter((c) => c.id !== id),
          // Cascade delete users
          users: state.users.filter((u) => u.companyId !== id),
        })),

      toggleProduct: (companyId, product) =>
        set((state) => ({
          companies: state.companies.map((c) => {
            if (c.id !== companyId) return c;
            const newAccess = !c.productAccess[product];
            return {
              ...c,
              productAccess: { ...c.productAccess, [product]: newAccess },
              productEnabledAt: {
                ...c.productEnabledAt,
                [product]: newAccess ? new Date().toISOString() : c.productEnabledAt[product],
              },
            };
          }),
        })),

      users: [...mockUsers],

      addUser: (user) =>
        set((state) => ({
          users: [
            ...state.users,
            {
              ...user,
              id: `user-${String(Date.now()).slice(-6)}`,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      updateUser: (id, data) =>
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...data } : u)),
        })),

      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
        })),

      toggleUserActive: (userId) =>
        set((state) => ({
          users: state.users.map((u) =>
            u.id === userId ? { ...u, isActive: !u.isActive } : u
          ),
        })),
    }),
    {
      name: "admin-store",
    }
  )
);
