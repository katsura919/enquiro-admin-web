"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface FAQFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedCategory: string
  onCategoryChange: (value: string) => void
  showActiveOnly: boolean
  onActiveOnlyChange: (value: boolean) => void
  categories: string[]
  totalFAQs: number
  filteredCount: number
  activeCount: number
  inactiveCount: number
}

export default function FAQFilters({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  showActiveOnly,
  onActiveOnlyChange,
  categories,
  totalFAQs,
  filteredCount,
  activeCount,
  inactiveCount
}: FAQFiltersProps) {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search FAQs by question, answer, or tags..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select 
              className="px-3 py-2 border border-input rounded-md bg-background min-w-[150px]"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            
            <div className="flex items-center space-x-2 px-3 py-2 border border-input rounded-md bg-background">
              <Switch
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
            Showing {filteredCount} of {totalFAQs} FAQs
          </p>
          <div className="text-sm text-muted-foreground">
            {activeCount} active • {inactiveCount} inactive
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
