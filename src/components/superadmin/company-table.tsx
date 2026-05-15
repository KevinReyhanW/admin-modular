"use client";

import { useState } from "react";
import { useAdminStore } from "@/lib/store";
import { PRODUCTS, type ProductKey } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Building2, MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";
import { AddCompanyDialog } from "./add-company-dialog";
import { EditCompanySheet } from "./edit-company-sheet";
import { EmptyState } from "@/components/ui/empty-state";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Company } from "@/lib/mock-data";

export function CompanyTable() {
  const companies = useAdminStore((s) => s.companies);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [productFilter, setProductFilter] = useState<string>("all");
  const [addOpen, setAddOpen] = useState(false);
  const [editCompany, setEditCompany] = useState<Company | null>(null);

  const filtered = companies.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.contactEmail.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || c.status === statusFilter;
    const matchesProduct =
      productFilter === "all" ||
      c.productAccess[productFilter as ProductKey] === true;
    return matchesSearch && matchesStatus && matchesProduct;
  });

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => value && setStatusFilter(value)}
          >
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={productFilter}
            onValueChange={(value) => value && setProductFilter(value)}
          >
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Product" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="sga">SGA</SelectItem>
              <SelectItem value="iba">IBA</SelectItem>
              <SelectItem value="claimmind">ClaimMind</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setAddOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Company
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-border/80 bg-card/80 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead className="hidden md:table-cell">Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Products</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12">
                  <EmptyState
                    title="No companies found"
                    description="We couldn't find any companies matching your search filters. Try adjusting your search criteria."
                    actionLabel="Clear Filters"
                    onAction={() => {
                      setSearch("");
                      setStatusFilter("all");
                      setProductFilter("all");
                    }}
                  />
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>
                    <Link
                      href={`/superadmin/companies/${company.id}`}
                      className="flex items-center gap-2 hover:underline"
                    >
                      <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                        <Building2 className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="font-medium text-sm">{company.name}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {company.contactEmail}
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex gap-1 flex-wrap">
                      {(Object.keys(company.productAccess) as ProductKey[])
                        .filter((k) => company.productAccess[k])
                        .map((k) => (
                          <Badge
                            key={k}
                            variant="outline"
                            className="text-[10px]"
                          >
                            {PRODUCTS[k].name}
                          </Badge>
                        ))}
                      {!company.productAccess.sga &&
                        !company.productAccess.iba &&
                        !company.productAccess.claimmind && (
                          <span className="text-xs text-muted-foreground">
                            None
                          </span>
                        )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={<Button variant="ghost" className="h-8 w-8 p-0" />}
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            render={<Link href={`/superadmin/companies/${company.id}`} className="cursor-pointer" />}
                          >
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => setEditCompany(company)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Company
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AddCompanyDialog open={addOpen} onOpenChange={setAddOpen} />
      <EditCompanySheet
        company={editCompany}
        onClose={() => setEditCompany(null)}
      />
    </div>
  );
}
