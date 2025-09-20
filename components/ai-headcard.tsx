"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Phone, X, Fingerprint } from "lucide-react"

interface AIHeadcardProps {
  isVisible: boolean
  onClose: () => void
  userName?: string
  alertType: "suspicious" | "fraud" | "safe" | "call"
  message: string
}

export function AIHeadcard({ isVisible, onClose, userName = "User", alertType, message }: AIHeadcardProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true)
    }
  }, [isVisible])

  if (!isVisible) return null

  const getAlertConfig = () => {
    switch (alertType) {
      case "suspicious":
        return {
          color: "border-yellow-500/50 bg-yellow-500/10",
          iconColor: "text-yellow-500",
          badgeColor: "bg-yellow-500/20 text-yellow-500",
          icon: Shield,
        }
      case "fraud":
        return {
          color: "border-red-500/50 bg-red-500/10",
          iconColor: "text-red-500",
          badgeColor: "bg-red-500/20 text-red-500",
          icon: Shield,
        }
      case "safe":
        return {
          color: "border-green-500/50 bg-green-500/10",
          iconColor: "text-green-500",
          badgeColor: "bg-green-500/20 text-green-500",
          icon: Shield,
        }
      case "call":
        return {
          color: "border-blue-500/50 bg-blue-500/10",
          iconColor: "text-blue-500",
          badgeColor: "bg-blue-500/20 text-blue-500",
          icon: Phone,
        }
    }
  }

  const config = getAlertConfig()
  const IconComponent = config.icon

  return (
    <div className="fixed top-4 left-4 right-4 z-50 pointer-events-auto">
      <Card className={`glass ${config.color} border-2 ${isAnimating ? "animate-slide-down" : ""} shadow-2xl`}>
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            {/* AI Avatar */}
            <div className={`w-12 h-12 rounded-full ${config.color} flex items-center justify-center animate-pulse`}>
              <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
            </div>

            {/* Content */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <Badge className={`${config.badgeColor} border-0`}>ShieldBot AI</Badge>
                <Button variant="ghost" size="sm" onClick={onClose} className="h-6 w-6 p-0 hover:bg-white/10">
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-1">
                <div className="font-medium text-foreground">
                  Karibu, {userName}.{" "}
                  {alertType === "suspicious"
                    ? "Suspicious activity detected."
                    : alertType === "fraud"
                      ? "Fraud attempt blocked."
                      : alertType === "safe"
                        ? "Transaction verified safe."
                        : "Incoming call detected."}
                </div>
                <div className="text-sm text-muted-foreground">{message}</div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 pt-2">
                {alertType === "suspicious" && (
                  <>
                    <Button size="sm" variant="destructive" className="text-xs">
                      <Lock className="w-3 h-3 mr-1" />
                      LOCK ACCOUNT
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs glass border-primary/30 bg-transparent">
                      <Fingerprint className="w-3 h-3 mr-1" />
                      VERIFY
                    </Button>
                  </>
                )}
                {alertType === "fraud" && (
                  <Button size="sm" variant="destructive" className="text-xs">
                    <Lock className="w-3 h-3 mr-1" />
                    ACCOUNT LOCKED
                  </Button>
                )}
                {alertType === "call" && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs glass border-green-500/30 text-green-500 bg-transparent"
                    >
                      <Phone className="w-3 h-3 mr-1" />
                      ANSWER
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs glass border-red-500/30 text-red-500 bg-transparent"
                    >
                      DECLINE
                    </Button>
                  </>
                )}
                <Button size="sm" variant="outline" className="text-xs glass border-accent/30 bg-transparent">
                  <Phone className="w-3 h-3 mr-1" />
                  CALL SUPPORT
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
