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
import { Product, ProductFormData, categories, currencies } from "./types"

interface ProductDialogProps {
  isOpen: boolean
  onClose: () => void
  editingProduct: Product | null
  formData: ProductFormData
  onFormChange: (field: keyof ProductFormData, value: string | boolean) => void
  onSubmit: () => void
}

export default function ProductDialog({
  isOpen,
  onClose,
  editingProduct,
  formData,
  onFormChange,
  onSubmit
}: ProductDialogProps) {
  if (!isOpen) return null

  const isFormValid = 
    formData.name && 
    formData.sku && 
    formData.category && 
    formData.priceAmount && 
    !isNaN(Number(formData.priceAmount)) &&
    !isNaN(Number(formData.quantity))

  return (
    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        <DialogDescription>
          {editingProduct ? 'Update the product details below.' : 'Add a new product to your inventory.'}
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              placeholder="Enter product name..."
              value={formData.name}
              onChange={(e) => onFormChange('name', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sku">SKU *</Label>
            <Input
              id="sku"
              placeholder="Product SKU..."
              value={formData.sku}
              onChange={(e) => onFormChange('sku', e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe your product..."
            value={formData.description}
            onChange={(e) => onFormChange('description', e.target.value)}
            rows={3}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
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
          
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="0"
              placeholder="0"
              value={formData.quantity}
              onChange={(e) => onFormChange('quantity', e.target.value)}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-2">
            <Label htmlFor="priceAmount">Price *</Label>
            <Input
              id="priceAmount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={formData.priceAmount}
              onChange={(e) => onFormChange('priceAmount', e.target.value)}
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
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => onFormChange('isActive', checked)}
          />
          <Label htmlFor="isActive">Active (available for sale)</Label>
        </div>
        
        <div className="flex gap-3 pt-4">
          <Button 
            onClick={onSubmit}
            disabled={!isFormValid}
            className="flex-1"
          >
            {editingProduct ? 'Update Product' : 'Add Product'}
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
