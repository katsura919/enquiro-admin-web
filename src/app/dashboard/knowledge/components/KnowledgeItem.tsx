import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface Category {
  _id: string;
  name: string;
  description: string;
  businessId: string;
}

interface KnowledgeItemProps {
  item: {
    _id: string;
    categoryId: string;
    businessId: string;
    title: string;
    content: string;
    updatedAt: Date;
  };
  category: Category | undefined;
  onEdit: () => void;
  onDelete: () => void;
}

export default function KnowledgeItem({
  item,
  category,
  onEdit,
  onDelete,
}: KnowledgeItemProps) {
  return (
    <Card className="bg-card border-muted-gray shadow-none hover:shadow-sm transition-shadow">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="flex-1">
          <CardTitle className="text-lg text-secondary-foreground">
            {item.title}
          </CardTitle>
          {category && (
            <p className="text-sm text-muted-foreground mt-1">
              {category.name}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground h-8 w-8 p-0"
            onClick={onEdit}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground text-sm line-clamp-3">
          {item.content}
        </p>
        <div className="mt-4 flex items-center text-xs text-muted-foreground">
          <span>
            Last updated: {new Date(item.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
