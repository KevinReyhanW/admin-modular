"use client";

import { UserTable } from "@/components/superadmin/user-table";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border/70 bg-card/75 p-5 shadow-sm backdrop-blur">
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage admin users across all companies.
        </p>
      </div>
      <UserTable />
    </div>
  );
}
