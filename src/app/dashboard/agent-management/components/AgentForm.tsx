"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Agent } from "./AgentTable"

interface AgentFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
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
    password: "",
    confirmPassword: ""
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
          password: "", // Don't populate password for editing
          confirmPassword: ""
        })
      } else {
        // Creating new agent
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: ""
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {agent ? 'Edit Agent' : 'Add New Agent'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Form Fields */}
          <div className="space-y-4">
            <div>
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

            <div>
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

            <div>
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

            <div>
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
