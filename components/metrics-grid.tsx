"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Shield, TrendingUp, TrendingDown, AlertTriangle, Eye, Clock } from "lucide-react"

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

interface MetricsGridProps {
  metrics: DashboardMetrics
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  const metricCards = [
    {
      title: "Total Transactions",
      value: metrics.totalTransactions.toLocaleString(),
      subtitle: `$${metrics.totalAmount.toLocaleString()} processed`,
      icon: DollarSign,
      trend: metrics.totalTransactions > 0 ? "up" : "neutral",
      color: "text-primary",
    },
    {
      title: "Fraud Blocked",
      value: metrics.blockedTransactions.toLocaleString(),
      subtitle: `$${metrics.fraudPrevented.toLocaleString()} prevented`,
      icon: Shield,
      trend: metrics.blockedTransactions > 0 ? "up" : "neutral",
      color: "text-destructive",
    },
    {
      title: "Success Rate",
      value: `${metrics.totalTransactions > 0 ? ((metrics.approvedTransactions / metrics.totalTransactions) * 100).toFixed(1) : "0.0"}%`,
      subtitle: `${metrics.approvedTransactions} approved`,
      icon: TrendingUp,
      trend: "up",
      color: "text-green-600",
    },
    {
      title: "Average Risk",
      value: `${(metrics.averageRiskScore * 100).toFixed(1)}%`,
      subtitle: "Transaction risk score",
      icon: AlertTriangle,
      trend: metrics.averageRiskScore > 0.5 ? "up" : "down",
      color: "text-secondary",
    },
    {
      title: "Biometric Auth",
      value: `${(metrics.biometricSuccessRate * 100).toFixed(1)}%`,
      subtitle: "Authentication success",
      icon: Eye,
      trend: "up",
      color: "text-primary",
    },
    {
      title: "Security Alerts",
      value: metrics.alertsGenerated.toLocaleString(),
      subtitle: `${metrics.criticalAlerts} critical`,
      icon: AlertTriangle,
      trend: metrics.criticalAlerts > 0 ? "up" : "neutral",
      color: "text-destructive",
    },
    {
      title: "System Uptime",
      value: `${metrics.systemUptime}%`,
      subtitle: "Service availability",
      icon: Clock,
      trend: "up",
      color: "text-green-600",
    },
    {
      title: "Response Time",
      value: "127ms",
      subtitle: "Average detection time",
      icon: TrendingUp,
      trend: "down",
      color: "text-primary",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards.map((metric, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
            <metric.icon className={`h-4 w-4 ${metric.color}`} />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">{metric.subtitle}</p>
              </div>
              <div className="flex items-center space-x-1">
                {metric.trend === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
                {metric.trend === "down" && <TrendingDown className="h-3 w-3 text-red-500" />}
                <Badge
                  variant={metric.trend === "up" ? "default" : metric.trend === "down" ? "secondary" : "outline"}
                  className="text-xs"
                >
                  {metric.trend === "up" ? "↑" : metric.trend === "down" ? "↓" : "—"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
