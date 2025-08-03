"use client"

import { Card, CardContent } from "@/components/ui/card"
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
  activeCount: number
  inactiveCount: number
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
  filteredCount,
  activeCount,
  inactiveCount
}: ServiceFiltersProps) {
  return (
    <Card className="bg-card border-none mb-4">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services by name or description..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="bg-card pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select 
              className="px-3 py-2 border border-input rounded-md bg-card min-w-[150px]"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            
            <select 
              className="px-3 py-2 border border-input rounded-md bg-card min-w-[140px]"
              value={selectedPricingType}
              onChange={(e) => onPricingTypeChange(e.target.value)}
            >
              <option value="All">All Pricing</option>
              <option value="fixed">Fixed Price</option>
              <option value="hourly">Hourly Rate</option>
              <option value="package">Package Deal</option>
              <option value="quote">Custom Quote</option>
            </select>
            
            <div className="bg-card flex items-center space-x-2 px-3 py-2 border border-input rounded-md ">
              <Switch
                className="bg-card"
                id="activeOnly"
                checked={showActiveOnly}
                onCheckedChange={onActiveOnlyChange}
              />
              <Label htmlFor="activeOnly" className="text-sm whitespace-nowrap">Active only</Label>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Showing {filteredCount} of {totalServices} services
          </p>
          <div className="text-sm text-muted-foreground">
            {activeCount} active • {inactiveCount} inactive
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
