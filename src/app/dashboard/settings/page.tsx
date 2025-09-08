"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { User, Upload, Camera, X, Check, Save, Shield } from "lucide-react"
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

export default function AccountSettingsPage() {
  const { user: authUser } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [userData, setUserData] = useState(dummyUser)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [profilePreview, setProfilePreview] = useState<string>(dummyUser.profilePicture)

  const handleInputChange = (field: string, value: string) => {
    setUserData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setProfilePreview(result)
        setUserData(prev => ({ ...prev, profilePicture: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleProfileUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveProfile = () => {
    setProfilePreview("https://ui-avatars.com/api/?name=" + encodeURIComponent(userData.firstName + "+" + userData.lastName))
    setUserData(prev => ({ ...prev, profilePicture: "" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setIsSuccess(false)
    
    try {
      // TODO: Implement API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 3000)
    } catch (error) {
      console.error("Error updating account:", error)
    } finally {
      setIsSaving(false)
    }
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
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <User className="h-6 w-6 text-primary" />
            </div>
            Account Settings
          </h1>
          <p className="text-muted-foreground mt-1">Manage your personal account information and preferences</p>
        </div>
        <Button 
          onClick={handleSave} 
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
              Save Changes
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
          <p className="text-green-800 dark:text-green-200 font-medium">Account settings updated successfully!</p>
        </div>
      )}

      <div className="w-full max-w-4xl">
        {/* Account Information Card */}
        <Card className="border-0 shadow-sm bg-card/50 backdrop-blur">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-foreground">Personal Information</CardTitle>
            <p className="text-sm text-muted-foreground">Your account details and profile information</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Profile Picture Section */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Profile Picture</Label>
              <div className="flex items-start gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 border-2 border-dashed border-border rounded-full flex items-center justify-center bg-muted/30 hover:bg-muted/50 transition-colors overflow-hidden">
                    {profilePreview ? (
                      <>
                        <img
                          src={profilePreview}
                          alt="Profile picture"
                          className="w-full h-full object-cover rounded-full"
                          onError={() => setProfilePreview("https://ui-avatars.com/api/?name=" + encodeURIComponent(userData.firstName + "+" + userData.lastName))}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="text-xs"
                            onClick={handleProfileUploadClick}
                          >
                            <Camera className="h-3 w-3 mr-1" />
                            Change
                          </Button>
                        </div>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        className="h-full w-full flex-col gap-2 text-muted-foreground hover:text-foreground rounded-full"
                        onClick={handleProfileUploadClick}
                      >
                        <Upload className="h-6 w-6" />
                        <span className="text-xs">Upload</span>
                      </Button>
                    )}
                  </div>
                  {profilePreview && userData.profilePicture && (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={handleRemoveProfile}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Upload your profile picture. Recommended size: 200x200px
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleProfileUploadClick}
                      className="text-sm"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </Button>
                    <div className="text-sm text-muted-foreground flex items-center">
                      or drag and drop
                    </div>
                  </div>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Personal Details */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                <Input
                  id="firstName"
                  value={userData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter your first name"
                  className="bg-background border-border focus:border-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                <Input
                  id="lastName"
                  value={userData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter your last name"
                  className="bg-background border-border focus:border-primary"
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  className="bg-background border-border focus:border-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-medium">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={userData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  placeholder="Enter your phone number"
                  className="bg-background border-border focus:border-primary"
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
