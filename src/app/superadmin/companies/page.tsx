"use client";

import { CompanyTable } from "@/components/superadmin/company-table";

export default function CompaniesPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border/70 bg-card/75 p-5 shadow-sm backdrop-blur">
        <h1 className="text-2xl font-bold tracking-tight">Companies</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage all tenant companies and their product access.
        </p>
      </div>
      <CompanyTable />
    </div>
  );
}
