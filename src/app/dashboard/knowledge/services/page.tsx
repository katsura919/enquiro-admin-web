

"use client"

import { useState, useEffect } from "react"
import {useAuth } from "@/lib/auth"
import api from "@/utils/api"
import { Dialog } from "@/components/ui/dialog"
import ServiceHeader from "./components/ServiceHeader"
import ServiceFilters from "./components/ServiceFilters"
import ServiceTable from "./components/ServiceTable"
import ServiceDialog from "./components/ServiceDialog"
import EmptyState from "./components/EmptyState"
import { Service, ServiceFormData, mockServices, categories, normalizeService } from "./components/types"

export default function ServicesPage() {
  const user =  useAuth().user
  const businessId = user?.businessId
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedPricingType, setSelectedPricingType] = useState("All")
  const [showActiveOnly, setShowActiveOnly] = useState(false)
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

  // Fetch services from API
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true)
      setError(null)
      try {
        let url = `/service/business/${businessId}`
        const params: any = {}
        if (selectedCategory !== "All") params.category = selectedCategory
        if (selectedPricingType !== "All") params.pricingType = selectedPricingType
        if (showActiveOnly) params.isActive = true
        const res = await api.get(url, { params })
        setServices(res.data.services.map(normalizeService))
      } catch (err: any) {
        setError(err?.response?.data?.error || err.message || "Failed to fetch services")
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId, selectedCategory, selectedPricingType, showActiveOnly])

  // Filter services based on search and filters (search is client-side)
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

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
      setServices([normalizeService(res.data.service), ...services])
      resetForm()
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || "Failed to create service")
    } finally {
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
      setServices(services.map(service =>
        service.id === editingService.id
          ? normalizeService(res.data.service)
          : service
      ))
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
      setServices(services.filter(service => service.id !== id))
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

  const activeCount = services.filter(s => s.isActive).length
  const inactiveCount = services.filter(s => !s.isActive).length

  return (
    <div className="p-6">
      <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
        setIsCreateDialogOpen(open)
        if (!open) resetForm()
      }}>


        <ServiceFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          selectedPricingType={selectedPricingType}
          onPricingTypeChange={setSelectedPricingType}
          showActiveOnly={showActiveOnly}
          onActiveOnlyChange={setShowActiveOnly}
          categories={categories}
          totalServices={services.length}
          filteredCount={filteredServices.length}
          activeCount={activeCount}
          inactiveCount={inactiveCount}
        />

        <ServiceHeader onCreateClick={() => setIsCreateDialogOpen(true)} />

        {error && <div className="text-red-500 mb-2">{error}</div>}

        {/* Service List */}
        <div className="space-y-4">
          {filteredServices.length === 0 ? (
            <EmptyState
              hasAnyServices={services.length > 0}
              onCreateClick={() => setIsCreateDialogOpen(true)}
            />
          ) : (
            <ServiceTable
              services={filteredServices}
              onEdit={handleEditService}
              onDelete={handleDeleteService}
              onToggleStatus={toggleServiceStatus}
            />
          )}
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
