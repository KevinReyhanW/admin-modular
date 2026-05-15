"use client";

import { useAdminSession } from "@/lib/hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User, Menu } from "lucide-react";
import { useAuthStore } from "@/lib/hooks";
import { useRouter } from "next/navigation";

interface TopbarProps {
  onMobileMenuToggle?: () => void;
}

export function Topbar({ onMobileMenuToggle }: TopbarProps) {
  const session = useAdminSession();
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const initials = session.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-14 px-4 md:px-6 border-b border-border/70 bg-background/75 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-8 w-8"
          onClick={onMobileMenuToggle}
        >
          <Menu className="h-4 w-4" />
        </Button>
        <div className="hidden sm:block">
          <h1 className="text-sm font-semibold leading-none">Dashboard</h1>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Tenant and product operations
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground bg-muted px-2 py-1 rounded-md">
            {session.role.replace("_", " ")}
          </span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="h-8 gap-2 px-2">
                <Avatar className="h-6 w-6 ring-1 ring-primary/20">
                  <AvatarFallback className="text-[10px] bg-primary text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden sm:inline">
                  {session.name}
                </span>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{session.name}</p>
              <p className="text-xs text-muted-foreground">{session.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
