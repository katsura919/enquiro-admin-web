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
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  pageLimit: number
  onPageLimitChange: (limit: number) => void
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
  currentPage,
  totalPages,
  onPageChange,
  pageLimit,
  onPageLimitChange
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
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Showing {filteredCount} of {totalProducts} products
            </p>
            <div className="flex items-center gap-2">
              <Label className="text-sm text-muted-foreground">Per page:</Label>
              <select 
                className="bg-card px-2 py-1 border border-input rounded text-sm"
                value={pageLimit}
                onChange={(e) => onPageLimitChange(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
          
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-input rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
              >
                Previous
              </button>
              
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-input rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
