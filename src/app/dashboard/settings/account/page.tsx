"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { User, Upload } from "lucide-react"

// Dummy user data based on userModel.js
const dummyUser = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  phoneNumber: "+1234567890",
  profilePicture: "https://ui-avatars.com/api/?name=John+Doe",
  isVerified: true,
  businessId: "Business Name",
}

export default function AccountSettingsPage() {
  const [user, setUser] = useState(dummyUser)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 800)
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold text-white mb-2">Account Settings</h1>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-12">
        {/* Left: Profile fields */}
        <div className="flex-1 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1 text-white">First Name</label>
            <Input className="bg-white/5 text-white border-blue-500/20" value={user.firstName} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white">Last Name</label>
            <Input className="bg-white/5 text-white border-blue-500/20" value={user.lastName} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white">Email</label>
            <Input className="bg-white/5 text-white border-blue-500/20" value={user.email} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white">Phone Number</label>
            <Input className="bg-white/5 text-white border-blue-500/20" value={user.phoneNumber} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white">Business</label>
            <Input className="bg-white/5 text-white border-blue-500/20" value={user.businessId} readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-white">Status</label>
            <Input className="bg-white/5 text-white border-blue-500/20" value={user.isVerified ? 'Verified' : 'Not Verified'} readOnly />
          </div>
        </div>
        {/* Right: Profile picture */}
        <div className="flex flex-col items-center gap-4 min-w-[180px]">
          <div className="relative">
            <img
              src={user.profilePicture}
              alt="Profile picture"
              className="w-36 h-36 rounded-full border-4 border-white/10 object-cover"
            />
            <Button
              type="button"
              size="icon"
              className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-white/10 hover:bg-white/20 border border-white/20 text-white"
              disabled
            >
              <Upload className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
