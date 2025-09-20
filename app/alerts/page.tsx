"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  ArrowLeft,
  Shield,
  Clock,
  DollarSign,
  User,
  Eye,
  TrendingUp,
  Filter,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"
import { FraudDetection } from "@/lib/fraud-detection"

interface FraudLog {
  id: string
  transaction: {
    amount: number
    recipient: string
    timestamp: Date
    userVerified: boolean
  }
  riskScore: number
  reasons: string[]
  riskLevel: "low" | "medium" | "high"
  isBlocked: boolean
  timestamp: Date
}

interface SecurityEvent {
  id: string
  type: "biometric_failure" | "fraud_detected" | "suspicious_activity" | "system_alert"
  severity: "low" | "medium" | "high" | "critical"
  message: string
  details: string
  timestamp: Date
  resolved: boolean
}

export default function AlertsPage() {
  const [fraudLogs, setFraudLogs] = useState<FraudLog[]>([])
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [activeTab, setActiveTab] = useState("alerts")
  const [filterLevel, setFilterLevel] = useState<"all" | "high" | "medium" | "low">("all")
  const [isLoading, setIsLoading] = useState(true)

  const loadData = useCallback(() => {
    setIsLoading(true)

    // Load fraud logs
    const logs = FraudDetection.getFraudLogs()
    setFraudLogs(logs)

    // Generate security events from fraud logs and transactions
    const events: SecurityEvent[] = []

    logs.forEach((log) => {
      if (log.isBlocked) {
        events.push({
          id: `fraud-${log.id}`,
          type: "fraud_detected",
          severity: log.riskLevel === "high" ? "critical" : log.riskLevel === "medium" ? "high" : "medium",
          message: `Fraudulent transaction blocked - $${log.transaction.amount.toFixed(2)}`,
          details: log.reasons.join("; "),
          timestamp: log.timestamp,
          resolved: true,
        })
      }

      if (log.reasons.some((r) => r.includes("Biometric verification failed"))) {
        events.push({
          id: `biometric-${log.id}`,
          type: "biometric_failure",
          severity: "critical",
          message: "Biometric authentication failure detected",
          details: "Potential impostor attempt - face or voice verification failed",
          timestamp: log.timestamp,
          resolved: true,
        })
      }

      if (log.reasons.some((r) => r.includes("SIM swap"))) {
        events.push({
          id: `sim-${log.id}`,
          type: "suspicious_activity",
          severity: "high",
          message: "Potential SIM swap attack detected",
          details: "Device fingerprint mismatch indicates possible SIM swap",
          timestamp: log.timestamp,
          resolved: false,
        })
      }
    })

    // Add some system alerts for demo
    const now = new Date()
    events.push({
      id: "system-1",
      type: "system_alert",
      severity: "low",
      message: "Fraud detection engine updated",
      details: "New ML model deployed with improved accuracy",
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 hours ago
      resolved: true,
    })

    // Sort events by timestamp (newest first)
    events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    setSecurityEvents(events)

    setIsLoading(false)
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const getFilteredLogs = () => {
    if (filterLevel === "all") return fraudLogs
    return fraudLogs.filter((log) => log.riskLevel === filterLevel)
  }

  const getFilteredEvents = () => {
    if (filterLevel === "all") return securityEvents
    const severityMap = { high: ["critical", "high"], medium: ["high", "medium"], low: ["medium", "low"] }
    return securityEvents.filter((event) =>
      filterLevel === "high"
        ? severityMap.high.includes(event.severity)
        : filterLevel === "medium"
          ? severityMap.medium.includes(event.severity)
          : severityMap.low.includes(event.severity),
    )
  }

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "high":
      case "critical":
        return "destructive"
      case "medium":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "biometric_failure":
        return <Eye className="w-4 h-4" />
      case "fraud_detected":
        return <AlertTriangle className="w-4 h-4" />
      case "suspicious_activity":
        return <Shield className="w-4 h-4" />
      case "system_alert":
        return <TrendingUp className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return "Just now"
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
                <h1 className="text-xl font-bold text-foreground">Security Alerts</h1>
                <p className="text-sm text-muted-foreground">Fraud detection and security monitoring</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={loadData} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Shield className="w-3 h-3" />
                <span>Live Monitoring</span>
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{securityEvents.length}</div>
                <p className="text-xs text-muted-foreground">
                  {securityEvents.filter((e) => !e.resolved).length} unresolved
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blocked Transactions</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{fraudLogs.filter((l) => l.isBlocked).length}</div>
                <p className="text-xs text-muted-foreground">Fraud prevented</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Risk Events</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {securityEvents.filter((e) => e.severity === "critical" || e.severity === "high").length}
                </div>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Risk Score</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {fraudLogs.length > 0
                    ? ((fraudLogs.reduce((sum, log) => sum + log.riskScore, 0) / fraudLogs.length) * 100).toFixed(1)
                    : "0.0"}
                  %
                </div>
                <p className="text-xs text-muted-foreground">Transaction risk</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter by severity:</span>
            </div>
            <div className="flex space-x-2">
              {["all", "high", "medium", "low"].map((level) => (
                <Button
                  key={level}
                  variant={filterLevel === level ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterLevel(level as any)}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="alerts">Security Events</TabsTrigger>
              <TabsTrigger value="fraud">Fraud Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="alerts" className="space-y-4">
              {getFilteredEvents().length === 0 ? (
                <Card>
                  <CardContent className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Security Events</h3>
                      <p className="text-muted-foreground">All systems are secure and functioning normally.</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                getFilteredEvents().map((event) => (
                  <Card key={event.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`p-2 rounded-full ${
                              event.severity === "critical"
                                ? "bg-red-100 text-red-600"
                                : event.severity === "high"
                                  ? "bg-orange-100 text-orange-600"
                                  : event.severity === "medium"
                                    ? "bg-yellow-100 text-yellow-600"
                                    : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {getEventIcon(event.type)}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{event.message}</CardTitle>
                            <CardDescription className="flex items-center space-x-4 mt-1">
                              <span className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{formatTimeAgo(event.timestamp)}</span>
                              </span>
                              <Badge variant={getRiskLevelColor(event.severity) as any}>{event.severity}</Badge>
                              {event.resolved && (
                                <Badge variant="outline" className="text-green-600 border-green-200">
                                  Resolved
                                </Badge>
                              )}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{event.details}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="fraud" className="space-y-4">
              {getFilteredLogs().length === 0 ? (
                <Card>
                  <CardContent className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No Fraud Analysis Data</h3>
                      <p className="text-muted-foreground">
                        Complete some transactions to see fraud detection results.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                getFilteredLogs().map((log) => (
                  <Card key={log.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg flex items-center space-x-2">
                            <span>Transaction Analysis</span>
                            <Badge variant={log.isBlocked ? "destructive" : "default"}>
                              {log.isBlocked ? "BLOCKED" : "APPROVED"}
                            </Badge>
                          </CardTitle>
                          <CardDescription className="flex items-center space-x-4 mt-1">
                            <span className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatTimeAgo(log.timestamp)}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <DollarSign className="w-3 h-3" />
                              <span>${log.transaction.amount.toFixed(2)}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <User className="w-3 h-3" />
                              <span>{log.transaction.recipient}</span>
                            </span>
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">{(log.riskScore * 100).toFixed(1)}%</div>
                          <Badge variant={getRiskLevelColor(log.riskLevel) as any}>{log.riskLevel} risk</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {log.reasons.length > 0 && (
                        <div>
                          <h4 className="font-semibold mb-2">Risk Factors:</h4>
                          <ul className="space-y-1">
                            {log.reasons.map((reason, index) => (
                              <li key={index} className="text-sm flex items-start space-x-2">
                                <AlertTriangle className="w-3 h-3 text-destructive mt-0.5 flex-shrink-0" />
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
