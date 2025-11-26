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
import { Eye, EyeOff, Check, X } from "lucide-react";

interface ChangePasswordData {
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordErrors {
  newPassword?: string;
  confirmPassword?: string;
  server?: string;
}

interface ChangePasswordDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ChangePasswordData) => Promise<void>;
  loading?: boolean;
  agentId: string;
}

export function ChangePasswordDialog({
  open,
  onClose,
  onSubmit,
  loading = false,
  agentId,
}: ChangePasswordDialogProps) {
  const [formData, setFormData] = React.useState<ChangePasswordData>({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = React.useState<ChangePasswordErrors>({});
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      setFormData({
        newPassword: "",
        confirmPassword: "",
      });
      setErrors({});
      setShowPassword(false);
      setShowConfirmPassword(false);
    }
  }, [open]);

  const getPasswordRequirements = () => {
    const password = formData.newPassword || "";
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  const validateForm = (): boolean => {
    const newErrors: ChangePasswordErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(
        formData.newPassword
      )
    ) {
      newErrors.newPassword =
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = () => {
    const passwordRequirements = getPasswordRequirements();
    return (
      formData.newPassword &&
      passwordRequirements.minLength &&
      passwordRequirements.hasUppercase &&
      passwordRequirements.hasLowercase &&
      passwordRequirements.hasNumber &&
      passwordRequirements.hasSpecialChar &&
      formData.newPassword === formData.confirmPassword
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
      console.error("Password change error:", error);
      setErrors((prev) => ({
        ...prev,
        server: error.response?.data?.error || "Failed to change password",
      }));
    }
  };

  const handleInputChange = (
    field: keyof ChangePasswordData,
    value: string
  ) => {
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
        className="sm:max-w-md"
        onPointerDownOutside={(e) => {
          if (loading) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (loading) e.preventDefault();
        }}
      >
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold">
            Change Password
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Set a new password for this agent.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.server && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-sm text-destructive">{errors.server}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="newPassword" className="text-sm font-medium mb-2">
                New Password *
              </Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) =>
                    handleInputChange("newPassword", e.target.value)
                  }
                  placeholder="Enter new password"
                  className={
                    errors.newPassword
                      ? "border-destructive focus:border-destructive pr-10"
                      : "pr-10"
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-sm text-destructive mt-1">
                  {errors.newPassword}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium mb-2"
              >
                Confirm New Password *
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  placeholder="Confirm new password"
                  className={
                    errors.confirmPassword
                      ? "border-destructive focus:border-destructive pr-10"
                      : "pr-10"
                  }
                  disabled={!formData.newPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={!formData.newPassword}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Password Requirements */}
            {formData.newPassword && (
              <div className="bg-muted/50 p-3 rounded-lg space-y-2">
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Password Requirements:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    {getPasswordRequirements().minLength ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <X className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span
                      className={`text-xs ${
                        getPasswordRequirements().minLength
                          ? "text-green-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPasswordRequirements().hasUppercase ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <X className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span
                      className={`text-xs ${
                        getPasswordRequirements().hasUppercase
                          ? "text-green-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      One uppercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPasswordRequirements().hasLowercase ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <X className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span
                      className={`text-xs ${
                        getPasswordRequirements().hasLowercase
                          ? "text-green-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      One lowercase letter
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPasswordRequirements().hasNumber ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <X className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span
                      className={`text-xs ${
                        getPasswordRequirements().hasNumber
                          ? "text-green-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      One number
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPasswordRequirements().hasSpecialChar ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <X className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span
                      className={`text-xs ${
                        getPasswordRequirements().hasSpecialChar
                          ? "text-green-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      One special character
                    </span>
                  </div>
                </div>
              </div>
            )}
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
                  <span className="animate-spin mr-2">⏳</span> Changing...
                </>
              ) : (
                "Change Password"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
