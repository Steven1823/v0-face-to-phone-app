"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  AlertTriangle,
  MapPin,
  Clock,
  CreditCard,
  Smartphone,
  Eye,
  Mic,
  Zap,
  Target,
  Activity,
} from "lucide-react"
import { offlineStorage } from "@/lib/offline-storage"

interface DemoScenario {
  id: string
  name: string
  description: string
  type: "legitimate" | "fraud"
  severity: "low" | "medium" | "high" | "critical"
  icon: any
  color: string
}

const demoScenarios: DemoScenario[] = [
  {
    id: "legitimate-transfer",
    name: "Legitimate Transfer",
    description: "Normal transaction with proper biometric verification",
    type: "legitimate",
    severity: "low",
    icon: CreditCard,
    color: "text-accent",
  },
  {
    id: "wrong-face",
    name: "Wrong Face Attack",
    description: "Attempt to use different person's face for authentication",
    type: "fraud",
    severity: "high",
    icon: Eye,
    color: "text-destructive",
  },
  {
    id: "voice-spoofing",
    name: "Voice Spoofing",
    description: "Recorded voice playback attempt to bypass voice recognition",
    type: "fraud",
    severity: "high",
    icon: Mic,
    color: "text-destructive",
  },
  {
    id: "unusual-time",
    name: "Unusual Time Transfer",
    description: "Large transfer at 3 AM triggering time-based fraud detection",
    type: "fraud",
    severity: "medium",
    icon: Clock,
    color: "text-secondary",
  },
  {
    id: "rapid-transactions",
    name: "Rapid Fire Transactions",
    description: "Multiple transactions in quick succession indicating bot activity",
    type: "fraud",
    severity: "critical",
    icon: Zap,
    color: "text-destructive",
  },
  {
    id: "device-change",
    name: "New Device Attack",
    description: "Transaction from unrecognized device with different fingerprint",
    type: "fraud",
    severity: "medium",
    icon: Smartphone,
    color: "text-secondary",
  },
]

