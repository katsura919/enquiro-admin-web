"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TermsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
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
          <h2 className="text-xl font-bold text-white">Terms of Service</h2>
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
              <h3 className="font-semibold text-white text-base">1. Acceptance of Terms</h3>
              <p className="leading-relaxed">
                By using Enquiro's AI Chatbot Platform, you agree to these Terms of Service and our Privacy Policy. 
                These terms constitute a legally binding agreement between you and Enquiro. If you do not agree to 
                these terms, please do not use our services.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-white text-base">2. Service Description</h3>
              <p className="leading-relaxed">
                Enquiro provides a multi-tenant AI chatbot platform that helps organizations automate customer 
                support through intelligent conversation management. Our service includes chatbot creation, 
                training, deployment, and analytics tools designed to enhance customer engagement.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-white text-base">3. User Responsibilities</h3>
              <p className="leading-relaxed">
                You are responsible for maintaining the confidentiality of your account credentials and for all 
                activities under your account. You must notify us immediately of any unauthorized use of your 
                account. You agree to use our services only for lawful purposes and in accordance with these terms.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-white text-base">4. Data Privacy and Security</h3>
              <p className="leading-relaxed">
                We implement industry-standard security measures to protect your data. Each tenant's data is 
                isolated and encrypted both in transit and at rest. We will not share your data with third 
                parties without your explicit consent, except as required by law or as outlined in our Privacy Policy.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-white text-base">5. Service Availability</h3>
              <p className="leading-relaxed">
                We strive to maintain 99.9% uptime but cannot guarantee uninterrupted service availability. 
                Scheduled maintenance will be announced in advance when possible. We reserve the right to 
                modify or discontinue services with reasonable notice.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-white text-base">6. Intellectual Property</h3>
              <p className="leading-relaxed">
                All content, features, and functionality of the Enquiro platform are owned by us and are 
                protected by international copyright, trademark, patent, trade secret, and other intellectual 
                property laws. You retain ownership of your data and content.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-white text-base">7. Limitation of Liability</h3>
              <p className="leading-relaxed">
                Enquiro's liability is limited to the amount paid for the service in the preceding 12 months. 
                We shall not be liable for any indirect, incidental, special, consequential, or punitive damages 
                resulting from your use of our services.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-white text-base">8. Termination</h3>
              <p className="leading-relaxed">
                Either party may terminate this agreement at any time with 30 days notice. Upon termination, 
                you will lose access to the services, and we will delete your data according to our data 
                retention policy unless legally required to retain it.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-white text-base">9. Changes to Terms</h3>
              <p className="leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of significant 
                changes via email or through the platform. Continued use of the service after changes 
                constitutes acceptance of the new terms.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="font-semibold text-white text-base">10. Contact Information</h3>
              <p className="leading-relaxed">
                If you have any questions about these Terms of Service, please contact us at legal@enquiro.com 
                or through our support portal.
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
