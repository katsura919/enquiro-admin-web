"use client"

import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import CategorySidebar from "./components/CategorySidebar"
import KnowledgeList from "./components/KnowledgeList"
import KnowledgeModal from "./components/knowledge-modal"
import { useAuth } from '@/lib/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function KnowledgePage() {
  const { user } = useAuth()
  const [categories, setCategories] = useState<any[]>([])
  const [knowledge, setKnowledge] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isKnowledgeModalOpen, setIsKnowledgeModalOpen] = useState(false)
  const [selectedKnowledge, setSelectedKnowledge] = useState<any>(null)
  const [loading, setLoading] = useState(false)
   console.log(categories)
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  const businessId = user?.businessId 

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    if (!businessId) {
      console.log('No businessId found for fetching categories');
      return;
    }
    setLoading(true);
    try {
      console.log('Fetching categories for business:', businessId, 'at', `${API_URL}/category/business/${businessId}`);
      const res = await axios.get(`${API_URL}/category/business/${businessId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [businessId, token]);

  // Fetch knowledge
  const fetchKnowledge = useCallback(async () => {
    if (!businessId) return
    setLoading(true)
    try {
      const res = await axios.get(`${API_URL}/knowledge/business/${businessId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setKnowledge(res.data)
    } catch (err) {
      setKnowledge([])
    } finally {
      setLoading(false)
    }
  }, [businessId, token])

  useEffect(() => {
    fetchCategories()
    fetchKnowledge()
  }, [fetchCategories, fetchKnowledge])

  // CRUD handlers
  const handleSaveKnowledge = async (data: any) => {
    try {
      if (data._id) {
        // Update
        await axios.put(`${API_URL}/knowledge/${data._id}`, data, {
          headers: { Authorization: `Bearer ${token}` },
        })
      } else {
        // Create
        await axios.post(`${API_URL}/knowledge`, { ...data, businessId }, {
          headers: { Authorization: `Bearer ${token}` },
        })
      }
      fetchKnowledge()
    } catch (err) {
      // handle error
    }
    setIsKnowledgeModalOpen(false)
  }

  const handleAddCategory = async (category: { name: string; description: string }) => {
    try {
      await axios.post(`${API_URL}/category`, { ...category, businessId }, {
        headers: { Authorization: `Bearer ${token}` },
      }) 
      fetchCategories()
    } catch (err) {
      // handle error
    }
  }

  const handleDeleteKnowledge = async (itemId: string) => {
    try {
      await axios.delete(`${API_URL}/knowledge/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchKnowledge()
    } catch (err) {
      // handle error
    }
  }

  // Filter knowledge items based on category and search query
  const filteredKnowledge = knowledge.filter((item) => {
    const matchesCategory = !selectedCategory || item.categoryId === selectedCategory
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-gray-400">Manage your chatbot's knowledge</p>
        </div>
        <Button 
          className="bg-blue-500 hover:bg-blue-600"
          onClick={() => {
            setSelectedKnowledge(null)
            setIsKnowledgeModalOpen(true)
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Knowledge
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <CategorySidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          onAddCategory={handleAddCategory}
        />

        <KnowledgeList
          items={filteredKnowledge}
          categories={categories}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onEditItem={(item) => {
            setSelectedKnowledge(item)
            setIsKnowledgeModalOpen(true)
          }}
          onDeleteItem={handleDeleteKnowledge}
        />
      </div>

      <KnowledgeModal
        isOpen={isKnowledgeModalOpen}
        onClose={() => setIsKnowledgeModalOpen(false)}
        onSave={handleSaveKnowledge}
        categories={categories}
        initialData={selectedKnowledge}
      />
    </div>
  )
} 