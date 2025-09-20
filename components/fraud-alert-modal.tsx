"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Shield, X, Eye, UserX } from "lucide-react"

interface FraudAlertModalProps {
  isOpen: boolean
  onClose: () => void
  onCancel: () => void
  onProceed: () => void
  alertType: "sim_swap" | "location_anomaly" | "biometric_failure" | "rapid_transactions"
  riskScore: number
}

export function FraudAlertModal({ isOpen, onClose, onCancel, onProceed, alertType, riskScore }: FraudAlertModalProps) {
  const [showHacker, setShowHacker] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setShowHacker(true)
      // Add screen shake effect
      document.body.classList.add("shake")
      setTimeout(() => {
        document.body.classList.remove("shake")
      }, 500)
    }
  }, [isOpen])

  if (!isOpen) return null

  const getAlertDetails = () => {
    switch (alertType) {
      case "sim_swap":
        return {
          title: "⚠️ SIM Swap Attack Detected",
          description: "Your phone number may have been transferred to a different device",
          icon: <UserX className="w-8 h-8 text-destructive" />,
        }
      case "location_anomaly":
        return {
          title: "🌍 Unusual Location Detected",
          description: "Transaction attempted from an unexpected location",
          icon: <Eye className="w-8 h-8 text-destructive" />,
        }
      case "biometric_failure":
        return {
          title: "🔒 Biometric Verification Failed",
          description: "Face or voice recognition did not match your profile",
          icon: <AlertTriangle className="w-8 h-8 text-destructive" />,
        }
      default:
        return {
          title: "⚡ Rapid Transaction Alert",
          description: "Multiple transactions detected in a short time period",
          icon: <AlertTriangle className="w-8 h-8 text-destructive" />,
        }
    }
  }

  const alertDetails = getAlertDetails()

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-destructive/50 shadow-2xl hacker-alert">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 rounded-full bg-destructive/10 w-fit">{alertDetails.icon}</div>
          <CardTitle className="text-destructive">{alertDetails.title}</CardTitle>
          <CardDescription className="text-center">{alertDetails.description}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Hacker illustration placeholder */}
          {showHacker && (
            <div className="relative mx-auto w-32 h-32 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-lg flex items-center justify-center hacker-alert">
              <div className="text-6xl">🕵️</div>
              <div className="absolute inset-0 bg-red-500/10 rounded-lg animate-pulse" />
            </div>
          )}

          {/* Risk score */}
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">Risk Score</div>
            <div className="text-3xl font-bold text-destructive">{(riskScore * 100).toFixed(0)}%</div>
            <div className="w-full bg-muted rounded-full h-2 mt-2">
              <div
                className="bg-destructive h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${riskScore * 100}%` }}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col space-y-3">
            <Button onClick={onCancel} variant="destructive" size="lg" className="w-full ripple pulse-glow">
              🛑 Cancel Transaction
            </Button>
            <Button onClick={onProceed} variant="outline" size="lg" className="w-full bg-transparent">
              <Shield className="w-4 h-4 mr-2" />
              Verify with Biometrics
            </Button>
            <Button onClick={onClose} variant="ghost" size="sm" className="w-full">
              <X className="w-4 h-4 mr-2" />
              Dismiss Alert
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
