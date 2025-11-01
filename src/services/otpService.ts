import api from "@/utils/api";

export interface OtpStatus {
  otpEnabled: boolean;
  hasBackupCodes: boolean;
  backupCodesCount: number;
}

export interface OtpToggleRequest {
  enable: boolean;
  password: string;
  otpCode?: string; // Required when disabling OTP
}

export interface OtpToggleResponse {
  message: string;
  otpEnabled: boolean;
  backupCodes?: string[]; // Only returned when enabling
}

export interface BackupCodesRequest {
  password: string;
  otpCode?: string; // Required if OTP is enabled
}

export interface BackupCodesResponse {
  message: string;
  backupCodes: string[];
}

class OtpService {
  /**
   * Get current OTP status for the user
   */
  async getStatus(): Promise<OtpStatus> {
    const response = await api.get("/user/otp/status");
    return response.data;
  }

  /**
   * Send OTP code for settings changes
   */
  async sendSettingsOtp(): Promise<{ message: string; expiresIn: string }> {
    const response = await api.post("/user/otp/send-settings-otp");
    return response.data;
  }

  /**
   * Toggle OTP (enable/disable)
   */
  async toggleOtp(data: OtpToggleRequest): Promise<OtpToggleResponse> {
    const response = await api.post("/user/otp/toggle", data);
    return response.data;
  }

  /**
   * Generate new backup codes
   */
  async generateBackupCodes(
    data: BackupCodesRequest
  ): Promise<BackupCodesResponse> {
    const response = await api.post("/user/otp/backup-codes", data);
    return response.data;
  }

  /**
   * Verify OTP for login
   */
  async verifyLoginOtp(
    email: string,
    otpCode: string
  ): Promise<{ token: string; user: any }> {
    const response = await api.post("/auth/verify-login-otp", {
      email,
      otpCode,
    });
    return response.data;
  }

  /**
   * Resend login OTP
   */
  async resendLoginOtp(
    email: string
  ): Promise<{ message: string; expiresIn: string }> {
    const response = await api.post("/auth/resend-login-otp", { email });
    return response.data;
  }

  /**
   * Verify backup code for login
   */
  async verifyBackupCode(
    email: string,
    backupCode: string
  ): Promise<{ token: string; user: any }> {
    const response = await api.post("/auth/verify-backup-code", {
      email,
      backupCode,
    });
    return response.data;
  }

  /**
   * Format backup codes for display (add dashes for readability)
   */
  formatBackupCode(code: string): string {
    return code.replace(/(.{4})/g, "$1-").slice(0, -1);
  }

  /**
   * Download backup codes as a text file
   */
  downloadBackupCodes(codes: string[], userEmail: string): void {
    const content = `ENQUIRO BACKUP CODES
Generated on: ${new Date().toLocaleString()}
Account: ${userEmail}

IMPORTANT: Save these codes in a secure location. Each code can only be used once.

${codes
  .map((code, index) => `${index + 1}. ${this.formatBackupCode(code)}`)
  .join("\n")}

Instructions:
- Use these codes if you can't access your email for 2FA
- Each code works only once
- Generate new codes if you run out
- Keep these codes secure and private

Contact support if you lose access to both your email and backup codes.
`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `enquiro-backup-codes-${
      new Date().toISOString().split("T")[0]
    }.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const otpService = new OtpService();
