"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
} from "lucide-react"
import { offlineStorage } from "@/lib/offline-storage"
import { fingerprintAuth } from "@/lib/fingerprint-auth"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login")
  const [accountType, setAccountType] = useState<"individual" | "business">("individual")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [fingerprintStatus, setFingerprintStatus] = useState<"idle" | "scanning" | "success" | "error">("idle")
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    password: "",
    businessName: "",
    idNumber: "",
  })
  const router = useRouter()

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

      // Register fingerprint if supported
      const fingerprintSupported = await fingerprintAuth.isSupported()
      if (fingerprintSupported) {
        setFingerprintStatus("scanning")
        const fingerprintRegistered = await fingerprintAuth.register(user.id, formData.fullName)
        setFingerprintStatus(fingerprintRegistered ? "success" : "error")

        if (fingerprintRegistered) {
          await offlineStorage.logSecurityEvent({
            userId: user.id,
            type: "biometric_enrollment",
            severity: "low",
            description: "Fingerprint biometric enrolled successfully",
            metadata: { method: "fingerprint" },
          })
        }
      }

      await offlineStorage.logSecurityEvent({
        userId: user.id,
        type: "login",
        severity: "low",
        description: "New user account created",
        metadata: { accountType, method: "signup" },
      })

      setTimeout(() => {
        router.push("/enrollment")
      }, 1500)
    } catch (error) {
      console.error("Sign up failed:", error)
      setFingerprintStatus("error")
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

        await offlineStorage.logSecurityEvent({
          userId: user.id,
          type: "login",
          severity: "low",
          description: "User logged in successfully",
          metadata: { method: "password" },
        })

        router.push("/dashboard")
      } else {
        alert("User not found. Please sign up first.")
      }
    } catch (error) {
      console.error("Login failed:", error)
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

      const success = await fingerprintAuth.authenticate(currentUserId)

      if (success) {
        setFingerprintStatus("success")

        await offlineStorage.logSecurityEvent({
          userId: currentUserId,
          type: "login",
          severity: "low",
          description: "User logged in with fingerprint",
          metadata: { method: "fingerprint" },
        })

        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      } else {
        setFingerprintStatus("error")
      }
    } catch (error) {
      console.error("Fingerprint login failed:", error)
      setFingerprintStatus("error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleBiometricLogin = () => {
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen african-pattern bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center glow">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Face-to-Phone
          </h1>
          <p className="text-muted-foreground mt-2">Secure African Fintech Innovation</p>
        </div>

        <Card className="glass glow">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome</CardTitle>
            <CardDescription>AI-powered fraud detection for Africa</CardDescription>
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
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Login"}
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or</span>
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
                      className={`p-3 rounded-lg border ${
                        fingerprintStatus === "success"
                          ? "bg-green-50 border-green-200 text-green-800"
                          : fingerprintStatus === "error"
                            ? "bg-red-50 border-red-200 text-red-800"
                            : "bg-blue-50 border-blue-200 text-blue-800"
                      }`}
                    >
                      <div className="flex items-center">
                        {fingerprintStatus === "scanning" && <Fingerprint className="w-4 h-4 mr-2 animate-pulse" />}
                        {fingerprintStatus === "success" && <CheckCircle className="w-4 h-4 mr-2" />}
                        {fingerprintStatus === "error" && <AlertCircle className="w-4 h-4 mr-2" />}
                        <span className="text-sm">
                          {fingerprintStatus === "scanning" && "Setting up fingerprint authentication..."}
                          {fingerprintStatus === "success" && "Fingerprint enrolled successfully!"}
                          {fingerprintStatus === "error" && "Fingerprint setup failed. You can try again later."}
                        </span>
                      </div>
                    </div>
                  )}

                  <Button
                    onClick={handleSignUp}
                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Secured with biometric authentication and AI fraud detection
        </p>
      </div>
    </div>
  )
}
