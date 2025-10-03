"use client"

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
  filteredCount
}: ProductFiltersProps) {
  return (
    <div className="space-y-4">
    
      
      {/* Search */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-background pl-10"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Category</Label>
        <select 
          className="w-full bg-background px-3 py-2 border border-input rounded-md"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="All">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Filters</Label>
        
        <div className="flex items-center space-x-2 px-3 py-2 border border-input rounded-md bg-background">
          <Switch
            id="activeOnly"
            checked={showActiveOnly}
            onCheckedChange={onActiveOnlyChange}
          />
          <Label htmlFor="activeOnly" className="text-sm">Active only</Label>
        </div>

        <div className="flex items-center space-x-2 px-3 py-2 border border-input rounded-md bg-background">
          <Switch
            id="inStockOnly"
            checked={showInStockOnly}
            onCheckedChange={onInStockOnlyChange}
          />
          <Label htmlFor="inStockOnly" className="text-sm">In stock only</Label>
        </div>
      </div>

      {/* Results Summary */}
      <div className="pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          Showing {filteredCount} of {totalProducts} products
        </div>
      </div>
    </div>
  )
}
