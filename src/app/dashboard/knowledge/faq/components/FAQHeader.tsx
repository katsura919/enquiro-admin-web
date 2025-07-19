"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  DialogTrigger,
} from "@/components/ui/dialog"

interface FAQHeaderProps {
  onCreateClick: () => void
}

export default function FAQHeader({ onCreateClick }: FAQHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div></div>
      
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2" onClick={onCreateClick}>
          <Plus className="h-4 w-4" />
          Create FAQ
        </Button>
      </DialogTrigger>
    </div>
  )
}
