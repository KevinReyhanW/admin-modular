"use client";

import { use } from "react";
import { useAdminStore } from "@/lib/store";
import { PRODUCTS, type ProductKey } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProductToggleCard } from "@/components/superadmin/product-toggle-card";
import { UsageCharts } from "@/components/superadmin/usage-charts";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, Building2, Mail, Calendar, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const companies = useAdminStore((s) => s.companies);
  const users = useAdminStore((s) => s.users);
  const deleteCompany = useAdminStore((s) => s.deleteCompany);

  const company = companies.find((c) => c.id === id);
  const companyUsers = users.filter((u) => u.companyId === id);

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-muted-foreground mb-4">Company not found.</p>
        <Link
          href="/superadmin/companies"
          className={buttonVariants({ variant: "outline" })}
        >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Companies
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <div className="flex items-center gap-3 rounded-lg border border-border/70 bg-card/75 p-4 shadow-sm backdrop-blur">
        <Link
          href="/superadmin/companies"
          className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "h-8 w-8")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{company.name}</h1>
          <p className="text-muted-foreground text-sm">{company.contactEmail}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge
            variant={
              company.status === "active"
                ? "default"
                : company.status === "inactive"
                ? "secondary"
                : "destructive"
            }
            className="capitalize"
          >
            {company.status}
          </Badge>
          <button
            onClick={() => {
              if (confirm(`Are you sure you want to delete ${company.name}? This will also delete all associated users.`)) {
                deleteCompany(company.id);
                toast.success(`Company ${company.name} deleted.`);
                router.push("/superadmin/companies");
              }
            }}
            className={cn(buttonVariants({ variant: "destructive", size: "icon" }), "h-8 w-8")}
            title="Delete Company"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
        </TabsList>

        {/* Overview tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Company Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span>{company.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{company.contactEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    Created{" "}
                    {new Date(company.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Active Products
                  </p>
                  <div className="flex gap-1 flex-wrap">
                    {(Object.keys(PRODUCTS) as ProductKey[])
                      .filter((k) => company.productAccess[k])
                      .map((k) => (
                        <Badge key={k} variant="outline" className="text-xs">
                          {PRODUCTS[k].name}
                        </Badge>
                      ))}
                    {!company.productAccess.sga &&
                      !company.productAccess.iba &&
                      !company.productAccess.claimmind && (
                        <span className="text-xs text-muted-foreground">
                          No products enabled
                        </span>
                      )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Assigned Users</CardTitle>
              </CardHeader>
              <CardContent>
                {companyUsers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No users assigned.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {companyUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between text-sm"
                      >
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {user.role.replace("_", " ")}
                          </Badge>
                          <Badge
                            variant={user.isActive ? "default" : "secondary"}
                            className="text-[10px]"
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Products tab */}
        <TabsContent value="products">
          <ProductToggleCard company={company} />
        </TabsContent>

        {/* Users tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Users ({companyUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {companyUsers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-8 text-muted-foreground"
                      >
                        No users assigned to this company.
                      </TableCell>
                    </TableRow>
                  ) : (
                    companyUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-[10px] capitalize">
                            {user.role.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.isActive ? "default" : "secondary"}
                            className="text-[10px]"
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Usage tab */}
        <TabsContent value="usage">
          <UsageCharts companyId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
