import { Input } from "@/components/ui/input"

interface PersonalDetailsStepProps {
  firstName: string
  setFirstName: (value: string) => void
  lastName: string
  setLastName: (value: string) => void
  errors: Record<string, string>
}

export default function PersonalDetailsStep({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  errors
}: PersonalDetailsStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-white tracking-tight">Personal Details</h2>
        <p className="text-base text-gray-400 leading-relaxed">Tell us your name</p>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 block" htmlFor="firstName">
              First Name
            </label>
            <Input
              id="firstName"
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={`h-12 text-base bg-white/5 text-white placeholder:text-gray-500 focus:ring-2 transition-all duration-200 ${
                errors.firstName 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'
              }`}
            />
            {errors.firstName && (
              <p className="text-sm text-red-400 mt-1">{errors.firstName}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 block" htmlFor="lastName">
              Last Name
            </label>
            <Input
              id="lastName"
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={`h-12 text-base bg-white/5 text-white placeholder:text-gray-500 focus:ring-2 transition-all duration-200 ${
                errors.lastName 
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'
              }`}
            />
            {errors.lastName && (
              <p className="text-sm text-red-400 mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}