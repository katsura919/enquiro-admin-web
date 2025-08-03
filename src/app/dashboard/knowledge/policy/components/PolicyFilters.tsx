"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Search } from "lucide-react"

interface PolicyFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedType: string
  onTypeChange: (value: string) => void
  showActiveOnly: boolean
  onActiveOnlyChange: (value: boolean) => void
  policyTypes: Array<{ value: string; label: string }>
  totalPolicies: number
  filteredCount: number
  activeCount: number
  inactiveCount: number
}

export default function PolicyFilters({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  showActiveOnly,
  onActiveOnlyChange,
  policyTypes,
  totalPolicies,
  filteredCount,
  activeCount,
  inactiveCount
}: PolicyFiltersProps) {
  return (
    <Card className="bg-card border-none mb-4">
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search policies by title, content, or tags..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="bg-card pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select 
              className="px-3 py-2 border border-input rounded-md bg-card min-w-[150px]"
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value)}
            >
              <option value="All">All Types</option>
              {policyTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
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
          </div>
        </div>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            Showing {filteredCount} of {totalPolicies} policies
          </p>
          <div className="text-sm text-muted-foreground">
            {activeCount} active • {inactiveCount} inactive
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
