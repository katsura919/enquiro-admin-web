// Types and interfaces for Product management
export interface Product {
  id: string
  businessId: string
  name: string
  sku: string
  description: string
  category: string
  price: {
    amount: number
    currency: string
  }
  quantity: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductFormData {
  name: string
  sku: string
  description: string
  category: string
  priceAmount: string
  currency: string
  quantity: string
  isActive: boolean
}

// Mock data for products
export const mockProducts: Product[] = [
  {
    id: "1",
    businessId: "business1",
    name: "Premium Coffee Blend",
    sku: "PCB-001",
    description: "A rich and aromatic coffee blend made from the finest beans sourced from South America.",
    category: "Beverages",
    price: {
      amount: 24.99,
      currency: "USD"
    },
    quantity: 150,
    isActive: true,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    businessId: "business1",
    name: "Wireless Headphones Pro",
    sku: "WHP-PRO-001",
    description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
    category: "Electronics",
    price: {
      amount: 199.99,
      currency: "USD"
    },
    quantity: 45,
    isActive: true,
    createdAt: "2024-01-14T09:15:00Z",
    updatedAt: "2024-01-14T09:15:00Z"
  },
  {
    id: "3",
    businessId: "business1",
    name: "Organic Cotton T-Shirt",
    sku: "OCT-M-BLK",
    description: "Comfortable and sustainable organic cotton t-shirt available in multiple colors.",
    category: "Clothing",
    price: {
      amount: 29.99,
      currency: "USD"
    },
    quantity: 0,
    isActive: false,
    createdAt: "2024-01-13T14:20:00Z",
    updatedAt: "2024-01-13T14:20:00Z"
  }
]

// Product categories
export const categories = [
  "Electronics",
  "Clothing",
  "Beverages", 
  "Food",
  "Books",
  "Home & Garden",
  "Sports",
  "Beauty & Health",
  "Toys",
  "Other"
]

// Currency options
export const currencies = [
  "USD",
  "EUR", 
  "GBP",
  "CAD",
  "AUD",
  "JPY"
]
