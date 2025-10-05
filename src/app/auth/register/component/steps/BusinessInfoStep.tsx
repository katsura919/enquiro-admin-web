import { Input } from "@/components/ui/input"

interface BusinessInfoStepProps {
  businessName: string
  setBusinessName: (value: string) => void
  category: string
  setCategory: (value: string) => void
  description: string
  setDescription: (value: string) => void
  address: string
  setAddress: (value: string) => void
  errors: Record<string, string>
}

export default function BusinessInfoStep({
  businessName,
  setBusinessName,
  category,
  setCategory,
  description,
  setDescription,
  address,
  setAddress,
  errors
}: BusinessInfoStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-white tracking-tight">Business Information</h2>
        <p className="text-base text-gray-400 leading-relaxed">Tell us about your business</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 block" htmlFor="businessName">
              Business Name
            </label>
            <Input
              id="businessName"
              type="text"
              placeholder="Acme Corporation"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className={`h-12 text-base bg-white/5 text-white placeholder:text-gray-500 focus:ring-2 transition-all duration-200 ${
                errors.businessName 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'
              }`}
            />
            {errors.businessName && (
              <p className="text-sm text-red-400 mt-1">{errors.businessName}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 block" htmlFor="category">
              Business Category
            </label>
            <Input
              id="category"
              type="text"
              placeholder="Technology"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`h-12 text-base bg-white/5 text-white placeholder:text-gray-500 focus:ring-2 transition-all duration-200 ${
                errors.category 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'
              }`}
            />
            {errors.category && (
              <p className="text-sm text-red-400 mt-1">{errors.category}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 block" htmlFor="description">
              Business Description
            </label>
            <Input
              id="description"
              type="text"
              placeholder="Software Development"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`h-12 text-base bg-white/5 text-white placeholder:text-gray-500 focus:ring-2 transition-all duration-200 ${
                errors.description 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'
              }`}
            />
            {errors.description && (
              <p className="text-sm text-red-400 mt-1">{errors.description}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 block" htmlFor="address">
              Business Address
            </label>
            <Input
              id="address"
              type="text"
              placeholder="123 Main St, City, State 12345"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`h-12 text-base bg-white/5 text-white placeholder:text-gray-500 focus:ring-2 transition-all duration-200 ${
                errors.address 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'
              }`}
            />
            {errors.address && (
              <p className="text-sm text-red-400 mt-1">{errors.address}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}