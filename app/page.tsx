"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { WelcomeScreen } from "@/components/welcome-screen"
import { OnboardingPages } from "@/components/onboarding-pages"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { WifiOff, Wifi } from "lucide-react"

export default function HomePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<"welcome" | "onboarding" | "complete">("welcome")
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const currentUserId = localStorage.getItem("currentUserId")
    if (currentUserId) {
      router.push("/dashboard")
      return
    }

    const hasCompletedOnboarding = localStorage.getItem("hasCompletedOnboarding")
    if (hasCompletedOnboarding) {
      setCurrentStep("complete")
      router.push("/auth")
      return
    }

    // Check offline mode from localStorage
    const offlineMode = localStorage.getItem("offlineMode") === "true"
    setIsOffline(offlineMode)
  }, [router])

  const handleWelcomeContinue = () => {
    setCurrentStep("onboarding")
  }

  const handleOnboardingComplete = () => {
    localStorage.setItem("hasCompletedOnboarding", "true")
    setCurrentStep("complete")
    router.push("/auth")
  }

  const toggleOfflineMode = () => {
    const newOfflineMode = !isOffline
    setIsOffline(newOfflineMode)
    localStorage.setItem("offlineMode", newOfflineMode.toString())
  }

  const OfflineToggle = () => (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`flex items-center space-x-3 p-3 rounded-lg glass ${
          isOffline ? "bg-purple-900/80 border-purple-500/30" : "bg-white/10 border-white/20"
        }`}
      >
        <Badge
          variant="outline"
          className={`${isOffline ? "border-purple-400 text-purple-200" : "border-primary text-primary"}`}
        >
          {isOffline ? (
            <>
              <WifiOff className="w-3 h-3 mr-1" />
              Offline Mode
            </>
          ) : (
            <>
              <Wifi className="w-3 h-3 mr-1" />
              Online Mode
            </>
          )}
        </Badge>
        <Switch
          checked={isOffline}
          onCheckedChange={toggleOfflineMode}
          className="data-[state=checked]:bg-purple-600"
        />
      </div>
    </div>
  )

  if (currentStep === "welcome") {
    return (
      <>
        <OfflineToggle />
        <WelcomeScreen onContinue={handleWelcomeContinue} isOffline={isOffline} />
      </>
    )
  }

  if (currentStep === "onboarding") {
    return (
      <>
        <OfflineToggle />
        <OnboardingPages onComplete={handleOnboardingComplete} isOffline={isOffline} />
      </>
    )
  }

  return null
}
