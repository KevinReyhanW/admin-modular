"use client";

import { useState } from "react";
import { useAdminSession } from "@/lib/hooks";
import { getAuditLog } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User, Shield } from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const session = useAdminSession();
  const auditLog = getAuditLog();

  const [name, setName] = useState(session.name);
  const [email, setEmail] = useState(session.email);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border/70 bg-card/75 p-5 shadow-sm backdrop-blur">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your profile and view system audit logs.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="audit">Audit Log</TabsTrigger>
        </TabsList>

        {/* Profile tab */}
        <TabsContent value="profile" className="mt-6">
          <div className="grid gap-8 md:grid-cols-2 lg:max-w-5xl">
            <Card className="border-border/50 shadow-sm bg-card/60 backdrop-blur-sm transition-all duration-200 hover:shadow-md hover:bg-card/80">
              <CardHeader className="px-6 pt-6 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-md">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Profile Information</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Update your personal details.</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 px-6 pb-6">
                <div className="space-y-2.5">
                  <Label htmlFor="settings-name" className="text-sm font-medium">Full Name</Label>
                  <Input
                    id="settings-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-10 transition-colors focus-visible:ring-primary/30"
                  />
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="settings-email" className="text-sm font-medium">Email Address</Label>
                  <Input
                    id="settings-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 transition-colors focus-visible:ring-primary/30"
                  />
                </div>
                <div className="pt-2">
                  <Label className="text-sm font-medium block mb-2.5">Current Role</Label>
                  <Badge variant="secondary" className="px-3 py-1 bg-muted/50 text-muted-foreground uppercase text-[11px] font-semibold tracking-wider">
                    {session.role.replace("_", " ")}
                  </Badge>
                </div>
                <div className="pt-2">
                  <Separator className="mb-6 opacity-60" />
                  <Button onClick={() => toast.success("Profile updated successfully")} className="w-full sm:w-auto h-10 px-6 font-medium">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 shadow-sm bg-card/60 backdrop-blur-sm transition-all duration-200 hover:shadow-md hover:bg-card/80">
              <CardHeader className="px-6 pt-6 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-md">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Security Settings</CardTitle>
                    <p className="text-xs text-muted-foreground mt-0.5">Change your account password.</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 px-6 pb-6">
                <div className="space-y-2.5">
                  <Label htmlFor="current-password" className="text-sm font-medium">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="h-10 transition-colors focus-visible:ring-primary/30"
                  />
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="new-password" className="text-sm font-medium">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-10 transition-colors focus-visible:ring-primary/30"
                  />
                </div>
                <div className="pt-2">
                  <Separator className="mb-6 opacity-60" />
                  <Button
                    disabled={!currentPassword || !newPassword}
                    onClick={() => {
                      toast.success("Password updated successfully");
                      setCurrentPassword("");
                      setNewPassword("");
                    }}
                    className="w-full sm:w-auto h-10 px-6 font-medium"
                  >
                    Update Password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Audit Log tab */}
        <TabsContent value="audit" className="mt-6">
          <Card className="border-border/50 shadow-sm overflow-hidden">
            <CardHeader className="px-6 py-5 bg-muted/20 border-b border-border/40">
              <CardTitle className="text-lg">Recent System Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-muted/10">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-6 h-11 text-xs uppercase font-semibold text-muted-foreground tracking-wider">Action</TableHead>
                    <TableHead className="hidden sm:table-cell h-11 text-xs uppercase font-semibold text-muted-foreground tracking-wider">Performed By</TableHead>
                    <TableHead className="h-11 text-xs uppercase font-semibold text-muted-foreground tracking-wider">Target</TableHead>
                    <TableHead className="text-right pr-6 h-11 text-xs uppercase font-semibold text-muted-foreground tracking-wider">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLog.map((entry) => (
                    <TableRow key={entry.id} className="group hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium text-sm pl-6 py-3">
                        {entry.action}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground py-3">
                        {entry.performedBy}
                      </TableCell>
                      <TableCell className="text-sm py-3">
                        <Badge variant="outline" className="font-normal text-xs bg-background/50">
                          {entry.target}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-xs text-muted-foreground pr-6 py-3">
                        {new Date(entry.timestamp).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
