"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PrivacyModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[80vh] bg-gray-900/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700/50">
          <h2 className="text-xl font-bold text-white">Privacy Policy</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[60vh] custom-scrollbar">
          <div className="text-sm text-gray-300 space-y-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-white text-base">1. Information We Collect</h3>
              <p className="leading-relaxed">
                We collect information you provide directly to us, such as when you create an account, 
                use our services, or contact us for support. This includes your name, email address, 
                business information, and any content you create using our platform.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-white text-base">2. How We Use Your Information</h3>
              <p className="leading-relaxed">
                We use the information we collect to provide, maintain, and improve our services, 
                process transactions, send you technical notices and support messages, and communicate 
                with you about products, services, and promotional offers.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-white text-base">3. Information Sharing</h3>
              <p className="leading-relaxed">
                We do not sell, trade, or otherwise transfer your personal information to third parties 
                without your consent, except as described in this policy. We may share information with 
                service providers who assist us in operating our platform and conducting our business.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-white text-base">4. Data Security</h3>
              <p className="leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal 
                information against unauthorized access, alteration, disclosure, or destruction. All data 
                is encrypted in transit and at rest using industry-standard encryption methods.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-white text-base">5. Data Retention</h3>
              <p className="leading-relaxed">
                We retain your information for as long as your account is active or as needed to provide 
                you services. We will delete your information within 30 days of account termination, 
                unless legally required to retain it for longer periods.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-white text-base">6. Your Rights</h3>
              <p className="leading-relaxed">
                You have the right to access, update, or delete your personal information. You may also 
                request a copy of your data or restrict its processing. To exercise these rights, 
                please contact us at privacy@enquiro.com.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-white text-base">7. Cookies and Tracking</h3>
              <p className="leading-relaxed">
                We use cookies and similar tracking technologies to collect and use personal information 
                about you. You can control cookies through your browser settings, but disabling them 
                may affect your ability to use certain features of our service.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-white text-base">8. International Data Transfers</h3>
              <p className="leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. 
                We ensure appropriate safeguards are in place to protect your information in accordance 
                with this privacy policy.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-white text-base">9. Updates to This Policy</h3>
              <p className="leading-relaxed">
                We may update this privacy policy from time to time. We will notify you of any changes 
                by posting the new policy on this page and updating the "last modified" date.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-white text-base">10. Contact Us</h3>
              <p className="leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at 
                privacy@enquiro.com or through our support portal.
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-700/50 bg-gray-800/50">
          <div className="flex justify-end">
            <Button
              onClick={onClose}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
