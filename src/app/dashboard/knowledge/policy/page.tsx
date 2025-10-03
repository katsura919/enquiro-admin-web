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
import { Policy, PolicyFormData, mockPolicies } from "./components/types"
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
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
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

  // Fetch policies function
  const fetchPolicies = React.useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      })
      
      if (searchTerm.trim()) params.append('search', searchTerm.trim())
      if (selectedType !== 'All') params.append('type', selectedType)
      if (showActiveOnly) params.append('isActive', 'true')
      
      const { data } = await api.get(`/policy/business/${businessId}?${params}`)
      if (data.success) {
        setPolicies(data.policies)
        setTotal(data.total)
        setTotalPages(data.totalPages)
      }
    } catch (err) {
      setPolicies([])
      setTotal(0)
      setTotalPages(0)
    } finally {
      setLoading(false)
    }
  }, [businessId, page, limit, searchTerm, selectedType, showActiveOnly])

  // Fetch policies and types on mount
  React.useEffect(() => {
    const fetchTypes = async () => {
      try {
        const { data } = await api.get(`/policy/business/${businessId}/types`)
        if (data.success) setPolicyTypes(data.types)
      } catch (err) {
        setPolicyTypes([])
      }
    }
    
    if (businessId) {
      fetchPolicies()
      fetchTypes()
    }
  }, [fetchPolicies, businessId])

  // Reset page when search/filter changes
  React.useEffect(() => {
    setPage(1)
  }, [searchTerm, selectedType, showActiveOnly])

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
        setPage(1) // Reset to first page
        resetForm()
        // Data will be refetched via useEffect dependency on page change
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
        resetForm()
        fetchPolicies() // Refetch data to get updated policy
      }
    } catch (err) {}
  }

  const handleDeletePolicy = async (id: string) => {
    try {
      const { data } = await api.delete(`/policy/${id}`)
      if (data.success) {
        // If we're on a page that becomes empty after deletion, go to previous page
        if (policies.length === 1 && page > 1) {
          setPage(page - 1)
        } else {
          fetchPolicies() // Refetch current page data
        }
      }
    } catch (err) {}
  }

  const togglePolicyStatus = async (id: string) => {
    const policy = policies.find(p => (p._id || p.id) === id)
    if (!policy) return
    try {
      const { data } = await api.put(`/policy/${id}`, { ...policy, isActive: !policy.isActive })
      if (data.success && data.policy) {
        fetchPolicies() // Refetch data to get updated policy status
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
          totalPolicies={total}
          filteredCount={policies.length}
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
          ) : policies.length === 0 ? (
            <EmptyState 
              hasAnyPolicies={total > 0} 
              onCreateClick={() => setIsCreateDialogOpen(true)} 
            />
          ) : (
            policies.map((policy) => (
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

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-6">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages} ({total} total policies)
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}

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
