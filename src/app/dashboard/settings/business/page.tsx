"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Building, Save, Upload, Eye, ExternalLink, Camera, X, Check, Copy } from "lucide-react"
import { useAuth } from "@/lib/auth"
import api from "@/utils/api"

interface BusinessData {
  _id?: string
  name: string
  slug: string
  description: string
  logo: string
  category: string
  address: string
  createdAt?: string
  updatedAt?: string
}

export default function BusinessSettingsPage() {
  const { user } = useAuth()
  const businessId = user?.businessId
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [businessData, setBusinessData] = useState<BusinessData>({
    name: "",
    slug: "",
    description: "",
    logo: "",
    category: "",
    address: ""
  })
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string>("")
  const [copied, setCopied] = useState(false)

  // Fetch business data
  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!businessId) return
      
      try {
        const response = await api.get(`/business/${businessId}`)
        setBusinessData(response.data)
        setLogoPreview(response.data.logo || "")
      } catch (error) {
        console.error("Error fetching business data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBusinessData()
  }, [businessId])

  const handleInputChange = (field: keyof BusinessData, value: string) => {
    setBusinessData(prev => ({ ...prev, [field]: value }))
    
    // Auto-generate slug from name
    if (field === 'name') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
      setBusinessData(prev => ({ ...prev, slug }))
    }
    
    // Update logo preview
    if (field === 'logo') {
      setLogoPreview(value)
    }
  }

  const handleSave = async () => {
    if (!businessId) return
    
    setIsSaving(true)
    setIsSuccess(false)
    
    try {
      await api.put(`/business/${businessId}`, businessData)
      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 3000)
    } catch (error) {
      console.error("Error updating business:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const getChatUrl = () => {
    return `${window.location.origin}/chat/${businessData.slug}`
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setLogoPreview(result)
        setBusinessData(prev => ({ ...prev, logo: result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogoUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveLogo = () => {
    setLogoPreview("")
    setBusinessData(prev => ({ ...prev, logo: "" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(getChatUrl())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading business settings...</p>
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
              <Building className="h-6 w-6 text-primary" />
            </div>
            Business Settings
          </h1>
          <p className="text-muted-foreground mt-1">Manage your business information and branding</p>
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
          <p className="text-green-800 dark:text-green-200 font-medium">Business settings updated successfully!</p>
        </div>
      )}

      <div className="w-full max-w-4xl">
        {/* Business Settings Card */}
        <Card className="border-0 shadow-sm bg-card/50 backdrop-blur">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-foreground">Business Information</CardTitle>
            <p className="text-sm text-muted-foreground">Manage your business details, branding, and contact information</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Logo Upload Section */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Business Logo</Label>
              <div className="flex items-start gap-6">
                <div className="relative group">
                  <div className="w-24 h-24 border-2 border-dashed border-border rounded-xl flex items-center justify-center bg-muted/30 hover:bg-muted/50 transition-colors overflow-hidden">
                    {logoPreview ? (
                      <>
                        <img
                          src={logoPreview}
                          alt="Business logo"
                          className="w-full h-full object-cover rounded-lg"
                          onError={() => setLogoPreview("")}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="text-xs"
                            onClick={handleLogoUploadClick}
                          >
                            <Camera className="h-3 w-3 mr-1" />
                            Change
                          </Button>
                        </div>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        className="h-full w-full flex-col gap-2 text-muted-foreground hover:text-foreground"
                        onClick={handleLogoUploadClick}
                      >
                        <Upload className="h-6 w-6" />
                        <span className="text-xs">Upload Logo</span>
                      </Button>
                    )}
                  </div>
                  {logoPreview && (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={handleRemoveLogo}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Upload your business logo or provide a URL. Recommended size: 200x200px
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLogoUploadClick}
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

            {/* Business Details */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Business Name *</Label>
                <Input
                  id="name"
                  value={businessData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your business name"
                  className="bg-background border-border focus:border-primary"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                <Input
                  id="category"
                  value={businessData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  placeholder="e.g., E-commerce, Healthcare"
                  className="bg-background border-border focus:border-primary"
                />
              </div>
            </div>

            {/* URL Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug" className="text-sm font-medium">URL Slug *</Label>
              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <Input
                    id="slug"
                    value={businessData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="your-business-url"
                    className="bg-background border-border focus:border-primary pr-16"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    .chat
                  </div>
                </div>
              </div>
              {businessData.slug && (
                <div className="p-3 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-center justify-between">
                    <code className="text-sm text-foreground font-mono">{getChatUrl()}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyUrl}
                      className="ml-2 h-6 w-6 p-0"
                    >
                      {copied ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <Textarea
                id="description"
                value={businessData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Tell us about your business..."
                rows={3}
                className="bg-background border-border focus:border-primary resize-none"
              />
            </div>

            {/* Contact Information */}
            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">Business Address</Label>
              <Textarea
                id="address"
                value={businessData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter your business address..."
                rows={3}
                className="bg-background border-border focus:border-primary resize-none"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
