"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Camera,
  Mic,
  Shield,
  User,
  Building2,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Fingerprint,
  CheckCircle,
  AlertCircle,
  WifiOff,
  Wifi,
} from "lucide-react"
import { offlineStorage } from "@/lib/offline-storage"
import { fingerprintAuth } from "@/lib/fingerprint-auth"
import { eventLogger } from "@/lib/event-logger"
import { useRouter } from "next/navigation"
import { SideMenu } from "@/components/side-menu"
import { OfflineBanner } from "@/components/offline-banner"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login")
  const [accountType, setAccountType] = useState<"individual" | "business">("individual")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [fingerprintStatus, setFingerprintStatus] = useState<"idle" | "scanning" | "success" | "error">("idle")
  const [isOffline, setIsOffline] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    businessName: "",
    idNumber: "",
  })
  const router = useRouter()

  useEffect(() => {
    // Check offline mode from localStorage
    const offlineMode = localStorage.getItem("offlineMode") === "true"
    setIsOffline(offlineMode)
  }, [])

  const toggleOfflineMode = () => {
    const newOfflineMode = !isOffline
    setIsOffline(newOfflineMode)
    localStorage.setItem("offlineMode", newOfflineMode.toString())
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSignUp = async () => {
    setIsLoading(true)
    try {
      await offlineStorage.initialize()

      const userData = {
        accountType,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        idNumber: formData.idNumber,
        ...(accountType === "business" && { businessName: formData.businessName }),
      }

      const user = await offlineStorage.createUser(userData)
      localStorage.setItem("currentUserId", user.id)

      await eventLogger.logLogin(user.id, true, "signup")

      setFingerprintStatus("scanning")

      // Check if we're in simulation mode
      const isSimulation = await fingerprintAuth.isSimulationMode()
      if (isSimulation) {
        console.log("[v0] Running in fingerprint simulation mode")
      }

      const fingerprintRegistered = await fingerprintAuth.register(user.id, formData.fullName)
      setFingerprintStatus(fingerprintRegistered ? "success" : "error")

      if (fingerprintRegistered) {
        await eventLogger.logBiometricEvent(user.id, "fingerprint", true, 0.95)
        await offlineStorage.logSecurityEvent({
          userId: user.id,
          type: "biometric_enrollment",
          severity: "low",
          description: isSimulation
            ? "Fingerprint simulation enrolled successfully"
            : "Fingerprint biometric enrolled successfully",
          metadata: { method: "fingerprint", simulation: isSimulation, offline: isOffline },
        })
      } else {
        await eventLogger.logBiometricEvent(user.id, "fingerprint", false, 0.0)
      }

      await offlineStorage.logSecurityEvent({
        userId: user.id,
        type: "login",
        severity: "low",
        description: "New user account created",
        metadata: { accountType, method: "signup", offline: isOffline },
      })

      setTimeout(() => {
        router.push("/enrollment")
      }, 1500)
    } catch (error) {
      console.error("Sign up failed:", error)
      setFingerprintStatus("error")
      await eventLogger.logEvent("login", "medium", {
        success: false,
        method: "signup",
        error: error instanceof Error ? error.message : "Unknown error",
        offline: isOffline,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async () => {
    setIsLoading(true)
    try {
      await offlineStorage.initialize()

      const user = await offlineStorage.getUserByEmail(formData.email)
      if (user) {
        localStorage.setItem("currentUserId", user.id)

        await eventLogger.logLogin(user.id, true, "password")

        await offlineStorage.logSecurityEvent({
          userId: user.id,
          type: "login",
          severity: "low",
          description: "User logged in successfully",
          metadata: { method: "password", offline: isOffline },
        })

        router.push("/dashboard")
      } else {
        alert("User not found. Please sign up first.")
        await eventLogger.logLogin("unknown", false, "password")
      }
    } catch (error) {
      console.error("Login failed:", error)
      await eventLogger.logLogin("unknown", false, "password")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFingerprintLogin = async () => {
    setIsLoading(true)
    setFingerprintStatus("scanning")

    try {
      const currentUserId = localStorage.getItem("currentUserId")
      if (!currentUserId) {
        throw new Error("No user found. Please login first.")
      }

      const isSimulation = await fingerprintAuth.isSimulationMode()
      if (isSimulation) {
        console.log("[v0] Running fingerprint authentication in simulation mode")
      }

      const success = await fingerprintAuth.authenticate(currentUserId)

      if (success) {
        setFingerprintStatus("success")

        await eventLogger.logBiometricEvent(currentUserId, "fingerprint", true, 0.92)
        await eventLogger.logLogin(currentUserId, true, "fingerprint")

        await offlineStorage.logSecurityEvent({
          userId: currentUserId,
          type: "login",
          severity: "low",
          description: isSimulation ? "User logged in with fingerprint simulation" : "User logged in with fingerprint",
          metadata: { method: "fingerprint", simulation: isSimulation, offline: isOffline },
        })

        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      } else {
        setFingerprintStatus("error")
        await eventLogger.logBiometricEvent(currentUserId, "fingerprint", false, 0.0)
      }
    } catch (error) {
      console.error("Fingerprint login failed:", error)
      setFingerprintStatus("error")
      await eventLogger.logEvent("biometric", "medium", {
        type: "fingerprint",
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        offline: isOffline,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBiometricLogin = () => {
    router.push("/dashboard")
  }

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 ${
        isOffline ? "offline-animated-bg" : "animated-bg"
      }`}
    >
      <div className="fixed top-4 right-4 z-50">
        <div
          className={`flex items-center space-x-3 p-3 rounded-lg ${isOffline ? "glass-offline glow-offline" : "glass"}`}
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

      <OfflineBanner isOffline={isOffline} />
      <SideMenu isOffline={isOffline} onToggleOffline={toggleOfflineMode} />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div
            className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              isOffline
                ? "bg-gradient-to-r from-purple-600 to-indigo-600 glow-offline"
                : "bg-gradient-to-r from-primary to-secondary glow"
            }`}
          >
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1
            className={`text-3xl font-bold ${
              isOffline
                ? "bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent"
                : "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
            }`}
          >
            Face-to-Phone
          </h1>
          <p className={`mt-2 ${isOffline ? "text-purple-200" : "text-muted-foreground"}`}>
            Security Monitor - {isOffline ? "Offline Mode" : "Online Mode"}
          </p>
        </div>

        <Card
          className={`${isOffline ? "glass-offline glow-offline bg-slate-800/90 border-purple-500/30" : "glass glow"}`}
        >
          <CardHeader className="text-center">
            <CardTitle className={`text-2xl ${isOffline ? "text-white" : ""}`}>Karibu - Welcome</CardTitle>
            <CardDescription className={isOffline ? "text-purple-200" : ""}>
              AI-powered security monitoring for Africa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password">Password/PIN</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password or PIN"
                        className="pl-10 pr-10"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    onClick={handleLogin}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 ripple-effect"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or use biometrics</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      variant="outline"
                      onClick={handleFingerprintLogin}
                      className={`glass glow-blue bg-transparent ${fingerprintStatus === "scanning" ? "fingerprint-scan" : ""}`}
                      disabled={isLoading}
                    >
                      <Fingerprint
                        className={`w-4 h-4 ${fingerprintStatus === "success" ? "text-green-500" : fingerprintStatus === "error" ? "text-red-500" : ""}`}
                      />
                      {fingerprintStatus === "success" && <CheckCircle className="w-3 h-3 ml-1 text-green-500" />}
                      {fingerprintStatus === "error" && <AlertCircle className="w-3 h-3 ml-1 text-red-500" />}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleBiometricLogin}
                      className="glass glow-green bg-transparent"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" onClick={handleBiometricLogin} className="glass glow bg-transparent">
                      <Mic className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label>Account Type</Label>
                    <RadioGroup
                      value={accountType}
                      onValueChange={(value: "individual" | "business") => setAccountType(value)}
                      className="flex space-x-6 mt-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="individual" id="individual" />
                        <Label htmlFor="individual" className="flex items-center cursor-pointer">
                          <User className="w-4 h-4 mr-2" />
                          Individual
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="business" id="business" />
                        <Label htmlFor="business" className="flex items-center cursor-pointer">
                          <Building2 className="w-4 h-4 mr-2" />
                          Business
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        placeholder="Enter your full name"
                        className="pl-10"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                      />
                    </div>
                  </div>

                  {accountType === "business" && (
                    <div>
                      <Label htmlFor="businessName">Business Name</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="businessName"
                          placeholder="Enter business name"
                          className="pl-10"
                          value={formData.businessName}
                          onChange={(e) => handleInputChange("businessName", e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter phone number"
                        className="pl-10"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signupEmail">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signupEmail"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="idNumber">ID/Passport Number</Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="idNumber"
                        placeholder="Enter ID or passport number"
                        className="pl-10"
                        value={formData.idNumber}
                        onChange={(e) => handleInputChange("idNumber", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signupPassword">Password/PIN</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="signupPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create password or PIN"
                        className="pl-10 pr-10"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {fingerprintStatus !== "idle" && (
                    <div
                      className={`p-3 rounded-lg border slide-in ${
                        fingerprintStatus === "success"
                          ? "bg-green-50 border-green-200 text-green-800 shield-success"
                          : fingerprintStatus === "error"
                            ? "bg-red-50 border-red-200 text-red-800 hacker-alert"
                            : "bg-blue-50 border-blue-200 text-blue-800"
                      }`}
                    >
                      <div className="flex items-center">
                        {fingerprintStatus === "scanning" && <Fingerprint className="w-4 h-4 mr-2 animate-pulse" />}
                        {fingerprintStatus === "success" && <CheckCircle className="w-4 h-4 mr-2" />}
                        {fingerprintStatus === "error" && <AlertCircle className="w-4 h-4 mr-2" />}
                        <span className="text-sm">
                          {fingerprintStatus === "scanning" && "Setting up fingerprint authentication..."}
                          {fingerprintStatus === "success" &&
                            "Welcome to our Super Power App! Fingerprint enrolled successfully!"}
                          {fingerprintStatus === "error" &&
                            "Fingerprint setup completed in demo mode. You can still use all features!"}
                        </span>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleSignUp}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 ripple-effect"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account & Setup Biometrics"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className={`text-center text-sm mt-6 ${isOffline ? "text-purple-200" : "text-muted-foreground"}`}>
          🛡️ Secured with biometric authentication and AI fraud detection
          {isOffline && " - Running in secure offline mode"}
        </p>
      </div>
    </div>
  )
}
