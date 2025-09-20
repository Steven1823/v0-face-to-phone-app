"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface TimeSeriesData {
  timestamp: Date
  transactions: number
  blocked: number
  riskScore: number
  alerts: number
}

interface AnalyticsChartsProps {
  timeSeriesData: TimeSeriesData[]
  timeRange: "24h" | "7d" | "30d"
  chartType?: "overview" | "transactions" | "security"
  isOffline?: boolean
}

export function AnalyticsCharts({
  timeSeriesData,
  timeRange,
  chartType = "overview",
  isOffline = false,
}: AnalyticsChartsProps) {
  const formatXAxis = (timestamp: Date) => {
    if (timeRange === "24h") {
      return timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (timeRange === "7d") {
      return timestamp.toLocaleDateString([], { month: "short", day: "numeric" })
    } else {
      return timestamp.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  const chartData = timeSeriesData.map((point) => ({
    ...point,
    time: formatXAxis(point.timestamp),
    riskScorePercent: point.riskScore * 100,
  }))

  // Calculate pie chart data for fraud distribution
  const totalTransactions = timeSeriesData.reduce((sum, point) => sum + point.transactions, 0)
  const totalBlocked = timeSeriesData.reduce((sum, point) => sum + point.blocked, 0)
  const totalApproved = totalTransactions - totalBlocked

  const pieData = [
    { name: "Approved", value: totalApproved, color: "#22c55e" },
    { name: "Blocked", value: totalBlocked, color: "#ef4444" },
  ]

  const cardClassName = `${isOffline ? "bg-purple-900/30 border-purple-500/30" : "bg-white/10 border-white/20"} backdrop-blur-sm chart-animate`

  if (chartType === "transactions") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className={cardClassName}>
          <CardHeader>
            <CardTitle className="text-lg text-white">Transaction Volume</CardTitle>
            <CardDescription className="text-white/70">Total transactions processed over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isOffline ? "rgba(139, 92, 246, 0.9)" : "rgba(255,255,255,0.9)",
                    border: "none",
                    borderRadius: "8px",
                    color: isOffline ? "white" : "black",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="transactions"
                  stroke="#3b82f6"
                  fill="url(#transactionGradient)"
                  fillOpacity={0.6}
                  strokeWidth={3}
                  className="chart-line-animate"
                />
                <defs>
                  <linearGradient id="transactionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className={cardClassName}>
          <CardHeader>
            <CardTitle className="text-lg text-white">Fraud Detection</CardTitle>
            <CardDescription className="text-white/70">Approved vs blocked transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  className="chart-animate"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isOffline ? "rgba(139, 92, 246, 0.9)" : "rgba(255,255,255,0.9)",
                    border: "none",
                    borderRadius: "8px",
                    color: isOffline ? "white" : "black",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              {pieData.map((entry) => (
                <div key={entry.name} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-sm text-white">
                    {entry.name}: {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (chartType === "security") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className={cardClassName}>
          <CardHeader>
            <CardTitle className="text-lg text-white">Risk Score Trends</CardTitle>
            <CardDescription className="text-white/70">Average risk score over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isOffline ? "rgba(139, 92, 246, 0.9)" : "rgba(255,255,255,0.9)",
                    border: "none",
                    borderRadius: "8px",
                    color: isOffline ? "white" : "black",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="riskScorePercent"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: "#f59e0b", strokeWidth: 2, fill: "#fff" }}
                  className="chart-line-animate"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className={cardClassName}>
          <CardHeader>
            <CardTitle className="text-lg text-white">Security Alerts</CardTitle>
            <CardDescription className="text-white/70">Alert volume over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.7)" />
                <YAxis stroke="rgba(255,255,255,0.7)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isOffline ? "rgba(139, 92, 246, 0.9)" : "rgba(255,255,255,0.9)",
                    border: "none",
                    borderRadius: "8px",
                    color: isOffline ? "white" : "black",
                  }}
                />
                <Bar dataKey="alerts" fill="url(#alertGradient)" radius={[4, 4, 0, 0]} className="chart-bar-animate" />
                <defs>
                  <linearGradient id="alertGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#dc2626" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className={cardClassName}>
        <CardHeader>
          <CardTitle className="text-lg text-white">Transaction Activity</CardTitle>
          <CardDescription className="text-white/70">Transaction volume and blocked attempts</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.7)" />
              <YAxis stroke="rgba(255,255,255,0.7)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: isOffline ? "rgba(139, 92, 246, 0.9)" : "rgba(255,255,255,0.9)",
                  border: "none",
                  borderRadius: "8px",
                  color: isOffline ? "white" : "black",
                }}
              />
              <Line
                type="monotone"
                dataKey="transactions"
                stroke="#22c55e"
                strokeWidth={3}
                name="Total"
                dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#22c55e", strokeWidth: 2, fill: "#fff" }}
                className="chart-line-animate"
              />
              <Line
                type="monotone"
                dataKey="blocked"
                stroke="#dc2626"
                strokeWidth={3}
                name="Blocked"
                dot={{ fill: "#dc2626", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#dc2626", strokeWidth: 2, fill: "#fff" }}
                className="chart-line-animate"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className={cardClassName}>
        <CardHeader>
          <CardTitle className="text-lg text-white">Risk Assessment</CardTitle>
          <CardDescription className="text-white/70">Average risk score and security alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.7)" />
              <YAxis stroke="rgba(255,255,255,0.7)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: isOffline ? "rgba(139, 92, 246, 0.9)" : "rgba(255,255,255,0.9)",
                  border: "none",
                  borderRadius: "8px",
                  color: isOffline ? "white" : "black",
                }}
              />
              <Area
                type="monotone"
                dataKey="riskScorePercent"
                stroke="#f59e0b"
                fill="url(#riskGradient)"
                fillOpacity={0.6}
                strokeWidth={3}
                name="Risk Score %"
                className="chart-line-animate"
              />
              <defs>
                <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
