import { useState } from "react"
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
}: CategorySidebarProps) {  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: "", description: "" })

  return (
    <div className="h-full bg-card border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Categories</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setIsAddingCategory(true)}
          >
            <FolderPlus className="h-4 w-4" />
          </Button>
        </div>
        
        {isAddingCategory && (
          <div className="space-y-4">
            <Input
              placeholder="Category name"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="bg-background text-foreground border-border"
            />
            <Input
              placeholder="Description"
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              className="bg-background text-foreground border-border"
            />
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
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
                className="flex-1 border-border text-muted-foreground hover:text-foreground"
                onClick={() => {
                  setIsAddingCategory(false)
                  setNewCategory({ name: "", description: "" })
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Category List */}
      <div className="flex-1 overflow-y-auto p-2">
        {!isAddingCategory && (
          <div className="space-y-1">
            <button
              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                !selectedCategory
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
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
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
                onClick={() => onSelectCategory(category._id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 