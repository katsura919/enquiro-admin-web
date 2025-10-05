import { ArrowRight, FileText, Shield } from "lucide-react"

interface TermsAgreementStepProps {
  agreeToTerms: boolean
  setAgreeToTerms: (value: boolean) => void
  onShowTermsModal: () => void
  onShowPrivacyModal: () => void
  errors: Record<string, string>
}

export default function TermsAgreementStep({
  agreeToTerms,
  setAgreeToTerms,
  onShowTermsModal,
  onShowPrivacyModal,
  errors
}: TermsAgreementStepProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h2 className="text-2xl font-bold text-white tracking-tight">Terms & Agreements</h2>
        <p className="text-base text-gray-400 leading-relaxed">Review and accept our terms</p>
      </div>
      <div className="space-y-4">
        {/* Summary Card */}
        <div className="bg-white/5 rounded-2xl border border-blue-500/20 p-6">
          <div className="space-y-4">          
            <div className="flex flex-col space-y-3">
              <button
                onClick={onShowTermsModal}
                className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <FileText className="h-4 w-4 text-blue-400" />
                  </div>
                  <span className="text-white font-medium">Terms of Service</span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
              </button>
              
              <button
                onClick={onShowPrivacyModal}
                className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Shield className="h-4 w-4 text-blue-400" />
                  </div>
                  <span className="text-white font-medium">Privacy Policy</span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Agreement Checkbox */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl px-6 py-4">
          <div className="flex items-start space-x-3">
            <input 
              type="checkbox" 
              id="agreeToTerms"
              checked={agreeToTerms}
              onChange={(e) => setAgreeToTerms(e.target.checked)}
              className={`mt-1 w-4 h-4 rounded bg-white/5 focus:ring-offset-0 focus:ring-2 ${
                errors.terms
                  ? 'border-red-500 text-red-500 focus:ring-red-500'
                  : 'border-gray-700 text-blue-500 focus:ring-blue-500'
              }`}
            />
            <div className="flex-1">
              <label htmlFor="agreeToTerms" className="text-sm text-gray-400 leading-relaxed">
                I have read and agree to the{" "}
                <button
                  onClick={onShowTermsModal}
                  className="text-blue-400 font-medium hover:text-blue-300 underline transition-colors"
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  onClick={onShowPrivacyModal}
                  className="text-blue-400 font-medium hover:text-blue-300 underline transition-colors"
                >
                  Privacy Policy
                </button>. 
                I understand that my business data will be processed according to these terms.
              </label>
              {errors.terms && (
                <p className="text-sm text-red-400 mt-2">{errors.terms}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}