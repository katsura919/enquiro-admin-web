"use client"

import * as React from "react";

import { useState } from "react"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import FAQHeader from "./components/FAQHeader"
import FAQFilters from "./components/FAQFilters"
import FAQCard from "./components/FAQCard"
import FAQDialog from "./components/FAQDialog"
import EmptyState from "./components/EmptyState"
import FAQPagination from "./components/FAQPagination"
import { FAQ, FormData, FAQResponse } from "./components/types"
import { ScrollArea } from "@/components/ui/scroll-area"
import api from "@/utils/api";
import { useAuth } from "@/lib/auth"

export default function FAQPage() {
  // Replace with your actual businessId source
  const { user } = useAuth()
  const businessId = user?.businessId
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showActiveOnly, setShowActiveOnly] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [totalFAQs, setTotalFAQs] = useState(0)
  const [itemsPerPage] = useState(10)

  // Form state for creating/editing FAQ
  const [formData, setFormData] = useState<FormData>({
    question: "",
    answer: "",
    category: "",
    tags: "",
    isActive: true
  })

  // Fetch FAQs with current filters and pagination
  const fetchFAQs = React.useCallback(async () => {
    if (!businessId) return
    
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString()
      })
      
      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim())
      }
      
      if (selectedCategory && selectedCategory !== 'All') {
        params.append('category', selectedCategory)
      }
      
      if (showActiveOnly) {
        params.append('isActive', 'true')
      }
      
      const { data }: { data: FAQResponse } = await api.get(`/faq/business/${businessId}?${params}`)
      
      if (data.success) {
        setFaqs(data.faqs)
        setTotalFAQs(data.total)
        setTotalPages(data.totalPages)
      }
    } catch (err) {
      setFaqs([])
      setTotalFAQs(0)
      setTotalPages(0)
    } finally {
      setLoading(false)
    }
  }, [businessId, currentPage, itemsPerPage, searchTerm, selectedCategory, showActiveOnly])

  // Fetch categories separately (doesn't need pagination)
  const fetchCategories = React.useCallback(async () => {
    if (!businessId) return
    
    try {
      const { data } = await api.get(`/faq/business/${businessId}/categories`)
      if (data.success) setCategories(data.categories)
    } catch (err) {
      setCategories([])
    }
  }, [businessId])

  // Fetch FAQs when dependencies change
  React.useEffect(() => {
    fetchFAQs()
  }, [fetchFAQs])

  // Fetch categories on mount
  React.useEffect(() => {
    fetchCategories()
  }, [fetchCategories])



  const handleFormChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCreateFAQ = async () => {
    try {
      const { data } = await api.post(`/faq`, {
        businessId,
        question: formData.question,
        answer: formData.answer,
        category: formData.category,
        isActive: formData.isActive,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      })
      if (data.success && data.faq) {
        // Refresh the FAQ list to get updated data with proper pagination
        fetchFAQs()
        // Also refresh categories in case a new category was added
        fetchCategories()
        resetForm()
      }
    } catch (err) {}
  }

  const handleEditFAQ = (faq: FAQ) => {
    setEditingFAQ(faq)
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      tags: faq.tags.join(', '),
      isActive: faq.isActive
    })
    setIsCreateDialogOpen(true)
  }

  const handleUpdateFAQ = async () => {
    if (!editingFAQ) return
    try {
      const { data } = await api.put(`/faq/${editingFAQ._id || editingFAQ.id}`, {
        question: formData.question,
        answer: formData.answer,
        category: formData.category,
        isActive: formData.isActive,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      })
      if (data.success && data.faq) {
        // Refresh the FAQ list to get updated data
        fetchFAQs()
        // Also refresh categories in case the category was changed
        fetchCategories()
        resetForm()
      }
    } catch (err) {}
  }

  const handleDeleteFAQ = async (id: string) => {
    try {
      const { data } = await api.delete(`/faq/${id}`)
      if (data.success) {
        // Refresh the FAQ list to get updated data and handle pagination properly
        fetchFAQs()
      }
    } catch (err) {}
  }

  const toggleFAQStatus = async (id: string) => {
    const faq = faqs.find(f => (f._id || f.id) === id)
    if (!faq) return
    try {
      const { data } = await api.put(`/faq/${id}`, { ...faq, isActive: !faq.isActive })
      if (data.success && data.faq) {
        // Refresh the FAQ list to get updated data
        fetchFAQs()
      }
    } catch (err) {}
  }

  const resetForm = () => {
    setFormData({ question: "", answer: "", category: "", tags: "", isActive: true })
    setEditingFAQ(null)
    setIsCreateDialogOpen(false)
  }

  const handleDialogSubmit = () => {
    if (editingFAQ) {
      handleUpdateFAQ()
    } else {
      handleCreateFAQ()
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
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
            <div className="space-y-6 bg-card p-6 rounded-lg border border-muted-gray">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">FAQ Manager</h2>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2 cursor-pointer" onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4" />
                    New FAQ
                  </Button>
                </DialogTrigger>
              </div>
              
              <FAQFilters
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
              showActiveOnly={showActiveOnly}
              onActiveOnlyChange={(value) => {
                setShowActiveOnly(value)
                setCurrentPage(1) // Reset to first page when filtering
              }}
              categories={categories}
              totalFAQs={totalFAQs}
              filteredCount={faqs.length}
              activeCount={faqs.filter(f => f.isActive).length}
              inactiveCount={faqs.filter(f => !f.isActive).length}
            />
            </div>
          </div>

          {/* Right Main Content: FAQ List and Pagination */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Scrollable FAQ List Container */}
            <div className="flex-1 flex flex-col min-h-0 rounded-b-md">
              <ScrollArea className="h-[calc(100vh-180px)] rounded-lg">
                <div className="space-y-4 pr-4 pb-2">
                  {loading ? (
                    <div className="flex items-center justify-center min-h-[600px]">
                      <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
                        <p className="text-sm text-muted-foreground">Loading FAQs...</p>
                      </div>
                    </div>
                  ) : faqs.length === 0 ? (
                    <EmptyState 
                      hasAnyFAQs={totalFAQs > 0} 
                      onCreateClick={() => setIsCreateDialogOpen(true)} 
                    />
                  ) : (
                    faqs.map((faq: FAQ) => (
                      <FAQCard
                        key={faq._id || faq.id}
                        faq={faq}
                        onEdit={handleEditFAQ}
                        onDelete={handleDeleteFAQ}
                        onToggleStatus={toggleFAQStatus}
                      />
                    ))
                  )}
                </div>
              </ScrollArea>

              {/* Fixed Pagination at Bottom - Always Rendered */}
              <div className="flex-shrink-0 bg-background">
                <FAQPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  totalItems={totalFAQs}
                  itemsPerPage={itemsPerPage}
                />
              </div>
            </div>
          </div>
        </div>

        <FAQDialog
          isOpen={isCreateDialogOpen}
          onClose={resetForm}
          editingFAQ={editingFAQ}
          formData={formData}
          onFormChange={handleFormChange}
          onSubmit={handleDialogSubmit}
          categories={categories}
        />
      </Dialog>
    </div>
  )
}
