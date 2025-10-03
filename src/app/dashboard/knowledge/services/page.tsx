

"use client"

import { useState, useEffect } from "react"
import {useAuth } from "@/lib/auth"
import api from "@/utils/api"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import ServiceFilters from "./components/ServiceFilters"
import ServiceTable from "./components/ServiceTable"
import ServiceDialog from "./components/ServiceDialog"
import ServicePagination from "./components/ServicePagination"
import EmptyState from "./components/EmptyState"
import { Service, ServiceFormData, mockServices, categories, normalizeService } from "./components/types"

export default function ServicesPage() {
  const user =  useAuth().user
  const businessId = user?.businessId
  const [services, setServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedPricingType, setSelectedPricingType] = useState("All")
  const [showActiveOnly, setShowActiveOnly] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const pageLimit = 12
  const [totalServices, setTotalServices] = useState(0)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  // Form state for creating/editing service
  const [formData, setFormData] = useState<ServiceFormData>({
    name: "",
    description: "",
    category: "",
    pricingType: "fixed",
    pricingAmount: "",
    currency: "USD",
    duration: "",
    isActive: true
  })

  // Fetch services function
  const fetchServices = async () => {
    setLoading(true)
    setError(null)
    try {
      const params: any = {
        page: currentPage,
        limit: pageLimit
      }
      if (selectedCategory !== "All") params.category = selectedCategory
      if (selectedPricingType !== "All") params.pricingType = selectedPricingType
      if (showActiveOnly) params.isActive = true
      if (searchTerm.trim()) params.search = searchTerm.trim()
      
      const res = await api.get(`/service/business/${businessId}`, { params })
      setServices((res.data.services || []).map(normalizeService))
      setTotalServices(res.data.total || 0)
      setTotalPages(res.data.totalPages || 0)
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || "Failed to fetch services")
      setServices([])
      setTotalServices(0)
      setTotalPages(0)
    } finally {
      setLoading(false)
    }
  }

  // Fetch services from API
  useEffect(() => {
    if (businessId) {
      fetchServices()
    }
  }, [businessId, selectedCategory, selectedPricingType, showActiveOnly, searchTerm, currentPage, pageLimit])

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get(`/service/business/${businessId}/categories`)
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
  }, [selectedCategory, selectedPricingType, showActiveOnly, searchTerm])

  const handleFormChange = (field: keyof ServiceFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCreateService = async () => {
    setLoading(true)
    setError(null)
    try {
      const payload = {
        businessId,
        name: formData.name,
        description: formData.description,
        category: formData.category,
        pricing: {
          type: formData.pricingType,
          amount: formData.pricingType === 'quote' ? 0 : Number(formData.pricingAmount),
          currency: formData.currency
        },
        duration: formData.duration,
        isActive: formData.isActive
      }
      const res = await api.post("/service", payload)
      if (res.data && res.data.service) {
        // Go to first page and reset form
        setCurrentPage(1)
        resetForm()
        // Refetch data to show the new service immediately
        await fetchServices()
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || "Failed to create service")
      setLoading(false)
    }
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description,
      category: service.category,
      pricingType: service.pricing.type,
      pricingAmount: service.pricing.type === 'quote' ? '' : service.pricing.amount.toString(),
      currency: service.pricing.currency,
      duration: service.duration,
      isActive: service.isActive
    })
    setIsCreateDialogOpen(true)
  }

  const handleUpdateService = async () => {
    if (!editingService) return
    setLoading(true)
    setError(null)
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        pricing: {
          type: formData.pricingType,
          amount: formData.pricingType === 'quote' ? 0 : Number(formData.pricingAmount),
          currency: formData.currency
        },
        duration: formData.duration,
        isActive: formData.isActive
      }
      const res = await api.put(`/service/${editingService.id}`, payload)
      if (res.data && res.data.service) {
        // Update the service in current page
        setServices(prev => prev.map(service =>
          service.id === editingService.id
            ? normalizeService(res.data.service)
            : service
        ))
      }
      resetForm()
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || "Failed to update service")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteService = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      await api.delete(`/service/${id}`)
      // Remove from current page and adjust pagination if needed
      setServices(prev => {
        const filtered = prev.filter(service => service.id !== id)
        // If page becomes empty and we're not on page 1, go to previous page
        if (filtered.length === 0 && currentPage > 1) {
          setCurrentPage(currentPage - 1)
        }
        return filtered
      })
      // Update total count
      setTotalServices(prev => Math.max(0, prev - 1))
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || "Failed to delete service")
    } finally {
      setLoading(false)
    }
  }

  const toggleServiceStatus = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const service = services.find(s => s.id === id)
      if (!service) return
      const payload = { ...service, isActive: !service.isActive }
      const res = await api.put(`/service/${id}`, payload)
      setServices(services.map(s => s.id === id ? normalizeService(res.data.service) : s))
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || "Failed to update status")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "",
      pricingType: "fixed",
      pricingAmount: "",
      currency: "USD",
      duration: "",
      isActive: true
    })
    setEditingService(null)
    setIsCreateDialogOpen(false)
  }

  const handleDialogSubmit = () => {
    if (editingService) {
      handleUpdateService()
    } else {
      handleCreateService()
    }
  }

  return (
    <div className="p-6">
      <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
        setIsCreateDialogOpen(open)
        if (!open) resetForm()
      }}>
        
        {/* Responsive Layout: Vertical on mobile, Horizontal on desktop */}
        <div className="flex flex-col lg:flex-row gap-6 h-full">
          
          {/* Left Sidebar: Search and Filters - Fixed */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="space-y-6 bg-card p-6 rounded-lg">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Service Manager</h2>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2" onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4" />
                    New Service
                  </Button>
                </DialogTrigger>
              </div>
              
              <ServiceFilters
                searchTerm={searchTerm}
                onSearchChange={(value) => {
                  setSearchTerm(value)
                  setCurrentPage(1) // Reset to first page when searching
                }}
                selectedCategory={selectedCategory}
                onCategoryChange={(value) => {
                  setSelectedCategory(value)
                  setCurrentPage(1) // Reset to first page when filtering
                }}
                selectedPricingType={selectedPricingType}
                onPricingTypeChange={(value) => {
                  setSelectedPricingType(value)
                  setCurrentPage(1) // Reset to first page when filtering
                }}
                showActiveOnly={showActiveOnly}
                onActiveOnlyChange={(value) => {
                  setShowActiveOnly(value)
                  setCurrentPage(1) // Reset to first page when filtering
                }}
                categories={["All", ...categories]}
                totalServices={totalServices}
                filteredCount={services.length}
              />
            </div>
          </div>

          {/* Right Main Content: Service List */}
          <div className="flex-1 flex flex-col min-h-0">
            {error && <div className="text-red-500 mb-2">{error}</div>}
            
            {/* Scrollable Service List Container */}
            <div className="flex-1 flex flex-col min-h-0 rounded-b-md">
              <ScrollArea className="h-[calc(100vh-180px)] rounded-lg">
                <div className="space-y-4 pr-4 pb-2">
                  {loading ? (
                    <div className="flex items-center justify-center min-h-[400px] p-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-none"></div>
                    </div>
                  ) : services.length === 0 ? (
                    <EmptyState
                      hasAnyServices={totalServices > 0}
                      onCreateClick={() => setIsCreateDialogOpen(true)}
                    />
                  ) : (
                    <ServiceTable
                      services={services}
                      onEdit={handleEditService}
                      onDelete={handleDeleteService}
                      onToggleStatus={toggleServiceStatus}
                    />
                  )}
                </div>
              </ScrollArea>

              {/* Fixed Pagination at Bottom - Always Rendered */}
              <div className="flex-shrink-0 bg-background">
                <ServicePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  totalItems={totalServices}
                  itemsPerPage={pageLimit}
                />
              </div>
            </div>
          </div>
        </div>

        <ServiceDialog
          isOpen={isCreateDialogOpen}
          onClose={resetForm}
          editingService={editingService}
          formData={formData}
          onFormChange={handleFormChange}
          onSubmit={handleDialogSubmit}
        />
      </Dialog>
    </div>
  )
}
