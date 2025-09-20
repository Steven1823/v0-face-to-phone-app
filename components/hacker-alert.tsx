"use client"

import { X, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface HackerAlertProps {
  isVisible: boolean
  onClose: () => void
  onCancel: () => void
  onProceed: () => void
  alertType: "fraud" | "success"
  message: string
}

export function HackerAlert({ isVisible, onClose, onCancel, onProceed, alertType, message }: HackerAlertProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card
        className={`w-full max-w-md glass ${alertType === "fraud" ? "hacker-alert pulse-glow border-destructive" : "shield-success border-secondary"}`}
      >
        <CardHeader className="text-center">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {alertType === "fraud" ? (
                <div className="w-16 h-16 bg-gradient-to-r from-destructive to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 pulse-glow">
                  <div className="text-2xl">🕵️‍♂️</div>
                </div>
              ) : (
                <div className="w-16 h-16 bg-gradient-to-r from-secondary to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shield-success">
                  <Shield className="w-8 h-8 text-white" />
                </div>
              )}
              <CardTitle className={`text-xl ${alertType === "fraud" ? "text-destructive" : "text-secondary"}`}>
                {alertType === "fraud" ? "⚠️ Suspicious Activity Detected" : "✅ Transaction Secured"}
              </CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">{message}</p>

          {alertType === "fraud" ? (
            <div className="space-y-3">
              <Button
                onClick={onCancel}
                className="w-full bg-destructive hover:bg-destructive/90 ripple-effect"
                size="lg"
              >
                🛑 Cancel Transaction
              </Button>
              <Button onClick={onProceed} variant="outline" className="w-full bg-transparent" size="lg">
                Proceed with Biometric Verification
              </Button>
            </div>
          ) : (
            <Button onClick={onClose} className="w-full bg-secondary hover:bg-secondary/90 ripple-effect" size="lg">
              Continue
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
