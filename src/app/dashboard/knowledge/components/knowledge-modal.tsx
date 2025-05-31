"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

interface KnowledgeModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: KnowledgeItem) => void
  categories: Category[]
  initialData?: KnowledgeItem
}

interface Category {
  _id: string
  name: string
  description: string
  businessId: string
}

interface KnowledgeItem {
  _id?: string
  categoryId: string
  businessId: string
  title: string
  content: string
}

export default function KnowledgeModal({
  isOpen,
  onClose,
  onSave,
  categories,
  initialData,
}: KnowledgeModalProps) {
  const [formData, setFormData] = useState<KnowledgeItem>({
    categoryId: "",
    businessId: "1", // TODO: Get from context/auth
    title: "",
    content: "",
  })

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData({
        categoryId: categories[0]?._id || "",
        businessId: "1", // TODO: Get from context/auth
        title: "",
        content: "",
      })
    }
  }, [initialData, categories])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <Card className="w-full max-w-2xl bg-white/5 border-blue-500/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">
            {initialData ? "Edit Knowledge" : "Add Knowledge"}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Category
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full rounded-md bg-white/5 border-blue-500/20 text-white px-3 py-2"
            >
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Title
            </label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter knowledge title"
              className="bg-white/5 text-white border-blue-500/20"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-200">
              Content
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Enter knowledge content"
              rows={5}
              className="w-full rounded-md bg-white/5 border border-blue-500/20 text-white px-3 py-2"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            className="border-blue-500/20 text-gray-400 hover:text-white"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            className="bg-blue-500 hover:bg-blue-600"
            onClick={() => {
              onSave(formData)
              onClose()
            }}
          >
            {initialData ? "Update" : "Create"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 