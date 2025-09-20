"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CreditCard, Shield, AlertTriangle, Check, X, Eye, Mic } from "lucide-react"
import Link from "next/link"
import { BiometricVerification } from "@/components/biometric-verification"
import { BiometricStorage } from "@/lib/biometric-storage"
import { FraudDetection } from "@/lib/fraud-detection"
import { TransactionStorage } from "@/lib/transaction-storage"

type TransactionStep = "form" | "verification" | "processing" | "result"

interface TransactionData {
  amount: number
  recipient: string
  description: string
  timestamp: Date
}

interface VerificationResult {
  faceMatch: boolean
  voiceMatch: boolean
  faceConfidence: number
  voiceConfidence: number
}

interface FraudResult {
  isBlocked: boolean
  riskScore: number
  reasons: string[]
  riskLevel: "low" | "medium" | "high"
}

export default function TransactionPage() {
  const [currentStep, setCurrentStep] = useState<TransactionStep>("form")
  const [transactionData, setTransactionData] = useState<TransactionData>({
    amount: 0,
    recipient: "",
    description: "",
    timestamp: new Date(),
  })
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const [fraudResult, setFraudResult] = useState<FraudResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasBiometricData, setHasBiometricData] = useState(false)

  useEffect(() => {
    setHasBiometricData(BiometricStorage.hasBiometricData())
  }, [])

  const handleFormSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      setError(null)

      if (!transactionData.amount || transactionData.amount <= 0) {
        setError("Please enter a valid amount")
        return
      }

      if (!transactionData.recipient.trim()) {
        setError("Please enter a recipient")
        return
      }

      if (!hasBiometricData) {
        setError("Biometric enrollment required. Please complete enrollment first.")
        return
      }

      setCurrentStep("verification")
    },
    [transactionData, hasBiometricData],
  )

  const handleVerificationComplete = useCallback(
    async (faceResult: { match: boolean; confidence: number }, voiceResult: { match: boolean; confidence: number }) => {
      setIsProcessing(true)
      setError(null)

      try {
        const verification: VerificationResult = {
          faceMatch: faceResult.match,
          voiceMatch: voiceResult.match,
          faceConfidence: faceResult.confidence,
          voiceConfidence: voiceResult.confidence,
        }

        setVerificationResult(verification)

        // Check if biometric verification passed
        if (!verification.faceMatch || !verification.voiceMatch) {
          const fraudCheck: FraudResult = {
            isBlocked: true,
            riskScore: 0.95,
            reasons: ["Biometric verification failed"],
            riskLevel: "high",
          }
          setFraudResult(fraudCheck)
          setCurrentStep("result")
          return
        }

        setCurrentStep("processing")

        // Run fraud detection
        const fraudCheck = await FraudDetection.analyzeTransaction({
          amount: transactionData.amount,
          recipient: transactionData.recipient,
          timestamp: transactionData.timestamp,
          userVerified: true,
        })

        setFraudResult(fraudCheck)

        // Store transaction
        await TransactionStorage.storeTransaction({
          ...transactionData,
          id: crypto.randomUUID(),
          status: fraudCheck.isBlocked ? "blocked" : "approved",
          fraudScore: fraudCheck.riskScore,
          fraudReasons: fraudCheck.reasons,
          biometricVerification: verification,
        })

        setCurrentStep("result")
      } catch (err) {
        setError("Transaction processing failed. Please try again.")
        console.error("[Transaction] Processing error:", err)
      } finally {
        setIsProcessing(false)
      }
    },
    [transactionData],
  )

  const startNewTransaction = useCallback(() => {
    setCurrentStep("form")
    setTransactionData({
      amount: 0,
      recipient: "",
      description: "",
      timestamp: new Date(),
    })
    setVerificationResult(null)
    setFraudResult(null)
    setError(null)
  }, [])

  const getStepProgress = () => {
    switch (currentStep) {
      case "form":
        return 25
      case "verification":
        return 50
      case "processing":
        return 75
      case "result":
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
                <h1 className="text-xl font-bold text-foreground">Secure Transaction</h1>
                <p className="text-sm text-muted-foreground">Biometric-verified money transfer</p>
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
            <span className="text-sm font-medium text-foreground">Transaction Progress</span>
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
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-destructive">{error}</AlertDescription>
            </Alert>
          )}

          {!hasBiometricData && (
            <Alert className="mb-6 border-secondary/50 bg-secondary/10">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Biometric enrollment is required for secure transactions.{" "}
                <Link href="/enrollment" className="underline font-medium">
                  Complete enrollment first
                </Link>
              </AlertDescription>
            </Alert>
          )}

          {currentStep === "form" && (
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">New Transaction</CardTitle>
                <CardDescription>Enter transaction details for secure processing</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount ($)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      value={transactionData.amount || ""}
                      onChange={(e) =>
                        setTransactionData((prev) => ({
                          ...prev,
                          amount: Number.parseFloat(e.target.value) || 0,
                        }))
                      }
                      className="text-lg"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recipient">Recipient</Label>
                    <Input
                      id="recipient"
                      placeholder="Enter recipient name or account"
                      value={transactionData.recipient}
                      onChange={(e) =>
                        setTransactionData((prev) => ({
                          ...prev,
                          recipient: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input
                      id="description"
                      placeholder="Payment description"
                      value={transactionData.description}
                      onChange={(e) =>
                        setTransactionData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      This transaction will require biometric verification (face and voice) before processing.
                    </AlertDescription>
                  </Alert>

                  <Button type="submit" className="w-full" size="lg" disabled={!hasBiometricData}>
                    Continue to Verification
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {currentStep === "verification" && (
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-secondary" />
                </div>
                <CardTitle className="text-2xl">Biometric Verification</CardTitle>
                <CardDescription>Verify your identity to authorize this transaction</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Transaction Summary */}
                <div className="bg-muted/50 rounded-lg p-4 mb-6">
                  <h3 className="font-semibold mb-2">Transaction Summary</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-mono">${transactionData.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Recipient:</span>
                      <span>{transactionData.recipient}</span>
                    </div>
                    {transactionData.description && (
                      <div className="flex justify-between">
                        <span>Description:</span>
                        <span>{transactionData.description}</span>
                      </div>
                    )}
                  </div>
                </div>

                <BiometricVerification onComplete={handleVerificationComplete} isProcessing={isProcessing} />
              </CardContent>
            </Card>
          )}

          {currentStep === "processing" && (
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                </div>
                <CardTitle className="text-2xl">Processing Transaction</CardTitle>
                <CardDescription>Running security checks and fraud analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>Biometric verification completed</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent"></div>
                    <span>Analyzing transaction for fraud indicators...</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === "result" && fraudResult && (
            <Card>
              <CardHeader className="text-center">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                    fraudResult.isBlocked
                      ? "bg-destructive/10"
                      : fraudResult.riskLevel === "medium"
                        ? "bg-yellow-100"
                        : "bg-green-100"
                  }`}
                >
                  {fraudResult.isBlocked ? (
                    <X className="w-8 h-8 text-destructive" />
                  ) : (
                    <Check className="w-8 h-8 text-green-600" />
                  )}
                </div>
                <CardTitle
                  className={`text-2xl ${
                    fraudResult.isBlocked
                      ? "text-destructive"
                      : fraudResult.riskLevel === "medium"
                        ? "text-yellow-600"
                        : "text-green-600"
                  }`}
                >
                  {fraudResult.isBlocked ? "Transaction Blocked" : "Transaction Approved"}
                </CardTitle>
                <CardDescription>
                  {fraudResult.isBlocked
                    ? "Security measures prevented this transaction"
                    : "Your transaction has been processed successfully"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Transaction Details */}
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Transaction Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-mono">${transactionData.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Recipient:</span>
                      <span>{transactionData.recipient}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <Badge variant={fraudResult.isBlocked ? "destructive" : "default"}>
                        {fraudResult.isBlocked ? "Blocked" : "Approved"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Risk Score:</span>
                      <span className="font-mono">{(fraudResult.riskScore * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                {/* Verification Results */}
                {verificationResult && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Biometric Verification</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm">Face:</span>
                        <Badge variant={verificationResult.faceMatch ? "default" : "destructive"}>
                          {verificationResult.faceMatch ? "Match" : "No Match"}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mic className="w-4 h-4" />
                        <span className="text-sm">Voice:</span>
                        <Badge variant={verificationResult.voiceMatch ? "default" : "destructive"}>
                          {verificationResult.voiceMatch ? "Match" : "No Match"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}

                {/* Fraud Analysis */}
                {fraudResult.reasons.length > 0 && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Security Analysis</h3>
                    <ul className="space-y-1">
                      {fraudResult.reasons.map((reason, index) => (
                        <li key={index} className="text-sm flex items-center space-x-2">
                          <AlertTriangle className="w-3 h-3 text-destructive" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={startNewTransaction} className="flex-1" size="lg">
                    New Transaction
                  </Button>
                  <Link href="/alerts" className="flex-1">
                    <Button variant="outline" className="w-full bg-transparent" size="lg">
                      View Security Log
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
