"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Plus } from "lucide-react"

interface EmptyStateProps {
  hasAnyProducts: boolean
  onCreateClick: () => void
}

export default function EmptyState({ hasAnyProducts, onCreateClick }: EmptyStateProps) {
  return (
    <Card>
      <CardContent>
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {hasAnyProducts ? "No Products Match Your Filters" : "No Products Yet"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {hasAnyProducts 
              ? "Try adjusting your search or filter criteria to find the products you're looking for."
              : "Start building your product catalog to showcase what you offer to customers."
            }
          </p>
          {!hasAnyProducts && (
            <Button onClick={onCreateClick}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Product
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
