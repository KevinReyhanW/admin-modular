// ============================================================
// Types
// ============================================================

export type ProductKey = "sga" | "iba" | "claimmind";

export type CompanyStatus = "active" | "inactive" | "suspended";

export type UserRole = "super_admin" | "company_admin" | "viewer";

export interface ProductAccess {
  sga: boolean;
  iba: boolean;
  claimmind: boolean;
}

export interface ProductAccessTimestamps {
  sga: string | null;
  iba: string | null;
  claimmind: string | null;
}

export interface Company {
  id: string;
  name: string;
  contactEmail: string;
  status: CompanyStatus;
  productAccess: ProductAccess;
  productEnabledAt: ProductAccessTimestamps;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId: string;
  isActive: boolean;
  createdAt: string;
}

export interface SgaUsage {
  companyId: string;
  totalMessages: number;
  activeSessionsToday: number;
  languageBreakdown: { en: number; id: number };
  avgResponseTime: number; // seconds
  dailyMessages: { date: string; count: number }[];
}

export interface IbaUsage {
  companyId: string;
  totalQueries: number;
  mostAskedTopics: { topic: string; count: number }[];
  activeUsersThisMonth: number;
  dailyQueries: { date: string; count: number }[];
}

export interface ClaimMindUsage {
  companyId: string;
  totalClaims: number;
  claimsInReview: number;
  approved: number;
  rejected: number;
  avgProcessingTime: number; // hours
  dailyClaims: { date: string; count: number }[];
}

export interface AuditLogEntry {
  id: string;
  action: string;
  performedBy: string;
  target: string;
  timestamp: string;
}

// ============================================================
// Product metadata
// ============================================================

export const PRODUCTS: Record<
  ProductKey,
  { name: string; description: string; color: string }
> = {
  sga: {
    name: "SGA",
    description: "Smart Guest Assistant — AI hotel concierge via WhatsApp",
    color: "emerald",
  },
  iba: {
    name: "IBA",
    description:
      "Intelligent Business Advisor — Conversational business analytics",
    color: "blue",
  },
  claimmind: {
    name: "ClaimMind",
    description: "AI-assisted hospital & insurance claim processing",
    color: "violet",
  },
};

// ============================================================
// Mock Companies
// ============================================================

export const mockCompanies: Company[] = [
  {
    id: "comp-001",
    name: "Grand Hyatt Jakarta",
    contactEmail: "admin@grandhyatt.co.id",
    status: "active",
    productAccess: { sga: true, iba: true, claimmind: false },
    productEnabledAt: {
      sga: "2025-11-15T08:30:00Z",
      iba: "2025-12-01T10:00:00Z",
      claimmind: null,
    },
    createdAt: "2025-10-01T00:00:00Z",
  },
  {
    id: "comp-002",
    name: "Astra International",
    contactEmail: "tech@astra.co.id",
    status: "active",
    productAccess: { sga: false, iba: true, claimmind: true },
    productEnabledAt: {
      sga: null,
      iba: "2025-09-20T14:00:00Z",
      claimmind: "2026-01-10T09:00:00Z",
    },
    createdAt: "2025-09-15T00:00:00Z",
  },
  {
    id: "comp-003",
    name: "Siloam Hospitals Group",
    contactEmail: "ops@siloamhospitals.com",
    status: "active",
    productAccess: { sga: false, iba: false, claimmind: true },
    productEnabledAt: {
      sga: null,
      iba: null,
      claimmind: "2026-02-01T08:00:00Z",
    },
    createdAt: "2026-01-20T00:00:00Z",
  },
  {
    id: "comp-004",
    name: "Traveloka",
    contactEmail: "admin@traveloka.com",
    status: "inactive",
    productAccess: { sga: true, iba: false, claimmind: false },
    productEnabledAt: {
      sga: "2025-08-01T12:00:00Z",
      iba: null,
      claimmind: null,
    },
    createdAt: "2025-07-10T00:00:00Z",
  },
  {
    id: "comp-005",
    name: "Mandiri Insurance",
    contactEmail: "digital@mandiriins.co.id",
    status: "suspended",
    productAccess: { sga: false, iba: true, claimmind: true },
    productEnabledAt: {
      sga: null,
      iba: "2025-10-15T11:00:00Z",
      claimmind: "2025-11-20T07:30:00Z",
    },
    createdAt: "2025-10-01T00:00:00Z",
  },
];

// ============================================================
// Mock Users
// ============================================================

