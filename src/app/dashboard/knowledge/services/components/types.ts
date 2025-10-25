// Helper to normalize service object from API (map _id to id)
export function normalizeService(service: any): Service {
  return {
    ...service,
    id: service._id || service.id,
  }
}
// Types and interfaces for Service management
export interface Service {
  id: string
  businessId: string
  name: string
  description: string
  category: string
  pricing: {
    type: 'fixed' | 'hourly' | 'package' | 'quote'
    amount: number
    currency: string
  }
  duration: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ServiceFormData {
  name: string
  description: string
  category: string
  pricingType: 'fixed' | 'hourly' | 'package' | 'quote'
  pricingAmount: string
  currency: string
  duration: string
  isActive: boolean
}

// Mock data for services
export const mockServices: Service[] = [
  {
    id: "1",
    businessId: "business1",
    name: "Website Development",
    description: "Full-stack web development services including frontend, backend, and database design.",
    category: "Web Development",
    pricing: {
      type: "package",
      amount: 2500.00,
      currency: "USD"
    },
    duration: "2-4 weeks",
    isActive: true,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    businessId: "business1",
    name: "Digital Marketing Consultation",
    description: "Expert consultation on digital marketing strategies, SEO, and social media marketing.",
    category: "Marketing",
    pricing: {
      type: "hourly",
      amount: 150.00,
      currency: "USD"
    },
    duration: "1-2 hours",
    isActive: true,
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-14T09:15:00Z"
  },
  {
    id: "3",
    businessId: "business1",
    name: "Logo Design",
    description: "Professional logo design with multiple concepts and unlimited revisions.",
    category: "Design",
    pricing: {
      type: "fixed",
      amount: 500.00,
      currency: "USD"
    },
    duration: "5-7 days",
    isActive: false,
    createdAt: "2024-01-13T14:20:00Z",
    updatedAt: "2024-01-13T14:20:00Z"
  },
  {
    id: "4",
    businessId: "business1",
    name: "Business Strategy Consulting",
    description: "Comprehensive business strategy development and implementation planning.",
    category: "Consulting",
    pricing: {
      type: "quote",
      amount: 0,
      currency: "USD"
    },
    duration: "Varies",
    isActive: true,
    createdAt: "2024-01-12T11:45:00Z",
    updatedAt: "2024-01-12T11:45:00Z"
  }
]

// Service categories
export const categories = [
  "Web Development",
  "Mobile Development",
  "Design",
  "Marketing",
  "Consulting",
  "Photography",
  "Writing",
  "Legal",
  "Finance",
  "Other"
]

// Currency options
export const currencies = [
  "PHP",
  "USD",
  "EUR", 
  "GBP",
  "CAD",
  "AUD",
  "JPY"
]

// Pricing types
export const pricingTypes = [
  { value: "fixed", label: "Fixed Price" },
  { value: "hourly", label: "Hourly Rate" },
  { value: "package", label: "Package Deal" },
  { value: "quote", label: "Custom Quote" }
]
