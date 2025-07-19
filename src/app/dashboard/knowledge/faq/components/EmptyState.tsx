"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, HelpCircle } from "lucide-react"

interface EmptyStateProps {
  hasAnyFAQs: boolean
  onCreateClick: () => void
}

export default function EmptyState({ hasAnyFAQs, onCreateClick }: EmptyStateProps) {
  return (
    <Card>
      <CardContent>
        <div className="text-center py-12">
          <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {!hasAnyFAQs ? "No FAQs Yet" : "No FAQs Match Your Filters"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {!hasAnyFAQs 
              ? "Start building your FAQ knowledge base to help customers get quick answers."
              : "Try adjusting your search or filter criteria to find the FAQs you're looking for."
            }
          </p>
          {!hasAnyFAQs && (
            <Button onClick={onCreateClick}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First FAQ
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
