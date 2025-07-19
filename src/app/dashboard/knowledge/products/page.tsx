"use client"

import { useState } from "react"
import { Dialog } from "@/components/ui/dialog"
import ProductHeader from "./components/ProductHeader"
import ProductFilters from "./components/ProductFilters"
import ProductTable from "./components/ProductTable"
import ProductDialog from "./components/ProductDialog"
import EmptyState from "./components/EmptyState"
import { Product, ProductFormData, mockProducts, categories } from "./components/types"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showActiveOnly, setShowActiveOnly] = useState(false)
  const [showInStockOnly, setShowInStockOnly] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Form state for creating/editing product
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    sku: "",
    description: "",
    category: "",
    priceAmount: "",
    currency: "USD",
    quantity: "0",
    isActive: true
  })

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
    const matchesActiveStatus = !showActiveOnly || product.isActive
    const matchesStockStatus = !showInStockOnly || product.quantity > 0
    
    return matchesSearch && matchesCategory && matchesActiveStatus && matchesStockStatus
  })

  const handleFormChange = (field: keyof ProductFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCreateProduct = () => {
    // TODO: Implement API call to create product
    const newProduct: Product = {
      id: Date.now().toString(),
      businessId: "business1",
      name: formData.name,
      sku: formData.sku,
      description: formData.description,
      category: formData.category,
      price: {
        amount: Number(formData.priceAmount),
        currency: formData.currency
      },
      quantity: Number(formData.quantity),
      isActive: formData.isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    setProducts([newProduct, ...products])
    resetForm()
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      sku: product.sku,
      description: product.description,
      category: product.category,
      priceAmount: product.price.amount.toString(),
      currency: product.price.currency,
      quantity: product.quantity.toString(),
      isActive: product.isActive
    })
    setIsCreateDialogOpen(true)
  }

  const handleUpdateProduct = () => {
    if (!editingProduct) return
    
    // TODO: Implement API call to update product
    const updatedProducts = products.map(product => 
      product.id === editingProduct.id 
        ? {
            ...product,
            name: formData.name,
            sku: formData.sku,
            description: formData.description,
            category: formData.category,
            price: {
              amount: Number(formData.priceAmount),
              currency: formData.currency
            },
            quantity: Number(formData.quantity),
            isActive: formData.isActive,
            updatedAt: new Date().toISOString()
          }
        : product
    )
    
    setProducts(updatedProducts)
    resetForm()
  }

  const handleDeleteProduct = (id: string) => {
    // TODO: Implement API call to delete product
    setProducts(products.filter(product => product.id !== id))
  }

  const toggleProductStatus = (id: string) => {
    // TODO: Implement API call to toggle product status
    setProducts(products.map(product => 
      product.id === id ? { ...product, isActive: !product.isActive } : product
    ))
  }

  const resetForm = () => {
    setFormData({
      name: "",
      sku: "",
      description: "",
      category: "",
      priceAmount: "",
      currency: "USD",
      quantity: "0",
      isActive: true
    })
    setEditingProduct(null)
    setIsCreateDialogOpen(false)
  }

  const handleDialogSubmit = () => {
    if (editingProduct) {
      handleUpdateProduct()
    } else {
      handleCreateProduct()
    }
  }

  const activeCount = products.filter(p => p.isActive).length
  const inactiveCount = products.filter(p => !p.isActive).length
  const inStockCount = products.filter(p => p.quantity > 0).length
  const outOfStockCount = products.filter(p => p.quantity === 0).length

  return (
    <div className="p-6">
      <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
        setIsCreateDialogOpen(open)
        if (!open) resetForm()
      }}>
        <ProductHeader onCreateClick={() => setIsCreateDialogOpen(true)} />
        
        <ProductFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          showActiveOnly={showActiveOnly}
          onActiveOnlyChange={setShowActiveOnly}
          showInStockOnly={showInStockOnly}
          onInStockOnlyChange={setShowInStockOnly}
          categories={categories}
          totalProducts={products.length}
          filteredCount={filteredProducts.length}
          activeCount={activeCount}
          inactiveCount={inactiveCount}
          inStockCount={inStockCount}
          outOfStockCount={outOfStockCount}
        />

        {/* Product List */}
        <div className="space-y-4">
          {filteredProducts.length === 0 ? (
            <EmptyState 
              hasAnyProducts={products.length > 0} 
              onCreateClick={() => setIsCreateDialogOpen(true)} 
            />
          ) : (
            <ProductTable
              products={filteredProducts}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onToggleStatus={toggleProductStatus}
            />
          )}
        </div>

        <ProductDialog
          isOpen={isCreateDialogOpen}
          onClose={resetForm}
          editingProduct={editingProduct}
          formData={formData}
          onFormChange={handleFormChange}
          onSubmit={handleDialogSubmit}
        />
      </Dialog>
    </div>
  )
}
