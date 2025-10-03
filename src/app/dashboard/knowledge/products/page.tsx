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
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showActiveOnly, setShowActiveOnly] = useState(false)
  const [showInStockOnly, setShowInStockOnly] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageLimit, setPageLimit] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [totalProducts, setTotalProducts] = useState(0)
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



  // Fetch products function
  const fetchProducts = async () => {
    setIsLoading(true)
    
    try {
      const params: any = {
        page: currentPage,
        limit: pageLimit
      }
      if (selectedCategory !== "All") params.category = selectedCategory
      if (showActiveOnly) params.isActive = true
      if (showInStockOnly) params.inStock = true
      if (searchTerm.trim()) params.search = searchTerm.trim()
      
      const res = await api.get(`/product/business/${businessId}`, { params })
      setProducts(res.data.products || [])
      setTotalProducts(res.data.total || 0)
      setTotalPages(res.data.totalPages || 0)
    } catch (err) {
      setProducts([])
      setTotalProducts(0)
      setTotalPages(0)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch products and categories from API
  useEffect(() => {
    if (businessId) {
      fetchProducts()
    }
  }, [businessId, selectedCategory, showActiveOnly, showInStockOnly, searchTerm, currentPage, pageLimit])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get(`/product/business/${businessId}/categories`)
        setCategories(res.data.categories || [])
      } catch (err) {
        setCategories([])
      }
    }
    
    if (businessId) {
      fetchCategories()
    }
  }, [businessId])

  // Reset to page 1 when filters change
  useEffect(() => {
    if (currentPage > 1) {
      setCurrentPage(1)
    }
  }, [selectedCategory, showActiveOnly, showInStockOnly, searchTerm])

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
      const res = await api.post(`/product`, payload)
      if (res.data && res.data.product) {
        // Go to first page and refetch data to show new product immediately
        setCurrentPage(1)
        resetForm()
        // Refetch data to show the new product
        await fetchProducts()
      }
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
        // Update the product in current page
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
      // Remove from current page and adjust pagination if needed
      setProducts(prev => {
        const filtered = prev.filter(product => {
          const pid = product._id || product.id
          return pid !== id
        })
        // If page becomes empty and we're not on page 1, go to previous page
        if (filtered.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1)
        }
        return filtered
      })
      // Update total count
      setTotalProducts(prev => Math.max(0, prev - 1))
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
          totalProducts={totalProducts}
          filteredCount={products.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pageLimit={pageLimit}
          onPageLimitChange={setPageLimit}
        />

        <ProductHeader onCreateClick={() => setIsCreateDialogOpen(true)} />
          
        {/* Product List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[400px] p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              hasAnyProducts={totalProducts > 0}
              onCreateClick={() => setIsCreateDialogOpen(true)}
            />
          ) : (
            <ProductTable
              products={products}
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
