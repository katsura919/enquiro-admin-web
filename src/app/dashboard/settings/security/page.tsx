"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Shield, 
  Save, 
  Eye, 
  EyeOff, 
  Check, 
  AlertTriangle, 
  Lock, 
  Mail, 
  Smartphone,
  Key,
  Clock,
  Globe
} from "lucide-react"
import { useAuth } from "@/lib/auth"

interface SecuritySettings {
  twoFactorEnabled: boolean
  emailNotifications: boolean
  loginAlerts: boolean
  sessionTimeout: number
  lastPasswordChange: string
  activeSessions: number
}

interface PasswordChangeData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface EmailChangeData {
  newEmail: string
  currentPassword: string
}

export default function SecuritySettingsPage() {
  const { user } = useAuth()
  
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    emailNotifications: true,
    loginAlerts: true,
    sessionTimeout: 30,
    lastPasswordChange: "2024-10-15T10:30:00Z",
    activeSessions: 3
  })

  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const [emailData, setEmailData] = useState<EmailChangeData>({
    newEmail: "",
    currentPassword: ""
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [activeSection, setActiveSection] = useState<'password' | 'email' | null>(null)

  const handleSecuritySettingChange = (setting: keyof SecuritySettings, value: boolean | number) => {
    setSecuritySettings(prev => ({ ...prev, [setting]: value }))
  }

  const handlePasswordChange = (field: keyof PasswordChangeData, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
  }

  const handleEmailChange = (field: keyof EmailChangeData, value: string) => {
    setEmailData(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    setIsSuccess(false)
    
    try {
      // TODO: Implement API call for security settings
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 3000)
    } catch (error) {
      console.error("Error updating security settings:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      // TODO: Show error
      return
    }

    setIsLoading(true)
    try {
      // TODO: Implement API call for password change
      await new Promise(resolve => setTimeout(resolve, 1500))
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setActiveSection(null)
      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 3000)
    } catch (error) {
      console.error("Error changing password:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangeEmail = async () => {
    setIsLoading(true)
    try {
      // TODO: Implement API call for email change
      await new Promise(resolve => setTimeout(resolve, 1500))
      setEmailData({ newEmail: "", currentPassword: "" })
      setActiveSection(null)
      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 3000)
    } catch (error) {
      console.error("Error changing email:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: "", color: "" }
    if (password.length < 6) return { strength: 25, label: "Weak", color: "bg-red-500" }
    if (password.length < 10) return { strength: 50, label: "Fair", color: "bg-yellow-500" }
    if (password.length < 12 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) 
      return { strength: 75, label: "Good", color: "bg-blue-500" }
    return { strength: 100, label: "Strong", color: "bg-green-500" }
  }

  const passwordStrength = getPasswordStrength(passwordData.newPassword)

  if (isLoading && activeSection) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">
            {activeSection === 'password' ? 'Changing password...' : 'Changing email...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            Security Settings
          </h1>
          <p className="text-muted-foreground mt-1">Manage your account security and privacy settings</p>
        </div>
        <Button 
          onClick={handleSaveSettings} 
          disabled={isSaving}
          className="bg-primary hover:bg-primary/90 px-6 py-2 h-auto"
        >
          {isSaving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>

      {/* Success Message */}
      {isSuccess && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
          <div className="p-1 bg-green-100 dark:bg-green-900 rounded-full">
            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-green-800 dark:text-green-200 font-medium">Security settings updated successfully!</p>
        </div>
      )}

      <div className="w-full max-w-4xl space-y-6">
        {/* Account Security Overview */}
        <Card className="border-0 shadow-sm bg-card/50 backdrop-blur">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-foreground">Security Overview</CardTitle>
            <p className="text-sm text-muted-foreground">Current security status and recommendations</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Two-Factor Auth</span>
                </div>
                <Badge variant={securitySettings.twoFactorEnabled ? "default" : "secondary"}>
                  {securitySettings.twoFactorEnabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="h-5 w-5 text-blue-500" />
                  <span className="font-medium">Last Password Change</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(securitySettings.lastPasswordChange).toLocaleDateString()}
                </p>
              </div>

              <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="h-5 w-5 text-orange-500" />
                  <span className="font-medium">Active Sessions</span>
                </div>
                <p className="text-sm font-medium">{securitySettings.activeSessions} devices</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card className="border-0 shadow-sm bg-card/50 backdrop-blur">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-foreground flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Change Password
            </CardTitle>
            <p className="text-sm text-muted-foreground">Update your account password for better security</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeSection !== 'password' ? (
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-muted-foreground">Last changed on {new Date(securitySettings.lastPasswordChange).toLocaleDateString()}</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveSection('password')}
                  className="bg-background"
                >
                  Change Password
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-sm font-medium">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      placeholder="Enter your current password"
                      className="bg-background border-border focus:border-primary pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-sm font-medium">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      placeholder="Enter your new password"
                      className="bg-background border-border focus:border-primary pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {passwordData.newPassword && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${passwordStrength.color}`}
                            style={{ width: `${passwordStrength.strength}%` }}
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">{passwordStrength.label}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      placeholder="Confirm your new password"
                      className="bg-background border-border focus:border-primary pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      Passwords do not match
                    </p>
                  )}
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={handleChangePassword}
                    disabled={!passwordData.currentPassword || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Update Password
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setActiveSection(null)
                      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Change Email */}
        <Card className="border-0 shadow-sm bg-card/50 backdrop-blur">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-foreground flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Change Email Address
            </CardTitle>
            <p className="text-sm text-muted-foreground">Update your email address for account communications</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeSection !== 'email' ? (
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                <div>
                  <p className="font-medium">Email Address</p>
                  <p className="text-sm text-muted-foreground">{user?.email || "john.doe@example.com"}</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setActiveSection('email')}
                  className="bg-background"
                >
                  Change Email
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newEmail" className="text-sm font-medium">New Email Address</Label>
                  <Input
                    id="newEmail"
                    type="email"
                    value={emailData.newEmail}
                    onChange={(e) => handleEmailChange('newEmail', e.target.value)}
                    placeholder="Enter your new email address"
                    className="bg-background border-border focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentPasswordEmail" className="text-sm font-medium">Current Password</Label>
                  <Input
                    id="currentPasswordEmail"
                    type="password"
                    value={emailData.currentPassword}
                    onChange={(e) => handleEmailChange('currentPassword', e.target.value)}
                    placeholder="Enter your current password to confirm"
                    className="bg-background border-border focus:border-primary"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    onClick={handleChangeEmail}
                    disabled={!emailData.newEmail || !emailData.currentPassword}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Update Email
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setActiveSection(null)
                      setEmailData({ newEmail: "", currentPassword: "" })
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Preferences */}
        <Card className="border-0 shadow-sm bg-card/50 backdrop-blur">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-foreground">Security Preferences</CardTitle>
            <p className="text-sm text-muted-foreground">Configure additional security features and notifications</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                </div>
                <Switch
                  checked={securitySettings.twoFactorEnabled}
                  onCheckedChange={(checked) => handleSecuritySettingChange('twoFactorEnabled', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive security alerts via email</p>
                  </div>
                </div>
                <Switch
                  checked={securitySettings.emailNotifications}
                  onCheckedChange={(checked) => handleSecuritySettingChange('emailNotifications', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Login Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified of suspicious login attempts</p>
                  </div>
                </div>
                <Switch
                  checked={securitySettings.loginAlerts}
                  onCheckedChange={(checked) => handleSecuritySettingChange('loginAlerts', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