export const mockUsers: User[] = [
  // Grand Hyatt Jakarta
  {
    id: "user-001",
    name: "Budi Santoso",
    email: "budi@grandhyatt.co.id",
    role: "company_admin",
    companyId: "comp-001",
    isActive: true,
    createdAt: "2025-10-05T00:00:00Z",
  },
  {
    id: "user-002",
    name: "Siti Rahma",
    email: "siti@grandhyatt.co.id",
    role: "viewer",
    companyId: "comp-001",
    isActive: true,
    createdAt: "2025-10-10T00:00:00Z",
  },
  {
    id: "user-003",
    name: "Andi Wijaya",
    email: "andi@grandhyatt.co.id",
    role: "viewer",
    companyId: "comp-001",
    isActive: false,
    createdAt: "2025-11-01T00:00:00Z",
  },
  // Astra International
  {
    id: "user-004",
    name: "Dewi Lestari",
    email: "dewi@astra.co.id",
    role: "company_admin",
    companyId: "comp-002",
    isActive: true,
    createdAt: "2025-09-20T00:00:00Z",
  },
  {
    id: "user-005",
    name: "Reza Pratama",
    email: "reza@astra.co.id",
    role: "viewer",
    companyId: "comp-002",
    isActive: true,
    createdAt: "2025-10-01T00:00:00Z",
  },
  {
    id: "user-006",
    name: "Maya Putri",
    email: "maya@astra.co.id",
    role: "viewer",
    companyId: "comp-002",
    isActive: true,
    createdAt: "2025-10-15T00:00:00Z",
  },
  // Siloam Hospitals Group
  {
    id: "user-007",
    name: "Dr. Hendro Tanoto",
    email: "hendro@siloamhospitals.com",
    role: "company_admin",
    companyId: "comp-003",
    isActive: true,
    createdAt: "2026-01-25T00:00:00Z",
  },
  {
    id: "user-008",
    name: "Nurse Linda",
    email: "linda@siloamhospitals.com",
    role: "viewer",
    companyId: "comp-003",
    isActive: true,
    createdAt: "2026-02-01T00:00:00Z",
  },
  {
    id: "user-009",
    name: "Agus Prabowo",
    email: "agus@siloamhospitals.com",
    role: "viewer",
    companyId: "comp-003",
    isActive: false,
    createdAt: "2026-02-10T00:00:00Z",
  },
  // Traveloka
  {
    id: "user-010",
    name: "Ferry Unardi",
    email: "ferry@traveloka.com",
    role: "company_admin",
    companyId: "comp-004",
    isActive: true,
    createdAt: "2025-07-15T00:00:00Z",
  },
  {
    id: "user-011",
    name: "Jessica Tanoe",
    email: "jessica@traveloka.com",
    role: "viewer",
    companyId: "comp-004",
    isActive: false,
    createdAt: "2025-08-01T00:00:00Z",
  },
  {
    id: "user-012",
    name: "Kevin Aluwi",
    email: "kevin@traveloka.com",
    role: "viewer",
    companyId: "comp-004",
    isActive: true,
    createdAt: "2025-08-10T00:00:00Z",
  },
  // Mandiri Insurance
  {
    id: "user-013",
    name: "Haryanto Surya",
    email: "haryanto@mandiriins.co.id",
    role: "company_admin",
    companyId: "comp-005",
    isActive: true,
    createdAt: "2025-10-05T00:00:00Z",
  },
  {
    id: "user-014",
    name: "Ratna Dewi",
    email: "ratna@mandiriins.co.id",
    role: "viewer",
    companyId: "comp-005",
    isActive: true,
    createdAt: "2025-10-20T00:00:00Z",
  },
  {
    id: "user-015",
    name: "Bambang Susilo",
    email: "bambang@mandiriins.co.id",
    role: "viewer",
    companyId: "comp-005",
    isActive: false,
    createdAt: "2025-11-01T00:00:00Z",
  },
];

// ============================================================
// Helper: generate daily data for last 30 days
// ============================================================

function generateDailyData(
  baseValue: number,
  variance: number
): { date: string; count: number }[] {
  const data: { date: string; count: number }[] = [];
  const now = new Date("2026-05-12");
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    data.push({
      date: d.toISOString().split("T")[0],
      count: Math.max(
        0,
        Math.round(baseValue + (Math.random() - 0.5) * variance)
      ),
    });
  }
  return data;
}

// ============================================================
// Mock SGA Usage
// ============================================================

export const mockSgaUsage: SgaUsage[] = [
  {
    companyId: "comp-001",
    totalMessages: 24580,
    activeSessionsToday: 47,
    languageBreakdown: { en: 14200, id: 10380 },
    avgResponseTime: 1.2,
    dailyMessages: generateDailyData(820, 300),
  },
  {
    companyId: "comp-004",
    totalMessages: 3200,
    activeSessionsToday: 0,
    languageBreakdown: { en: 2100, id: 1100 },
    avgResponseTime: 1.5,
    dailyMessages: generateDailyData(100, 60),
  },
];

// ============================================================
// Mock IBA Usage
// ============================================================

