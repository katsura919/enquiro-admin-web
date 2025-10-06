"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Search } from "lucide-react"

interface ServiceFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (value: string) => void
  selectedPricingType: string
  onPricingTypeChange: (value: string) => void
  showActiveOnly: boolean
  onActiveOnlyChange: (value: boolean) => void
  categories: string[]
  totalServices: number
  filteredCount: number
}

export default function ServiceFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedPricingType,
  onPricingTypeChange,
  showActiveOnly,
  onActiveOnlyChange,
  categories,
  totalServices,
  filteredCount
}: ServiceFiltersProps) {
  return (
    <div className="space-y-4">
      
      {/* Search */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground " />
          <Input
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-card pl-10 shadow-none"
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

      {/* Pricing Type Filter */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Pricing Type</Label>
        <select 
          className="w-full bg-background px-3 py-2 border border-input rounded-md"
          value={selectedPricingType}
          onChange={(e) => onPricingTypeChange(e.target.value)}
        >
          <option value="All">All Pricing</option>
          <option value="fixed">Fixed Price</option>
          <option value="hourly">Hourly Rate</option>
          <option value="package">Package Deal</option>
          <option value="quote">Custom Quote</option>
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
      </div>

      {/* Results Summary */}
      <div className="pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          Showing {filteredCount} of {totalServices} services
        </div>
      </div>
    </div>
  )
}
