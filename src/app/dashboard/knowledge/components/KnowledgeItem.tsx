import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"

interface Category {
  _id: string
  name: string
  description: string
  businessId: string
}

interface KnowledgeItemProps {
  item: {
    _id: string
    categoryId: string
    businessId: string
    title: string
    content: string
    updatedAt: Date
  }
  category: Category | undefined
  onEdit: () => void
  onDelete: () => void
}

export default function KnowledgeItem({
  item,
  category,
  onEdit,
  onDelete,
}: KnowledgeItemProps) {  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-foreground">{item.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{category?.name}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{item.content}</p>
        <div className="mt-4 flex items-center text-sm text-muted-foreground">
          <span>Last updated: {new Date(item.updatedAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  )
} 