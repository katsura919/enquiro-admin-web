import { Input } from "@/components/ui/input"

interface EmailAddressStepProps {
  email: string
  setEmail: (value: string) => void
  errors: Record<string, string>
}

export default function EmailAddressStep({
  email,
  setEmail,
  errors
}: EmailAddressStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-white tracking-tight">Email Address</h2>
        <p className="text-base text-gray-400 leading-relaxed">Enter your email address</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 block" htmlFor="email">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`h-12 text-base bg-white/5 text-white placeholder:text-gray-500 focus:ring-2 transition-all duration-200 ${
              errors.email 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'
            }`}
          />
          {errors.email && (
            <p className="text-sm text-red-400 mt-1">{errors.email}</p>
          )}
        </div>
      </div>
    </div>
  )
}