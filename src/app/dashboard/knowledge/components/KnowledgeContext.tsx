"use client"

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import axios from "axios"
import { useAuth } from "@/lib/auth"

interface Category {
  _id: string
  name: string
  description: string
  businessId: string
}

interface KnowledgeContextType {
  categories: Category[]
  selectedCategory: string | null
  setSelectedCategory: (categoryId: string | null) => void
  loading: boolean
  fetchCategories: () => void
  addCategory: (category: { name: string; description: string }) => Promise<void>
}

const KnowledgeContext = createContext<KnowledgeContextType | undefined>(undefined)

const API_URL = process.env.NEXT_PUBLIC_API_URL

export function KnowledgeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
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

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

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
  return (
    <KnowledgeContext.Provider
      value={{
        categories,
        selectedCategory,
        setSelectedCategory,
        loading,
        fetchCategories,
        addCategory: handleAddCategory,
      }}
    >
      {children}
    </KnowledgeContext.Provider>
  )
}

export function useKnowledge() {
  const context = useContext(KnowledgeContext)
  if (context === undefined) {
    throw new Error('useKnowledge must be used within a KnowledgeProvider')
  }
  return context
}
