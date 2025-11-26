"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Agent } from "./AgentTable";

interface EditAgentData {
  name: string;
  email: string;
  phone: string;
}

interface EditAgentErrors extends Partial<EditAgentData> {
  server?: string;
}

interface EditAgentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: EditAgentData) => Promise<void>;
  agent: Agent | null;
  loading?: boolean;
}

export function EditAgentDialog({
  open,
  onClose,
  onSubmit,
  agent,
  loading = false,
}: EditAgentDialogProps) {
  const [formData, setFormData] = React.useState<EditAgentData>({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = React.useState<EditAgentErrors>({});

  // Reset form when dialog opens or agent changes
  React.useEffect(() => {
    if (open && agent) {
      setFormData({
        name: agent.name,
        email: agent.email,
        phone: agent.phone || "",
      });
      setErrors({});
    }
  }, [open, agent]);

  const validateForm = (): boolean => {
    const newErrors: EditAgentErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.phone && !/^\+?[\d\s\-\(\)]{7,15}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number (7-15 digits)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = () => {
    return (
      formData.name?.trim() &&
      formData.email?.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email || "")
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error: any) {
      if (
        error.response?.status === 409 &&
        error.response?.data?.error?.includes("Email address is already taken")
      ) {
        setErrors((prev) => ({
          ...prev,
          email: error.response.data.error,
        }));
      } else {
        console.error("Form submission error:", error);
      }
    }
  };

  const handleInputChange = (field: keyof EditAgentData, value: string) => {
    if (field === "phone") {
      value = value.replace(/[^\d\s\-\(\)\+]/g, "");
    }

    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen && !loading) {
          onClose();
        }
      }}
      modal={true}
    >
      <DialogContent
        className="sm:max-w-lg"
        onPointerDownOutside={(e) => {
          if (loading) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (loading) e.preventDefault();
        }}
      >
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold">
            Edit Agent
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Update agent information below.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium mb-2">
                Full Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter full name"
                className={errors.name ? "border-destructive" : "shadow-none"}
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium mb-2">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter email address"
                className={
                  errors.email
                    ? "border-destructive focus:border-destructive"
                    : ""
                }
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium mb-2">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter phone number (optional)"
                className={
                  errors.phone
                    ? "border-destructive focus:border-destructive"
                    : ""
                }
                maxLength={20}
              />
              {errors.phone && (
                <p className="text-sm text-destructive mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !isFormValid()}>
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
