import { Star, MessageSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface EmptyStateProps {
  title?: string
  description?: string
  icon?: "star" | "message"
}

export default function EmptyState({ 
  title = "No Ratings Yet", 
  description = "Customer ratings will appear here once they start rating your agents.",
  icon = "star"
}: EmptyStateProps) {
  const Icon = icon === "star" ? Star : MessageSquare

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="flex flex-col items-center justify-center py-16 px-4">
        <div className="rounded-full bg-muted p-6 mb-4">
          <Icon className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground text-center max-w-md">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}
