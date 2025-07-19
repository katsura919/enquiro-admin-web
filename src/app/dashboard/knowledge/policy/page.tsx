"use client"

import { useState } from "react"
import { Dialog } from "@/components/ui/dialog"
import PolicyHeader from "./components/PolicyHeader"
import PolicyFilters from "./components/PolicyFilters"
import PolicyCard from "./components/PolicyCard"
import PolicyDialog from "./components/PolicyDialog"
import EmptyState from "./components/EmptyState"
import { Policy, PolicyFormData, mockPolicies, policyTypes } from "./components/types"

export default function PolicyPage() {
  const [policies, setPolicies] = useState<Policy[]>(mockPolicies)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("All")
  const [showActiveOnly, setShowActiveOnly] = useState(false)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null)

  // Form state for creating/editing policy
  const [formData, setFormData] = useState<PolicyFormData>({
    title: "",
    content: "",
    type: "",
    tags: "",
    isActive: true
  })

  // Filter policies based on search and filters
  const filteredPolicies = policies.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = selectedType === "All" || policy.type === selectedType
    const matchesActiveStatus = !showActiveOnly || policy.isActive
    
    return matchesSearch && matchesType && matchesActiveStatus
  })

  const handleFormChange = (field: keyof PolicyFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCreatePolicy = () => {
    // TODO: Implement API call to create policy
    const newPolicy: Policy = {
      id: Date.now().toString(),
      businessId: "business1",
      title: formData.title,
      content: formData.content,
      type: formData.type as Policy['type'],
      isActive: formData.isActive,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    setPolicies([newPolicy, ...policies])
    resetForm()
  }

  const handleEditPolicy = (policy: Policy) => {
    setEditingPolicy(policy)
    setFormData({
      title: policy.title,
      content: policy.content,
      type: policy.type,
      tags: policy.tags.join(', '),
      isActive: policy.isActive
    })
    setIsCreateDialogOpen(true)
  }

  const handleUpdatePolicy = () => {
    if (!editingPolicy) return
    
    // TODO: Implement API call to update policy
    const updatedPolicies = policies.map(policy => 
      policy.id === editingPolicy.id 
        ? {
            ...policy,
            title: formData.title,
            content: formData.content,
            type: formData.type as Policy['type'],
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            isActive: formData.isActive,
            updatedAt: new Date().toISOString()
          }
        : policy
    )
    
    setPolicies(updatedPolicies)
    resetForm()
  }

  const handleDeletePolicy = (id: string) => {
    // TODO: Implement API call to delete policy
    setPolicies(policies.filter(policy => policy.id !== id))
  }

  const togglePolicyStatus = (id: string) => {
    // TODO: Implement API call to toggle policy status
    setPolicies(policies.map(policy => 
      policy.id === id ? { ...policy, isActive: !policy.isActive } : policy
    ))
  }

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      type: "",
      tags: "",
      isActive: true
    })
    setEditingPolicy(null)
    setIsCreateDialogOpen(false)
  }

  const handleDialogSubmit = () => {
    if (editingPolicy) {
      handleUpdatePolicy()
    } else {
      handleCreatePolicy()
    }
  }

  const activeCount = policies.filter(p => p.isActive).length
  const inactiveCount = policies.filter(p => !p.isActive).length

  return (
    <div className="p-6">
      <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
        setIsCreateDialogOpen(open)
        if (!open) resetForm()
      }}>
        <PolicyHeader onCreateClick={() => setIsCreateDialogOpen(true)} />
        
        <PolicyFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          showActiveOnly={showActiveOnly}
          onActiveOnlyChange={setShowActiveOnly}
          policyTypes={policyTypes}
          totalPolicies={policies.length}
          filteredCount={filteredPolicies.length}
          activeCount={activeCount}
          inactiveCount={inactiveCount}
        />

        {/* Policy List */}
        <div className="space-y-4">
          {filteredPolicies.length === 0 ? (
            <EmptyState 
              hasAnyPolicies={policies.length > 0} 
              onCreateClick={() => setIsCreateDialogOpen(true)} 
            />
          ) : (
            filteredPolicies.map((policy) => (
              <PolicyCard
                key={policy.id}
                policy={policy}
                onEdit={handleEditPolicy}
                onDelete={handleDeletePolicy}
                onToggleStatus={togglePolicyStatus}
              />
            ))
          )}
        </div>

        <PolicyDialog
          isOpen={isCreateDialogOpen}
          onClose={resetForm}
          editingPolicy={editingPolicy}
          formData={formData}
          onFormChange={handleFormChange}
          onSubmit={handleDialogSubmit}
        />
      </Dialog>
    </div>
  )
}
