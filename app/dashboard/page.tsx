"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  BarChart3,
  Shield,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Clock,
  Eye,
  RefreshCw,
  Download,
  Filter,
} from "lucide-react"
import Link from "next/link"
import { TransactionStorage } from "@/lib/transaction-storage"
import { FraudDetection } from "@/lib/fraud-detection"
import { SecurityMonitoring } from "@/lib/security-monitoring"
import { AnalyticsCharts } from "@/components/analytics-charts"
import { MetricsGrid } from "@/components/metrics-grid"
import { ThreatIntelligence } from "@/components/threat-intelligence"

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

interface TimeSeriesData {
  timestamp: Date
  transactions: number
  blocked: number
  riskScore: number
  alerts: number
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([])
  const [activeTab, setActiveTab] = useState("overview")
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("24h")
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const loadDashboardData = useCallback(() => {
    setIsLoading(true)

    try {
      // Get transaction data
      const transactions = TransactionStorage.getTransactions()
      const transactionStats = TransactionStorage.getTransactionStats()

      // Get fraud logs
      const fraudLogs = FraudDetection.getFraudLogs()

      // Get security alerts
      const alerts = SecurityMonitoring.getAlerts()
      const alertStats = SecurityMonitoring.getAlertStats()

      // Calculate biometric success rate
      const biometricAttempts = transactions.filter((t) => t.biometricVerification)
      const biometricSuccesses = biometricAttempts.filter(
        (t) => t.biometricVerification.faceMatch && t.biometricVerification.voiceMatch,
      )
      const biometricSuccessRate =
        biometricAttempts.length > 0 ? biometricSuccesses.length / biometricAttempts.length : 1

      // Calculate fraud prevented amount
      const blockedTransactions = transactions.filter((t) => t.status === "blocked")
      const fraudPrevented = blockedTransactions.reduce((sum, t) => sum + t.amount, 0)

      // Build metrics
      const dashboardMetrics: DashboardMetrics = {
        totalTransactions: transactionStats.total,
        blockedTransactions: transactionStats.blocked,
        approvedTransactions: transactionStats.approved,
        totalAmount: transactionStats.totalAmount,
        averageRiskScore: transactionStats.averageFraudScore,
        biometricSuccessRate,
        alertsGenerated: alertStats.total,
        criticalAlerts: alertStats.critical + alertStats.high,
        fraudPrevented,
        systemUptime: 99.8, // Simulated uptime
      }

      setMetrics(dashboardMetrics)

      // Generate time series data
      const now = new Date()
      const timeSeriesPoints: TimeSeriesData[] = []

      const hoursBack = timeRange === "24h" ? 24 : timeRange === "7d" ? 168 : 720
      const intervalHours = timeRange === "24h" ? 1 : timeRange === "7d" ? 6 : 24

      for (let i = hoursBack; i >= 0; i -= intervalHours) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000)
        const periodStart = new Date(timestamp.getTime() - intervalHours * 60 * 60 * 1000)

        const periodTransactions = transactions.filter((t) => t.timestamp >= periodStart && t.timestamp <= timestamp)

        const periodAlerts = alerts.filter((a) => a.timestamp >= periodStart && a.timestamp <= timestamp)

        const avgRiskScore =
          periodTransactions.length > 0
            ? periodTransactions.reduce((sum, t) => sum + t.fraudScore, 0) / periodTransactions.length
            : 0

        timeSeriesPoints.push({
          timestamp,
          transactions: periodTransactions.length,
          blocked: periodTransactions.filter((t) => t.status === "blocked").length,
          riskScore: avgRiskScore,
          alerts: periodAlerts.length,
        })
      }

      setTimeSeriesData(timeSeriesPoints)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("[Dashboard] Failed to load data:", error)
    } finally {
      setIsLoading(false)
    }
  }, [timeRange])

  useEffect(() => {
    loadDashboardData()
    const interval = setInterval(loadDashboardData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [loadDashboardData])

  const exportData = useCallback(() => {
    const data = {
      metrics,
      timeSeriesData,
      transactions: TransactionStorage.getTransactions(),
      fraudLogs: FraudDetection.getFraudLogs(),
      alerts: SecurityMonitoring.getAlerts(),
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `face-to-phone-analytics-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [metrics, timeSeriesData])

  if (isLoading && !metrics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-card flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics dashboard...</p>
        </div>
      </div>
    )
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
                <h1 className="text-xl font-bold text-foreground">Analytics Dashboard</h1>
                <p className="text-sm text-muted-foreground">Security insights and fraud detection analytics</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={exportData}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" onClick={loadDashboardData} disabled={isLoading}>
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Badge variant="secondary" className="flex items-center space-x-1">
                <BarChart3 className="w-3 h-3" />
                <span>Live</span>
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Time Range Selector */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Time Range:</span>
            </div>
            <div className="flex space-x-2">
              {[
                { key: "24h", label: "24 Hours" },
                { key: "7d", label: "7 Days" },
                { key: "30d", label: "30 Days" },
              ].map((range) => (
                <Button
                  key={range.key}
                  variant={timeRange === range.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeRange(range.key as any)}
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {metrics && (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Key Metrics Grid */}
                <MetricsGrid metrics={metrics} />

                {/* Charts */}
                <AnalyticsCharts timeSeriesData={timeSeriesData} timeRange={timeRange} />

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                        <span>Recent Threats</span>
                      </CardTitle>
                      <CardDescription>Latest security events and blocked transactions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {SecurityMonitoring.getAlerts()
                          .slice(0, 5)
                          .map((alert) => (
                            <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
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
                                  <p className="text-sm font-medium">{alert.title}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {alert.timestamp.toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                              <Badge
                                variant={
                                  alert.severity === "critical" || alert.severity === "high"
                                    ? "destructive"
                                    : "secondary"
                                }
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
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <span>System Health</span>
                      </CardTitle>
                      <CardDescription>Real-time system performance metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">System Uptime</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-mono">{metrics.systemUptime}%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Biometric Success Rate</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-mono">
                              {(metrics.biometricSuccessRate * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Fraud Detection Rate</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-mono">
                              {metrics.totalTransactions > 0
                                ? ((metrics.blockedTransactions / metrics.totalTransactions) * 100).toFixed(1)
                                : "0.0"}
                              %
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Average Response Time</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-mono">127ms</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="transactions" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Transaction Volume</CardTitle>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{metrics.totalTransactions}</div>
                      <p className="text-xs text-muted-foreground">
                        ${metrics.totalAmount.toLocaleString()} total value
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {metrics.totalTransactions > 0
                          ? ((metrics.approvedTransactions / metrics.totalTransactions) * 100).toFixed(1)
                          : "0.0"}
                        %
                      </div>
                      <p className="text-xs text-muted-foreground">{metrics.approvedTransactions} approved</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Risk Score</CardTitle>
                      <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{(metrics.averageRiskScore * 100).toFixed(1)}%</div>
                      <p className="text-xs text-muted-foreground">Average transaction risk</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Transaction Timeline Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Transaction Timeline</CardTitle>
                    <CardDescription>Transaction volume and fraud detection over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AnalyticsCharts timeSeriesData={timeSeriesData} timeRange={timeRange} chartType="transactions" />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{metrics.alertsGenerated}</div>
                      <p className="text-xs text-muted-foreground">{metrics.criticalAlerts} critical</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Fraud Prevented</CardTitle>
                      <Shield className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${metrics.fraudPrevented.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">{metrics.blockedTransactions} transactions</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Biometric Auth</CardTitle>
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{(metrics.biometricSuccessRate * 100).toFixed(1)}%</div>
                      <p className="text-xs text-muted-foreground">Success rate</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">127ms</div>
                      <p className="text-xs text-muted-foreground">Average detection</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Security Events Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Security Events</CardTitle>
                    <CardDescription>Real-time security monitoring and threat detection</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AnalyticsCharts timeSeriesData={timeSeriesData} timeRange={timeRange} chartType="security" />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="intelligence" className="space-y-6">
                <ThreatIntelligence />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  )
}
