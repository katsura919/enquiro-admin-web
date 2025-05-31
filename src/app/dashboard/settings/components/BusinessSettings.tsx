import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Building2, Upload } from "lucide-react"

interface BusinessSettingsProps {
  business: {
    name: string
    description: string
    website: string
    logo: string
    primaryColor: string
    slug: string
  }
  onSave: (data: any) => void
}

export default function BusinessSettings({ business, onSave }: BusinessSettingsProps) {
  const [formData, setFormData] = useState(business)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onSave(formData)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="bg-white/5 border-blue-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Building2 className="h-5 w-5" />
          Business Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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

          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 