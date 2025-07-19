export interface FAQ {
  id: string
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

export const mockFAQs: FAQ[] = [
  {
    id: "1",
    question: "How do I reset my password?",
    answer: "To reset your password, click on the 'Forgot Password' link on the login page and follow the instructions sent to your email.",
    category: "Account Management",
    isActive: true,
    tags: ["password", "account", "security"],
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "2", 
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise customers.",
    category: "Billing",
    isActive: true,
    tags: ["payment", "billing", "credit card"],
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-14T09:15:00Z"
  },
  {
    id: "3",
    question: "How can I contact customer support?",
    answer: "You can reach our customer support team via email at support@enquiro.com, through our live chat feature, or by calling 1-800-ENQUIRO during business hours.",
    category: "Support",
    isActive: false,
    tags: ["support", "contact", "help"],
    createdAt: "2024-01-13T14:20:00Z",
    updatedAt: "2024-01-13T14:20:00Z"
  }
]

export const categories = ["Account Management", "Billing", "Support", "Technical", "General"]
