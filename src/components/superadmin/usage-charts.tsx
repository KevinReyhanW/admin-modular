"use client";

import {
  getSgaUsage,
  getIbaUsage,
  getClaimMindUsage,
  type SgaUsage,
  type IbaUsage,
  type ClaimMindUsage,
} from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

interface UsageChartsProps {
  companyId: string;
}

export function UsageCharts({ companyId }: UsageChartsProps) {
  const sgaData = getSgaUsage(companyId);
  const ibaData = getIbaUsage(companyId);
  const claimData = getClaimMindUsage(companyId);

  const hasSga = sgaData.length > 0;
  const hasIba = ibaData.length > 0;
  const hasClaim = claimData.length > 0;

  if (!hasSga && !hasIba && !hasClaim) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground text-sm">
          No usage data available for this company.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {hasSga && <SgaUsageCard data={sgaData[0]} />}
      {hasIba && <IbaUsageCard data={ibaData[0]} />}
      {hasClaim && <ClaimMindUsageCard data={claimData[0]} />}
    </div>
  );
}

function SgaUsageCard({ data }: { data: SgaUsage }) {
  const chartData = data.dailyMessages.slice(-14).map((d) => ({
    date: d.date.slice(5),
    messages: d.count,
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">SGA — Smart Guest Assistant</CardTitle>
          <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-700 border-emerald-200">
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <MetricItem
            label="Total Messages"
            value={data.totalMessages.toLocaleString()}
          />
          <MetricItem
            label="Active Sessions Today"
            value={data.activeSessionsToday.toString()}
          />
          <MetricItem
            label="Avg Response Time"
            value={`${data.avgResponseTime}s`}
          />
          <MetricItem
            label="Language Split"
            value={`EN ${Math.round(
              (data.languageBreakdown.en /
                (data.languageBreakdown.en + data.languageBreakdown.id)) *
                100
            )}% / ID ${Math.round(
              (data.languageBreakdown.id /
                (data.languageBreakdown.en + data.languageBreakdown.id)) *
                100
            )}%`}
          />
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" className="text-xs" tick={{ fontSize: 10 }} />
              <YAxis className="text-xs" tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid hsl(var(--border))",
                }}
              />
              <Bar dataKey="messages" fill="hsl(152, 57%, 52%)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function IbaUsageCard({ data }: { data: IbaUsage }) {
  const chartData = data.dailyQueries.slice(-14).map((d) => ({
    date: d.date.slice(5),
    queries: d.count,
  }));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">
            IBA — Intelligent Business Advisor
          </CardTitle>
          <Badge variant="outline" className="text-[10px] bg-blue-500/10 text-blue-700 border-blue-200">
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          <MetricItem
            label="Total Queries"
            value={data.totalQueries.toLocaleString()}
          />
          <MetricItem
            label="Active Users This Month"
            value={data.activeUsersThisMonth.toString()}
          />
          <div>
            <p className="text-xs text-muted-foreground mb-1">Top Topics</p>
            <div className="space-y-0.5">
              {data.mostAskedTopics.slice(0, 3).map((t) => (
                <p key={t.topic} className="text-xs">
                  {t.topic}{" "}
                  <span className="text-muted-foreground">({t.count})</span>
                </p>
              ))}
            </div>
          </div>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" className="text-xs" tick={{ fontSize: 10 }} />
              <YAxis className="text-xs" tick={{ fontSize: 10 }} />
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
      </CardContent>
    </Card>
  );
}

function ClaimMindUsageCard({ data }: { data: ClaimMindUsage }) {
  const chartData = data.dailyClaims.slice(-14).map((d) => ({
    date: d.date.slice(5),
    claims: d.count,
  }));

  const total = data.approved + data.rejected;
  const approvedPct = total > 0 ? Math.round((data.approved / total) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-base">ClaimMind</CardTitle>
          <Badge variant="outline" className="text-[10px] bg-violet-500/10 text-violet-700 border-violet-200">
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <MetricItem
            label="Total Claims"
            value={data.totalClaims.toLocaleString()}
          />
          <MetricItem
            label="In Review"
            value={data.claimsInReview.toString()}
          />
          <MetricItem
            label="Approved / Rejected"
            value={`${approvedPct}% / ${100 - approvedPct}%`}
          />
          <MetricItem
            label="Avg Processing Time"
            value={`${data.avgProcessingTime}h`}
          />
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="date" className="text-xs" tick={{ fontSize: 10 }} />
              <YAxis className="text-xs" tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid hsl(var(--border))",
                }}
              />
              <Bar dataKey="claims" fill="hsl(263, 70%, 58%)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}
