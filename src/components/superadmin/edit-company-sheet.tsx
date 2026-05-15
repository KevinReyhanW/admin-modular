"use client";

import { useState } from "react";
import { useAdminStore } from "@/lib/store";
import {
  PRODUCTS,
  type ProductKey,
  type CompanyStatus,
  type Company,
} from "@/lib/mock-data";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
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

interface EditCompanySheetProps {
  company: Company | null;
  onClose: () => void;
}

export function EditCompanySheet({ company, onClose }: EditCompanySheetProps) {
  return (
    <Sheet open={!!company} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Edit Company</SheetTitle>
        </SheetHeader>
        {company && (
          <EditCompanyForm
            key={company.id}
            company={company}
            onClose={onClose}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

function EditCompanyForm({
  company,
  onClose,
}: {
  company: Company;
  onClose: () => void;
}) {
  const updateCompany = useAdminStore((s) => s.updateCompany);
  const [name, setName] = useState(company.name);
  const [email, setEmail] = useState(company.contactEmail);
  const [status, setStatus] = useState<CompanyStatus>(company.status);
  const [products, setProducts] = useState<Record<ProductKey, boolean>>({
    ...company.productAccess,
  });

  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    const now = new Date().toISOString();
    updateCompany(company.id, {
      name: name.trim(),
      contactEmail: email.trim(),
      status,
      productAccess: { ...products },
      productEnabledAt: {
        sga: products.sga && !company.productAccess.sga ? now : company.productEnabledAt.sga,
        iba: products.iba && !company.productAccess.iba ? now : company.productEnabledAt.iba,
        claimmind: products.claimmind && !company.productAccess.claimmind ? now : company.productEnabledAt.claimmind,
      },
    });
    
    toast.success(`Company ${name} updated successfully.`);
    onClose();
  };

  return (
    <>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="edit-name">Company Name</Label>
          <Input
            id="edit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-email">Primary Contact Email</Label>
          <Input
            id="edit-email"
            type="email"
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
            <SelectTrigger>
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
                id={`edit-product-${key}`}
                checked={products[key]}
                onCheckedChange={(checked) =>
                  setProducts((prev) => ({ ...prev, [key]: !!checked }))
                }
              />
              <label
                htmlFor={`edit-product-${key}`}
                className="text-sm font-medium leading-none cursor-pointer"
              >
                {PRODUCTS[key].name}
              </label>
            </div>
          ))}
        </div>
      </div>
      <SheetFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!name.trim() || !email.trim()}>
          Save Changes
        </Button>
      </SheetFooter>
    </>
  );
}
