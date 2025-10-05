import { useRef, useEffect } from "react"

interface VerifyEmailStepProps {
  registeredEmail: string
  codeDigits: string[]
  setCodeDigits: (digits: string[]) => void
  setVerificationCode: (code: string) => void
  errors: Record<string, string>
  resendTimer: number
  isResending: boolean
  onResendCode: () => void
}

export default function VerifyEmailStep({
  registeredEmail,
  codeDigits,
  setCodeDigits,
  setVerificationCode,
  errors,
  resendTimer,
  isResending,
  onResendCode
}: VerifyEmailStepProps) {
  // Refs for digit inputs
  const digitInputs = useRef<(HTMLInputElement | null)[]>([])

  // Handle digit input changes
  const handleDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return // Only allow digits
    
    // Check if previous digits are filled (sequential entry)
    if (index > 0 && !codeDigits[index - 1]) {
      // Focus the first empty digit instead
      const firstEmptyIndex = codeDigits.findIndex(digit => !digit)
      if (firstEmptyIndex !== -1) {
        digitInputs.current[firstEmptyIndex]?.focus()
      }
      return
    }
    
    const newDigits = [...codeDigits]
    newDigits[index] = value.slice(-1) // Only take the last character
    setCodeDigits(newDigits)
    
    // Update the verification code
    setVerificationCode(newDigits.join(''))
    
    // Auto-focus next input
    if (value && index < 5) {
      digitInputs.current[index + 1]?.focus()
    }
  }

  // Handle backspace and navigation
  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (codeDigits[index]) {
        // Clear current digit
        const newDigits = [...codeDigits]
        newDigits[index] = ''
        setCodeDigits(newDigits)
        setVerificationCode(newDigits.join(''))
      } else if (index > 0) {
        // Move to previous digit and clear it
        const newDigits = [...codeDigits]
        newDigits[index - 1] = ''
        setCodeDigits(newDigits)
        setVerificationCode(newDigits.join(''))
        digitInputs.current[index - 1]?.focus()
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      digitInputs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < 5 && codeDigits[index]) {
      // Only allow right arrow if current digit is filled
      digitInputs.current[index + 1]?.focus()
    }
  }

  // Handle paste functionality
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    const newDigits = Array(6).fill('').map((_, i) => pastedData[i] || '')
    setCodeDigits(newDigits)
    setVerificationCode(newDigits.join(''))
    
    // Focus the next empty input or the last input
    const nextEmptyIndex = newDigits.findIndex(digit => !digit)
    const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : 5
    digitInputs.current[focusIndex]?.focus()
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-white tracking-tight">Verify Your Email</h2>
        <p className="text-base text-gray-400 leading-relaxed">Enter the 6-digit code sent to your email</p>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-4 py-3">
          <p className="text-sm text-blue-400">
            We've sent a verification code to <span className="font-semibold">{registeredEmail}</span>
          </p>
        </div>
      </div>
      <div className="space-y-6">
        <div className="space-y-4">
          <label className="text-sm font-medium text-gray-300 block text-center">
            Enter Verification Code
          </label>
          
          {/* Digit Input Boxes */}
          <div className="flex justify-center items-center space-x-3 sm:space-x-4">
            {codeDigits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { digitInputs.current[index] = el }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigitChange(index, e.target.value)}
                onKeyDown={(e) => handleDigitKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className={`w-12 h-12 sm:w-14 sm:h-14 text-center text-xl sm:text-2xl font-mono font-semibold bg-white/5 text-white border-2 rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 ${
                  errors.verificationCode 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                    : 'border-gray-700 focus:border-blue-500 focus:ring-blue-500'
                }`}
              />
            ))}
          </div>
          
          {errors.verificationCode && (
            <p className="text-sm text-red-400 text-center mt-2">{errors.verificationCode}</p>
          )}
        </div>
        
        {/* Resend Code Section */}
        <div className="text-center pt-2">
          <div className="space-y-2">
            {resendTimer > 0 ? (
              <p className="text-sm text-gray-400">
                Resend code in <span className="font-medium text-blue-400">{resendTimer}s</span>
              </p>
            ) : (
              <button
                onClick={onResendCode}
                disabled={isResending}
                className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors disabled:opacity-50"
              >
                {isResending ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-400/30 border-t-blue-400"></div>
                    <span>Resending...</span>
                  </div>
                ) : (
                  "Didn't receive the code? Resend"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}