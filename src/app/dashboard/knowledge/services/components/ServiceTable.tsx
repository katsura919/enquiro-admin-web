"use client"

import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  ArrowUpDown,
  Clock,
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
import { Service } from "./types"

interface ServiceTableProps {
  services: Service[]
  onEdit: (service: Service) => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string) => void
}

type SortField = 'name' | 'category' | 'pricing' | 'duration' | 'createdAt'
type SortDirection = 'asc' | 'desc'

export default function ServiceTable({ services, onEdit, onDelete, onToggleStatus }: ServiceTableProps) {
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const formatPrice = (pricing: Service['pricing']) => {
    if (pricing.type === 'quote') {
      return 'Custom Quote'
    }
    
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: pricing.currency
    }).format(pricing.amount)
    
    switch (pricing.type) {
      case 'hourly':
        return `${formatted}/hr`
      case 'package':
        return `${formatted} package`
      default:
        return formatted
    }
  }

  const getPricingTypeColor = (type: string) => {
    switch (type) {
      case 'fixed': return 'default'
      case 'hourly': return 'secondary'
      case 'package': return 'outline'
      case 'quote': return 'destructive'
      default: return 'default'
    }
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedServices = [...services].sort((a, b) => {
    let aValue: any = a[sortField]
    let bValue: any = b[sortField]

    if (sortField === 'pricing') {
      aValue = a.pricing.amount
      bValue = b.pricing.amount
    }

    if (sortField === 'createdAt') {
      aValue = new Date(a.createdAt).getTime()
      bValue = new Date(b.createdAt).getTime()
    }

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }

    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-muted/50 select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-2">
        {children}
        <ArrowUpDown className="h-4 w-4" />
      </div>
    </TableHead>
  )

  return (
    <TooltipProvider>
      <div className="border rounded-lg">
        <Table className="bg-card rounded-lg">
          <TableHeader>
            <TableRow>
              <SortableHeader field="name">Service Name</SortableHeader>
              <SortableHeader field="category">Category</SortableHeader>
              <SortableHeader field="pricing">Pricing</SortableHeader>
              <SortableHeader field="duration">Duration</SortableHeader>
              <TableHead>Status</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedServices.map((service, index) => (
              <TableRow key={service.id} className={!service.isActive ? 'opacity-60' : ''}>
                <TableCell>
                  <div>
                    <div className="font-medium">{service.name}</div>
                    {service.description && (
                      <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                        {service.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{service.category}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{formatPrice(service.pricing)}</span>
                    </div>
                    <Badge variant={getPricingTypeColor(service.pricing.type) as any} className="text-xs">
                      {service.pricing.type}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">{service.duration}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={service.isActive ? "default" : "secondary"}>
                    {service.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onToggleStatus(service.id)}
                        className="h-8 w-8 p-0"
                      >
                        {service.isActive ? (
                          <Eye className="h-4 w-4 text-blue-500" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{service.isActive ? 'Active service - Click to deactivate' : 'Inactive service - Click to activate'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => onEdit(service)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => onDelete(service.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  )
}
