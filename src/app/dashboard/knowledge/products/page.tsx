"use client"

import { useState, useEffect } from "react"
import { Dialog } from "@/components/ui/dialog"
import ProductHeader from "./components/ProductHeader"
import ProductFilters from "./components/ProductFilters"
import ProductTable from "./components/ProductTable"
import ProductDialog from "./components/ProductDialog"
import EmptyState from "./components/EmptyState"
import { Product, ProductFormData } from "./components/types"
import api from "@/utils/api"
import { useAuth } from "@/lib/auth"

export default function ProductsPage() {
  const user = useAuth().user
  const businessId = user?.businessId
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
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



  // Fetch products and categories from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params: any = {}
        if (selectedCategory !== "All") params.category = selectedCategory
        if (showActiveOnly) params.isActive = true
        if (showInStockOnly) params.inStock = true
        if (searchTerm.length > 1) {
          // Use search endpoint
          const res = await api.get(`/product/business/${businessId}/search`, { params: { query: searchTerm } })
          setProducts(res.data.products || [])
          return
        }
        const res = await api.get(`/product/business/${businessId}`, { params })
        setProducts(res.data.products || [])
      } catch (err) {
        setProducts([])
      }
    }
    fetchProducts()
  }, [businessId, selectedCategory, showActiveOnly, showInStockOnly, searchTerm])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get(`/product/business/${businessId}/categories`)
        setCategories(res.data.categories || [])
      } catch (err) {
        setCategories([])
      }
    }
    fetchCategories()
  }, [businessId])

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

  const handleCreateProduct = async () => {
    try {
      const payload = {
        businessId,
        name: formData.name,
        sku: formData.sku,
        description: formData.description,
        category: formData.category,
        price: {
          amount: Number(formData.priceAmount),
          currency: formData.currency
        },
        quantity: Number(formData.quantity),
        isActive: formData.isActive
      }
      // Flatten price for backend
      // price is already set above
      const res = await api.post(`/product`, payload)
      if (res.data && res.data.product) {
        setProducts(prev => [res.data.product, ...prev])
      }
      resetForm()
    } catch (err) {
      console.log(err)
    }
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

  const handleUpdateProduct = async () => {
    if (!editingProduct) return
    try {
      const payload = {
        name: formData.name,
        sku: formData.sku,
        description: formData.description,
        category: formData.category,
        price: {
          amount: Number(formData.priceAmount),
          currency: formData.currency
        },
        quantity: Number(formData.quantity),
        isActive: formData.isActive
      }
      const productId = editingProduct._id || editingProduct.id
      const res = await api.put(`/product/${productId}`, payload)
      if (res.data && res.data.product) {
        setProducts(prev => prev.map(product => {
          const pid = product._id || product.id
          return pid === productId ? res.data.product : product
        }))
      }
      resetForm()
    } catch (err) {
      // handle error
    }
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      await api.delete(`/product/${id}`)
      setProducts(prev => prev.filter(product => {
        const pid = product._id || product.id
        return pid !== id
      }))
    } catch (err) {
      // handle error
    }
  }

  const toggleProductStatus = async (id: string) => {
    try {
      const product = products.find(p => (p._id || p.id) === id)
      if (!product) return
      const res = await api.put(`/product/${id}`, {
        ...product,
        isActive: !product.isActive
      })
      if (res.data && res.data.product) {
        setProducts(prev => prev.map(p => {
          const pid = p._id || p.id
          return pid === id ? res.data.product : p
        }))
      }
    } catch (err) {
      // handle error
    }
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
        <ProductFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          showActiveOnly={showActiveOnly}
          onActiveOnlyChange={setShowActiveOnly}
          showInStockOnly={showInStockOnly}
          onInStockOnlyChange={setShowInStockOnly}
          categories={["All", ...categories]}
          totalProducts={products.length}
          filteredCount={filteredProducts.length}
          activeCount={activeCount}
          inactiveCount={inactiveCount}
          inStockCount={inStockCount}
          outOfStockCount={outOfStockCount}
        />

        <ProductHeader onCreateClick={() => setIsCreateDialogOpen(true)} />
          
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
