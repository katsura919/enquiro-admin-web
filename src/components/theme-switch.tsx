"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ThemeSwitch() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch by waiting for mount
  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="h-9 w-9 p-0 rounded-lg"
        disabled
      >
        <div className="h-4 w-4 rounded-full bg-muted animate-pulse" />
      </Button>
    )
  }

  const isDark = resolvedTheme === 'dark'

  const handleToggle = () => {
    // Add a brief visual feedback before theme change
    const button = document.querySelector('[aria-label*="Switch to"]') as HTMLElement
    if (button) {
      button.style.transform = 'scale(0.95)'
      setTimeout(() => {
        button.style.transform = 'scale(1)'
      }, 100)
    }
    
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="h-9 w-9 p-0 rounded-lg transition-all duration-300 hover:bg-accent relative"
      onClick={handleToggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      {/* Light mode icon */}
      <Sun 
        className={cn(
          "h-4 w-4 text-foreground transition-all duration-500 ease-out transform-gpu",
          isDark 
            ? "scale-0 rotate-180 opacity-0 translate-y-1" 
            : "scale-100 rotate-0 opacity-100 translate-y-0 animate-in spin-in-180 zoom-in-75 duration-500"
        )}
      />
      
      {/* Dark mode icon */}
      <Moon 
        className={cn(
          "absolute h-4 w-4 text-foreground transition-all duration-500 ease-out transform-gpu",
          isDark 
            ? "scale-100 rotate-0 opacity-100 translate-y-0 animate-in spin-in-180 zoom-in-75 duration-500" 
            : "scale-0 -rotate-180 opacity-0 -translate-y-1"
        )}
      />
    </Button>
  )
}
