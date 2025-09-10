"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wrench, Plus } from "lucide-react"

interface EmptyStateProps {
  hasAnyServices: boolean
  onCreateClick: () => void
}

export default function EmptyState({ hasAnyServices, onCreateClick }: EmptyStateProps) {
  return (
    <Card className="border-none h-[60vh] flex items-center justify-center">
      <CardContent>
        <div className="text-center py-12">
          <Wrench className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {hasAnyServices ? "No Services Match Your Filters" : "No Services Yet"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {hasAnyServices 
              ? "Try adjusting your search or filter criteria to find the services you're looking for."
              : "Start building your service catalog to showcase what you provide to customers."
            }
          </p>
          {!hasAnyServices && (
            <Button onClick={onCreateClick}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Service
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
