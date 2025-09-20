"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Phone, X, Fingerprint, AlertTriangle, Eye } from "lucide-react"

interface AIHeadcardProps {
  isVisible: boolean
  onClose: () => void
  alertType: "call" | "suspicious" | "transaction" | "sms" | "sim_swap"
  userName?: string
  language?: "en" | "sw"
}

export function AIHeadcard({ 
  isVisible, 
  onClose, 
  alertType, 
  userName = "User",
  language = "en" 
}: AIHeadcardProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [shieldPulse, setShieldPulse] = useState(true)

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true)
      // Pulse animation for shield
      const interval = setInterval(() => {
        setShieldPulse(prev => !prev)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isVisible])

  if (!isVisible) return null

  const getAlertContent = () => {
    const content = {
      en: {
        call: {
          title: `Karibu, ${userName}. Call in progress.`,
          message: "Tip: Never share OTPs during calls. Press LOCK if unsure.",
          bgColor: "bg-accent/10 border-accent/20",
          iconColor: "text-accent",
          avatar: "🛡️"
        },
        suspicious: {
          title: `Karibu, ${userName}. Suspicious activity detected.`,
          message: "Tip: Real banks never ask for OTPs. Press LOCK if unsure.",
          bgColor: "bg-destructive/10 border-destructive/20",
          iconColor: "text-destructive",
          avatar: "🕵️‍♂️"
        },
        transaction: {
          title: `Karibu, ${userName}. High-value transaction detected.`,
          message: "Tip: Use fingerprint for high-value transfers.",
          bgColor: "bg-primary/10 border-primary/20",
          iconColor: "text-primary",
          avatar: "💳"
        },
        sms: {
          title: `Karibu, ${userName}. Suspicious SMS received.`,
          message: "Tip: If you see a SIM swap alert, lock your account.",
          bgColor: "bg-secondary/10 border-secondary/20",
          iconColor: "text-secondary",
          avatar: "📱"
        },
        sim_swap: {
          title: `Karibu, ${userName}. SIM swap detected!`,
          message: "URGENT: Your SIM card may have been cloned. Lock account now!",
          bgColor: "bg-destructive/20 border-destructive/40",
          iconColor: "text-destructive",
          avatar: "⚠️"
        }
      },
      sw: {
        call: {
          title: `Karibu, ${userName}. Simu inaendelea.`,
          message: "Dokezo: Usishiriki OTP wakati wa simu. Bonyeza LOCK ukiwa na wasiwasi.",
          bgColor: "bg-accent/10 border-accent/20",
          iconColor: "text-accent",
          avatar: "🛡️"
        },
        suspicious: {
          title: `Karibu, ${userName}. Shughuli za mashaka zimegunduliwa.`,
          message: "Dokezo: Benki halisi haziulizi OTP. Bonyeza LOCK ukiwa na wasiwasi.",
          bgColor: "bg-destructive/10 border-destructive/20",
          iconColor: "text-destructive",
          avatar: "🕵️‍♂️"
        },
        transaction: {
          title: `Karibu, ${userName}. Muamala wa thamani kubwa umegunduliwa.`,
          message: "Dokezo: Tumia kidole kwa uhamisho wa pesa nyingi.",
          bgColor: "bg-primary/10 border-primary/20",
          iconColor: "text-primary",
          avatar: "💳"
        },
        sms: {
          title: `Karibu, ${userName}. SMS ya mashaka imepokelewa.`,
          message: "Dokezo: Ukiona onyo la SIM swap, funga akaunti yako.",
          bgColor: "bg-secondary/10 border-secondary/20",
          iconColor: "text-secondary",
          avatar: "📱"
        },
        sim_swap: {
          title: `Karibu, ${userName}. SIM swap imegunduliwa!`,
          message: "HARAKA: SIM yako inaweza kuwa imenakiliwa. Funga akaunti sasa!",
          bgColor: "bg-destructive/20 border-destructive/40",
          iconColor: "text-destructive",
          avatar: "⚠️"
        }
      }
    }

    return content[language][alertType] || content.en[alertType]
  }

  const content = getAlertContent()

  const quickActions = language === "en" ? [
    { label: "LOCK ACCOUNT", icon: Lock, color: "destructive", action: "lock" },
    { label: "VERIFY", icon: Fingerprint, color: "primary", action: "verify" },
    { label: "CALL SUPPORT", icon: Phone, color: "accent", action: "support" }
  ] : [
    { label: "FUNGA AKAUNTI", icon: Lock, color: "destructive", action: "lock" },
    { label: "THIBITISHA", icon: Fingerprint, color: "primary", action: "verify" },
    { label: "PIGA MSAADA", icon: Phone, color: "accent", action: "support" }
  ]

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "lock":
        alert(language === "en" ? "Account locked for security!" : "Akaunti imefungwa kwa usalama!")
        break
      case "verify":
        alert(language === "en" ? "Biometric verification started..." : "Uthibitisho wa kibayolojia umeanza...")
        break
      case "support":
        alert(language === "en" ? "Connecting to support..." : "Inaunganisha na msaada...")
        break
    }
    onClose()
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-50 flex justify-center">
      <Card className={`glass ${content.bgColor} max-w-sm w-full ${isAnimating ? "slide-in" : ""} glow ${alertType === "sim_swap" ? "hacker-alert" : ""}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              {/* Animated ShieldBot Avatar */}
              <div
                className={`w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center glow ${shieldPulse ? "pulse-glow" : ""} transition-all duration-1000`}
              >
                {alertType === "suspicious" || alertType === "sim_swap" ? (
                  <div className="text-xl">{content.avatar}</div>
                ) : (
                  <Shield className={`w-6 h-6 text-white ${shieldPulse ? "animate-pulse" : ""}`} />
                )}
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

          {/* Threat Level Indicator */}
          {(alertType === "suspicious" || alertType === "sim_swap") && (
            <div className="flex items-center space-x-2 mb-4 p-2 bg-destructive/10 rounded-lg">
              <AlertTriangle className="w-4 h-4 text-destructive animate-pulse" />
              <span className="text-xs font-medium text-destructive">
                {language === "en" ? "HIGH THREAT DETECTED" : "TISHIO KUBWA LIMEGUNDULIWA"}
              </span>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                size="sm"
                variant="outline"
                className={`glass border-${action.color}/30 text-${action.color} hover:bg-${action.color}/10 text-xs bg-transparent ripple-effect`}
                onClick={() => handleQuickAction(action.action)}
              >
                <action.icon className="w-3 h-3 mr-1" />
                {action.label}
              </Button>
            ))}
          </div>

          {/* Anti-hack imagery for threats */}
          {(alertType === "suspicious" || alertType === "sim_swap") && (
            <div className="mt-3 flex items-center justify-center">
              <div className="w-full h-1 bg-gradient-to-r from-destructive/20 via-destructive/60 to-destructive/20 rounded-full animate-pulse"></div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}