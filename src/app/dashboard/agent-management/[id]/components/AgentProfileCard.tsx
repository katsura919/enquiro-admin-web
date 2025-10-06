"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { 
  Edit, 
  Mail, 
  Phone, 
  MapPin
} from "lucide-react"

interface Agent {
  _id: string
  businessId: string
  name: string
  email: string
  phone?: string
  profilePic?: string
  role: string
  createdAt: string
  deletedAt?: string | null
}

interface AgentProfileCardProps {
  agent: Agent
  isEditing: boolean
  editForm: {
    name: string
    email: string
    phone: string
  }
  onEdit: () => void
  onSave: () => void
  onCancel: () => void
  onFormChange: (field: string, value: string) => void
}

export function AgentProfileCard({
  agent,
  isEditing,
  editForm,
  onEdit,
  onSave,
  onCancel,
  onFormChange
}: AgentProfileCardProps) {
  const getInitials = (name: string) => {
    if (!name || typeof name !== 'string') {
      return 'NA'
    }
    return name
      .trim()
      .split(" ")
      .filter(word => word.length > 0)
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || 'NA'
  }

  return (
    <>
      <Card className="overflow-hidden bg-card border-muted-gray shadow-none">
        <CardContent className="p-0">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 px-6 py-8">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                <AvatarImage src={agent.profilePic} alt={agent.name || 'Agent'} />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                  {getInitials(agent.name || '')}
                </AvatarFallback>
              </Avatar>
              
              <div className="mt-4">
                {isEditing ? (
                  <Input
                    value={editForm.name}
                    onChange={(e) => onFormChange('name', e.target.value)}
                    className="text-center text-lg font-semibold bg-white dark:bg-gray-800"
                    placeholder="Agent name"
                  />
                ) : (
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {agent.name || 'Unknown Agent'}
                  </h2>
                )}
                <p className="text-sm text-gray-600 dark:text-gray-300 capitalize mt-1">
                  {agent.role || 'Product Designer'}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="px-6 py-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-3">
              Contact Information
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Phone:</p>
                  {isEditing ? (
                    <Input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => onFormChange('phone', e.target.value)}
                      className="text-sm mt-1"
                      placeholder="+1 555 666 7890"
                    />
                  ) : (
                    <p className="text-sm text-gray-900 dark:text-white">
                      {agent.phone || '+1 555 666 7890'}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Address:</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    525 E 68th Street<br />
                    New York, NY 10021-5-308-69
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">E-mail:</p>
                  {isEditing ? (
                    <Input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => onFormChange('email', e.target.value)}
                      className="text-sm mt-1"
                      placeholder="hello@jeremyrose.com"
                    />
                  ) : (
                    <p className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                      {agent.email || 'hello@jeremyrose.com'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Edit Profile Button */}
            {!isEditing && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onEdit}
                className="w-full mt-4"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Edit Profile Buttons - Below Card */}
      {isEditing && (
        <div className="flex gap-2 mt-4">
          <Button size="sm" onClick={onSave} className="flex-1">
            Save Changes
          </Button>
          <Button size="sm" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        </div>
      )}
    </>
  )
}