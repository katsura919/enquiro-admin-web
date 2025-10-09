"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Globe, Eye, Download, Settings } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import Link from "next/link"

interface QRProps {
  businessSlug: string
  businessLogo?: string
  businessName?: string
}

export default function QR({ businessSlug, businessLogo, businessName = "Your Business" }: QRProps) {
  const [copied, setCopied] = useState(false)
  const qrRef = useRef<HTMLDivElement>(null)
  
  // Fixed QR settings
  const qrSettings = {
    size: 300,
    bgColor: "#ffffff",
    fgColor: "#000000",
    level: "M" as "L" | "M" | "Q" | "H",
    includeMargin: true,
    includeLogo: true
  }
  
  const chatUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/chat/${businessSlug}`

  // Create default logo using local logo file
  const createDefaultLogo = () => {
    return "/logo-blue.png"
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(chatUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadQR = async () => {
    const svg = qrRef.current?.querySelector('svg')
    if (!svg) return

    // Create a canvas for the QR code
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = qrSettings.size + (qrSettings.includeMargin ? 40 : 0)
    canvas.height = qrSettings.size + (qrSettings.includeMargin ? 40 : 0)

    // Fill background
    ctx.fillStyle = qrSettings.bgColor
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    try {
      // Convert SVG to image
      const svgData = new XMLSerializer().serializeToString(svg)
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const svgUrl = URL.createObjectURL(svgBlob)

      // Load and draw the QR code
      const qrImg = new Image()
      await new Promise((resolve, reject) => {
        qrImg.onload = resolve
        qrImg.onerror = reject
        qrImg.src = svgUrl
      })

      ctx.drawImage(qrImg, 0, 0, canvas.width, canvas.height)

      // If logo is enabled, load and draw the logo
      if (qrSettings.includeLogo) {
        const logoImg = new Image()
        logoImg.crossOrigin = 'anonymous'
        
        await new Promise((resolve, reject) => {
          logoImg.onload = resolve
          logoImg.onerror = () => {
            console.warn('Logo failed to load, continuing without logo')
            resolve(null)
          }
          // Use absolute URL for the logo
          const logoSrc = logoToUse.startsWith('http') ? logoToUse : `${window.location.origin}${logoToUse}`
          logoImg.src = logoSrc
        })

        if (logoImg.complete && logoImg.naturalHeight !== 0) {
          const logoSize = qrSettings.size * 0.2
          const logoX = (canvas.width - logoSize) / 2
          const logoY = (canvas.height - logoSize) / 2

          // Draw white background circle for logo
          ctx.fillStyle = '#ffffff'
          ctx.beginPath()
          ctx.arc(canvas.width / 2, canvas.height / 2, logoSize / 2 + 4, 0, 2 * Math.PI)
          ctx.fill()

          // Draw logo
          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize)
        }
      }

      // Clean up
      URL.revokeObjectURL(svgUrl)

      // Download the canvas as image
      const link = document.createElement('a')
      link.download = `qr-code-${businessSlug}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()

    } catch (error) {
      console.error('Error downloading QR code:', error)
      // Fallback to simple SVG download
      const svgData = new XMLSerializer().serializeToString(svg)
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(svgBlob)
      const link = document.createElement('a')
      link.download = `qr-code-${businessSlug}.svg`
      link.href = url
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  const logoToUse = businessLogo || createDefaultLogo()


  return (
    <Card className="bg-card border-muted-gray shadow-none ">
      <CardHeader className="pb-4 px-6 pt-6">
        <CardTitle className="text-foreground flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Link to your chat interface
          </div>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="text-xs bg-card"
          >
            <Link href="/dashboard/settings/chatbot">
              Customize
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 px-6 pb-6">
        {/* URL Section */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              readOnly
              value={chatUrl}
              className="bg-card shadow-none text-foreground border-muted-gray"
            />
            <Button
              onClick={handleCopy}
              variant="outline"
              className="shrink-0 border-muted-gray text-secondary-foreground hover:bg-accent bg-card shadow-none cursor-pointer"
            >
              <Copy className="h-4 w-4" />
              {copied ? "Copied!" : "Copy"}
            </Button>
          </div>
        </div>

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
            <Button variant="outline" size="sm" onClick={downloadQR} className="shadow-none bg-card cursor-pointer">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button asChild variant="outline" size="sm" className="shadow-none bg-card">
              <Link href={chatUrl} target="_blank">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Link>
            </Button>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
