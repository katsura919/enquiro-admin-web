"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { Agent } from "./AgentTable"

interface AgentFormData {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

interface AgentFormErrors extends Partial<AgentFormData> {
  server?: string
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
    password: "",
    confirmPassword: ""
  })
  const [errors, setErrors] = React.useState<AgentFormErrors>({})
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

  // Reset form when dialog opens/closes or agent changes
  React.useEffect(() => {
    if (open) {
      if (agent) {
        // Editing existing agent
        setFormData({
          name: agent.name,
          email: agent.email,
          phone: agent.phone || "",
          password: "", // Don't populate password for editing
          confirmPassword: ""
        })
      } else {
        // Creating new agent
        setFormData({
          name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: ""
        })
      }
      setErrors({})
    }
  }, [open, agent])

  const validateForm = (): boolean => {
    const newErrors: AgentFormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    // Phone validation (optional but must be valid if provided)
    if (formData.phone && !/^[\+]?[\d]{7,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = "Please enter a valid phone number"
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
      // Don't call onClose here - let the parent handle it after success
    } catch (error: any) {
      // Handle specific email validation error from server
      if (error.response?.status === 409 && error.response?.data?.error?.includes('Email address is already taken')) {
        setErrors(prev => ({ 
          ...prev, 
          email: error.response.data.error // Use the exact error message from backend
        }))
      } else {
        console.error('Form submission error:', error)
      }
    }
  }

  const handleInputChange = (field: keyof AgentFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        // Only allow closing when not loading and when dialog is being closed (isOpen = false)
        if (!isOpen && !loading) {
          onClose()
        }
      }}
      modal={true}
    >
      <DialogContent 
        className="sm:max-w-lg"
        onPointerDownOutside={(e) => {
          // Prevent closing by clicking outside when loading
          if (loading) {
            e.preventDefault()
          }
        }} 
        onEscapeKeyDown={(e) => {
          // Prevent closing with escape key when loading
          if (loading) {
            e.preventDefault()
          }
        }}
      >
        <DialogHeader className="pb-4">
          <DialogTitle className="text-xl font-semibold">
            {agent ? 'Edit Agent' : 'Add New Agent'}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {agent ? 'Update agent information below.' : 'Fill in the details to create a new agent account.'}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Fields */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium mb-2">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter full name"
                className={errors.name ? "border-destructive" : "shadow-none"}
              />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium mb-2">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
                className={errors.email ? "border-destructive focus:border-destructive" : ""}
              />
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium mb-2">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter phone number (optional)"
                className={errors.phone ? "border-destructive focus:border-destructive" : ""}
              />
              {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password" className="text-sm font-medium mb-2">
                  Password {!agent && '*'}
                 
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder={agent ? "New password" : "Enter password"}
                    className={errors.password ? "border-destructive focus:border-destructive pr-10" : "pr-10 "}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground cu" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.password && <p className="text-sm text-destructive mt-1">{errors.password}</p>}
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium mb-2">
                  Confirm Password {(!agent || formData.password) && '*'}
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm password"
                    className={errors.confirmPassword ? "border-destructive focus:border-destructive pr-10" : "pr-10"}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-destructive mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              disabled={loading}
              className="min-w-[80px] cursor-pointer"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="min-w-[120px] cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                agent ? 'Update Agent' : 'Create Agent'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
