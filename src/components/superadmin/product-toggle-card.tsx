"use client";

import { useState } from "react";
import { useAdminStore } from "@/lib/store";
import { PRODUCTS, type ProductKey, type Company } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare, Brain, FileCheck } from "lucide-react";

const productIcons: Record<ProductKey, React.ElementType> = {
  sga: MessageSquare,
  iba: Brain,
  claimmind: FileCheck,
};

const productColors: Record<ProductKey, string> = {
  sga: "text-emerald-600 bg-emerald-500/10",
  iba: "text-blue-600 bg-blue-500/10",
  claimmind: "text-violet-600 bg-violet-500/10",
};

interface ProductToggleCardProps {
  company: Company;
}

export function ProductToggleCard({ company }: ProductToggleCardProps) {
  const toggleProduct = useAdminStore((s) => s.toggleProduct);
  const [confirmState, setConfirmState] = useState<{
    product: ProductKey;
    enabling: boolean;
  } | null>(null);

  const handleToggle = (product: ProductKey) => {
    const currentlyEnabled = company.productAccess[product];
    if (currentlyEnabled) {
      // Disabling — show confirmation
      setConfirmState({ product, enabling: false });
    } else {
      // Enabling — show confirmation
      setConfirmState({ product, enabling: true });
    }
  };

  const confirmToggle = () => {
    if (!confirmState) return;
    toggleProduct(company.id, confirmState.product);
    setConfirmState(null);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Product Access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(Object.keys(PRODUCTS) as ProductKey[]).map((key) => {
            const Icon = productIcons[key];
            const colorClass = productColors[key];
            const enabled = company.productAccess[key];
            const lastEnabled = company.productEnabledAt[key];

            return (
              <div
                key={key}
                className="flex items-center justify-between gap-4 rounded-lg border border-border/80 bg-background/45 p-3 transition-colors hover:bg-accent/35"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${colorClass}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {PRODUCTS[key].name}
                      </span>
                      <Badge
                        variant={enabled ? "default" : "secondary"}
                        className="text-[10px]"
                      >
                        {enabled ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {PRODUCTS[key].description}
                    </p>
                    {lastEnabled && (
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Last enabled:{" "}
                        {new Date(lastEnabled).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                </div>
                <Switch
                  checked={enabled}
                  onCheckedChange={() => handleToggle(key)}
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Confirmation dialog */}
      <Dialog
        open={!!confirmState}
        onOpenChange={(open) => !open && setConfirmState(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {confirmState?.enabling ? "Enable" : "Disable"}{" "}
              {confirmState ? PRODUCTS[confirmState.product].name : ""}
            </DialogTitle>
            <DialogDescription>
              {confirmState?.enabling
                ? `Enable ${confirmState ? PRODUCTS[confirmState.product].name : ""} for ${company.name}? This will immediately grant access for all users under this company.`
                : `Disable ${confirmState ? PRODUCTS[confirmState.product].name : ""} for ${company.name}? This will immediately revoke access for all users under this company.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmState(null)}>
              Cancel
            </Button>
            <Button
              variant={confirmState?.enabling ? "default" : "destructive"}
              onClick={confirmToggle}
            >
              {confirmState?.enabling ? "Enable" : "Disable"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
