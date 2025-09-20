"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, Mic, Check, X, Shield } from "lucide-react"
import { FaceCapture } from "@/components/face-capture"
import { VoiceCapture } from "@/components/voice-capture"
import { BiometricStorage } from "@/lib/biometric-storage"

interface BiometricVerificationProps {
  onComplete: (
    faceResult: { match: boolean; confidence: number },
    voiceResult: { match: boolean; confidence: number },
  ) => void
  isProcessing: boolean
}

type VerificationStep = "intro" | "face" | "voice" | "complete"

export function BiometricVerification({ onComplete, isProcessing }: BiometricVerificationProps) {
  const [currentStep, setCurrentStep] = useState<VerificationStep>("intro")
  const [faceResult, setFaceResult] = useState<{ match: boolean; confidence: number } | null>(null)
  const [voiceResult, setVoiceResult] = useState<{ match: boolean; confidence: number } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFaceVerification = useCallback(async (imageData: string) => {
    setError(null)

    try {
      const result = await BiometricStorage.verifyFace(imageData)
      setFaceResult(result)

      console.log("[BiometricVerification] Face verification:", result)

      if (result.match) {
        setCurrentStep("voice")
      } else {
        setError("Face verification failed. Please try again or contact support.")
      }
    } catch (err) {
      setError("Face verification error. Please try again.")
      console.error("[BiometricVerification] Face verification error:", err)
    }
  }, [])

  const handleVoiceVerification = useCallback(
    async (audioBlob: Blob) => {
      setError(null)

      try {
        const result = await BiometricStorage.verifyVoice(audioBlob)
        setVoiceResult(result)

        console.log("[BiometricVerification] Voice verification:", result)

        if (result.match && faceResult) {
          setCurrentStep("complete")
          onComplete(faceResult, result)
        } else {
          setError("Voice verification failed. Please try again or contact support.")
        }
      } catch (err) {
        setError("Voice verification error. Please try again.")
        console.error("[BiometricVerification] Voice verification error:", err)
      }
    },
    [faceResult, onComplete],
  )

  const startVerification = useCallback(() => {
    setCurrentStep("face")
    setError(null)
  }, [])

  const retryVerification = useCallback(() => {
    setCurrentStep("intro")
    setFaceResult(null)
    setVoiceResult(null)
    setError(null)
  }, [])

  return (
    <div className="space-y-6">
      {error && (
        <Alert className="border-destructive/50 bg-destructive/10">
          <X className="h-4 w-4" />
          <AlertDescription className="text-destructive">{error}</AlertDescription>
        </Alert>
      )}

      {currentStep === "intro" && (
        <div className="text-center space-y-6">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              To authorize this transaction, we need to verify your identity using both face and voice recognition.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-primary/20">
              <CardHeader className="text-center pb-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Face Verification</CardTitle>
                <CardDescription className="text-sm">Verify your facial biometric</CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-secondary/20">
              <CardHeader className="text-center pb-3">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Mic className="w-6 h-6 text-secondary" />
                </div>
                <CardTitle className="text-lg">Voice Verification</CardTitle>
                <CardDescription className="text-sm">Verify your voice passphrase</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Button onClick={startVerification} disabled={isProcessing} size="lg" className="px-8">
            Start Verification
          </Button>
        </div>
      )}

      {currentStep === "face" && (
        <Card>
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Eye className="w-6 h-6 text-primary" />
            </div>
            <CardTitle>Face Verification</CardTitle>
            <CardDescription>Look directly at the camera to verify your identity</CardDescription>
          </CardHeader>
          <CardContent>
            <FaceCapture onCapture={handleFaceVerification} isProcessing={isProcessing} />
          </CardContent>
        </Card>
      )}

      {currentStep === "voice" && faceResult && (
        <div className="space-y-4">
          {/* Face verification success indicator */}
          <Alert className="border-green-200 bg-green-50">
            <Check className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Face verification successful ({(faceResult.confidence * 100).toFixed(1)}% confidence)
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mic className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle>Voice Verification</CardTitle>
              <CardDescription>Speak your passphrase to complete verification</CardDescription>
            </CardHeader>
            <CardContent>
              <VoiceCapture onCapture={handleVoiceVerification} isProcessing={isProcessing} />
            </CardContent>
          </Card>
        </div>
      )}

      {currentStep === "complete" && faceResult && voiceResult && (
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-8 h-8 text-green-600" />
          </div>

          <div>
            <h3 className="text-xl font-semibold text-green-600 mb-2">Verification Complete</h3>
            <p className="text-muted-foreground">Your identity has been successfully verified</p>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center justify-center space-x-2">
                <Eye className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Face Match</span>
              </div>
              <p className="text-xs text-green-600 mt-1">{(faceResult.confidence * 100).toFixed(1)}% confidence</p>
            </div>

            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center justify-center space-x-2">
                <Mic className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Voice Match</span>
              </div>
              <p className="text-xs text-green-600 mt-1">{(voiceResult.confidence * 100).toFixed(1)}% confidence</p>
            </div>
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>Processing your transaction with verified identity...</AlertDescription>
          </Alert>
        </div>
      )}

      {error && currentStep !== "intro" && (
        <div className="text-center">
          <Button onClick={retryVerification} variant="outline" disabled={isProcessing}>
            Retry Verification
          </Button>
        </div>
      )}
    </div>
  )
}
