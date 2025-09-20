"use client"

import { useEffect, useState } from "react"
import { Shield, Lock, Coins, Eye, Fingerprint, Zap } from "lucide-react"

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated gradient background */}
      <div className="absolute inset-0 animated-bg opacity-50" />

      {/* Floating security icons */}
      <div className="absolute top-20 left-10 text-primary/20 float">
        <Shield size={24} />
      </div>
      <div className="absolute top-40 right-20 text-secondary/20 float-delayed">
        <Lock size={20} />
      </div>
      <div className="absolute top-60 left-1/4 text-accent/20 float-slow">
        <Fingerprint size={28} />
      </div>
      <div className="absolute bottom-40 right-10 text-primary/20 float">
        <Eye size={22} />
      </div>
      <div className="absolute bottom-60 left-20 text-secondary/20 float-delayed">
        <Coins size={26} />
      </div>
      <div className="absolute top-1/3 right-1/3 text-accent/20 float-slow">
        <Zap size={18} />
      </div>

      {/* Subtle light rays */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/10 to-transparent" />
      <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-secondary/10 to-transparent" />
    </div>
  )
}
