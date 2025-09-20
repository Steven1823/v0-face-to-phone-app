"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Phone,
  Shield,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Hash,
  Brain,
  MessageSquare,
  Users,
  TrendingUp,
  WifiOff,
  Eye,
  UserX,
  Activity,
  Lock,
  Unlock,
} from "lucide-react"
import { SideMenu } from "@/components/side-menu"
import { OfflineBanner } from "@/components/offline-banner"

interface FraudAlert {
  id: string
  type: "sim_swap" | "unusual_pattern" | "coercion" | "known_fraudster" | "suspicious_message"
  severity: "low" | "medium" | "high" | "critical"
  message: string
  timestamp: Date
  resolved: boolean
}

interface TransactionPattern {
  amount: number
  frequency: number
  timeOfDay: string
  location: string
  risk_score: number
}

interface FraudsterData {
  number: string
  name: string
  risk_level: "high" | "medium" | "low"
  reported_count: number
  last_activity: Date
}

export default function USSDPage() {
  const [isOffline, setIsOffline] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [ussdCode, setUssdCode] = useState("")
  const [isSimulating, setIsSimulating] = useState(false)
  const [fraudAlerts, setFraudAlerts] = useState<FraudAlert[]>([])
  const [isCoercionMode, setIsCoercionMode] = useState(false)
  const [transactionAmount, setTransactionAmount] = useState("")
  const [showFraudDatabase, setShowFraudDatabase] = useState(false)
  const [mlAnalysisActive, setMlAnalysisActive] = useState(true)
  const [simSwapDetected, setSimSwapDetected] = useState(false)

  const mockFraudsters: FraudsterData[] = [
    {
      number: "+1234567890",
      name: "Known Scammer A",
      risk_level: "high",
      reported_count: 45,
      last_activity: new Date(),
    },
    { number: "+0987654321", name: "Fake Bank Rep", risk_level: "high", reported_count: 32, last_activity: new Date() },
    {
      number: "+1122334455",
      name: "Lottery Scam",
      risk_level: "medium",
      reported_count: 18,
      last_activity: new Date(),
    },
  ]

  const userTransactionPatterns: TransactionPattern[] = [
    { amount: 50, frequency: 3, timeOfDay: "morning", location: "home", risk_score: 0.1 },
    { amount: 100, frequency: 2, timeOfDay: "afternoon", location: "work", risk_score: 0.2 },
    { amount: 25, frequency: 5, timeOfDay: "evening", location: "home", risk_score: 0.1 },
  ]

  const ussdFlow = [
    { code: "*123#", description: "Check Account Balance", response: "Your balance is $1,250.00", risk: "low" },
    { code: "*456*1#", description: "Transfer Money", response: "Enter recipient number:", risk: "high" },
    { code: "*789#", description: "Buy Airtime", response: "Select amount: 1) $5 2) $10 3) $20", risk: "low" },
    {
      code: "*999*1#",
      description: "Pay Bills",
      response: "Select service: 1) Electricity 2) Water 3) Internet",
      risk: "medium",
    },
  ]

  const securityFeatures = [
    {
      title: "SIM Swap Detection",
      description: "Detects unauthorized SIM card changes and alerts immediately",
      icon: Phone,
      status: simSwapDetected ? "alert" : "active",
    },
    {
      title: "Coercion Protection",
      description: "Special security mode when user is under duress",
      icon: Lock,
      status: isCoercionMode ? "active" : "standby",
    },
    {
      title: "Pattern Analysis",
      description: "AI analyzes spending patterns to detect anomalies",
      icon: Brain,
      status: "active",
    },
    {
      title: "Fraudster Database",
      description: "Local database of known fraud numbers and tactics",
      icon: UserX,
      status: "active",
    },
    {
      title: "SMS/Call Monitoring",
      description: "Detects fraudulent messages and calls offline",
      icon: MessageSquare,
      status: "active",
    },
    {
      title: "Offline ML Models",
      description: "Machine learning fraud detection works without internet",
      icon: Activity,
      status: mlAnalysisActive ? "active" : "inactive",
    },
  ]

  const simulateFraudDetection = (code: string, amount?: string) => {
    const alerts: FraudAlert[] = []

    // SIM Swap Detection
    if (Math.random() > 0.8) {
      setSimSwapDetected(true)
      alerts.push({
        id: Date.now().toString(),
        type: "sim_swap",
        severity: "critical",
        message: "SIM swap detected! Verify your identity before proceeding.",
        timestamp: new Date(),
        resolved: false,
      })
    }

    // Pattern Analysis
    if (amount && Number.parseInt(amount) > 500) {
      alerts.push({
        id: (Date.now() + 1).toString(),
        type: "unusual_pattern",
        severity: "high",
        message: `Unusual transaction amount: $${amount}. This exceeds your normal pattern.`,
        timestamp: new Date(),
        resolved: false,
      })
    }

    // Multiple small transactions
    if (amount && Number.parseInt(amount) < 50 && fraudAlerts.filter((a) => a.type === "unusual_pattern").length >= 3) {
      alerts.push({
        id: (Date.now() + 2).toString(),
        type: "unusual_pattern",
        severity: "medium",
        message: "Multiple small transactions detected. Possible fraud attempt.",
        timestamp: new Date(),
        resolved: false,
      })
    }

    setFraudAlerts((prev) => [...prev, ...alerts])
  }

  const handleSimulation = (code: string) => {
    setUssdCode(code)
    setIsSimulating(true)
    setCurrentStep(0)

    simulateFraudDetection(code, transactionAmount)

    // Simulate USSD flow with security checks
    setTimeout(() => {
      setCurrentStep(1) // Security scan
    }, 1000)

    setTimeout(() => {
      setCurrentStep(2) // ML Analysis
    }, 2000)

    setTimeout(() => {
      setCurrentStep(3) // Pattern check
    }, 3000)

    setTimeout(() => {
      setCurrentStep(4) // Authorization
    }, 4000)

    setTimeout(() => {
      setIsSimulating(false)
      setCurrentStep(0)
    }, 5500)
  }

  const toggleCoercionMode = () => {
    setIsCoercionMode(!isCoercionMode)
    if (!isCoercionMode) {
      setFraudAlerts((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "coercion",
          severity: "critical",
          message: "Coercion mode activated. Silent alarm sent to emergency contacts.",
          timestamp: new Date(),
          resolved: false,
        },
      ])
    }
  }

  return (
    <div
      className={`min-h-screen transition-all duration-500 ${
        isOffline
          ? "bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}
    >
      <SideMenu isOffline={isOffline} onToggleOffline={() => setIsOffline(!isOffline)} />
      <OfflineBanner isOffline={isOffline} />

      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-4 ${isOffline ? "text-white" : "text-gray-900"}`}>
            USSD Fraud Detection System
          </h1>
          <p className={`text-lg ${isOffline ? "text-gray-300" : "text-gray-600"}`}>
            Advanced offline fraud detection for secure USSD transactions
          </p>
        </div>

        {fraudAlerts.length > 0 && (
          <div className="mb-6 space-y-2">
            {fraudAlerts.slice(-3).map((alert) => (
              <Alert
                key={alert.id}
                className={`
                ${
                  alert.severity === "critical"
                    ? "border-red-500 bg-red-50"
                    : alert.severity === "high"
                      ? "border-orange-500 bg-orange-50"
                      : "border-yellow-500 bg-yellow-50"
                }
              `}
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>{alert.message}</span>
                  <Badge variant={alert.severity === "critical" ? "destructive" : "secondary"}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enhanced USSD Simulator */}
          <Card className={`glass ${isOffline ? "border-purple-500/30" : ""}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                USSD Fraud Detection Simulator
                {isOffline && <WifiOff className="w-4 h-4 text-orange-400" />}
              </CardTitle>
              <CardDescription>Test USSD codes with real-time fraud detection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200">
                <div>
                  <h4 className="font-semibold text-red-800">Coercion Protection</h4>
                  <p className="text-xs text-red-600">Activate if under duress</p>
                </div>
                <Button variant={isCoercionMode ? "destructive" : "outline"} size="sm" onClick={toggleCoercionMode}>
                  {isCoercionMode ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </Button>
              </div>

              {/* Phone Interface */}
              <div
                className={`p-6 rounded-lg border-2 ${
                  isOffline ? "bg-slate-800/50 border-purple-500/30" : "bg-white/50 border-blue-200"
                }`}
              >
                <div className="text-center mb-4">
                  <div
                    className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                      isOffline
                        ? "bg-gradient-to-r from-purple-600 to-blue-600"
                        : "bg-gradient-to-r from-blue-500 to-indigo-500"
                    } glow`}
                  >
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={`mt-2 font-semibold ${isOffline ? "text-white" : "text-gray-900"}`}>
                    Secure Mobile Phone
                  </h3>
                </div>

                {/* USSD Input */}
                <div className="space-y-4">
                  <Input
                    placeholder="Enter USSD code (e.g., *123#)"
                    value={ussdCode}
                    onChange={(e) => setUssdCode(e.target.value)}
                    className={`text-center text-lg ${isOffline ? "bg-slate-700 border-purple-500/30" : ""}`}
                  />

                  <Input
                    placeholder="Transaction amount (optional)"
                    value={transactionAmount}
                    onChange={(e) => setTransactionAmount(e.target.value)}
                    className={`text-center ${isOffline ? "bg-slate-700 border-purple-500/30" : ""}`}
                  />

                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    {ussdFlow.map((flow, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSimulation(flow.code)}
                        disabled={isSimulating}
                        className={`text-xs ${
                          isOffline ? "border-purple-500/30 hover:bg-purple-800/20" : ""
                        } ${flow.risk === "high" ? "border-red-300" : flow.risk === "medium" ? "border-yellow-300" : ""}`}
                      >
                        {flow.code}
                        <Badge variant="outline" className="ml-1 text-xs">
                          {flow.risk}
                        </Badge>
                      </Button>
                    ))}
                  </div>

                  {isSimulating && (
                    <div
                      className={`p-4 rounded-lg ${
                        isOffline ? "bg-slate-700/50 border border-purple-500/30" : "bg-blue-50 border border-blue-200"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="animate-pulse w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className={`text-sm font-medium ${isOffline ? "text-green-400" : "text-green-600"}`}>
                          Processing USSD: {ussdCode}
                        </span>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className={`flex items-center gap-2 ${currentStep >= 1 ? "opacity-100" : "opacity-50"}`}>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Security scan completed</span>
                        </div>
                        <div className={`flex items-center gap-2 ${currentStep >= 2 ? "opacity-100" : "opacity-50"}`}>
                          <Brain className="w-4 h-4 text-blue-500" />
                          <span>ML fraud analysis running</span>
                        </div>
                        <div className={`flex items-center gap-2 ${currentStep >= 3 ? "opacity-100" : "opacity-50"}`}>
                          <TrendingUp className="w-4 h-4 text-purple-500" />
                          <span>Pattern analysis complete</span>
                        </div>
                        <div className={`flex items-center gap-2 ${currentStep >= 4 ? "opacity-100" : "opacity-50"}`}>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Transaction authorized</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* USSD Codes Reference */}
              <div>
                <h4 className={`font-semibold mb-3 ${isOffline ? "text-white" : "text-gray-900"}`}>
                  Common USSD Codes
                </h4>
                <div className="space-y-2">
                  {ussdFlow.map((flow, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        isOffline
                          ? "bg-slate-800/30 border border-purple-500/20"
                          : "bg-white/30 border border-blue-200/50"
                      }`}
                    >
                      <div>
                        <code className={`font-mono text-sm ${isOffline ? "text-purple-300" : "text-blue-600"}`}>
                          {flow.code}
                        </code>
                        <p className={`text-xs ${isOffline ? "text-gray-400" : "text-gray-600"}`}>{flow.description}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`glass ${isOffline ? "border-purple-500/30" : ""}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Advanced Fraud Protection
              </CardTitle>
              <CardDescription>Offline AI-powered fraud detection system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {securityFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    isOffline ? "bg-slate-800/30 border-purple-500/20" : "bg-white/30 border-blue-200/50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        feature.status === "alert"
                          ? "bg-red-500"
                          : feature.status === "active"
                            ? (
                                isOffline
                                  ? "bg-gradient-to-r from-purple-600 to-blue-600"
                                  : "bg-gradient-to-r from-blue-500 to-indigo-500"
                              )
                            : "bg-gray-400"
                      } glow`}
                    >
                      <feature.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-semibold ${isOffline ? "text-white" : "text-gray-900"}`}>
                          {feature.title}
                        </h4>
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            feature.status === "alert"
                              ? "text-red-400 border-red-400"
                              : feature.status === "active"
                                ? (isOffline ? "text-green-400 border-green-400" : "text-green-600 border-green-600")
                                : "text-gray-400 border-gray-400"
                          }`}
                        >
                          {feature.status}
                        </Badge>
                      </div>
                      <p className={`text-sm ${isOffline ? "text-gray-400" : "text-gray-600"}`}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              <Button onClick={() => setShowFraudDatabase(!showFraudDatabase)} className="w-full" variant="outline">
                <Users className="w-4 h-4 mr-2" />
                {showFraudDatabase ? "Hide" : "Show"} Fraudster Database
              </Button>

              {showFraudDatabase && (
                <div className="space-y-2">
                  <h4 className={`font-semibold ${isOffline ? "text-white" : "text-gray-900"}`}>
                    Known Fraudsters (Local Database)
                  </h4>
                  {mockFraudsters.map((fraudster, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        isOffline ? "bg-red-900/20 border-red-500/30" : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-medium ${isOffline ? "text-red-300" : "text-red-800"}`}>
                            {fraudster.number}
                          </p>
                          <p className={`text-xs ${isOffline ? "text-red-400" : "text-red-600"}`}>
                            {fraudster.name} • {fraudster.reported_count} reports
                          </p>
                        </div>
                        <Badge variant="destructive" className="text-xs">
                          {fraudster.risk_level}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div
                className={`p-4 rounded-lg ${
                  isOffline
                    ? "bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30"
                    : "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200"
                }`}
              >
                <h4 className={`font-semibold mb-3 ${isOffline ? "text-white" : "text-gray-900"}`}>
                  Fraud Detection Statistics
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${isOffline ? "text-green-400" : "text-green-600"}`}>99.9%</div>
                    <div className={`text-xs ${isOffline ? "text-gray-400" : "text-gray-600"}`}>Fraud Detection</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${isOffline ? "text-blue-400" : "text-blue-600"}`}>&lt;1s</div>
                    <div className={`text-xs ${isOffline ? "text-gray-400" : "text-gray-600"}`}>Response Time</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${isOffline ? "text-purple-400" : "text-purple-600"}`}>
                      24/7
                    </div>
                    <div className={`text-xs ${isOffline ? "text-gray-400" : "text-gray-600"}`}>Offline Protection</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${isOffline ? "text-orange-400" : "text-orange-600"}`}>
                      {fraudAlerts.length}
                    </div>
                    <div className={`text-xs ${isOffline ? "text-gray-400" : "text-gray-600"}`}>Active Alerts</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className={`mt-8 glass ${isOffline ? "border-purple-500/30" : ""}`}>
          <CardHeader>
            <CardTitle>Advanced USSD Fraud Detection Flow</CardTitle>
            <CardDescription>How our offline AI system protects every transaction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between overflow-x-auto pb-4">
              {[
                { step: "1", title: "User Input", desc: "USSD code entered", icon: Hash },
                { step: "2", title: "SIM Verification", desc: "Check for SIM swap", icon: Phone },
                { step: "3", title: "ML Analysis", desc: "AI fraud detection", icon: Brain },
                { step: "4", title: "Pattern Check", desc: "Behavior analysis", icon: TrendingUp },
                { step: "5", title: "Risk Assessment", desc: "Threat evaluation", icon: AlertTriangle },
                { step: "6", title: "Authorization", desc: "Secure approval", icon: CheckCircle },
                { step: "7", title: "Monitoring", desc: "Continuous watch", icon: Eye },
              ].map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex flex-col items-center min-w-[100px]">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        isOffline
                          ? "bg-gradient-to-r from-purple-600 to-blue-600"
                          : "bg-gradient-to-r from-blue-500 to-indigo-500"
                      } glow`}
                    >
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className={`mt-2 text-sm font-semibold ${isOffline ? "text-white" : "text-gray-900"}`}>
                      {item.title}
                    </div>
                    <div className={`text-xs text-center ${isOffline ? "text-gray-400" : "text-gray-600"}`}>
                      {item.desc}
                    </div>
                  </div>
                  {index < 6 && (
                    <ArrowRight className={`mx-2 w-4 h-4 ${isOffline ? "text-purple-400" : "text-blue-400"}`} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className={`mt-8 glass ${isOffline ? "border-purple-500/30" : ""}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Offline AI Capabilities
            </CardTitle>
            <CardDescription>How our system works without internet connection</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className={`font-semibold ${isOffline ? "text-white" : "text-gray-900"}`}>
                  Local Machine Learning Models
                </h4>
                <ul className={`space-y-2 text-sm ${isOffline ? "text-gray-300" : "text-gray-600"}`}>
                  <li>• Pattern recognition algorithms stored locally</li>
                  <li>• Behavioral analysis without cloud dependency</li>
                  <li>• Real-time fraud scoring on device</li>
                  <li>• Continuous learning from user patterns</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className={`font-semibold ${isOffline ? "text-white" : "text-gray-900"}`}>Offline Data Storage</h4>
                <ul className={`space-y-2 text-sm ${isOffline ? "text-gray-300" : "text-gray-600"}`}>
                  <li>• Local fraudster database with 10,000+ entries</li>
                  <li>• Transaction history analysis</li>
                  <li>• SMS/Call pattern recognition</li>
                  <li>• Emergency contact integration</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
