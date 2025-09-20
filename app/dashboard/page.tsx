"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Shield,
  TrendingUp,
  AlertTriangle,
  Clock,
  Eye,
  RefreshCw,
  Download,
  Bot,
  Zap,
  Database,
  Menu,
} from "lucide-react"
import { SecurityMonitoring } from "@/lib/security-monitoring"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { ThreatIntelligence } from "@/components/threat-intelligence"
import { EnhancedChatbot } from "@/components/enhanced-chatbot"
import { AIHeadcard } from "@/components/ai-headcard"
import { SideMenu } from "@/components/side-menu"
import { OfflineBanner } from "@/components/offline-banner"
import { eventLogger } from "@/lib/event-logger"

interface DashboardMetrics {
  totalTransactions: number
  blockedTransactions: number
  approvedTransactions: number
  totalAmount: number
  averageRiskScore: number
  biometricSuccessRate: number
  alertsGenerated: number
  criticalAlerts: number
  fraudPrevented: number
  systemUptime: number
}

interface SecurityMetrics {
  totalAlerts: number
  criticalAlerts: number
  resolvedAlerts: number
  averageResponseTime: number
  biometricSuccessRate: number
  fraudAttempts: number
  systemUptime: number
  securityScore: number
}

interface TimeSeriesData {
  timestamp: Date
  transactions: number
  blocked: number
  riskScore: number
  alerts: number
  threats: number
  securityScore: number
  biometricAttempts: number
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<SecurityMetrics | null>(null)
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("24h")
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [showAIAlert, setShowAIAlert] = useState(false)
  const [aiAlertType, setAIAlertType] = useState<"suspicious" | "fraud" | "safe" | "call">("safe")
  const [isOffline, setIsOffline] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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

