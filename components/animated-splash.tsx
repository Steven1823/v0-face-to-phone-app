"use client"

import { useEffect, useState } from "react"
import { Shield, Zap, Eye, Mic } from "lucide-react"

export function AnimatedSplash() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 animated-bg flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden">
        <Shield className="floating-icon absolute top-20 left-20 w-8 h-8 text-primary/30" />
        <Zap className="floating-icon absolute top-40 right-32 w-6 h-6 text-secondary/30" />
        <Eye className="floating-icon absolute bottom-32 left-32 w-7 h-7 text-accent/30" />
        <Mic className="floating-icon absolute bottom-20 right-20 w-5 h-5 text-primary/30" />
      </div>

      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center glow animate-pulse">
          <Shield className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
          Face-to-Phone
        </h1>
        <p className="text-muted-foreground animate-pulse">Securing Africa's Financial Future</p>
      </div>
    </div>
  )
}
