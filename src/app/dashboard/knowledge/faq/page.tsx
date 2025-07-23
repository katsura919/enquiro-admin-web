"use client"

import * as React from "react";

import { useState } from "react"
import { Dialog } from "@/components/ui/dialog"
import FAQHeader from "./components/FAQHeader"
import FAQFilters from "./components/FAQFilters"
import FAQCard from "./components/FAQCard"
import FAQDialog from "./components/FAQDialog"
import EmptyState from "./components/EmptyState"
import { FAQ, FormData, categories } from "./components/types"
import api from "@/utils/api";
import { useAuth } from "@/lib/auth"

export default function FAQPage() {
  // Replace with your actual businessId source
  const { user } = useAuth()
  const businessId = user?.businessId
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showActiveOnly, setShowActiveOnly] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingFAQ, setEditingFAQ] = useState<FAQ | null>(null)

  // Form state for creating/editing FAQ
  const [formData, setFormData] = useState<FormData>({
    question: "",
    answer: "",
    category: "",
    tags: "",
    isActive: true
  })

  // Fetch FAQs and categories on mount
  React.useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const { data } = await api.get(`/faq/business/${businessId}`)
        if (data.success) setFaqs(data.faqs)
      } catch (err) {
        setFaqs([])
      }
    }
    const fetchCategories = async () => {
      try {
        const { data } = await api.get(`/faq/business/${businessId}/categories`)
        if (data.success) setCategories(data.categories)
      } catch (err) {
        setCategories([])
      }
    }
    fetchFAQs()
    fetchCategories()
  }, [businessId])

  // Filter FAQs based on search and filters
  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory
    const matchesActiveStatus = !showActiveOnly || faq.isActive
    
    return matchesSearch && matchesCategory && matchesActiveStatus
  })

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
        setFaqs([data.faq, ...faqs])
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
        setFaqs(faqs.map(faq => (faq._id || faq.id) === data.faq._id ? data.faq : faq))
        resetForm()
      }
    } catch (err) {}
  }

  const handleDeleteFAQ = async (id: string) => {
    try {
      const { data } = await api.delete(`/faq/${id}`)
      if (data.success) {
        setFaqs(faqs.filter(faq => (faq._id || faq.id) !== id))
      }
    } catch (err) {}
  }

  const toggleFAQStatus = async (id: string) => {
    const faq = faqs.find(f => (f._id || f.id) === id)
    if (!faq) return
    try {
      const { data } = await api.put(`/faq/${id}`, { ...faq, isActive: !faq.isActive })
      if (data.success && data.faq) {
        setFaqs(faqs.map(f => (f._id || f.id) === id ? data.faq : f))
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

  const activeCount = faqs.filter(f => f.isActive).length
  const inactiveCount = faqs.filter(f => !f.isActive).length

  return (
    <div className="p-6">
      <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
        setIsCreateDialogOpen(open)
        if (!open) resetForm()
      }}>
        <FAQHeader onCreateClick={() => setIsCreateDialogOpen(true)} />
        
        <FAQFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          showActiveOnly={showActiveOnly}
          onActiveOnlyChange={setShowActiveOnly}
          categories={categories}
          totalFAQs={faqs.length}
          filteredCount={filteredFAQs.length}
          activeCount={activeCount}
          inactiveCount={inactiveCount}
        />

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.length === 0 ? (
            <EmptyState 
              hasAnyFAQs={faqs.length > 0} 
              onCreateClick={() => setIsCreateDialogOpen(true)} 
            />
          ) : (
            filteredFAQs.map((faq) => (
              <FAQCard
                key={faq.id}
                faq={faq}
                onEdit={handleEditFAQ}
                onDelete={handleDeleteFAQ}
                onToggleStatus={toggleFAQStatus}
              />
            ))
          )}
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
