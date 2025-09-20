"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, Mic, Check, ArrowLeft, ArrowRight, Shield, AlertCircle } from "lucide-react"
import Link from "next/link"
import { FaceCapture } from "@/components/face-capture"
import { VoiceCapture } from "@/components/voice-capture"
import { BiometricStorage } from "@/lib/biometric-storage"

type EnrollmentStep = "intro" | "face" | "voice" | "complete"

export default function EnrollmentPage() {
  const [currentStep, setCurrentStep] = useState<EnrollmentStep>("intro")
  const [faceData, setFaceData] = useState<string | null>(null)
  const [voiceData, setVoiceData] = useState<Blob | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFaceCapture = useCallback(async (imageData: string) => {
    setIsProcessing(true)
    setError(null)

    try {
      // Simulate face processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Store face data
      await BiometricStorage.storeFaceData(imageData)
      setFaceData(imageData)

      console.log("[Enrollment] Face data captured and stored")
      setCurrentStep("voice")
    } catch (err) {
      setError("Failed to process face data. Please try again.")
      console.error("[Enrollment] Face capture error:", err)
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const handleVoiceCapture = useCallback(async (audioBlob: Blob) => {
    setIsProcessing(true)
    setError(null)

    try {
      // Simulate voice processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Store voice data
      await BiometricStorage.storeVoiceData(audioBlob)
      setVoiceData(audioBlob)

      console.log("[Enrollment] Voice data captured and stored")
      setCurrentStep("complete")
    } catch (err) {
      setError("Failed to process voice data. Please try again.")
      console.error("[Enrollment] Voice capture error:", err)
    } finally {
      setIsProcessing(false)
    }
  }, [])

  const getStepProgress = () => {
    switch (currentStep) {
      case "intro":
        return 0
      case "face":
        return 33
      case "voice":
        return 66
      case "complete":
        return 100
      default:
        return 0
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-card">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-foreground">Biometric Enrollment</h1>
                <p className="text-sm text-muted-foreground">Set up your security profile</p>
              </div>
            </div>
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Shield className="w-3 h-3" />
              <span>Secure</span>
            </Badge>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Progress</span>
            <span className="text-sm text-muted-foreground">{getStepProgress()}%</span>
          </div>
          <Progress value={getStepProgress()} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {error && (
            <Alert className="mb-6 border-destructive/50 bg-destructive/10">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-destructive">{error}</AlertDescription>
            </Alert>
          )}

          {currentStep === "intro" && (
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Welcome to Biometric Enrollment</CardTitle>
                <CardDescription className="text-lg">
                  We'll set up your face and voice recognition for secure authentication
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <Camera className="w-6 h-6 text-primary" />
                    <div>
                      <h3 className="font-medium">Face Recognition</h3>
                      <p className="text-sm text-muted-foreground">Capture your facial biometric</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg">
                    <Mic className="w-6 h-6 text-secondary" />
                    <div>
                      <h3 className="font-medium">Voice Passphrase</h3>
                      <p className="text-sm text-muted-foreground">Record your voice pattern</p>
                    </div>
                  </div>
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Your biometric data is encrypted and stored locally on your device. It never leaves your phone and
                    cannot be accessed by third parties.
                  </AlertDescription>
                </Alert>

                <Button onClick={() => setCurrentStep("face")} className="w-full" size="lg">
                  Start Enrollment
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {currentStep === "face" && (
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Face Recognition Setup</CardTitle>
                <CardDescription>Position your face in the camera frame and capture your biometric</CardDescription>
              </CardHeader>
              <CardContent>
                <FaceCapture onCapture={handleFaceCapture} isProcessing={isProcessing} />
              </CardContent>
            </Card>
          )}

          {currentStep === "voice" && (
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mic className="w-8 h-8 text-secondary" />
                </div>
                <CardTitle className="text-2xl">Voice Passphrase Setup</CardTitle>
                <CardDescription>Record your voice saying the passphrase for authentication</CardDescription>
              </CardHeader>
              <CardContent>
                <VoiceCapture onCapture={handleVoiceCapture} isProcessing={isProcessing} />
              </CardContent>
            </Card>
          )}

          {currentStep === "complete" && (
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-green-600">Enrollment Complete!</CardTitle>
                <CardDescription>Your biometric profile has been successfully created and secured</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-4 border rounded-lg bg-green-50">
                    <Check className="w-5 h-5 text-green-600" />
                    <div>
                      <h3 className="font-medium text-green-800">Face Recognition</h3>
                      <p className="text-sm text-green-600">Successfully enrolled</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg bg-green-50">
                    <Check className="w-5 h-5 text-green-600" />
                    <div>
                      <h3 className="font-medium text-green-800">Voice Passphrase</h3>
                      <p className="text-sm text-green-600">Successfully enrolled</p>
                    </div>
                  </div>
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Your biometric data is now ready for secure authentication. You can proceed to make transactions
                    with confidence.
                  </AlertDescription>
                </Alert>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/transaction" className="flex-1">
                    <Button className="w-full" size="lg">
                      Make Transaction
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <Link href="/" className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent" size="lg">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
