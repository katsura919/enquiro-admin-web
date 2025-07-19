// Types and interfaces for Policy management
export interface Policy {
  id: string
  businessId: string
  title: string
  content: string
  type: 'privacy' | 'terms' | 'refund' | 'shipping' | 'warranty' | 'general'
  isActive: boolean
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface PolicyFormData {
  title: string
  content: string
  type: 'privacy' | 'terms' | 'refund' | 'shipping' | 'warranty' | 'general' | ''
  tags: string
  isActive: boolean
}

// Mock data for policies
export const mockPolicies: Policy[] = [
  {
    id: "1",
    businessId: "business1",
    title: "Privacy Policy",
    content: "This Privacy Policy describes how we collect, use, and protect your personal information when you use our services. We are committed to ensuring that your privacy is protected and that any personal information you provide is handled in accordance with applicable privacy laws.",
    type: "privacy",
    isActive: true,
    tags: ["privacy", "data protection", "personal information"],
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    businessId: "business1",
    title: "Terms of Service",
    content: "By accessing and using our website and services, you accept and agree to be bound by the terms and provision of this agreement. These terms constitute a legally binding agreement between you and our company.",
    type: "terms",
    isActive: true,
    tags: ["terms", "service agreement", "legal"],
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-14T09:15:00Z"
  },
  {
    id: "3",
    businessId: "business1",
    title: "Refund Policy",
    content: "We offer a 30-day money-back guarantee for all our services. If you are not satisfied with your purchase, you may request a full refund within 30 days of your initial purchase date.",
    type: "refund",
    isActive: false,
    tags: ["refund", "money back", "guarantee"],
    createdAt: "2024-01-13T14:20:00Z",
    updatedAt: "2024-01-13T14:20:00Z"
  },
  {
    id: "4",
    businessId: "business1",
    title: "Shipping Policy",
    content: "We offer free shipping on orders over $50. Standard shipping takes 3-5 business days, while express shipping takes 1-2 business days. International shipping is available to most countries.",
    type: "shipping",
    isActive: true,
    tags: ["shipping", "delivery", "international"],
    createdAt: "2024-01-12T11:45:00Z",
    updatedAt: "2024-01-12T11:45:00Z"
  }
]

// Policy types
export const policyTypes = [
  { value: "privacy", label: "Privacy Policy" },
  { value: "terms", label: "Terms of Service" },
  { value: "refund", label: "Refund Policy" },
  { value: "shipping", label: "Shipping Policy" },
  { value: "warranty", label: "Warranty Policy" },
  { value: "general", label: "General Policy" }
]
