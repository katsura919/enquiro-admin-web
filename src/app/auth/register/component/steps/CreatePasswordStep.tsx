import { Input } from "@/components/ui/input"
import { Eye, EyeOff } from "lucide-react"

interface CreatePasswordStepProps {
  password: string
  setPassword: (value: string) => void
  confirmPassword: string
  setConfirmPassword: (value: string) => void
  showPassword: boolean
  setShowPassword: (value: boolean) => void
  showConfirmPassword: boolean
  setShowConfirmPassword: (value: boolean) => void
  errors: Record<string, string>
}

export default function CreatePasswordStep({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  errors
}: CreatePasswordStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-white tracking-tight">Create Password</h2>
        <p className="text-base text-gray-400 leading-relaxed">Create a secure password</p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 block" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`h-12 text-base bg-white/5 text-white placeholder:text-gray-500 focus:ring-2 transition-all duration-200 pr-12 ${
                errors.password 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-red-400 mt-1">{errors.password}</p>
          )}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300 block" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`h-12 text-base bg-white/5 text-white placeholder:text-gray-500 focus:ring-2 transition-all duration-200 pr-12 ${
                errors.confirmPassword 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-400 mt-1">{errors.confirmPassword}</p>
          )}
        </div>
      </div>
    </div>
  )
}