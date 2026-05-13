import { create } from "zustand";
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
  toggleProduct: (companyId: string, product: ProductKey) => void;

  // Users
  users: User[];
  addUser: (user: Omit<User, "id" | "createdAt">) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  toggleUserActive: (userId: string) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  companies: [...mockCompanies],

  addCompany: (company) =>
    set((state) => ({
      companies: [
        ...state.companies,
        {
          ...company,
          id: `comp-${String(state.companies.length + 1).padStart(3, "0")}`,
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
          id: `user-${String(state.users.length + 1).padStart(3, "0")}`,
          createdAt: new Date().toISOString(),
        },
      ],
    })),

  updateUser: (id, data) =>
    set((state) => ({
      users: state.users.map((u) => (u.id === id ? { ...u, ...data } : u)),
    })),

  toggleUserActive: (userId) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId ? { ...u, isActive: !u.isActive } : u
      ),
    })),
}));