export const mockIbaUsage: IbaUsage[] = [
  {
    companyId: "comp-001",
    totalQueries: 8420,
    mostAskedTopics: [
      { topic: "Revenue Forecast", count: 1840 },
      { topic: "Customer Satisfaction", count: 1560 },
      { topic: "Occupancy Rate", count: 1200 },
      { topic: "Cost Breakdown", count: 980 },
      { topic: "Competitor Analysis", count: 840 },
    ],
    activeUsersThisMonth: 12,
    dailyQueries: generateDailyData(280, 120),
  },
  {
    companyId: "comp-002",
    totalQueries: 15640,
    mostAskedTopics: [
      { topic: "Market Share", count: 3200 },
      { topic: "Supply Chain", count: 2800 },
      { topic: "Sales Pipeline", count: 2400 },
      { topic: "Employee Productivity", count: 1900 },
      { topic: "Financial Projections", count: 1500 },
    ],
    activeUsersThisMonth: 28,
    dailyQueries: generateDailyData(520, 200),
  },
  {
    companyId: "comp-005",
    totalQueries: 4300,
    mostAskedTopics: [
      { topic: "Claim Trends", count: 1100 },
      { topic: "Premium Revenue", count: 900 },
      { topic: "Risk Assessment", count: 750 },
      { topic: "Policy Renewal", count: 600 },
      { topic: "Fraud Detection", count: 450 },
    ],
    activeUsersThisMonth: 8,
    dailyQueries: generateDailyData(140, 60),
  },
];

// ============================================================
// Mock ClaimMind Usage
// ============================================================

export const mockClaimMindUsage: ClaimMindUsage[] = [
  {
    companyId: "comp-002",
    totalClaims: 3840,
    claimsInReview: 124,
    approved: 2980,
    rejected: 736,
    avgProcessingTime: 4.2,
    dailyClaims: generateDailyData(128, 50),
  },
  {
    companyId: "comp-003",
    totalClaims: 12500,
    claimsInReview: 380,
    approved: 9800,
    rejected: 2320,
    avgProcessingTime: 3.8,
    dailyClaims: generateDailyData(420, 150),
  },
  {
    companyId: "comp-005",
    totalClaims: 6200,
    claimsInReview: 95,
    approved: 5100,
    rejected: 1005,
    avgProcessingTime: 5.1,
    dailyClaims: generateDailyData(210, 80),
  },
];

// ============================================================
// Mock Audit Log
// ============================================================

export const mockAuditLog: AuditLogEntry[] = [
  {
    id: "log-001",
    action: "Enabled SGA",
    performedBy: "Super Admin",
    target: "Grand Hyatt Jakarta",
    timestamp: "2026-05-12T09:15:00Z",
  },
  {
    id: "log-002",
    action: "Created user",
    performedBy: "Super Admin",
    target: "Budi Santoso (Grand Hyatt Jakarta)",
    timestamp: "2026-05-12T08:30:00Z",
  },
  {
    id: "log-003",
    action: "Disabled IBA",
    performedBy: "Super Admin",
    target: "Traveloka",
    timestamp: "2026-05-11T16:45:00Z",
  },
  {
    id: "log-004",
    action: "Suspended company",
    performedBy: "Super Admin",
    target: "Mandiri Insurance",
    timestamp: "2026-05-11T14:20:00Z",
  },
  {
    id: "log-005",
    action: "Updated company status",
    performedBy: "Super Admin",
    target: "Astra International → Active",
    timestamp: "2026-05-11T11:00:00Z",
  },
  {
    id: "log-006",
    action: "Created user",
    performedBy: "Super Admin",
    target: "Dr. Hendro Tanoto (Siloam Hospitals)",
    timestamp: "2026-05-10T10:30:00Z",
  },
  {
    id: "log-007",
    action: "Enabled ClaimMind",
    performedBy: "Super Admin",
    target: "Siloam Hospitals Group",
    timestamp: "2026-05-10T09:00:00Z",
  },
  {
    id: "log-008",
    action: "Deactivated user",
    performedBy: "Super Admin",
    target: "Jessica Tanoe (Traveloka)",
    timestamp: "2026-05-09T15:20:00Z",
  },
  {
    id: "log-009",
    action: "Updated user role",
    performedBy: "Super Admin",
    target: "Reza Pratama → company_admin",
    timestamp: "2026-05-09T13:45:00Z",
  },
  {
    id: "log-010",
    action: "Created company",
    performedBy: "Super Admin",
    target: "Siloam Hospitals Group",
    timestamp: "2026-05-08T08:00:00Z",
  },
];

// ============================================================
// Data access helpers (mimics API calls)
// ============================================================

export function getCompanies(): Company[] {
  return mockCompanies;
}

export function getCompanyById(id: string): Company | undefined {
  return mockCompanies.find((c) => c.id === id);
}

export function getUsersByCompany(companyId: string): User[] {
  return mockUsers.filter((u) => u.companyId === companyId);
}

export function getAllUsers(): User[] {
  return mockUsers;
}

export function getSgaUsage(companyId?: string): SgaUsage[] {
  if (companyId) return mockSgaUsage.filter((u) => u.companyId === companyId);
  return mockSgaUsage;
}

export function getIbaUsage(companyId?: string): IbaUsage[] {
  if (companyId) return mockIbaUsage.filter((u) => u.companyId === companyId);
  return mockIbaUsage;
}

export function getClaimMindUsage(companyId?: string): ClaimMindUsage[] {
  if (companyId)
    return mockClaimMindUsage.filter((u) => u.companyId === companyId);
  return mockClaimMindUsage;
}

export function getAuditLog(): AuditLogEntry[] {
  return mockAuditLog;
}
