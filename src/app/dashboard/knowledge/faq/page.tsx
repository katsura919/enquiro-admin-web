"use client"

import { useState } from "react"
import { Dialog } from "@/components/ui/dialog"
import FAQHeader from "./components/FAQHeader"
import FAQFilters from "./components/FAQFilters"
import FAQCard from "./components/FAQCard"
import FAQDialog from "./components/FAQDialog"
import EmptyState from "./components/EmptyState"
import { FAQ, FormData, mockFAQs, categories } from "./components/types"

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQ[]>(mockFAQs)
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

  const handleCreateFAQ = () => {
    // TODO: Implement API call to create FAQ
    const newFAQ: FAQ = {
      id: Date.now().toString(),
      question: formData.question,
      answer: formData.answer,
      category: formData.category,
      isActive: formData.isActive,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    setFaqs([newFAQ, ...faqs])
    resetForm()
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

  const handleUpdateFAQ = () => {
    if (!editingFAQ) return
    
    // TODO: Implement API call to update FAQ
    const updatedFAQs = faqs.map(faq => 
      faq.id === editingFAQ.id 
        ? {
            ...faq,
            question: formData.question,
            answer: formData.answer,
            category: formData.category,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            isActive: formData.isActive,
            updatedAt: new Date().toISOString()
          }
        : faq
    )
    
    setFaqs(updatedFAQs)
    resetForm()
  }

  const handleDeleteFAQ = (id: string) => {
    // TODO: Implement API call to delete FAQ
    setFaqs(faqs.filter(faq => faq.id !== id))
  }

  const toggleFAQStatus = (id: string) => {
    // TODO: Implement API call to toggle FAQ status
    setFaqs(faqs.map(faq => 
      faq.id === id ? { ...faq, isActive: !faq.isActive } : faq
    ))
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
