"use client"

import { useEffect, useState } from "react"
import { Shield, CheckCircle, Lock } from "lucide-react"

interface SuccessAnimationProps {
  isVisible: boolean
  message: string
  onComplete?: () => void
}

export function SuccessAnimation({ isVisible, message, onComplete }: SuccessAnimationProps) {
  const [showShield, setShowShield] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setShowShield(true)
      const timer = setTimeout(() => {
        setShowShield(false)
        onComplete?.()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center space-y-4 shield-protect">
        {/* Animated shield */}
        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-secondary to-secondary/80 rounded-full flex items-center justify-center pulse-green">
          <Shield className="w-12 h-12 text-white" />
        </div>

        {/* Success message */}
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2 text-secondary">
            <CheckCircle className="w-6 h-6" />
            <span className="text-lg font-semibold">Transaction Secure</span>
          </div>
          <p className="text-muted-foreground max-w-sm">{message}</p>
        </div>

        {/* Floating security icons */}
        <div className="relative">
          <div className="absolute -top-8 -left-8 text-secondary/50 float">
            <Lock size={16} />
          </div>
          <div className="absolute -top-6 -right-6 text-secondary/50 float-delayed">
            <Shield size={14} />
          </div>
        </div>
      </div>
    </div>
  )
}
