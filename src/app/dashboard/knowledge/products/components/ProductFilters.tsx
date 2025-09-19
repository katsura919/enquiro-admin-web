"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Search } from "lucide-react"

interface ProductFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (value: string) => void
  showActiveOnly: boolean
  onActiveOnlyChange: (value: boolean) => void
  showInStockOnly: boolean
  onInStockOnlyChange: (value: boolean) => void
  categories: string[]
  totalProducts: number
  filteredCount: number
  activeCount: number
  inactiveCount: number
  inStockCount: number
  outOfStockCount: number
}

export default function ProductFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  showActiveOnly,
  onActiveOnlyChange,
  showInStockOnly,
  onInStockOnlyChange,
  categories,
  totalProducts,
  filteredCount,
  activeCount,
  inactiveCount,
  inStockCount,
  outOfStockCount
}: ProductFiltersProps) {
  return (
    <Card className="bg-none border-none mb-4">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products by name, SKU, or description..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="bg-card pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select 
              className="bg-card px-3 py-2 border border-input rounded-md  min-w-[150px]"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            
            <div className="flex items-center space-x-2 px-3 py-2 border border-input rounded-md bg-card">
              <Switch
                id="activeOnly"
                checked={showActiveOnly}
                onCheckedChange={onActiveOnlyChange}
              />
              <Label htmlFor="activeOnly" className="text-sm whitespace-nowrap">Active only</Label>
            </div>

            <div className="flex items-center space-x-2 px-3 py-2 border border-input rounded-md bg-card">
              <Switch
                id="inStockOnly"
                checked={showInStockOnly}
                onCheckedChange={onInStockOnlyChange}
              />
              <Label htmlFor="inStockOnly" className="text-sm whitespace-nowrap">In stock</Label>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Showing {filteredCount} of {totalProducts} products
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>{activeCount} active • {inactiveCount} inactive</span>
            <span>{inStockCount} in stock • {outOfStockCount} out of stock</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
