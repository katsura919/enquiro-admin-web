"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
    <div className="space-y-4">
      {/* Search Section */}
      <div>
        <Label className="text-sm font-semibold mb-3 block">Search & Filter</Label>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-card shadow-none"
          />
        </div>
      </div>
      
      {/* Filter Controls */}
      <div className="space-y-3">
        {/* Category Filter */}
        <div>
          <Label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wide">
            Category
          </Label>
          <Select value={selectedCategory} onValueChange={onCategoryChange}>
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Status Filter */}
        <div>
          <Label className="text-xs font-medium text-muted-foreground mb-2 block uppercase tracking-wide">
            Status
          </Label>
          <div className="flex items-center space-x-3 px-3 py-2 border border-input rounded-md bg-card">
            <Switch
              id="activeOnly"
              checked={showActiveOnly}
              onCheckedChange={onActiveOnlyChange}
            />
            <Label htmlFor="activeOnly" className="text-sm font-medium">
              Active only
            </Label>
          </div>
        </div>
      </div>
      
      {/* Stats Summary */}
      <div className="pt-4 border-t">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total FAQs</span>
            <span className="font-medium">{totalFAQs}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Showing</span>
            <span className="font-medium">{filteredCount}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Active: {activeCount}</span>
            <span>Inactive: {inactiveCount}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
