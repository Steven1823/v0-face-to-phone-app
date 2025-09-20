"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Phone, X, Fingerprint } from "lucide-react"

interface AIHeadcardProps {
  isVisible: boolean
  onClose: () => void
  alertType: "call" | "suspicious" | "transaction" | "sms"
  userName?: string
}

export function AIHeadcard({ isVisible, onClose, alertType, userName = "User" }: AIHeadcardProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true)
    }
  }, [isVisible])

  if (!isVisible) return null

  const getAlertContent = () => {
    switch (alertType) {
      case "call":
        return {
          title: `Karibu, ${userName}. Call in progress.`,
          message: "Tip: Never share OTPs during calls. Press LOCK if unsure.",
          bgColor: "bg-accent/10 border-accent/20",
          iconColor: "text-accent",
        }
      case "suspicious":
        return {
          title: `Karibu, ${userName}. Suspicious activity detected.`,
          message: "Tip: Real banks never ask for OTPs. Press LOCK if unsure.",
          bgColor: "bg-destructive/10 border-destructive/20",
          iconColor: "text-destructive",
        }
      case "transaction":
        return {
          title: `Karibu, ${userName}. High-value transaction detected.`,
          message: "Tip: Use fingerprint for high-value transfers.",
          bgColor: "bg-primary/10 border-primary/20",
          iconColor: "text-primary",
        }
      case "sms":
        return {
          title: `Karibu, ${userName}. Suspicious SMS received.`,
          message: "Tip: If you see a SIM swap alert, lock your account.",
          bgColor: "bg-secondary/10 border-secondary/20",
          iconColor: "text-secondary",
        }
      default:
        return {
          title: `Karibu, ${userName}. Security alert.`,
          message: "Tip: Stay vigilant and report suspicious activity.",
          bgColor: "bg-muted/10 border-muted/20",
          iconColor: "text-muted-foreground",
        }
    }
  }

  const content = getAlertContent()

  return (
    <div className="fixed top-4 left-4 right-4 z-50 flex justify-center">
      <Card className={`glass ${content.bgColor} max-w-sm w-full ${isAnimating ? "slide-in" : ""} glow`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              {/* Animated ShieldBot Avatar */}
              <div
                className={`w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center glow pulse-glow`}
              >
                <Shield className={`w-6 h-6 text-white`} />
              </div>
              <div className="flex-1">
                <Badge variant="outline" className="glass border-primary/30 text-primary text-xs mb-1">
                  ShieldBot AI
                </Badge>
                <p className="text-sm font-medium text-foreground">{content.title}</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="p-1 h-auto">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mb-4">{content.message}</p>

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="outline"
              className="glass border-destructive/30 text-destructive hover:bg-destructive/10 text-xs bg-transparent"
            >
              <Lock className="w-3 h-3 mr-1" />
              LOCK ACCOUNT
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="glass border-primary/30 text-primary hover:bg-primary/10 text-xs bg-transparent"
            >
              <Fingerprint className="w-3 h-3 mr-1" />
              VERIFY
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="glass border-accent/30 text-accent hover:bg-accent/10 text-xs bg-transparent"
            >
              <Phone className="w-3 h-3 mr-1" />
              CALL SUPPORT
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
