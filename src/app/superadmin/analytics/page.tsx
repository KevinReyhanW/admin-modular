"use client";

import { useState } from "react";
import { useAdminStore } from "@/lib/store";
import {
  getSgaUsage,
  getIbaUsage,
  getClaimMindUsage,
} from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Brain, FileCheck } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

export default function AnalyticsPage() {
  const companies = useAdminStore((s) => s.companies);
  const [companyFilter, setCompanyFilter] = useState<string>("all");

  const selectedCompanyId =
    companyFilter === "all" ? undefined : companyFilter;

  const sgaData = getSgaUsage(selectedCompanyId);
  const ibaData = getIbaUsage(selectedCompanyId);
  const claimData = getClaimMindUsage(selectedCompanyId);

  // Aggregate totals
  const sgaTotalMessages = sgaData.reduce((a, d) => a + d.totalMessages, 0);
  const sgaActiveSessions = sgaData.reduce(
    (a, d) => a + d.activeSessionsToday,
    0
  );
  const ibaTotalQueries = ibaData.reduce((a, d) => a + d.totalQueries, 0);
  const ibaActiveUsers = ibaData.reduce(
    (a, d) => a + d.activeUsersThisMonth,
    0
  );
  const claimTotalClaims = claimData.reduce((a, d) => a + d.totalClaims, 0);
  const claimInReview = claimData.reduce((a, d) => a + d.claimsInReview, 0);
  const claimApproved = claimData.reduce((a, d) => a + d.approved, 0);
  const claimRejected = claimData.reduce((a, d) => a + d.rejected, 0);

  // Merge daily data for charts
  const sgaChartData = mergeDailyData(
    sgaData.flatMap((d) => d.dailyMessages),
    "messages"
  ).slice(-14);
  const ibaChartData = mergeDailyData(
    ibaData.flatMap((d) => d.dailyQueries),
    "queries"
  ).slice(-14);
  const claimChartData = mergeDailyData(
    claimData.flatMap((d) => d.dailyClaims),
    "claims"
  ).slice(-14);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-border/70 bg-card/75 p-5 shadow-sm backdrop-blur">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Usage & Analytics
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Platform-wide usage metrics across all products.
          </p>
        </div>
        <Select
          value={companyFilter}
          onValueChange={(value) => value && setCompanyFilter(value)}
        >
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Filter by company" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Companies</SelectItem>
            {companies.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card className="border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-emerald-600" />
            </div>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              SGA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {sgaTotalMessages.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {sgaActiveSessions} active sessions today
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Brain className="h-4 w-4 text-blue-600" />
            </div>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              IBA
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {ibaTotalQueries.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {ibaActiveUsers} active users this month
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-violet-500">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
              <FileCheck className="h-4 w-4 text-violet-600" />
            </div>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              ClaimMind
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {claimTotalClaims.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {claimInReview} in review ·{" "}
              {claimApproved + claimRejected > 0
                ? `${Math.round(
                    (claimApproved / (claimApproved + claimRejected)) * 100
                  )}% approved`
                : "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="sga" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sga">SGA</TabsTrigger>
          <TabsTrigger value="iba">IBA</TabsTrigger>
          <TabsTrigger value="claimmind">ClaimMind</TabsTrigger>
        </TabsList>

        <TabsContent value="sga">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                SGA — Daily Messages (Last 14 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sgaChartData.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  No SGA data available
                  {selectedCompanyId ? " for this company" : ""}.
                </p>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sgaChartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-border"
                      />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{
                          fontSize: 12,
                          borderRadius: 8,
                          border: "1px solid hsl(var(--border))",
                        }}
                      />
                      <Bar
                        dataKey="messages"
                        fill="hsl(152, 57%, 52%)"
                        radius={[3, 3, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* SGA detail metrics */}
              {sgaData.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
                  {sgaData.map((d) => {
                    const company = companies.find(
                      (c) => c.id === d.companyId
                    );
                    return (
                      <div key={d.companyId} className="space-y-1">
                        <p className="text-xs font-medium">
                          {company?.name ?? d.companyId}
                        </p>
                        <p className="text-sm">
                          {d.totalMessages.toLocaleString()} msgs
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Avg {d.avgResponseTime}s · EN{" "}
                          {Math.round(
                            (d.languageBreakdown.en /
                              (d.languageBreakdown.en +
                                d.languageBreakdown.id)) *
                              100
                          )}
                          %
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="iba">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                IBA — Daily Queries (Last 14 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {ibaChartData.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  No IBA data available
                  {selectedCompanyId ? " for this company" : ""}.
                </p>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={ibaChartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-border"
                      />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{
                          fontSize: 12,
                          borderRadius: 8,
                          border: "1px solid hsl(var(--border))",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="queries"
                        stroke="hsl(217, 91%, 60%)"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* IBA top topics per company */}
              {ibaData.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                  {ibaData.map((d) => {
                    const company = companies.find(
                      (c) => c.id === d.companyId
                    );
                    return (
                      <div key={d.companyId}>
                        <p className="text-xs font-medium mb-1">
                          {company?.name ?? d.companyId}
                        </p>
                        <p className="text-sm mb-1">
                          {d.totalQueries.toLocaleString()} queries ·{" "}
                          {d.activeUsersThisMonth} active users
                        </p>
                        <div className="space-y-0.5">
                          {d.mostAskedTopics.slice(0, 3).map((t) => (
                            <p
                              key={t.topic}
                              className="text-xs text-muted-foreground"
                            >
                              {t.topic} ({t.count})
                            </p>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="claimmind">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                ClaimMind — Daily Claims (Last 14 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {claimChartData.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  No ClaimMind data available
                  {selectedCompanyId ? " for this company" : ""}.
                </p>
              ) : (
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={claimChartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-border"
                      />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 10 }}
                      />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip
                        contentStyle={{
                          fontSize: 12,
                          borderRadius: 8,
                          border: "1px solid hsl(var(--border))",
                        }}
                      />
                      <Bar
                        dataKey="claims"
                        fill="hsl(263, 70%, 58%)"
                        radius={[3, 3, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* ClaimMind detail per company */}
              {claimData.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                  {claimData.map((d) => {
                    const company = companies.find(
                      (c) => c.id === d.companyId
                    );
                    const total = d.approved + d.rejected;
                    return (
                      <div key={d.companyId}>
                        <p className="text-xs font-medium mb-1">
                          {company?.name ?? d.companyId}
                        </p>
                        <p className="text-sm">
                          {d.totalClaims.toLocaleString()} claims ·{" "}
                          {d.claimsInReview} in review
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {total > 0
                            ? `${Math.round((d.approved / total) * 100)}% approved`
                            : "N/A"}{" "}
                          · Avg {d.avgProcessingTime}h
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Helper to merge daily data from multiple companies
function mergeDailyData(
  data: { date: string; count: number }[],
  key: string
): Record<string, number | string>[] {
  const map = new Map<string, number>();
  data.forEach((d) => {
    map.set(d.date, (map.get(d.date) || 0) + d.count);
  });
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date: date.slice(5), [key]: count }));
}
