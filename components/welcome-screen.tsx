"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Zap, ArrowRight } from "lucide-react"

interface WelcomeScreenProps {
  onContinue: () => void
  isOffline: boolean
}

export function WelcomeScreen({ onContinue, isOffline }: WelcomeScreenProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        isOffline ? "bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900" : "animated-bg"
      }`}
    >
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-pulse ${
            isOffline ? "bg-purple-500/20" : "bg-primary/10"
          }`}
        ></div>
        <div
          className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000 ${
            isOffline ? "bg-indigo-500/20" : "bg-secondary/10"
          }`}
        ></div>
      </div>

      <Card
        className={`glass max-w-md w-full transform transition-all duration-1000 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        } ${isOffline ? "bg-slate-800/80 border-purple-500/30" : "border-white/20"}`}
      >
        <CardContent className="p-8 text-center">
          <div
            className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center glow ${
              isOffline
                ? "bg-gradient-to-r from-purple-600 to-indigo-600"
                : "bg-gradient-to-r from-primary to-secondary"
            }`}
          >
            <Shield className="w-10 h-10 text-white" />
          </div>

          <h1 className={`text-3xl font-bold mb-4 ${isOffline ? "text-white" : "text-foreground"}`}>
            Welcome to Face-to-Phone
          </h1>

          <p className={`text-lg mb-8 ${isOffline ? "text-purple-200" : "text-muted-foreground"}`}>
            Your personal AI security guard for banking protection
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isOffline ? "bg-purple-600" : "bg-primary"
                }`}
              >
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className={isOffline ? "text-purple-100" : "text-foreground"}>Advanced fraud detection</span>
            </div>
            <div className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isOffline ? "bg-indigo-600" : "bg-secondary"
                }`}
              >
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className={isOffline ? "text-purple-100" : "text-foreground"}>Works completely offline</span>
            </div>
          </div>

          <Button
            onClick={onContinue}
            size="lg"
            className={`w-full glow ${
              isOffline
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                : "bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            }`}
          >
            Get Started
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
