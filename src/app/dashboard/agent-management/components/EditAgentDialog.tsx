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
import { Agent } from "./AgentTable";

interface EditAgentData {
  name: string;
  email: string;
  phone: string;
  password?: string;
  confirmPassword?: string;
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
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = React.useState<EditAgentErrors>({});
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  // Reset form when dialog opens or agent changes
  React.useEffect(() => {
    if (open && agent) {
      setFormData({
        name: agent.name,
        email: agent.email,
        phone: agent.phone || "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
    }
  }, [open, agent]);

  const validateForm = (): boolean => {
    const newErrors: EditAgentErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.phone && !/^\+?[\d\s\-\(\)]{7,15}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number (7-15 digits)";
    }

    // Password validation only if provided
    if (formData.password) {
      if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/.test(
          formData.password
        )
      ) {
        newErrors.password =
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getPasswordRequirements = () => {
    const password = formData.password || "";
    return {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  const isFormValid = () => {
    const basicValidation =
      formData.name.trim() &&
      formData.email.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);

    if (!formData.password) {
      return basicValidation;
    }

    const passwordRequirements = getPasswordRequirements();
    const passwordValid =
      formData.password &&
      passwordRequirements.minLength &&
      passwordRequirements.hasUppercase &&
      passwordRequirements.hasLowercase &&
      passwordRequirements.hasNumber &&
      passwordRequirements.hasSpecialChar &&
      formData.password === formData.confirmPassword;

    return basicValidation && passwordValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Only send password if it was provided
      const submitData = { ...formData };
      if (!submitData.password) {
        delete submitData.password;
        delete submitData.confirmPassword;
      }
      await onSubmit(submitData);
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

            <div className="border-t pt-4 mt-2">
              <p className="text-sm font-medium mb-4">
                Change Password (Optional)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="password"
                    className="text-sm font-medium mb-2"
                  >
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      placeholder="Leave blank to keep current"
                      className={
                        errors.password
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
                  {errors.password && (
                    <p className="text-sm text-destructive mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium mb-2"
                  >
                    Confirm New Password
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
                      disabled={!formData.password}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      disabled={!formData.password}
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
              </div>

              {/* Password Requirements - Only show if password is being typed */}
              {formData.password && (
                <div className="bg-muted/50 p-3 rounded-lg space-y-2 mt-4">
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
