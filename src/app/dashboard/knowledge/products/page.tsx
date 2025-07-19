"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Package } from "lucide-react"

export default function ProductsPage() {
  return (
    <div className="p-8">

      <div className="grid gap-6">
        <Card className="bg-card border-border">
          <CardHeader>
       
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No Products Yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your products to help customers learn about what you offer.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Product
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
