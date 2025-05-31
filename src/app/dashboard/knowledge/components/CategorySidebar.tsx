import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FolderPlus } from "lucide-react"

interface Category {
  _id: string
  name: string
  description: string
  businessId: string
}

interface CategorySidebarProps {
  categories: Category[]
  selectedCategory: string | null
  onSelectCategory: (categoryId: string | null) => void
  onAddCategory: (category: { name: string; description: string }) => void
}

export default function CategorySidebar({
  categories,
  selectedCategory,
  onSelectCategory,
  onAddCategory,
}: CategorySidebarProps) {
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: "", description: "" })

  return (
    <Card className="bg-white/5 border-blue-500/20 md:col-span-1">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">Categories</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-400 hover:text-white"
          onClick={() => setIsAddingCategory(true)}
        >
          <FolderPlus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {isAddingCategory ? (
          <div className="space-y-4">
            <Input
              placeholder="Category name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="bg-white/5 text-white border-blue-500/20"
            />
            <Input
              placeholder="Description"
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              className="bg-white/5 text-white border-blue-500/20"
            />
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-blue-500 hover:bg-blue-600"
                onClick={() => {
                  onAddCategory(newCategory)
                  setIsAddingCategory(false)
                  setNewCategory({ name: "", description: "" })
                }}
              >
                Save
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-blue-500/20 text-gray-400 hover:text-white"
                onClick={() => {
                  setIsAddingCategory(false)
                  setNewCategory({ name: "", description: "" })
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                !selectedCategory
                  ? "bg-blue-500 text-white"
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
              onClick={() => onSelectCategory(null)}
            >
              All Categories
            </button>
            {categories.map((category) => (
              <button
                key={category._id}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  selectedCategory === category._id
                    ? "bg-blue-500 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
                onClick={() => onSelectCategory(category._id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 