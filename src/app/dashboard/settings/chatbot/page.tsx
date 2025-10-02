"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { MessageSquare, Save, Upload, Eye, Camera, X, Check, Bot, ZoomIn, ZoomOut, RotateCw, Globe, Settings, Palette, Copy, Download, AlertTriangle } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { useAuth } from "@/lib/auth"
import api from "@/utils/api"

interface ChatbotSettings {
  _id?: string
  businessId: string
  chatbotName: string
  chatbotIcon: string
  enableLiveChat: boolean
  createdAt?: string
  updatedAt?: string
}

interface BusinessData {
  _id: string
  name: string
  slug: string
  description: string
  category: string
  address: string
  logo?: string
  createdAt: string
  updatedAt: string
}

export default function ChatbotSettingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const businessId = user?.businessId
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const [initialSettings, setInitialSettings] = useState<ChatbotSettings>({
    businessId: businessId || "",
    chatbotName: "AI Assistant",
    chatbotIcon: "/logo-blue.png",
    enableLiveChat: true
  })
  
  const [settingsData, setSettingsData] = useState<ChatbotSettings>({
    businessId: businessId || "",
    chatbotName: "AI Assistant",
    chatbotIcon: "/logo-blue.png",
    enableLiveChat: true
  })
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [iconPreview, setIconPreview] = useState<string>("")
  
  // QR Code settings
  const [qrSettings, setQrSettings] = useState({
    size: 300,
    bgColor: "#ffffff",
    fgColor: "#000000",
    level: "M" as "L" | "M" | "Q" | "H",
    includeMargin: true,
    includeLogo: true
  })
  const [initialQrSettings, setInitialQrSettings] = useState({
    size: 300,
    bgColor: "#ffffff",
    fgColor: "#000000",
    level: "M" as "L" | "M" | "Q" | "H",
    includeMargin: true,
    includeLogo: true
  })
  const [isSavingQr, setIsSavingQr] = useState(false)
  const [copied, setCopied] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)
  const [businessData, setBusinessData] = useState<BusinessData | null>(null)
  
  // Image upload modal states
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [imageScale, setImageScale] = useState(1)
  const [imageRotation, setImageRotation] = useState(0)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })

  // Unsaved changes protection
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null)
  const [navigationBlocked, setNavigationBlocked] = useState(false)

  // Fetch chatbot settings
  useEffect(() => {
    const fetchChatbotSettings = async () => {
      if (!businessId) return
      
      try {
        setIsLoading(true)
        const response = await api.get(`/chatbot-settings/${businessId}`)
        if (response.data.success) {
          const settings = response.data.data
          setInitialSettings(settings)
          setSettingsData(settings)
          setIconPreview(settings.chatbotIcon || "")
        }
      } catch (error) {
        console.error("Error fetching chatbot settings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchChatbotSettings()
  }, [businessId])

  // Fetch business data
  useEffect(() => {
    const fetchBusinessData = async () => {
      if (!user?.businessId) return

      try {
        const response = await api.get(`/business/${user.businessId}`)
        setBusinessData(response.data)
      } catch (error) {
        console.error("Error fetching business data:", error)
      }
    }

    fetchBusinessData()
  }, [user?.businessId])

  // Fetch QR settings
  useEffect(() => {
    const fetchQRSettings = async () => {
      if (!businessId) return
      
      try {
        const response = await api.get(`/qr-settings/${businessId}`)
        if (response.data.success) {
          const settings = response.data.data
          const qrData = {
            size: 300, // Keep size fixed
            bgColor: settings.bgColor || "#ffffff",
            fgColor: settings.fgColor || "#000000",
            level: (settings.errorCorrectionLevel || "M") as "L" | "M" | "Q" | "H",
            includeMargin: true, // Keep margin fixed
            includeLogo: settings.includeLogo !== undefined ? settings.includeLogo : true
          }
          setQrSettings(qrData)
          setInitialQrSettings(qrData)
        }
      } catch (error) {
        console.error("Error fetching QR settings:", error)
      }
    }

    fetchQRSettings()
  }, [businessId])

  // Check if there are changes - defined early for use in effects
  const hasChanges = () => {
    const chatbotChanged = (
      settingsData.chatbotName !== initialSettings.chatbotName ||
      settingsData.chatbotIcon !== initialSettings.chatbotIcon ||
      settingsData.enableLiveChat !== initialSettings.enableLiveChat
    )
    
    const qrChanged = (
      qrSettings.bgColor !== initialQrSettings.bgColor ||
      qrSettings.fgColor !== initialQrSettings.fgColor ||
      qrSettings.level !== initialQrSettings.level ||
      qrSettings.includeLogo !== initialQrSettings.includeLogo
    )
    
    return chatbotChanged || qrChanged
  }

  // Protect against closing tab/browser with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges()) {
        e.preventDefault()
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?'
        return 'You have unsaved changes. Are you sure you want to leave?'
      }
    }

    // More comprehensive link interception
    const handleClick = (e: MouseEvent) => {
      if (!hasChanges()) return

      console.log('Navigation blocked - unsaved changes detected')
      const target = e.target as HTMLElement
      const link = target.closest('a, [role="button"], button')
      
      if (link) {
        // Get the intended destination
        let destination = ''
        let shouldBlock = false
        
        if (link.tagName === 'A') {
          const anchor = link as HTMLAnchorElement
          destination = anchor.href
          shouldBlock = true
        } else if (link.getAttribute('data-href')) {
          destination = link.getAttribute('data-href') || ''
          shouldBlock = true
        } else if (link.textContent?.toLowerCase().includes('dashboard') || 
                   link.className.includes('nav') || 
                   link.getAttribute('role') === 'button') {
          // Likely a navigation element even without explicit href
          shouldBlock = true
          destination = window.location.origin + '/dashboard'
        }
        
        if (shouldBlock) {
          // Check if it's a navigation link (not same-page anchor or external with target="_blank")
          const isExternalBlank = link.getAttribute('target') === '_blank'
          const isSamePage = destination.includes('#') && destination.split('#')[0] === window.location.href.split('#')[0]
          
          if (!isExternalBlank && !isSamePage) {
            e.preventDefault()
            e.stopPropagation()
            setPendingNavigation(destination || '/dashboard')
            setShowUnsavedDialog(true)
            return false
          }
        }
      }

      // Additional catch-all for any navigation attempts
      if (target.closest('[data-radix-collection-item]') || // Radix navigation items
          target.closest('.sidebar') || // Sidebar navigation
          target.closest('[role="menuitem"]') || // Menu items
          target.textContent?.toLowerCase().includes('dashboard')) {
        e.preventDefault()
        e.stopPropagation()
        setPendingNavigation('/dashboard')
        setShowUnsavedDialog(true)
        return false
      }
    }

    // Intercept browser navigation (back/forward buttons)
    const handlePopState = (e: PopStateEvent) => {
      if (hasChanges()) {
        e.preventDefault()
        window.history.pushState(null, '', window.location.href)
        setShowUnsavedDialog(true)
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('click', handleClick, true) // Use capture phase
    window.addEventListener('popstate', handlePopState)
    
    // Push current state to enable popstate detection
    window.history.pushState(null, '', window.location.href)
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('click', handleClick, true)
      window.removeEventListener('popstate', handlePopState)
    }
  }, [settingsData, qrSettings, initialSettings, initialQrSettings])

  const handleInputChange = (field: keyof ChatbotSettings, value: string | boolean) => {
    setSettingsData(prev => ({ ...prev, [field]: value }))
    
    // Update icon preview
    if (field === 'chatbotIcon') {
      setIconPreview(value as string)
    }
  }

  const handleSave = async () => {
    if (!businessId) return
    
    setIsSaving(true)
    setIsSavingQr(true)
    setIsSuccess(false)
    
    try {
      // Save chatbot settings
      const chatbotResponse = await api.put(`/chatbot-settings/${businessId}`, {
        chatbotName: settingsData.chatbotName,
        chatbotIcon: settingsData.chatbotIcon,
        enableLiveChat: settingsData.enableLiveChat
      })
      
      // Save QR settings
      const qrResponse = await api.put(`/qr-settings/${businessId}`, {
        bgColor: qrSettings.bgColor,
        fgColor: qrSettings.fgColor,
        includeLogo: qrSettings.includeLogo,
        errorCorrectionLevel: qrSettings.level
      })
      
      if (chatbotResponse.data.success && qrResponse.data.success) {
        setInitialSettings(settingsData) // Update initial settings after successful save
        setInitialQrSettings(qrSettings) // Update initial QR settings after successful save
        setIsSuccess(true)
        setTimeout(() => setIsSuccess(false), 3000)
      }
    } catch (error) {
      console.error("Error updating settings:", error)
    } finally {
      setIsSaving(false)
      setIsSavingQr(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setSelectedImage(result)
        setShowImageModal(true)
        // Reset modal states
        setImageScale(1)
        setImageRotation(0)
        setImagePosition({ x: 0, y: 0 })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageSave = () => {
    if (canvasRef.current && selectedImage) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const img = new Image()
      img.onload = () => {
        // Set canvas size to desired output size (64x64)
        canvas.width = 64
        canvas.height = 64

        // Clear canvas
        ctx.clearRect(0, 0, 64, 64)

        // Save context
        ctx.save()

        // Apply transformations
        ctx.translate(32, 32) // Center point
        ctx.rotate((imageRotation * Math.PI) / 180)
        ctx.scale(imageScale, imageScale)
        ctx.translate(imagePosition.x, imagePosition.y)

        // Draw image centered
        ctx.drawImage(img, -32, -32, 64, 64)

        // Restore context
        ctx.restore()

        // Get cropped image as base64
        const croppedImage = canvas.toDataURL('image/png')
        setIconPreview(croppedImage)
        setSettingsData(prev => ({ ...prev, chatbotIcon: croppedImage }))
        setShowImageModal(false)
      }
      img.src = selectedImage
    }
  }

  const handleImageCancel = () => {
    setShowImageModal(false)
    setSelectedImage("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleIconUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemoveIcon = () => {
    setIconPreview("/logo-blue.png")
    setSettingsData(prev => ({ ...prev, chatbotIcon: "/logo-blue.png" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Navigation protection functions
  const handleNavigation = (url: string) => {
    if (hasChanges()) {
      setPendingNavigation(url)
      setShowUnsavedDialog(true)
    } else {
      if (url.startsWith('/')) {
        router.push(url)
      } else {
        window.location.href = url
      }
    }
  }

  const confirmNavigation = () => {
    if (pendingNavigation) {
      if (pendingNavigation.startsWith('/') || pendingNavigation.includes(window.location.origin)) {
        // Internal navigation - use Next.js router
        const path = pendingNavigation.startsWith('/') 
          ? pendingNavigation 
          : pendingNavigation.replace(window.location.origin, '')
        router.push(path)
      } else {
        // External navigation - use window.location
        window.location.href = pendingNavigation
      }
    }
    setShowUnsavedDialog(false)
    setPendingNavigation(null)
  }

  const cancelNavigation = () => {
    console.log('Navigation cancelled by user')
    setShowUnsavedDialog(false)
    setPendingNavigation(null)
    // If this was from browser back/forward, we need to maintain current state
    window.history.pushState(null, '', window.location.href)
  }

  // QR Code functions
  const chatUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/chat/${businessData?.slug || 'demo'}`

  const handleCopy = () => {
    navigator.clipboard.writeText(chatUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadQR = async () => {
    const svg = qrRef.current?.querySelector('svg')
    if (!svg) return

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = qrSettings.size + (qrSettings.includeMargin ? 40 : 0)
    canvas.height = qrSettings.size + (qrSettings.includeMargin ? 40 : 0)

    ctx.fillStyle = qrSettings.bgColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    try {
      const svgData = new XMLSerializer().serializeToString(svg)
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const svgUrl = URL.createObjectURL(svgBlob)

      const qrImg = new Image()
      await new Promise((resolve, reject) => {
        qrImg.onload = resolve
        qrImg.onerror = reject
        qrImg.src = svgUrl
      })

      ctx.drawImage(qrImg, 0, 0, canvas.width, canvas.height)

      if (qrSettings.includeLogo && logoToUse) {
        const logoImg = new Image()
        logoImg.crossOrigin = 'anonymous'
        
        await new Promise((resolve) => {
          logoImg.onload = resolve
          logoImg.onerror = () => {
            console.warn('Logo failed to load, continuing without logo')
            resolve(null)
          }
          const logoSrc = logoToUse.startsWith('http') ? logoToUse : `${window.location.origin}${logoToUse}`
          logoImg.src = logoSrc
        })

        if (logoImg.complete && logoImg.naturalHeight !== 0) {
          const logoSize = qrSettings.size * 0.2
          const logoX = (canvas.width - logoSize) / 2
          const logoY = (canvas.height - logoSize) / 2

          ctx.fillStyle = '#ffffff'
          ctx.beginPath()
          ctx.arc(canvas.width / 2, canvas.height / 2, logoSize / 2 + 4, 0, 2 * Math.PI)
          ctx.fill()

          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize)
        }
      }

      URL.revokeObjectURL(svgUrl)

      const link = document.createElement('a')
      link.download = `qr-code-${businessData?.slug || 'chatbot'}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()

    } catch (error) {
      console.error('Error downloading QR code:', error)
    }
  }

  // Create default logo using local logo file (same as QR.tsx)
  const createDefaultLogo = () => {
    return "/logo-blue.png"
  }

  // QR code should use business logo, not chatbot icon
  const logoToUse = businessData?.logo || createDefaultLogo()

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading chatbot settings...</p>
        </div>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[90vh] w-full">
 
        {/* Success Message */}
        {isSuccess && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2">
            <div className="p-1 bg-green-100 dark:bg-green-900 rounded-full">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-green-800 dark:text-green-200 font-medium">Chatbot settings updated successfully!</p>
          </div>
        )}

        <div className="w-full max-w-4xl">
          {/* Chatbot Settings Card */}
          <Card className="border-0 shadow-sm bg-card/50 backdrop-blur">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-foreground">Chatbot & QR Settings</CardTitle>
              <p className="text-sm text-muted-foreground">Customize your AI assistant's name, appearance, and features</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* QR Code Section */}
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-foreground">Chat QR Code</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Share your chat interface with customers using this QR code
                  </p>
                </div>

                {/* URL Section */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-foreground">
                    Chat Page URL
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      readOnly
                      value={chatUrl}
                      className="bg-background text-foreground border-border text-sm"
                    />
                    <Button
                      onClick={handleCopy}
                      variant="outline"
                      size="sm"
                      className="shrink-0 border-border text-primary hover:bg-accent"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* QR Code and Customization */}
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                  {/* QR Code Display */}
                  <div className="flex flex-col items-center space-y-4">
                    <div 
                      ref={qrRef}
                      className="relative p-4 bg-white rounded-lg border border-border shadow-sm"
                      style={{ backgroundColor: qrSettings.bgColor }}
                    >
                      <QRCodeSVG 
                        value={chatUrl} 
                        size={qrSettings.size}
                        bgColor={qrSettings.bgColor}
                        fgColor={qrSettings.fgColor}
                        level={qrSettings.level}
                        includeMargin={qrSettings.includeMargin}
                        imageSettings={qrSettings.includeLogo ? {
                          src: logoToUse,
                          height: qrSettings.size * 0.2,
                          width: qrSettings.size * 0.2,
                          excavate: true,
                        } : undefined}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={downloadQR}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <a href={chatUrl} target="_blank" rel="noopener noreferrer">
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </a>
                      </Button>
                    </div>
                  </div>

                  {/* Customization Panel */}
                  <div className="flex-1 space-y-4 p-4 bg-muted/30 rounded-lg border border-border/50">
                    <div className="flex items-center gap-2 mb-4">
                      <Palette className="h-4 w-4" />
                      <h4 className="font-medium text-foreground">Customization</h4>
                    </div>
                      
                      {/* Colors */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm">Background Color</Label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="color"
                              value={qrSettings.bgColor}
                              onChange={(e) => setQrSettings(prev => ({ ...prev, bgColor: e.target.value }))}
                              className="w-8 h-8 rounded border border-border"
                            />
                            <Input
                              value={qrSettings.bgColor}
                              onChange={(e) => setQrSettings(prev => ({ ...prev, bgColor: e.target.value }))}
                              className="text-xs"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Foreground Color</Label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="color"
                              value={qrSettings.fgColor}
                              onChange={(e) => setQrSettings(prev => ({ ...prev, fgColor: e.target.value }))}
                              className="w-8 h-8 rounded border border-border"
                            />
                            <Input
                              value={qrSettings.fgColor}
                              onChange={(e) => setQrSettings(prev => ({ ...prev, fgColor: e.target.value }))}
                              className="text-xs"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Logo Toggle */}
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Include Chatbot Logo</Label>
                        <button
                          onClick={() => setQrSettings(prev => ({ ...prev, includeLogo: !prev.includeLogo }))}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            qrSettings.includeLogo ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              qrSettings.includeLogo ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>

                      {/* Error Correction Level */}
                      <div className="space-y-2">
                        <Label className="text-sm">Error Correction Level</Label>
                        <div className="grid grid-cols-4 gap-1">
                          {(['L', 'M', 'Q', 'H'] as const).map((level) => (
                            <Button
                              key={level}
                              variant={qrSettings.level === level ? "default" : "outline"}
                              size="sm"
                              onClick={() => setQrSettings(prev => ({ ...prev, level }))}
                              className="text-xs"
                            >
                              {level}
                            </Button>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Higher levels provide better error recovery but larger QR codes
                        </p>
                      </div>
                    </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-border/50" />

              {/* Enable Live Chat - First */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-sm font-medium text-foreground">
                      Enable Live Chat
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Allow visitors to escalate conversations to human agents
                    </p>
                  </div>
                  <Switch
                    checked={settingsData.enableLiveChat}
                    onCheckedChange={(checked) => handleInputChange('enableLiveChat', checked)}
                  />
                </div>
              </div>

              {/* Settings Section - Only show when live chat is enabled */}
              {settingsData.enableLiveChat && (
                <div className="space-y-6 pt-2 border-t border-border/50 mt-6">
                  {/* Chatbot Name */}
                  <div className="space-y-3">
                    <Label htmlFor="chatbotName" className="text-sm font-medium text-foreground">
                      Chatbot Name
                    </Label>
                    <Input
                      id="chatbotName"
                      type="text"
                      value={settingsData.chatbotName}
                      onChange={(e) => handleInputChange('chatbotName', e.target.value)}
                      placeholder="AI Assistant"
                      className="w-full max-w-md"
                      maxLength={50}
                    />
                    <p className="text-xs text-muted-foreground">
                      This name will appear in chat conversations (max 50 characters)
                    </p>
                  </div>

                  {/* Chatbot Icon */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-foreground">Chatbot Icon</Label>
                    
                    {/* Icon Preview and Upload */}
                    <div className="flex items-center gap-4">
                      <div className="relative group">
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-border/50 bg-muted/30 flex items-center justify-center overflow-hidden">
                          {iconPreview ? (
                            <img 
                              src={iconPreview} 
                              alt="Chatbot icon preview" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Bot className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        
                        {/* Overlay buttons */}
                        <div className="absolute inset-0 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleIconUploadClick}
                            className="h-7 w-7 p-0 text-white hover:bg-white/20"
                          >
                            <Camera className="h-3 w-3" />
                          </Button>
                          {iconPreview && iconPreview !== "/logo-blue.png" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleRemoveIcon}
                              className="h-7 w-7 p-0 text-white hover:bg-white/20"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <Button
                          variant="outline"
                          onClick={handleIconUploadClick}
                          className="mb-2"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Icon
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          Upload a custom icon for your chatbot. Recommended: 64x64px, PNG or JPG
                        </p>
                      </div>
                    </div>

                    {/* Hidden file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Preview Section */}
                  <div className="pt-6 border-t border-border">
                    <Label className="text-sm font-medium text-foreground mb-4 block">
                      Preview
                    </Label>
                    <div className="bg-muted/30 rounded-lg p-4 max-w-sm">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-background border shadow-sm flex items-center justify-center overflow-hidden">
                          {iconPreview ? (
                            <img 
                              src={iconPreview} 
                              alt="Preview" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Bot className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {settingsData.chatbotName}
                          </p>
                          <p className="text-xs text-muted-foreground">Online</p>
                        </div>
                      </div>
                      <div className="bg-background rounded-lg p-3 text-sm text-foreground">
                        Hello! I'm {settingsData.chatbotName}. How can I help you today?
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        Live chat available
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button outside collapsible section - Always show if there are changes */}
              {hasChanges() && (
                <div className="pt-6 border-t border-border">
                  <Button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="bg-primary hover:bg-primary/90 px-6 py-2 h-auto w-full"
                  >
                    {(isSaving || isSavingQr) ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Disabled State Preview - Only show when live chat is disabled */}
              {!settingsData.enableLiveChat && (
                <div className="pt-4 transition-all duration-300 ease-in-out">
                  <Label className="text-sm font-medium text-foreground mb-4 block">
                    Preview
                  </Label>
                  <div className="bg-muted/30 rounded-lg p-4 max-w-sm opacity-60">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-background border shadow-sm flex items-center justify-center overflow-hidden">
                        <Bot className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">AI Assistant</p>
                        <p className="text-xs text-muted-foreground">Offline</p>
                      </div>
                    </div>
                    <div className="bg-background rounded-lg p-3 text-sm text-muted-foreground">
                      Live chat is currently disabled
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Unsaved Changes Confirmation Dialog */}
        <Dialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                Unsaved Changes
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-4">
              <p className="text-muted-foreground">
                You have unsaved changes to your chatbot and QR code settings. 
                Are you sure you want to leave without saving?
              </p>
            </div>

            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={cancelNavigation}>
                Stay on Page
              </Button>
              <Button variant="destructive" onClick={confirmNavigation}>
                Leave Without Saving
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Image Upload Modal */}
        <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Customize Chatbot Icon</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              {/* Preview Area */}
              <div className="relative border rounded-lg overflow-hidden bg-muted/30" style={{ height: '400px' }}>
                {selectedImage && (
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-contain transition-transform"
                    style={{
                      transform: `scale(${imageScale}) rotate(${imageRotation}deg) translate(${imagePosition.x}px, ${imagePosition.y}px)`
                    }}
                    draggable={false}
                  />
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setImageScale(Math.max(0.1, imageScale - 0.1))}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground min-w-16 text-center">
                  {Math.round(imageScale * 100)}%
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setImageScale(Math.min(3, imageScale + 0.1))}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-2" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setImageRotation((imageRotation + 90) % 360)}
                >
                  <RotateCw className="h-4 w-4" />
                </Button>
              </div>

              {/* Final Preview */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground">Final result:</div>
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-border/50 bg-muted/30 flex items-center justify-center overflow-hidden">
                  <canvas
                    ref={canvasRef}
                    width={64}
                    height={64}
                    className="w-full h-full"
                    style={{ display: 'none' }}
                  />
                  {selectedImage && (
                    <div className="w-full h-full overflow-hidden rounded-full">
                      <img
                        src={selectedImage}
                        alt="Final preview"
                        className="w-full h-full object-cover"
                        style={{
                          transform: `scale(${imageScale}) rotate(${imageRotation}deg) translate(${imagePosition.x}px, ${imagePosition.y}px)`
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={handleImageCancel}>
                Cancel
              </Button>
              <Button onClick={handleImageSave}>
                Save Icon
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

    </ScrollArea>
  )
}
