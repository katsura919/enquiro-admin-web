"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, HelpCircle } from "lucide-react"

export default function FAQPage() {
  return (
    <div className="p-8">

      <div className="grid gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
         
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No FAQs Yet</h3>
              <p className="text-muted-foreground mb-4">
                Start building your FAQ knowledge base to help customers get quick answers.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First FAQ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
