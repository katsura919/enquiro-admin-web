export interface FAQ {
  id?: string
  _id?: string
  question: string
  answer: string
  category: string
  isActive: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface FormData {
  question: string
  answer: string
  category: string
  tags: string
  isActive: boolean
}

export interface FAQResponse {
  success: boolean
  faqs: FAQ[]
  total: number
  page: number
  limit: number
  totalPages: number
  searchTerm: string | null
  category: string | null
  isActive: boolean | null
}



export const categories = ["Account Management", "Billing", "Support", "Technical", "General"]
