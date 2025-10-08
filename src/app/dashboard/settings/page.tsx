"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
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
  AlertTriangle
} from "lucide-react"
import { useAuth } from "@/lib/auth"

// Dummy user data based on userModel.js
const dummyUser = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phoneNumber: "+1234567890",
  profilePicture: "https://ui-avatars.com/api/?name=John+Doe",
  isVerified: true,
  businessId: "Business Name",
  role: "Admin",
  createdAt: "2024-01-15T10:30:00Z",
  lastLogin: "2024-12-01T14:22:00Z",
}

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

export default function AccountSettingsPage() {
  const { user: authUser } = useAuth()
  
  const [initialUserData, setInitialUserData] = useState(dummyUser)
  const [userData, setUserData] = useState(dummyUser)
  const [initialSecuritySettings, setInitialSecuritySettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    emailNotifications: true,
    loginAlerts: true,
    sessionTimeout: 30,
    lastPasswordChange: "2024-10-15T10:30:00Z",
    activeSessions: 3
  })
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
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [activeSection, setActiveSection] = useState<'password' | null>(null)

  // Check if there are changes
  const hasChanges = () => {
    const userDataChanged = (
      userData.firstName !== initialUserData.firstName ||
      userData.lastName !== initialUserData.lastName ||
      userData.email !== initialUserData.email ||
      userData.phoneNumber !== initialUserData.phoneNumber
    )
    
    const securityChanged = (
      securitySettings.twoFactorEnabled !== initialSecuritySettings.twoFactorEnabled ||
      securitySettings.emailNotifications !== initialSecuritySettings.emailNotifications ||
      securitySettings.loginAlerts !== initialSecuritySettings.loginAlerts ||
      securitySettings.sessionTimeout !== initialSecuritySettings.sessionTimeout
    )
    
    return userDataChanged || securityChanged
  }

  const handleInputChange = (field: string, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }))
  }

  const handleSecuritySettingChange = (setting: keyof SecuritySettings, value: boolean | number) => {
    setSecuritySettings(prev => ({ ...prev, [setting]: value }))
  }

  const handlePasswordChange = (field: keyof PasswordChangeData, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setIsSuccess(false)
    
    try {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setInitialUserData(userData) // Update initial data after successful save
      setInitialSecuritySettings(securitySettings) // Update initial settings after successful save
      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 3000)
    } catch (error) {
      console.error("Error updating account:", error)
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
            {activeSection === 'password' ? 'Changing password...' : 'Loading account settings...'}
          </p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading account settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Success Message */}
      {isSuccess && (
        <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
          <div className="p-1 bg-green-100 dark:bg-green-900 rounded-full">
            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-green-800 dark:text-green-200 font-medium">Account settings updated successfully!</p>
        </div>
      )}

      <div className="w-full max-w-4xl space-y-6">
        {/* Personal Information Card */}
        <Card className="border-muted-gray bg-card shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-foreground">Personal Information</CardTitle>
            <p className="text-sm text-muted-foreground">Your account details and profile information</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Details */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium text-foreground">First Name</Label>
                <Input
                  id="firstName"
                  value={userData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter your first name"
                  className="bg-card text-foreground border-border shadow-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium text-foreground">Last Name</Label>
                <Input
                  id="lastName"
                  value={userData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter your last name"
                  className="bg-card text-foreground border-border shadow-none"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  className="bg-card text-foreground border-border shadow-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-medium text-foreground">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={userData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="Enter your phone number"
                  className="bg-card text-foreground border-border shadow-none"
                />
              </div>
            </div>

            {/* Account Status Information */}
            <div className="pt-4 border-t border-border/50">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Verification Status</Label>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={userData.isVerified ? "default" : "secondary"}
                      className={userData.isVerified ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : ""}
                    >
                      {userData.isVerified ? (
                        <>
                          <Shield className="h-3 w-3 mr-1" />
                          Verified
                        </>
                      ) : (
                        "Not Verified"
                      )}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Role</Label>
                  <Badge variant="outline" className="w-fit">
                    {userData.role}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Business</Label>
                  <p className="text-sm text-muted-foreground">{userData.businessId}</p>
                </div>
              </div>

              {userData.createdAt && (
                <div className="pt-4 mt-4 border-t border-border/50 space-y-2">
                  <div className="grid gap-4 md:grid-cols-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Member since:</span>
                      <span className="ml-2 font-medium">{new Date(userData.createdAt).toLocaleDateString()}</span>
                    </div>
                    {userData.lastLogin && (
                      <div>
                        <span className="text-muted-foreground">Last login:</span>
                        <span className="ml-2 font-medium">{new Date(userData.lastLogin).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Save Button - Only show when there are changes */}
            {hasChanges() && (
              <div className="pt-6 border-t border-border">
                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
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
        <Card className="border-muted-gray bg-card shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-foreground flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Overview
            </CardTitle>
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

        {/* Password Management Card */}
        <Card className="border-muted-gray bg-card shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-foreground flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Password Management
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
                  <Label htmlFor="currentPassword" className="text-sm font-medium text-foreground">Current Password</Label>
                  <div className="relative">
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      placeholder="Enter your current password"
                      className="bg-card text-foreground border-border shadow-none pr-10"
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
                  <Label htmlFor="newPassword" className="text-sm font-medium text-foreground">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      placeholder="Enter your new password"
                      className="bg-card text-foreground border-border shadow-none pr-10"
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
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Password Strength:</span>
                        <span className={`font-medium ${
                          passwordStrength.strength < 50 ? 'text-red-500' : 
                          passwordStrength.strength < 75 ? 'text-yellow-500' : 
                          passwordStrength.strength < 100 ? 'text-blue-500' : 'text-green-500'
                        }`}>
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
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      placeholder="Confirm your new password"
                      className="bg-card text-foreground border-border shadow-none pr-10"
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

                <div className="flex gap-3 pt-2">
                  <Button 
                    onClick={handleChangePassword}
                    disabled={!passwordData.currentPassword || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Change Password
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

        {/* Security Preferences Card */}
        <Card className="border-muted-gray bg-card shadow-none">
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
        </Card>
      </div>
    </div>
  )
}
