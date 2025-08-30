"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Upload, X, ChevronDown } from "lucide-react"
import { Agent } from "./AgentTable"

interface AgentFormData {
  name: string
  email: string
  phone: string
  role: string
  password: string
  confirmPassword: string
  profilePic?: string
}

interface AgentFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: AgentFormData) => Promise<void>
  agent?: Agent | null
  loading?: boolean
}

export function AgentForm({ open, onClose, onSubmit, agent, loading = false }: AgentFormProps) {
  const [formData, setFormData] = React.useState<AgentFormData>({
    name: "",
    email: "",
    phone: "",
    role: "agent",
    password: "",
    confirmPassword: "",
    profilePic: ""
  })
  const [errors, setErrors] = React.useState<Partial<AgentFormData>>({})

  // Reset form when dialog opens/closes or agent changes
  React.useEffect(() => {
    if (open) {
      if (agent) {
        // Editing existing agent
        setFormData({
          name: agent.name,
          email: agent.email,
          phone: agent.phone || "",
          role: agent.role,
          password: "", // Don't populate password for editing
          confirmPassword: "",
          profilePic: agent.profilePic || ""
        })
      } else {
        // Creating new agent
        setFormData({
          name: "",
          email: "",
          phone: "",
          role: "agent",
          password: "",
          confirmPassword: "",
          profilePic: ""
        })
      }
      setErrors({})
    }
  }, [open, agent])

  const validateForm = (): boolean => {
    const newErrors: Partial<AgentFormData> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    if (!formData.role) {
      newErrors.role = "Role is required"
    }

    // Password validation only for new agents or when password is provided
    if (!agent || formData.password) {
      if (!formData.password) {
        newErrors.password = "Password is required"
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters"
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error('Form submission error:', error)
    }
  }

  const handleInputChange = (field: keyof AgentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload to a server and get a URL
      // For now, we'll use a placeholder
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profilePic: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {agent ? 'Edit Agent' : 'Add New Agent'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={formData.profilePic} alt={formData.name} />
              <AvatarFallback className="text-lg">
                {formData.name ? getInitials(formData.name) : 'AG'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex gap-2">
              <Label htmlFor="profile-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-muted">
                  <Upload className="h-4 w-4" />
                  Upload Photo
                </div>
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </Label>
              
              {formData.profilePic && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleInputChange('profilePic', '')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter full name"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
            </div>

            <div className="col-span-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
            </div>

            <div className="col-span-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="role">Role *</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {formData.role ? formData.role.charAt(0).toUpperCase() + formData.role.slice(1) : "Select role"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <DropdownMenuItem onClick={() => handleInputChange('role', 'agent')}>
                    Agent
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleInputChange('role', 'supervisor')}>
                    Supervisor
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleInputChange('role', 'admin')}>
                    Admin
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {errors.role && <p className="text-sm text-destructive mt-1">{errors.role}</p>}
            </div>

            <div className="col-span-1">
              <Label htmlFor="password">
                Password {!agent && '*'}
                {agent && <span className="text-muted-foreground text-xs">(leave blank to keep current)</span>}
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder={agent ? "New password" : "Enter password"}
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
            </div>

            <div className="col-span-1">
              <Label htmlFor="confirmPassword">
                Confirm Password {(!agent || formData.password) && '*'}
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm password"
                className={errors.confirmPassword ? "border-destructive" : ""}
              />
              {errors.confirmPassword && <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : agent ? 'Update Agent' : 'Create Agent'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
