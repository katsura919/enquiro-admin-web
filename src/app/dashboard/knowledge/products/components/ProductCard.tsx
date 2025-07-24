"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  Edit, 
  Trash2, 
  Eye,
  EyeOff,
  MoreVertical,
  Package,
  DollarSign
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Product } from "./types"

interface ProductCardProps {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string) => void
}

export default function ProductCard({ product, onEdit, onDelete, onToggleStatus }: ProductCardProps) {
  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { text: "Out of Stock", variant: "destructive" as const }
    if (quantity < 10) return { text: "Low Stock", variant: "secondary" as const }
    return { text: "In Stock", variant: "default" as const }
  }

  const stockStatus = getStockStatus(product.quantity)

  return (
    <TooltipProvider>
      <Card className={`transition-all ${product.isActive ? '' : 'opacity-60'}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg leading-tight">
                      {product.name}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {product.sku}
                    </Badge>
                  </div>
                  {product.description && (
                    <p className="text-muted-foreground leading-relaxed mb-2">
                      {product.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-medium">
                        {formatPrice(product.price.amount, product.price.currency)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4 text-blue-600" />
                      <span>{product.quantity} units</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{product.category}</Badge>
                <Badge variant={stockStatus.variant}>{stockStatus.text}</Badge>
              </div>
              
              <div className="text-xs text-muted-foreground">
                Created: {new Date(product.createdAt).toLocaleDateString()} • 
                Updated: {new Date(product.updatedAt).toLocaleDateString()}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  {(product.id ?? product._id) && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => onToggleStatus((product.id ?? product._id) as string)}
                      className="h-8 w-8 p-0"
                    >
                      {product.isActive ? (
                        <Eye className="h-4 w-4 text-green-500" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  )}
                </TooltipTrigger>
                <TooltipContent>
                  <p>{product.isActive ? 'Active product - Click to deactivate' : 'Inactive product - Click to activate'}</p>
                </TooltipContent>
              </Tooltip>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => onEdit(product)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {(product.id ?? product._id) && (
                    <DropdownMenuItem 
                      onClick={() => onDelete((product.id ?? product._id) as string)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
