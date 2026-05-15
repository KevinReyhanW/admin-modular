"use client";

import { useState } from "react";
import { useAdminStore } from "@/lib/store";
import type { UserRole } from "@/lib/mock-data";
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
import { Search, Plus, UserCircle, Trash2, MoreHorizontal } from "lucide-react";
import { AddUserDialog } from "./add-user-dialog";
import { toast } from "sonner";
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

export function UserTable() {
  const users = useAdminStore((s) => s.users);
  const companies = useAdminStore((s) => s.companies);
  const toggleUserActive = useAdminStore((s) => s.toggleUserActive);
  const updateUser = useAdminStore((s) => s.updateUser);
  const deleteUser = useAdminStore((s) => s.deleteUser);

  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [addOpen, setAddOpen] = useState(false);

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchesCompany =
      companyFilter === "all" || u.companyId === companyFilter;
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesCompany && matchesRole;
  });

  const getCompanyName = (companyId: string) => {
    return companies.find((c) => c.id === companyId)?.name ?? "Unknown";
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select
            value={companyFilter}
            onValueChange={(value) => value && setCompanyFilter(value)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Company" />
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
          <Select
            value={roleFilter}
            onValueChange={(value) => value && setRoleFilter(value)}
          >
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="company_admin">Company Admin</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setAddOpen(true)} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add User
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-border/80 bg-card/80 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="hidden sm:table-cell">Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-12"
                >
                  <EmptyState
                    title="No users found"
                    description="We couldn't find any users matching your search filters. Try adjusting your search criteria."
                    actionLabel="Clear Filters"
                    onAction={() => {
                      setSearch("");
                      setCompanyFilter("all");
                      setRoleFilter("all");
                    }}
                  />
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <UserCircle className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="font-medium text-sm">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell className="text-sm">
                    {getCompanyName(user.companyId)}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
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
                            onClick={() => {
                              const newRole = user.role === "company_admin" ? "viewer" : "company_admin";
                              updateUser(user.id, { role: newRole });
                              toast.success(`Role updated to ${newRole.replace("_", " ")}`);
                            }}
                          >
                            {user.role === "company_admin" ? "Make Viewer" : "Make Admin"}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              toggleUserActive(user.id);
                              toast.success(`User ${user.name} ${user.isActive ? 'deactivated' : 'activated'}`);
                            }}
                          >
                            {user.isActive ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${user.name}?`)) {
                                deleteUser(user.id);
                                toast.success(`User ${user.name} deleted`);
                              }
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
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

      <AddUserDialog open={addOpen} onOpenChange={setAddOpen} />
    </div>
  );
}
