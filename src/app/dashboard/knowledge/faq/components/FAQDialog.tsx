"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface FAQ {
  id?: string
  question: string
  answer: string
  category: string
  isActive: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
}

interface FormData {
  question: string
  answer: string
  category: string
  tags: string
  isActive: boolean
}

interface FAQDialogProps {
  isOpen: boolean
  onClose: () => void
  editingFAQ: FAQ | null
  formData: FormData
  onFormChange: (field: keyof FormData, value: string | boolean) => void
  onSubmit: () => void
  categories: string[]
}

export default function FAQDialog({
  isOpen,
  onClose,
  editingFAQ,
  formData,
  onFormChange,
  onSubmit,
  categories
}: FAQDialogProps) {
  const isFormValid = formData.question && formData.answer && formData.category

  // Fallback categories if none provided
  const fallbackCategories = ["Account Management", "Billing", "Support", "Technical", "General"];
  const categoryList = categories && categories.length > 0 ? categories : fallbackCategories;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingFAQ ? 'Edit FAQ' : 'Create New FAQ'}</DialogTitle>
          <DialogDescription>
            {editingFAQ ? 'Update the FAQ details below.' : 'Add a new frequently asked question to your knowledge base.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="question">Question *</Label>
            <Input
              id="question"
              placeholder="Enter the frequently asked question..."
              value={formData.question}
              onChange={(e) => onFormChange('question', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="answer">Answer *</Label>
            <Textarea
              id="answer"
              placeholder="Provide a detailed answer..."
              value={formData.answer}
              onChange={(e) => onFormChange('answer', e.target.value)}
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => onFormChange('category', value)}>
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  {categoryList.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="tag1, tag2, tag3..."
                value={formData.tags}
                onChange={(e) => onFormChange('tags', e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => onFormChange('isActive', checked)}
            />
            <Label htmlFor="isActive">Active (visible to customers)</Label>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button 
              onClick={onSubmit}
              disabled={!isFormValid}
              className="flex-1 cursor-pointer"
            >
              {editingFAQ ? 'Update FAQ' : 'Create FAQ'}
            </Button>
            <Button 
              variant="outline" 
              onClick={onClose}
              className="cursor-pointer"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
