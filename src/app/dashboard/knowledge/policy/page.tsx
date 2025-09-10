"use client"
import * as React from "react"
import { useState } from "react"
import api from "@/utils/api"
import { Dialog } from "@/components/ui/dialog"
import PolicyHeader from "./components/PolicyHeader"
import PolicyFilters from "./components/PolicyFilters"
import PolicyCard from "./components/PolicyCard"
import PolicyDialog from "./components/PolicyDialog"
import EmptyState from "./components/EmptyState"
import { Policy, PolicyFormData, mockPolicies, policyTypes } from "./components/types"
import { useAuth } from "@/lib/auth"

export default function PolicyPage() {

  const user = useAuth().user
  const businessId = user?.businessId
  const [policies, setPolicies] = useState<Policy[]>([])
  const [policyTypes, setPolicyTypes] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
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

  // Fetch policies and types on mount
  React.useEffect(() => {
    const fetchPolicies = async () => {
      setLoading(true)
      try {
        const { data } = await api.get(`/policy/business/${businessId}`)
        if (data.success) setPolicies(data.policies)
      } catch (err) {
        setPolicies([])
      }
    }
    const fetchTypes = async () => {
      try {
        const { data } = await api.get(`/policy/business/${businessId}/types`)
        if (data.success) setPolicyTypes(data.types)
      } catch (err) {
        setPolicyTypes([])
      } finally {
        setLoading(false)
      }
    }
    
    if (businessId) {
      fetchPolicies()
      fetchTypes()
    }
  }, [businessId])

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

  const handleCreatePolicy = async () => {
    try {
      const { data } = await api.post(`/policy`, {
        businessId,
        title: formData.title,
        content: formData.content,
        type: formData.type,
        isActive: formData.isActive,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      })
      if (data.success && data.policy) {
        setPolicies([data.policy, ...policies])
        resetForm()
      }
    } catch (err) {}
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

  const handleUpdatePolicy = async () => {
    if (!editingPolicy) return
    try {
      const { data } = await api.put(`/policy/${editingPolicy._id || editingPolicy.id}`, {
        title: formData.title,
        content: formData.content,
        type: formData.type,
        isActive: formData.isActive,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      })
      if (data.success && data.policy) {
        setPolicies(policies.map(policy => (policy._id || policy.id) === data.policy._id ? data.policy : policy))
        resetForm()
      }
    } catch (err) {}
  }

  const handleDeletePolicy = async (id: string) => {
    try {
      const { data } = await api.delete(`/policy/${id}`)
      if (data.success) {
        setPolicies(policies.filter(policy => (policy._id || policy.id) !== id))
      }
    } catch (err) {}
  }

  const togglePolicyStatus = async (id: string) => {
    const policy = policies.find(p => (p._id || p.id) === id)
    if (!policy) return
    try {
      const { data } = await api.put(`/policy/${id}`, { ...policy, isActive: !policy.isActive })
      if (data.success && data.policy) {
        setPolicies(policies.map(p => (p._id || p.id) === id ? data.policy : p))
      }
    } catch (err) {}
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

        
        <PolicyFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          showActiveOnly={showActiveOnly}
          onActiveOnlyChange={setShowActiveOnly}
          policyTypes={policyTypes.map(type => ({ value: type, label: type }))}
          totalPolicies={policies.length}
          filteredCount={filteredPolicies.length}
          activeCount={activeCount}
          inactiveCount={inactiveCount}
        />
        
        <PolicyHeader onCreateClick={() => setIsCreateDialogOpen(true)} />

        {/* Policy List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px] p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredPolicies.length === 0 ? (
            <EmptyState 
              hasAnyPolicies={policies.length > 0} 
              onCreateClick={() => setIsCreateDialogOpen(true)} 
            />
          ) : (
            filteredPolicies.map((policy) => (
              <PolicyCard
                key={policy._id || policy.id}
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
