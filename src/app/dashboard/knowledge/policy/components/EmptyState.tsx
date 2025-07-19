"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Plus } from "lucide-react"

interface EmptyStateProps {
  hasAnyPolicies: boolean
  onCreateClick: () => void
}

export default function EmptyState({ hasAnyPolicies, onCreateClick }: EmptyStateProps) {
  return (
    <Card>
      <CardContent>
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {hasAnyPolicies ? "No Policies Match Your Filters" : "No Policies Yet"}
          </h3>
          <p className="text-muted-foreground mb-4">
            {hasAnyPolicies 
              ? "Try adjusting your search or filter criteria to find the policies you're looking for."
              : "Start creating your business policies to help customers understand your terms and conditions."
            }
          </p>
          {!hasAnyPolicies && (
            <Button onClick={onCreateClick}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Policy
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
