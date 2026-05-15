"use client";

import { useState } from "react";
import { useAdminStore } from "@/lib/store";
import { PRODUCTS, type ProductKey, type CompanyStatus } from "@/lib/mock-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

interface AddCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCompanyDialog({ open, onOpenChange }: AddCompanyDialogProps) {
  const addCompany = useAdminStore((s) => s.addCompany);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<CompanyStatus>("active");
  const [products, setProducts] = useState<Record<ProductKey, boolean>>({
    sga: false,
    iba: false,
    claimmind: false,
  });

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const now = new Date().toISOString();
    addCompany({
      name: name.trim(),
      contactEmail: email.trim(),
      status,
      productAccess: { ...products },
      productEnabledAt: {
        sga: products.sga ? now : null,
        iba: products.iba ? now : null,
        claimmind: products.claimmind ? now : null,
      },
    });

    toast.success(`Company ${name} created successfully.`);

    // Reset form
    setName("");
    setEmail("");
    setStatus("active");
    setProducts({ sga: false, iba: false, claimmind: false });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Company</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name</Label>
            <Input
              id="company-name"
              placeholder="e.g. Acme Corp"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-email">Primary Contact Email</Label>
            <Input
              id="contact-email"
              type="email"
              placeholder="admin@acme.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={status}
              onValueChange={(v) => v && setStatus(v as CompanyStatus)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-3">
            <Label>Product Access</Label>
            {(Object.keys(PRODUCTS) as ProductKey[]).map((key) => (
              <div key={key} className="flex items-center gap-2">
                <Checkbox
                  id={`product-${key}`}
                  checked={products[key]}
                  onCheckedChange={(checked) =>
                    setProducts((prev) => ({ ...prev, [key]: !!checked }))
                  }
                />
                <label
                  htmlFor={`product-${key}`}
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {PRODUCTS[key].name}
                  <span className="text-muted-foreground font-normal ml-1">
                    — {PRODUCTS[key].description}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name.trim() || !email.trim()}>
            Create Company
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
