"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Building2, Upload, Globe, Link as LinkIcon } from "lucide-react"

// Mock data - replace with actual API data
const mockBusiness = {
  name: "Acme Corp",
  description: "Leading provider of innovative solutions",
  website: "https://acme.com",
  logo: "",
  primaryColor: "#2563eb",
  slug: "acme",
  socialLinks: {
    twitter: "",
    facebook: "",
    linkedin: "",
  },
  address: {
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  },
}

export default function BusinessSettingsPage() {
  const [formData, setFormData] = useState(mockBusiness)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // TODO: Implement API call
      console.log("Save business settings:", formData)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Business Settings</h1>
          <p className="text-gray-400">Manage your business profile and branding</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="bg-white/5 border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Building2 className="h-5 w-5" />
              Business Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Business Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white/5 text-white border-blue-500/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-white/5 text-white border-blue-500/20 min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Logo</Label>
              <div className="flex items-center gap-4">
                {formData.logo ? (
                  <img
                    src={formData.logo}
                    alt="Business logo"
                    className="w-16 h-16 rounded-lg object-cover bg-white/5"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <Button
                  type="button"
                  variant="outline"
                  className="border-blue-500/20 text-gray-400 hover:text-white"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Logo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Globe className="h-5 w-5" />
              Online Presence
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="bg-white/5 text-white border-blue-500/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Chat URL Slug</Label>
              <div className="flex gap-2 items-center">
                <span className="text-gray-400">chat/</span>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="bg-white/5 text-white border-blue-500/20"
                  required
                  pattern="[a-z0-9-]+"
                  title="Only lowercase letters, numbers, and hyphens are allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="primaryColor">Brand Color</Label>
              <div className="flex gap-2">
                <Input
                  id="primaryColor"
                  type="color"
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="w-12 h-12 p-1 bg-white/5 border-blue-500/20"
                />
                <Input
                  value={formData.primaryColor}
                  onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                  className="bg-white/5 text-white border-blue-500/20"
                  pattern="^#[0-9A-Fa-f]{6}$"
                  placeholder="#000000"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-blue-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <LinkIcon className="h-5 w-5" />
              Social Links
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                value={formData.socialLinks.twitter}
                onChange={(e) => setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, twitter: e.target.value }
                })}
                className="bg-white/5 text-white border-blue-500/20"
                placeholder="https://twitter.com/yourusername"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook</Label>
              <Input
                id="facebook"
                value={formData.socialLinks.facebook}
                onChange={(e) => setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, facebook: e.target.value }
                })}
                className="bg-white/5 text-white border-blue-500/20"
                placeholder="https://facebook.com/yourpage"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={formData.socialLinks.linkedin}
                onChange={(e) => setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, linkedin: e.target.value }
                })}
                className="bg-white/5 text-white border-blue-500/20"
                placeholder="https://linkedin.com/company/yourcompany"
              />
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </div>
  )
} 