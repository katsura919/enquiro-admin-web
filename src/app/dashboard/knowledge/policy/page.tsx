"use client"
import * as React from "react"
import { useState } from "react"
import api from "@/utils/api"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import PolicyFilters from "./components/PolicyFilters"
import PolicyCard from "./components/PolicyCard"
import PolicyDialog from "./components/PolicyDialog"
import PolicyPagination from "./components/PolicyPagination"
import EmptyState from "./components/EmptyState"
import { Policy, PolicyFormData, mockPolicies } from "./components/types"
import { ScrollArea } from "@/components/ui/scroll-area"
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
        
        {/* Responsive Layout: Vertical on mobile, Horizontal on desktop */}
        <div className="flex flex-col lg:flex-row gap-6 h-full">
          
          {/* Left Sidebar: Search and Filters - Fixed */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="space-y-6 bg-card p-6 rounded-lg ">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Policy Manager</h2>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2" onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4" />
                    New Policy
                  </Button>
                </DialogTrigger>
              </div>
              
              <PolicyFilters
                searchTerm={searchTerm}
                onSearchChange={(value) => {
                  setSearchTerm(value)
                  setPage(1) // Reset to first page when searching
                }}
                selectedType={selectedType}
                onTypeChange={(value) => {
                  setSelectedType(value)
                  setPage(1) // Reset to first page when filtering
                }}
                showActiveOnly={showActiveOnly}
                onActiveOnlyChange={(value) => {
                  setShowActiveOnly(value)
                  setPage(1) // Reset to first page when filtering
                }}
                policyTypes={policyTypes.map(type => ({ value: type, label: type }))}
                totalPolicies={total}
                filteredCount={policies.length}
                activeCount={activeCount}
                inactiveCount={inactiveCount}
              />
            </div>
          </div>

          {/* Right Main Content: Policy List and Pagination */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Scrollable Policy List Container */}
            <div className="flex-1 flex flex-col min-h-0 rounded-b-md">
              <ScrollArea className="h-[calc(100vh-180px)] rounded-lg">
                <div className="space-y-4 pr-4 pb-2">
                  {loading ? (
                    <div className="flex items-center justify-center min-h-[400px] p-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-none"></div>
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
              </ScrollArea>

              {/* Fixed Pagination at Bottom - Always Rendered */}
              <div className="flex-shrink-0 bg-background">
                <PolicyPagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                  totalItems={total}
                  itemsPerPage={limit}
                />
              </div>
            </div>
          </div>
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