export default function DemoPage() {
  const [activeScenario, setActiveScenario] = useState<DemoScenario | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [demoResults, setDemoResults] = useState<any>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    const userId = localStorage.getItem("currentUserId")
    setCurrentUserId(userId)
  }, [])

  const runDemoScenario = async (scenario: DemoScenario) => {
    setActiveScenario(scenario)
    setIsRunning(true)
    setDemoResults(null)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockResults = {
      scenario: scenario.name,
      timestamp: new Date().toISOString(),
      fraudScore: scenario.type === "fraud" ? Math.floor(Math.random() * 40) + 60 : Math.floor(Math.random() * 30) + 10,
      biometricMatch: scenario.type === "legitimate" ? 0.95 : 0.23,
      deviceFingerprint: "ABC123XYZ789",
      location: { lat: 37.7749, lng: -122.4194, city: "San Francisco, CA" },
      fraudReasons:
        scenario.type === "fraud"
          ? [
              scenario.id === "wrong-face"
                ? "Biometric mismatch detected"
                : scenario.id === "voice-spoofing"
                  ? "Voice pattern anomaly"
                  : scenario.id === "unusual-time"
                    ? "Transaction outside normal hours"
                    : scenario.id === "rapid-transactions"
                      ? "Rapid transaction pattern"
                      : scenario.id === "device-change"
                        ? "Unrecognized device fingerprint"
                        : "Suspicious activity detected",
            ]
          : [],
      blocked: scenario.type === "fraud",
      alertLevel: scenario.severity,
    }

    // Store demo result in offline storage if user is logged in
    if (currentUserId) {
      try {
        await offlineStorage.initialize()

        await offlineStorage.storeTransaction({
          userId: currentUserId,
          recipient: "Demo Recipient",
          amount: 1000,
          currency: "USD",
          status: scenario.type === "fraud" ? "blocked" : "completed",
          fraudScore: mockResults.fraudScore,
          fraudReasons: mockResults.fraudReasons,
          biometricVerified: scenario.type === "legitimate",
          deviceFingerprint: mockResults.deviceFingerprint,
          location: mockResults.location,
        })

        await offlineStorage.logSecurityEvent({
          userId: currentUserId,
          type: scenario.type === "fraud" ? "fraud_attempt" : "transaction",
          severity: scenario.severity,
          description: `Demo scenario: ${scenario.name}`,
          metadata: mockResults,
        })
      } catch (error) {
        console.error("Failed to store demo results:", error)
      }
    }

    setDemoResults(mockResults)
    setIsRunning(false)
  }

  const resetDemo = () => {
    setActiveScenario(null)
    setDemoResults(null)
    setIsRunning(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-4">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Hackathon Demo Center</span>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4">Face-to-Phone Demo Scenarios</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Interactive demonstrations of biometric authentication and fraud detection capabilities
          </p>
        </div>

        <Tabs defaultValue="scenarios" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="scenarios">Demo Scenarios</TabsTrigger>
            <TabsTrigger value="results">Live Results</TabsTrigger>
          </TabsList>

          <TabsContent value="scenarios" className="space-y-6">
            {/* Scenario Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {demoScenarios.map((scenario) => {
                const IconComponent = scenario.icon
                return (
                  <Card
                    key={scenario.id}
                    className={`glass cursor-pointer transition-all duration-300 hover:scale-105 ${
                      scenario.type === "fraud"
                        ? "border-destructive/20 hover:glow-red"
                        : "border-accent/20 hover:glow-green"
                    } ${activeScenario?.id === scenario.id ? "ring-2 ring-primary" : ""}`}
                    onClick={() => !isRunning && runDemoScenario(scenario)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            scenario.type === "fraud" ? "bg-destructive/10" : "bg-accent/10"
                          }`}
                        >
                          <IconComponent className={`w-6 h-6 ${scenario.color}`} />
                        </div>
                        <Badge
                          variant={scenario.type === "fraud" ? "destructive" : "default"}
                          className={
                            scenario.type === "fraud"
                              ? "bg-destructive/20 text-destructive"
                              : "bg-accent/20 text-accent"
                          }
                        >
                          {scenario.type}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{scenario.name}</CardTitle>
                      <CardDescription>{scenario.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge
                          variant="outline"
                          className={`${
                            scenario.severity === "critical"
                              ? "border-destructive text-destructive"
                              : scenario.severity === "high"
                                ? "border-destructive/70 text-destructive/70"
                                : scenario.severity === "medium"
                                  ? "border-secondary text-secondary"
                                  : "border-accent text-accent"
                          }`}
                        >
                          {scenario.severity} risk
                        </Badge>
                        <Button size="sm" disabled={isRunning} className="bg-gradient-to-r from-primary to-secondary">
                          {isRunning && activeScenario?.id === scenario.id ? "Running..." : "Run Demo"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Demo Controls */}
            <Card className="glass max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-primary" />
                  <span>Demo Controls</span>
                </CardTitle>
                <CardDescription>Control the demonstration and view offline capabilities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Button onClick={resetDemo} variant="outline" className="glass bg-transparent">
                    Reset Demo
                  </Button>
                  <Button
                    onClick={() => {
                      // Simulate airplane mode
                      alert("Demo: Airplane mode activated. All features continue to work offline!")
                    }}
                    variant="outline"
                    className="glass"
                  >
                    Test Offline Mode
                  </Button>
                  <Badge variant="outline" className="glass border-accent/30 text-accent px-3 py-1">
                    {navigator.onLine ? "Online" : "Offline"} Mode
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {demoResults ? (
              <div className="space-y-6">
                {/* Results Header */}
                <Card
                  className={`glass ${demoResults.blocked ? "border-destructive/20 glow-red" : "border-accent/20 glow-green"}`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        {demoResults.blocked ? (
                          <AlertTriangle className="w-6 h-6 text-destructive" />
                        ) : (
                          <Shield className="w-6 h-6 text-accent" />
                        )}
                        <span>{demoResults.blocked ? "Transaction Blocked" : "Transaction Approved"}</span>
                      </CardTitle>
                      <Badge
                        variant={demoResults.blocked ? "destructive" : "default"}
                        className={`${demoResults.blocked ? "bg-destructive/20 text-destructive pulse-glow" : "bg-accent/20 text-accent"} text-lg px-4 py-2`}
                      >
                        Fraud Score: {demoResults.fraudScore}%
                      </Badge>
                    </div>
                    <CardDescription>Demo Scenario: {demoResults.scenario}</CardDescription>
                  </CardHeader>
                </Card>

                {/* Detailed Results */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Eye className="w-5 h-5 text-secondary" />
                        <span>Biometric Analysis</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>Face Match Confidence:</span>
                        <Badge
                          variant="outline"
                          className={demoResults.biometricMatch > 0.8 ? "text-accent" : "text-destructive"}
                        >
                          {(demoResults.biometricMatch * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Liveness Detection:</span>
                        <Badge
                          variant="outline"
                          className={demoResults.biometricMatch > 0.8 ? "text-accent" : "text-destructive"}
                        >
                          {demoResults.biometricMatch > 0.8 ? "Passed" : "Failed"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Voice Pattern:</span>
                        <Badge
                          variant="outline"
                          className={demoResults.biometricMatch > 0.8 ? "text-accent" : "text-destructive"}
                        >
                          {demoResults.biometricMatch > 0.8 ? "Verified" : "Anomaly"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        <span>Location & Device</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>Location:</span>
                        <span className="text-sm">{demoResults.location.city}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Device ID:</span>
                        <span className="text-sm font-mono">{demoResults.deviceFingerprint}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Timestamp:</span>
                        <span className="text-sm">{new Date(demoResults.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Fraud Reasons */}
                {demoResults.fraudReasons.length > 0 && (
                  <Card className="glass border-destructive/20">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-destructive">
                        <AlertTriangle className="w-5 h-5" />
                        <span>Fraud Detection Alerts</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {demoResults.fraudReasons.map((reason: string, index: number) => (
                          <div key={index} className="flex items-center space-x-2 p-2 bg-destructive/10 rounded-lg">
                            <AlertTriangle className="w-4 h-4 text-destructive" />
                            <span className="text-destructive">{reason}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* GPS Simulation */}
                {demoResults.blocked && (
                  <Card className="glass border-destructive/20 pulse-glow">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-destructive">
                        <MapPin className="w-5 h-5" />
                        <span>Fraudster Location Detected</span>
                      </CardTitle>
                      <CardDescription>Simulated GPS tracking of suspicious activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-destructive/10 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Coordinates:</span>
                          <span className="font-mono text-sm">
                            {demoResults.location.lat}, {demoResults.location.lng}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Estimated Location:</span>
                          <span className="text-sm">{demoResults.location.city}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ) : (
              <Card className="glass text-center py-12">
                <CardContent>
                  <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">No Demo Results Yet</h3>
                  <p className="text-muted-foreground">Run a demo scenario to see detailed fraud detection results</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
