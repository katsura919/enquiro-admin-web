"use client"

import { useState } from "react"
import { Dialog } from "@/components/ui/dialog"
import ServiceHeader from "./components/ServiceHeader"
import ServiceFilters from "./components/ServiceFilters"
import ServiceTable from "./components/ServiceTable"
import ServiceDialog from "./components/ServiceDialog"
import EmptyState from "./components/EmptyState"
import { Service, ServiceFormData, mockServices, categories } from "./components/types"

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(mockServices)
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

  // Filter services based on search and filters
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = selectedCategory === "All" || service.category === selectedCategory
    const matchesPricingType = selectedPricingType === "All" || service.pricing.type === selectedPricingType
    const matchesActiveStatus = !showActiveOnly || service.isActive
    
    return matchesSearch && matchesCategory && matchesPricingType && matchesActiveStatus
  })

  const handleFormChange = (field: keyof ServiceFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCreateService = () => {
    // TODO: Implement API call to create service
    const newService: Service = {
      id: Date.now().toString(),
      businessId: "business1",
      name: formData.name,
      description: formData.description,
      category: formData.category,
      pricing: {
        type: formData.pricingType,
        amount: formData.pricingType === 'quote' ? 0 : Number(formData.pricingAmount),
        currency: formData.currency
      },
      duration: formData.duration,
      isActive: formData.isActive,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    setServices([newService, ...services])
    resetForm()
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

  const handleUpdateService = () => {
    if (!editingService) return
    
    // TODO: Implement API call to update service
    const updatedServices = services.map(service => 
      service.id === editingService.id 
        ? {
            ...service,
            name: formData.name,
            description: formData.description,
            category: formData.category,
            pricing: {
              type: formData.pricingType,
              amount: formData.pricingType === 'quote' ? 0 : Number(formData.pricingAmount),
              currency: formData.currency
            },
            duration: formData.duration,
            isActive: formData.isActive,
            updatedAt: new Date().toISOString()
          }
        : service
    )
    
    setServices(updatedServices)
    resetForm()
  }

  const handleDeleteService = (id: string) => {
    // TODO: Implement API call to delete service
    setServices(services.filter(service => service.id !== id))
  }

  const toggleServiceStatus = (id: string) => {
    // TODO: Implement API call to toggle service status
    setServices(services.map(service => 
      service.id === id ? { ...service, isActive: !service.isActive } : service
    ))
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
        <ServiceHeader onCreateClick={() => setIsCreateDialogOpen(true)} />
        
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
