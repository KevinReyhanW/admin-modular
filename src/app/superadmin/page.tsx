"use client";

import { useAdminStore } from "@/lib/store";
import { PRODUCTS, type ProductKey, getSgaUsage, getIbaUsage, getClaimMindUsage } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Package, MessageSquare, Brain, FileCheck } from "lucide-react";
import Link from "next/link";

export default function OverviewPage() {
  const companies = useAdminStore((s) => s.companies);
  const users = useAdminStore((s) => s.users);

  const activeCompanies = companies.filter((c) => c.status === "active").length;
  const activeUsers = users.filter((u) => u.isActive).length;

  // Count product subscriptions
  const productCounts: Record<ProductKey, number> = { sga: 0, iba: 0, claimmind: 0 };
  companies.forEach((c) => {
    if (c.productAccess.sga) productCounts.sga++;
    if (c.productAccess.iba) productCounts.iba++;
    if (c.productAccess.claimmind) productCounts.claimmind++;
  });

  // Aggregate usage
  const sgaTotal = getSgaUsage().reduce((acc, u) => acc + u.totalMessages, 0);
  const ibaTotal = getIbaUsage().reduce((acc, u) => acc + u.totalQueries, 0);
  const claimTotal = getClaimMindUsage().reduce((acc, u) => acc + u.totalClaims, 0);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border/70 bg-card/75 p-5 shadow-sm backdrop-blur">
        <Badge variant="outline" className="mb-3 border-primary/20 bg-primary/10 text-primary">
          Super Admin
        </Badge>
        <h1 className="text-2xl font-bold tracking-tight text-balance">
          Overview
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome back. Here&apos;s a summary of your platform.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Companies
            </CardTitle>
            <Building2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companies.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeCompanies} active
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Users
            </CardTitle>
            <Users className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {activeUsers} active
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Product Subscriptions
            </CardTitle>
            <Package className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {productCounts.sga + productCounts.iba + productCounts.claimmind}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              across {companies.length} companies
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-sky-500">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total API Activity
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-sky-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(sgaTotal + ibaTotal + claimTotal).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              messages, queries & claims
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Product breakdown */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Products</h2>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <Card className="transition-colors hover:border-emerald-300">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <CardTitle className="text-sm">{PRODUCTS.sga.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {PRODUCTS.sga.description}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{sgaTotal.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">total messages</p>
                </div>
                <Badge variant="secondary">{productCounts.sga} companies</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-colors hover:border-blue-300">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Brain className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-sm">{PRODUCTS.iba.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {PRODUCTS.iba.description}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{ibaTotal.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">total queries</p>
                </div>
                <Badge variant="secondary">{productCounts.iba} companies</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="transition-colors hover:border-violet-300">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                  <FileCheck className="h-4 w-4 text-violet-600" />
                </div>
                <div>
                  <CardTitle className="text-sm">{PRODUCTS.claimmind.name}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {PRODUCTS.claimmind.description}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold">{claimTotal.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">total claims</p>
                </div>
                <Badge variant="secondary">{productCounts.claimmind} companies</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent companies */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Recent Companies</h2>
          <Link
            href="/superadmin/companies"
            className="text-sm text-primary hover:underline"
          >
            View all →
          </Link>
        </div>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {companies.slice(0, 5).map((company) => (
                <Link
                  key={company.id}
                  href={`/superadmin/companies/${company.id}`}
                  className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{company.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {company.contactEmail}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {(Object.keys(company.productAccess) as ProductKey[])
                      .filter((k) => company.productAccess[k])
                      .map((k) => (
                        <Badge key={k} variant="outline" className="text-[10px]">
                          {PRODUCTS[k].name}
                        </Badge>
                      ))}
                    <Badge
                      variant={
                        company.status === "active"
                          ? "default"
                          : company.status === "inactive"
                          ? "secondary"
                          : "destructive"
                      }
                      className="text-[10px] capitalize"
                    >
                      {company.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
