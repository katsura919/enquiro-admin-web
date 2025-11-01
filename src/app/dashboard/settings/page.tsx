"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Check,
  Save,
  Shield,
  Eye,
  EyeOff,
  Lock,
  Smartphone,
  Clock,
  Globe,
  AlertTriangle,
  Download,
  RefreshCw,
  KeyRound,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import api from "@/utils/api";
import { otpService } from "@/services/otpService";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface UserData {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePicture?: string;
  isVerified: boolean;
  businessId: string;
  role: string;
  createdAt?: string;
  lastLogin?: string;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  emailNotifications: boolean;
  loginAlerts: boolean;
  sessionTimeout: number;
  lastPasswordChange: string;
  activeSessions: number;
}

interface OtpSettings {
  otpEnabled: boolean;
  hasBackupCodes: boolean;
  backupCodesCount: number;
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function AccountSettingsPage() {
  const { user: authUser } = useAuth();

  const [initialUserData, setInitialUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    isVerified: false,
    businessId: "",
    role: "",
  });
  const [userData, setUserData] = useState<UserData>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    isVerified: false,
    businessId: "",
    role: "",
  });
  const [initialSecuritySettings, setInitialSecuritySettings] =
    useState<SecuritySettings>({
      twoFactorEnabled: false,
      emailNotifications: true,
      loginAlerts: true,
      sessionTimeout: 30,
      lastPasswordChange: "2024-10-15T10:30:00Z",
      activeSessions: 3,
    });
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    emailNotifications: true,
    loginAlerts: true,
    sessionTimeout: 30,
    lastPasswordChange: "2024-10-15T10:30:00Z",
    activeSessions: 3,
  });
  const [otpSettings, setOtpSettings] = useState<OtpSettings>({
    otpEnabled: false,
    hasBackupCodes: false,
    backupCodesCount: 0,
  });
  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeSection, setActiveSection] = useState<"password" | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    phoneNumber?: string;
  }>({});
  const [passwordErrors, setPasswordErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  // OTP-related state
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpAction, setOtpAction] = useState<"enable" | "disable" | "backup">(
    "enable"
  );
  const [otpPassword, setOtpPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
    fetchOtpStatus();
  }, []);

  const fetchOtpStatus = async () => {
    try {
      const status = await otpService.getStatus();
      setOtpSettings(status);
      // Update security settings to reflect OTP status
      setSecuritySettings((prev) => ({
        ...prev,
        twoFactorEnabled: status.otpEnabled,
      }));
      setInitialSecuritySettings((prev) => ({
        ...prev,
        twoFactorEnabled: status.otpEnabled,
      }));
    } catch (error: any) {
      console.error("Error fetching OTP status:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/user/info");
      const user = response.data;

      const userInfo: UserData = {
        _id: user._id,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        profilePicture: user.profilePicture,
        isVerified: user.isVerified || false,
        businessId: user.businessId || "",
        role: user.role || "",
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      };

      setUserData(userInfo);
      setInitialUserData(userInfo);
    } catch (err: any) {
      console.error("Error fetching user data:", err);
      toast.error(err.response?.data?.error || "Failed to load user data");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if there are changes
  const hasChanges = () => {
    const userDataChanged =
      userData.firstName !== initialUserData.firstName ||
      userData.lastName !== initialUserData.lastName ||
      userData.email !== initialUserData.email ||
      userData.phoneNumber !== initialUserData.phoneNumber;

    const securityChanged =
      securitySettings.twoFactorEnabled !==
        initialSecuritySettings.twoFactorEnabled ||
      securitySettings.emailNotifications !==
        initialSecuritySettings.emailNotifications ||
      securitySettings.loginAlerts !== initialSecuritySettings.loginAlerts ||
      securitySettings.sessionTimeout !==
        initialSecuritySettings.sessionTimeout;

    return userDataChanged || securityChanged;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return undefined;
  };

  const validatePhoneNumber = (phoneNumber: string): string | undefined => {
    if (!phoneNumber) return undefined; // Phone number is optional
    const phoneRegex = /^\+?[\d\s\-()]+$/;
    if (!phoneRegex.test(phoneNumber))
      return "Phone number can only contain numbers, spaces, +, -, and ()";
    // Additional check for only digits (after removing formatting characters)
    const digitsOnly = phoneNumber.replace(/[\s\-()]/g, "");
    if (!/^[\d+]+$/.test(digitsOnly))
      return "Phone number must contain only numbers";
    return undefined;
  };

  const handleInputChange = (field: string, value: string) => {
    setUserData((prev: UserData) => ({ ...prev, [field]: value }));

    // Validate on change
    if (field === "email") {
      const error = validateEmail(value);
      setValidationErrors((prev) => ({ ...prev, email: error }));
    } else if (field === "phoneNumber") {
      const error = validatePhoneNumber(value);
      setValidationErrors((prev) => ({ ...prev, phoneNumber: error }));
    }
  };

  const handleSecuritySettingChange = (
    setting: keyof SecuritySettings,
    value: boolean | number
  ) => {
    setSecuritySettings((prev) => ({ ...prev, [setting]: value }));
  };

  const validatePasswordField = (
    field: keyof PasswordChangeData,
    value: string
  ): string | undefined => {
    if (field === "currentPassword") {
      if (!value) return "Current password is required";
      return undefined;
    }

    if (field === "newPassword") {
      if (!value) return "New password is required";
      if (value.length < 6)
        return "Password must be at least 6 characters long";
      if (
        passwordData.currentPassword &&
        value === passwordData.currentPassword
      ) {
        return "New password must be different from current password";
      }
      return undefined;
    }

    if (field === "confirmPassword") {
      if (!value) return "Please confirm your new password";
      if (passwordData.newPassword && value !== passwordData.newPassword) {
        return "Passwords do not match";
      }
      return undefined;
    }
  };

  const handlePasswordChange = (
    field: keyof PasswordChangeData,
    value: string
  ) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));

    // Validate on change
    const error = validatePasswordField(field, value);
    setPasswordErrors((prev) => ({ ...prev, [field]: error }));

    // Also revalidate confirm password when new password changes
    if (field === "newPassword" && passwordData.confirmPassword) {
      const confirmError = validatePasswordField(
        "confirmPassword",
        passwordData.confirmPassword
      );
      setPasswordErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const handleSave = async () => {
    // Validate before saving
    const emailError = validateEmail(userData.email);
    const phoneError = validatePhoneNumber(userData.phoneNumber);

    if (emailError || phoneError) {
      setValidationErrors({
        email: emailError,
        phoneNumber: phoneError,
      });
      toast.error("Please fix validation errors before saving");
      return;
    }

    setIsSaving(true);

    try {
      if (!userData._id) {
        throw new Error("User ID not found");
      }

      // Prepare update data (excluding password)
      const updateData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        profilePicture: userData.profilePicture,
      };

      const response = await api.put(`/user/${userData._id}`, updateData);

      // Update both current and initial data with the response
      const updatedUser = response.data;
      const userInfo: UserData = {
        _id: updatedUser._id,
        firstName: updatedUser.firstName || "",
        lastName: updatedUser.lastName || "",
        email: updatedUser.email || "",
        phoneNumber: updatedUser.phoneNumber || "",
        profilePicture: updatedUser.profilePicture,
        isVerified: updatedUser.isVerified || false,
        businessId: updatedUser.businessId || "",
        role: updatedUser.role || "",
        createdAt: updatedUser.createdAt,
        lastLogin: updatedUser.lastLogin,
      };

      setUserData(userInfo);
      setInitialUserData(userInfo);
      setInitialSecuritySettings(securitySettings);

      toast.success("Account settings updated successfully!");
    } catch (err: any) {
      console.error("Error updating account:", err);
      toast.error(err.response?.data?.error || "Failed to update account");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    // Validate all fields before submitting
    const currentPasswordError = validatePasswordField(
      "currentPassword",
      passwordData.currentPassword
    );
    const newPasswordError = validatePasswordField(
      "newPassword",
      passwordData.newPassword
    );
    const confirmPasswordError = validatePasswordField(
      "confirmPassword",
      passwordData.confirmPassword
    );

    if (currentPasswordError || newPasswordError || confirmPasswordError) {
      setPasswordErrors({
        currentPassword: currentPasswordError,
        newPassword: newPasswordError,
        confirmPassword: confirmPasswordError,
      });
      toast.error("Please fix validation errors before submitting");
      return;
    }

    setIsChangingPassword(true);
    try {
      await api.post("/user/change-password", {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      // Clear form and close section on success
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordErrors({});
      setActiveSection(null);

      // Update last password change date
      setSecuritySettings((prev) => ({
        ...prev,
        lastPasswordChange: new Date().toISOString(),
      }));
      setInitialSecuritySettings((prev) => ({
        ...prev,
        lastPasswordChange: new Date().toISOString(),
      }));

      toast.success("Password changed successfully!");
    } catch (err: any) {
      console.error("Error changing password:", err);
      const errorMessage =
        err.response?.data?.error || "Failed to change password";
      toast.error(errorMessage);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: "", color: "" };
    if (password.length < 6)
      return { strength: 25, label: "Weak", color: "bg-red-500" };
    if (password.length < 10)
      return { strength: 50, label: "Fair", color: "bg-yellow-500" };
    if (
      password.length < 12 ||
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)
    )
      return { strength: 75, label: "Good", color: "bg-blue-500" };
    return { strength: 100, label: "Strong", color: "bg-green-500" };
  };

  // OTP-related functions
  const handleOtpToggle = async () => {
    if (otpSettings.otpEnabled) {
      // Disabling OTP - requires current password and OTP
      setOtpAction("disable");
      setShowOtpModal(true);
    } else {
      // Enabling OTP - requires password
      setOtpAction("enable");
      setShowOtpModal(true);
    }
  };

  const handleSendOtpCode = async () => {
    try {
      setIsOtpLoading(true);
      await otpService.sendSettingsOtp();
      toast.success("OTP code sent to your email");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otpPassword) {
      toast.error("Password is required");
      return;
    }

    if (otpAction === "disable" && !otpCode) {
      toast.error("OTP code is required to disable OTP");
      return;
    }

    try {
      setIsOtpLoading(true);
      const result = await otpService.toggleOtp({
        enable: otpAction === "enable",
        password: otpPassword,
        otpCode: otpAction === "disable" ? otpCode : undefined,
      });

      if (result.backupCodes) {
        setBackupCodes(result.backupCodes);
        setShowBackupCodes(true);
      }

      await fetchOtpStatus(); // Refresh status
      setShowOtpModal(false);
      setOtpPassword("");
      setOtpCode("");

      toast.success(result.message);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleGenerateBackupCodes = async () => {
    setOtpAction("backup");
    setShowOtpModal(true);
  };

  const handleBackupCodesSubmit = async () => {
    if (!otpPassword) {
      toast.error("Password is required");
      return;
    }

    if (otpSettings.otpEnabled && !otpCode) {
      toast.error("OTP code is required");
      return;
    }

    try {
      setIsOtpLoading(true);
      const result = await otpService.generateBackupCodes({
        password: otpPassword,
        otpCode: otpSettings.otpEnabled ? otpCode : undefined,
      });

      setBackupCodes(result.backupCodes);
      setShowBackupCodes(true);
      setShowOtpModal(false);
      setOtpPassword("");
      setOtpCode("");

      await fetchOtpStatus(); // Refresh status
      toast.success(result.message);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsOtpLoading(false);
    }
  };

  const downloadBackupCodes = () => {
    if (!authUser?.email) return;
    otpService.downloadBackupCodes(backupCodes, authUser.email);
    toast.success("Backup codes downloaded");
  };

  const passwordStrength = getPasswordStrength(passwordData.newPassword);

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">
            Loading account settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full max-w-4xl space-y-6">
        {/* Personal Information Card */}
        <Card className="border-none bg-background shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-foreground">
              Personal Information
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Your account details and profile information
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Details */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="text-sm font-medium text-foreground"
                >
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={userData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                  placeholder="Enter your first name"
                  className="bg-card text-foreground border-border shadow-none"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="text-sm font-medium text-foreground"
                >
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={userData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                  placeholder="Enter your last name"
                  className="bg-card text-foreground border-border shadow-none"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-foreground"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  className={`bg-card text-foreground border-border shadow-none ${
                    validationErrors.email
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                />
                {validationErrors.email && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {validationErrors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phoneNumber"
                  className="text-sm font-medium text-foreground"
                >
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  value={userData.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  placeholder="Enter your phone number"
                  className={`bg-card text-foreground border-border shadow-none ${
                    validationErrors.phoneNumber
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                  }`}
                />
                {validationErrors.phoneNumber && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    {validationErrors.phoneNumber}
                  </p>
                )}
              </div>
            </div>

            {/* Save Button - Only show when there are changes */}
            {hasChanges() && (
              <div className="pt-6 border-t border-border">
                <Button
                  onClick={handleSave}
                  disabled={
                    isSaving ||
                    !!validationErrors.email ||
                    !!validationErrors.phoneNumber
                  }
                  className="bg-primary hover:bg-primary/90 px-6 py-2 h-auto w-full"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Overview Card */}
        <Card className="border-none bg-background shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-foreground flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Overview
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Current security status and recommendations
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-lg border border-border/50 bg-card">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Two-Factor Auth</span>
                </div>
                <Badge
                  variant={otpSettings.otpEnabled ? "default" : "secondary"}
                >
                  {otpSettings.otpEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>

              <div className="p-4 bg-card rounded-lg border border-border/50">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Last Password Change</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(
                    securitySettings.lastPasswordChange
                  ).toLocaleDateString()}
                </p>
              </div>

              <div className="p-4 bg-card rounded-lg border border-border/50">
                <div className="flex items-center gap-3 mb-2">
                  <KeyRound className="h-5 w-5 text-purple-500" />
                  <span className="font-medium">Backup Codes</span>
                </div>
                <p className="text-sm font-medium">
                  {otpSettings.hasBackupCodes
                    ? `${otpSettings.backupCodesCount} remaining`
                    : "None generated"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Password Management Card */}
        <Card className="border-none bg-background shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-foreground flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Password Management
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Update your account password for better security
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeSection !== "password" ? (
              <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border/50">
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-muted-foreground">
                    Last changed on{" "}
                    {new Date(
                      securitySettings.lastPasswordChange
                    ).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setActiveSection("password")}
                  className="bg-card cursor-pointer"
                >
                  Change Password
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="currentPassword"
                    className="text-sm font-medium text-foreground"
                  >
                    Current Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        handlePasswordChange("currentPassword", e.target.value)
                      }
                      placeholder="Enter your current password"
                      className={`bg-card text-foreground border-border shadow-none pr-10 ${
                        passwordErrors.currentPassword
                          ? "border-red-500 focus-visible:ring-red-500"
                          : ""
                      }`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowCurrentPassword(!showCurrentPassword)
                      }
                    >
                      {showCurrentPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {passwordErrors.currentPassword}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="newPassword"
                    className="text-sm font-medium text-foreground"
                  >
                    New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        handlePasswordChange("newPassword", e.target.value)
                      }
                      placeholder="Enter your new password"
                      className={`bg-card text-foreground border-border shadow-none pr-10 ${
                        passwordErrors.newPassword
                          ? "border-red-500 focus-visible:ring-red-500"
                          : ""
                      }`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {passwordErrors.newPassword}
                    </p>
                  )}
                  {passwordData.newPassword && !passwordErrors.newPassword && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Password Strength:
                        </span>
                        <span
                          className={`font-medium ${
                            passwordStrength.strength < 50
                              ? "text-red-500"
                              : passwordStrength.strength < 75
                              ? "text-yellow-500"
                              : passwordStrength.strength < 100
                              ? "text-blue-500"
                              : "text-green-500"
                          }`}
                        >
                          {passwordStrength.label}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{ width: `${passwordStrength.strength}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium text-foreground"
                  >
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        handlePasswordChange("confirmPassword", e.target.value)
                      }
                      placeholder="Confirm your new password"
                      className={`bg-card text-foreground border-border shadow-none pr-10 ${
                        passwordErrors.confirmPassword
                          ? "border-red-500 focus-visible:ring-red-500"
                          : ""
                      }`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {passwordErrors.confirmPassword}
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleChangePassword}
                    disabled={
                      isChangingPassword ||
                      !passwordData.currentPassword ||
                      !passwordData.newPassword ||
                      !passwordData.confirmPassword ||
                      !!passwordErrors.currentPassword ||
                      !!passwordErrors.newPassword ||
                      !!passwordErrors.confirmPassword
                    }
                    className="bg-primary hover:bg-primary/90"
                  >
                    {isChangingPassword ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Changing...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    disabled={isChangingPassword}
                    onClick={() => {
                      setActiveSection(null);
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                      setPasswordErrors({});
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Two-Factor Authentication Card */}
        <Card className="border-none bg-background shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-foreground flex items-center gap-2">
              <KeyRound className="h-5 w-5" />
              Two-Factor Authentication
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security to your account
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* OTP Toggle */}
            <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border/50">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">
                    Email-based OTP
                  </span>
                  <Badge
                    variant={otpSettings.otpEnabled ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {otpSettings.otpEnabled ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Receive verification codes via email when logging in
                </p>
              </div>
              <Switch
                checked={otpSettings.otpEnabled}
                onCheckedChange={handleOtpToggle}
                disabled={isOtpLoading}
              />
            </div>

            {/* Backup Codes Section */}
            {otpSettings.otpEnabled && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-card rounded-lg border border-border/50">
                  <div className="space-y-1">
                    <span className="font-medium text-foreground">
                      Backup Codes
                    </span>
                    <p className="text-sm text-muted-foreground">
                      {otpSettings.hasBackupCodes
                        ? `${otpSettings.backupCodesCount} backup codes remaining`
                        : "No backup codes generated"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateBackupCodes}
                    disabled={isOtpLoading}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    {otpSettings.hasBackupCodes
                      ? "Regenerate"
                      : "Generate"}{" "}
                    Codes
                  </Button>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                        Important Security Information
                      </p>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        Backup codes can be used to access your account if you
                        can't receive email codes. Store them securely and don't
                        share them with anyone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Preferences Card */}
        {/* <Card className="border-muted-gray bg-card shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-foreground flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Security Preferences
            </CardTitle>
            <p className="text-sm text-muted-foreground">Configure your security and notification preferences</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch
                  checked={securitySettings.twoFactorEnabled}
                  onCheckedChange={(checked) => handleSecuritySettingChange('twoFactorEnabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email alerts for account activities
                  </p>
                </div>
                <Switch
                  checked={securitySettings.emailNotifications}
                  onCheckedChange={(checked) => handleSecuritySettingChange('emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Login Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when someone logs into your account
                  </p>
                </div>
                <Switch
                  checked={securitySettings.loginAlerts}
                  onCheckedChange={(checked) => handleSecuritySettingChange('loginAlerts', checked)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sessionTimeout" className="text-base font-medium text-foreground">Session Timeout (minutes)</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Automatically log out after period of inactivity
                </p>
                <Input
                  id="sessionTimeout"
                  type="number"
                  min="5"
                  max="480"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) => handleSecuritySettingChange('sessionTimeout', parseInt(e.target.value))}
                  className="bg-card text-foreground border-border shadow-none w-32"
                />
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* OTP Modal */}
      <Dialog open={showOtpModal} onOpenChange={setShowOtpModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {otpAction === "enable" && "Enable Two-Factor Authentication"}
              {otpAction === "disable" && "Disable Two-Factor Authentication"}
              {otpAction === "backup" && "Generate Backup Codes"}
            </DialogTitle>
            <DialogDescription>
              {otpAction === "enable" &&
                "Enter your password to enable two-factor authentication for your account."}
              {otpAction === "disable" &&
                "Enter your password and current OTP code to disable two-factor authentication."}
              {otpAction === "backup" &&
                "Enter your password to generate new backup codes for your account."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="otpPassword">Current Password</Label>
              <Input
                id="otpPassword"
                type="password"
                value={otpPassword}
                onChange={(e) => setOtpPassword(e.target.value)}
                placeholder="Enter your current password"
                className="mt-1"
              />
            </div>

            {(otpAction === "disable" ||
              (otpAction === "backup" && otpSettings.otpEnabled)) && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="otpCode">OTP Code</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSendOtpCode}
                    disabled={isOtpLoading}
                    className="text-xs"
                  >
                    Send Code
                  </Button>
                </div>
                <Input
                  id="otpCode"
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowOtpModal(false);
                setOtpPassword("");
                setOtpCode("");
              }}
              disabled={isOtpLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={
                otpAction === "backup"
                  ? handleBackupCodesSubmit
                  : handleOtpSubmit
              }
              disabled={isOtpLoading || !otpPassword}
            >
              {isOtpLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                  Processing...
                </div>
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Backup Codes Modal */}
      <Dialog open={showBackupCodes} onOpenChange={setShowBackupCodes}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5" />
              Your Backup Codes
            </DialogTitle>
            <DialogDescription>
              Save these backup codes in a secure location. Each code can only
              be used once.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <p className="text-sm text-amber-800 dark:text-amber-200">
                <strong>Important:</strong> Save these backup codes in a secure
                location. Each code can only be used once and will allow you to
                access your account if you can't receive email codes.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 p-4 bg-card rounded-lg border border-border/50 font-mono text-sm">
              {backupCodes.map((code, index) => (
                <div key={index} className="p-2 bg-background rounded border">
                  {otpService.formatBackupCode(code)}
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={downloadBackupCodes}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Codes
            </Button>
            <Button
              onClick={() => {
                setShowBackupCodes(false);
                setBackupCodes([]);
              }}
            >
              I've Saved These Codes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
