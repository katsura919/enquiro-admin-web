"use client"

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Service, ServiceFormData, categories, currencies, pricingTypes } from "./types"

interface ServiceDialogProps {
  isOpen: boolean
  onClose: () => void
  editingService: Service | null
  formData: ServiceFormData
  onFormChange: (field: keyof ServiceFormData, value: string | boolean) => void
  onSubmit: () => void
}

export default function ServiceDialog({
  isOpen,
  onClose,
  editingService,
  formData,
  onFormChange,
  onSubmit
}: ServiceDialogProps) {
  if (!isOpen) return null

  const isFormValid = 
    formData.name && 
    formData.category && 
    formData.pricingType &&
    (formData.pricingType === 'quote' || (formData.pricingAmount && !isNaN(Number(formData.pricingAmount))))

  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
        <DialogDescription>
          {editingService ? 'Update the service details below.' : 'Add a new service to your offerings.'}
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Service Name *</Label>
            <Input
              id="name"
              placeholder="Enter service name..."
              value={formData.name}
              onChange={(e) => onFormChange('name', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <select 
              id="category"
              className="w-full p-2 border border-input rounded-md bg-background"
              value={formData.category}
              onChange={(e) => onFormChange('category', e.target.value)}
            >
              <option value="">Select category...</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe your service..."
            value={formData.description}
            onChange={(e) => onFormChange('description', e.target.value)}
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pricingType">Pricing Type *</Label>
            <select 
              id="pricingType"
              className="w-full p-2 border border-input rounded-md bg-background"
              value={formData.pricingType}
              onChange={(e) => onFormChange('pricingType', e.target.value as any)}
            >
              <option value="">Select pricing...</option>
              {pricingTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          
          {formData.pricingType !== 'quote' && (
            <>
              <div className="space-y-2">
                <Label htmlFor="pricingAmount">
                  Amount * {formData.pricingType === 'hourly' && '(per hour)'}
                </Label>
                <Input
                  id="pricingAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.pricingAmount}
                  onChange={(e) => onFormChange('pricingAmount', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <select 
                  id="currency"
                  className="w-full p-2 border border-input rounded-md bg-background"
                  value={formData.currency}
                  onChange={(e) => onFormChange('currency', e.target.value)}
                >
                  {currencies.map(curr => (
                    <option key={curr} value={curr}>{curr}</option>
                  ))}
                </select>
              </div>
            </>
          )}
          
          {formData.pricingType === 'quote' && (
            <div className="col-span-2 space-y-2">
              <Label className="text-muted-foreground">Custom Quote Pricing</Label>
              <p className="text-sm text-muted-foreground">
                Pricing will be determined on a case-by-case basis
              </p>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            placeholder="e.g., 1-2 weeks, 2-3 hours, Varies..."
            value={formData.duration}
            onChange={(e) => onFormChange('duration', e.target.value)}
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => onFormChange('isActive', checked)}
          />
          <Label htmlFor="isActive">Active (available to customers)</Label>
        </div>
        
        <div className="flex gap-3 pt-4">
          <Button 
            onClick={onSubmit}
            disabled={!isFormValid}
            className="flex-1"
          >
            {editingService ? 'Update Service' : 'Add Service'}
          </Button>
          <Button 
            variant="outline" 
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </DialogContent>
  )
}
