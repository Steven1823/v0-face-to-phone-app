"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Shield,
  Eye,
  Mic,
  AlertTriangle,
  Smartphone,
  WifiOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Lock,
  Database,
} from "lucide-react"

interface OnboardingPagesProps {
  onComplete: () => void
  isOffline: boolean
}

export function OnboardingPages({ onComplete, isOffline }: OnboardingPagesProps) {
  const [currentPage, setCurrentPage] = useState(0)

  const pages = [
    {
      title: "Security Monitoring",
      subtitle: "We guard your banking activities",
      description:
        "Face-to-Phone acts as your personal security guard, monitoring threats and protecting your banking activities. We never process transactions - we just keep you safe.",
      features: [
        { icon: Eye, text: "Biometric monitoring", color: "text-blue-500" },
        { icon: Mic, text: "Voice pattern analysis", color: "text-green-500" },
        { icon: AlertTriangle, text: "Real-time fraud alerts", color: "text-red-500" },
        { icon: Shield, text: "Advanced threat detection", color: "text-purple-500" },
      ],
      bgGradient: isOffline
        ? "bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
        : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50",
    },
    {
      title: "Privacy & Offline First",
      subtitle: "Your data stays with you",
      description:
        "All your data is stored locally on your device. We use advanced encryption and never send your personal information to external servers. Works completely offline.",
      features: [
        { icon: Database, text: "Local data storage", color: "text-emerald-500" },
        { icon: Lock, text: "End-to-end encryption", color: "text-amber-500" },
        { icon: WifiOff, text: "Offline functionality", color: "text-cyan-500" },
        { icon: Smartphone, text: "PWA technology", color: "text-pink-500" },
      ],
      bgGradient: isOffline
        ? "bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900"
        : "bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50",
    },
  ]

  const currentPageData = pages[currentPage]

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1)
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${currentPageData.bgGradient}`}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl animate-pulse ${
            isOffline ? "bg-purple-500/30" : "bg-primary/20"
          }`}
        ></div>
        <div
          className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl animate-pulse delay-1000 ${
            isOffline ? "bg-cyan-500/30" : "bg-secondary/20"
          }`}
        ></div>
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-3xl animate-pulse delay-500 ${
            isOffline ? "bg-indigo-500/20" : "bg-accent/15"
          }`}
        ></div>
      </div>

      <div className="max-w-4xl w-full">
        <Card
          className={`glass transform transition-all duration-500 ${
            isOffline ? "bg-slate-800/90 border-purple-500/30" : "border-white/30"
          }`}
        >
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-4">
              {pages.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full mx-1 transition-all duration-300 ${
                    index === currentPage
                      ? isOffline
                        ? "bg-purple-500"
                        : "bg-primary"
                      : isOffline
                        ? "bg-slate-600"
                        : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
            <CardTitle className={`text-4xl font-bold mb-4 ${isOffline ? "text-white" : "text-foreground"}`}>
              {currentPageData.title}
            </CardTitle>
            <p className={`text-xl ${isOffline ? "text-purple-200" : "text-muted-foreground"}`}>
              {currentPageData.subtitle}
            </p>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className={`text-lg mb-8 leading-relaxed ${isOffline ? "text-slate-200" : "text-muted-foreground"}`}>
                  {currentPageData.description}
                </p>

                <div className="space-y-4">
                  {currentPageData.features.map((feature, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-4 p-3 rounded-lg transition-all duration-300 ${
                        isOffline ? "bg-slate-700/50" : "bg-white/50"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isOffline ? "bg-slate-600" : "bg-white"
                        }`}
                      >
                        <feature.icon className={`w-5 h-5 ${feature.color}`} />
                      </div>
                      <span className={`font-medium ${isOffline ? "text-white" : "text-foreground"}`}>
                        {feature.text}
                      </span>
                      <CheckCircle className={`w-5 h-5 ml-auto ${isOffline ? "text-green-400" : "text-green-500"}`} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-center">
                <div
                  className={`relative w-64 h-64 rounded-2xl flex items-center justify-center glow ${
                    isOffline
                      ? "bg-gradient-to-br from-purple-600 to-indigo-600"
                      : "bg-gradient-to-br from-primary to-secondary"
                  }`}
                >
                  <div className="absolute inset-4 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                    {currentPage === 0 ? (
                      <Shield className="w-24 h-24 text-white" />
                    ) : (
                      <Lock className="w-24 h-24 text-white" />
                    )}
                  </div>
                  <div className="absolute -top-2 -right-2">
                    <Badge className={`${isOffline ? "bg-purple-500" : "bg-primary"} text-white`}>
                      {currentPage === 0 ? "Secure" : "Private"}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-12">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentPage === 0}
                className={`${
                  isOffline ? "border-slate-600 hover:bg-slate-700 text-white" : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <div className="text-center">
                <p className={`text-sm ${isOffline ? "text-slate-400" : "text-muted-foreground"}`}>
                  {currentPage + 1} of {pages.length}
                </p>
              </div>

              <Button
                onClick={handleNext}
                className={`glow ${
                  isOffline
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    : "bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                }`}
              >
                {currentPage === pages.length - 1 ? "Get Started" : "Next"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