  const loadDashboardData = useCallback(() => {
    setIsLoading(true)

    try {
      eventLogger.logEvent("system", "low", {
        action: "dashboard_accessed",
        tab: activeTab,
        timeRange,
        offline: isOffline,
      })

      const alerts = SecurityMonitoring.getAlerts()
      const alertStats = SecurityMonitoring.getAlertStats()

      // Simulate biometric attempts for demo
      const biometricAttempts = 150
      const biometricSuccesses = 142
      const biometricSuccessRate = biometricSuccesses / biometricAttempts

      const securityMetrics: SecurityMetrics = {
        totalAlerts: alertStats.total,
        criticalAlerts: alertStats.critical + alertStats.high,
        resolvedAlerts: alertStats.resolved || 0,
        averageResponseTime: 127, // ms
        biometricSuccessRate,
        fraudAttempts: alertStats.critical,
        systemUptime: 99.8,
        securityScore: 94.5, // Overall security score
      }

      setMetrics(securityMetrics)

      if (securityMetrics.criticalAlerts > 0) {
        setTimeout(() => {
          setAIAlertType("suspicious")
          setShowAIAlert(true)
        }, 3000)
      }

      const now = new Date()
      const timeSeriesPoints: TimeSeriesData[] = []

      const hoursBack = timeRange === "24h" ? 24 : timeRange === "7d" ? 168 : 720
      const intervalHours = timeRange === "24h" ? 1 : timeRange === "7d" ? 6 : 24

      for (let i = hoursBack; i >= 0; i -= intervalHours) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
        const periodStart = new Date(timestamp.getTime() - intervalHours * 60 * 60 * 1000)

        const periodAlerts = alerts.filter((a) => a.timestamp >= periodStart && a.timestamp <= timestamp)

        timeSeriesPoints.push({
          timestamp,
          alerts: periodAlerts.length,
          threats: periodAlerts.filter((a) => a.severity === "critical" || a.severity === "high").length,
          securityScore: Math.random() * 10 + 90, // Simulated security score
          biometricAttempts: Math.floor(Math.random() * 20) + 5,
          transactions: 0, // Placeholder for transactions
          blocked: 0, // Placeholder for blocked transactions
          riskScore: 0, // Placeholder for risk score
        })
      }

      setTimeSeriesData(timeSeriesPoints)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("[Dashboard] Failed to load data:", error)
      eventLogger.logEvent("system", "high", {
        error: "dashboard_load_failed",
        message: error instanceof Error ? error.message : "Unknown error",
        offline: isOffline,
      })
    } finally {
      setIsLoading(false)
    }
  }, [timeRange, activeTab, isOffline])

  const exportData = useCallback(async () => {
    try {
      const blob = await eventLogger.exportToPDF()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `face-to-phone-security-report-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      eventLogger.logEvent("system", "low", {
        action: "data_exported",
        format: "json",
        timestamp: new Date().toISOString(),
        offline: isOffline,
      })
    } catch (error) {
      console.error("Export failed:", error)
    }
  }, [isOffline])

  useEffect(() => {
    loadDashboardData()
    const interval = setInterval(loadDashboardData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [loadDashboardData])

  if (isLoading && !metrics) {
    return (
      <div className="min-h-screen animated-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isOffline ? "offline-animated-bg" : "animated-bg"}`}>
      <OfflineBanner isOffline={isOffline} />
      <SideMenu
        isOffline={isOffline}
        onToggleOffline={toggleOfflineMode}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
      />
      <EnhancedChatbot />

      <AIHeadcard
        isVisible={showAIAlert}
        onClose={() => setShowAIAlert(false)}
        userName="Security Monitor"
        alertType={aiAlertType}
        message="Security monitoring active. No transaction processing - we only protect your banking activities."
      />

      <header
        className={`border-b backdrop-blur-sm ${isOffline ? "bg-black/20 border-purple-500/30" : "bg-white/10 border-white/20"}`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(true)}
                className={`${isOffline ? "text-white hover:bg-purple-500/20" : "text-white hover:bg-white/20"} glass`}
              >
                <Menu className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold flex items-center space-x-2 text-white">
                  <Bot className="w-5 h-5 text-yellow-400" />
                  <span>Security Monitor Dashboard</span>
                </h1>
                <p className="text-sm text-white/80">Banking security insights and fraud prevention analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-white/80">Offline Mode</span>
                <Switch
                  checked={isOffline}
                  onCheckedChange={toggleOfflineMode}
                  className="data-[state=checked]:bg-purple-500"
                />
              </div>
              {isOffline && (
                <Badge variant="outline" className="text-purple-300 border-purple-400 bg-purple-500/20">
                  <Database className="w-3 h-3 mr-1" />
                  Local Storage Active
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={exportData}
                className="glass bg-transparent text-white border-white/30 hover:bg-white/20"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={loadDashboardData}
                disabled={isLoading}
                className="glass bg-transparent text-white border-white/30 hover:bg-white/20"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Badge
                variant="secondary"
                className="flex items-center space-x-1 glass chatbot-pulse bg-yellow-500/20 text-yellow-300"
              >
                <Zap className="w-3 h-3" />
                <span>AI Powered</span>
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {metrics && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList
                className={`grid w-full grid-cols-3 ${isOffline ? "bg-purple-900/50 border-purple-500/30" : "bg-white/10 border-white/20"}`}
              >
                <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/20">
                  Security Overview
                </TabsTrigger>
                <TabsTrigger value="monitoring" className="text-white data-[state=active]:bg-white/20">
                  Live Monitoring
                </TabsTrigger>
                <TabsTrigger value="intelligence" className="text-white data-[state=active]:bg-white/20">
                  Threat Intelligence
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card
                    className={`${isOffline ? "bg-purple-900/30 border-purple-500/30" : "bg-white/10 border-white/20"} backdrop-blur-sm chart-animate`}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-white">Security Alerts</CardTitle>
                      <AlertTriangle className="h-4 w-4 text-red-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">{metrics.totalAlerts}</div>
                      <p className="text-xs text-white/70">{metrics.criticalAlerts} critical</p>
                    </CardContent>
                  </Card>

                  <Card
                    className={`${isOffline ? "bg-purple-900/30 border-purple-500/30" : "bg-white/10 border-white/20"} backdrop-blur-sm chart-animate`}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-white">Security Score</CardTitle>
                      <Shield className="h-4 w-4 text-green-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">{metrics.securityScore}%</div>
                      <p className="text-xs text-white/70">Overall protection level</p>
                    </CardContent>
                  </Card>

                  <Card
                    className={`${isOffline ? "bg-purple-900/30 border-purple-500/30" : "bg-white/10 border-white/20"} backdrop-blur-sm chart-animate`}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-white">Biometric Auth</CardTitle>
                      <Eye className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">
                        {(metrics.biometricSuccessRate * 100).toFixed(1)}%
                      </div>
                      <p className="text-xs text-white/70">Success rate</p>
                    </CardContent>
                  </Card>

                  <Card
                    className={`${isOffline ? "bg-purple-900/30 border-purple-500/30" : "bg-white/10 border-white/20"} backdrop-blur-sm chart-animate`}
                  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-white">Response Time</CardTitle>
                      <Clock className="h-4 w-4 text-yellow-400" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-white">{metrics.averageResponseTime}ms</div>
                      <p className="text-xs text-white/70">Average detection</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="chart-animate">
                  <AnalyticsCharts timeSeriesData={timeSeriesData} timeRange={timeRange} isOffline={isOffline} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-white">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                        <span>Recent Threats</span>
                      </CardTitle>
                      <CardDescription className="text-white/70">
                        Latest security events and blocked transactions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {SecurityMonitoring.getAlerts()
                          .slice(0, 5)
                          .map((alert) => (
                            <div
                              key={alert.id}
                              className="flex items-center justify-between p-3 border border-white/20 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    alert.severity === "critical"
                                      ? "bg-red-500"
                                      : alert.severity === "high"
                                        ? "bg-orange-500"
                                        : alert.severity === "medium"
                                          ? "bg-yellow-500"
                                          : "bg-blue-500"
                                  }`}
                                />
                                <div>
                                  <p className="text-sm font-medium text-white">{alert.title}</p>
                                  <p className="text-xs text-white/70">{alert.timestamp.toLocaleTimeString()}</p>
                                </div>
                              </div>
                              <Badge
                                variant={
                                  alert.severity === "critical" || alert.severity === "high"
                                    ? "destructive"
                                    : "secondary"
                                }
                                className="bg-white/20 text-white"
                              >
                                {alert.severity}
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-white">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <span>System Health</span>
                      </CardTitle>
                      <CardDescription className="text-white/70">Real-time system performance metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white">System Uptime</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-mono text-white">{metrics.systemUptime}%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white">Biometric Success Rate</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-mono text-white">
                              {(metrics.biometricSuccessRate * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white">Fraud Detection Rate</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-mono text-white">
                              {metrics.totalAlerts > 0
                                ? ((metrics.criticalAlerts / metrics.totalAlerts) * 100).toFixed(1)
                                : "0.0"}
                              %
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white">Average Response Time</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-mono text-white">127ms</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="monitoring" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card
                    className={`${isOffline ? "bg-purple-900/30 border-purple-500/30" : "bg-white/10 border-white/20"} backdrop-blur-sm`}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-white">
                        <Eye className="w-5 h-5 text-blue-400" />
                        <span>Real-Time Monitoring</span>
                      </CardTitle>
                      <CardDescription className="text-white/70">Live transaction security monitoring</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border border-white/20 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-white">System Status</span>
                          </div>
                          <Badge className="bg-green-500/20 text-green-300">Online</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-white/20 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                            <span className="text-white">Biometric Scanner</span>
                          </div>
                          <Badge className="bg-blue-500/20 text-blue-300">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-white/20 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                            <span className="text-white">Fraud Detection</span>
                          </div>
                          <Badge className="bg-yellow-500/20 text-yellow-300">Monitoring</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className={`${isOffline ? "bg-purple-900/30 border-purple-500/30" : "bg-white/10 border-white/20"} backdrop-blur-sm`}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-white">
                        <TrendingUp className="w-5 h-5 text-green-400" />
                        <span>Live Activity Feed</span>
                      </CardTitle>
                      <CardDescription className="text-white/70">Recent security events</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 p-2 border-l-2 border-green-500">
                          <div className="text-xs text-white/70">12:34 PM</div>
                          <div className="text-sm text-white">Biometric authentication successful</div>
                        </div>
                        <div className="flex items-center space-x-3 p-2 border-l-2 border-blue-500">
                          <div className="text-xs text-white/70">12:32 PM</div>
                          <div className="text-sm text-white">Transaction security check passed</div>
                        </div>
                        <div className="flex items-center space-x-3 p-2 border-l-2 border-yellow-500">
                          <div className="text-xs text-white/70">12:30 PM</div>
                          <div className="text-sm text-white">Unusual pattern detected - monitoring</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="intelligence" className="space-y-6">
                <ThreatIntelligence isOffline={isOffline} />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  )
}
