"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { MessageSquare, Save, Upload, Eye, Camera, X, Check, Bot, ZoomIn, ZoomOut, RotateCw } from "lucide-react"
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

export default function ChatbotSettingsPage() {
  const { user } = useAuth()
  const businessId = user?.businessId
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const [initialSettings, setInitialSettings] = useState<ChatbotSettings>({
    businessId: businessId || "",
    chatbotName: "AI Assistant",
    chatbotIcon: "/default-chatbot-icon.svg",
    enableLiveChat: true
  })
  
  const [settingsData, setSettingsData] = useState<ChatbotSettings>({
    businessId: businessId || "",
    chatbotName: "AI Assistant",
    chatbotIcon: "/default-chatbot-icon.svg",
    enableLiveChat: true
  })
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [iconPreview, setIconPreview] = useState<string>("")
  
  // Image upload modal states
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>("")
  const [imageScale, setImageScale] = useState(1)
  const [imageRotation, setImageRotation] = useState(0)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 })

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

  // Check if there are changes
  const hasChanges = () => {
    return (
      settingsData.chatbotName !== initialSettings.chatbotName ||
      settingsData.chatbotIcon !== initialSettings.chatbotIcon ||
      settingsData.enableLiveChat !== initialSettings.enableLiveChat
    )
  }

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
    setIsSuccess(false)
    
    try {
      const response = await api.put(`/chatbot-settings/${businessId}`, {
        chatbotName: settingsData.chatbotName,
        chatbotIcon: settingsData.chatbotIcon,
        enableLiveChat: settingsData.enableLiveChat
      })
      
      if (response.data.success) {
        setInitialSettings(settingsData) // Update initial settings after successful save
        setIsSuccess(true)
        setTimeout(() => setIsSuccess(false), 3000)
      }
    } catch (error) {
      console.error("Error updating chatbot settings:", error)
    } finally {
      setIsSaving(false)
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
    setIconPreview("/default-chatbot-icon.svg")
    setSettingsData(prev => ({ ...prev, chatbotIcon: "/default-chatbot-icon.svg" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

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
    <ScrollArea className="h-[90vh]">
 
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
              <CardTitle className="text-xl text-foreground">Chatbot Settings</CardTitle>
              <p className="text-sm text-muted-foreground">Customize your AI assistant's name, appearance, and features</p>
            </CardHeader>
            <CardContent className="space-y-6">
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
                          {iconPreview && iconPreview !== "/default-chatbot-icon.svg" && (
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
                    {isSaving ? (
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
