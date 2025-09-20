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
}

export function AnalyticsCharts({ timeSeriesData, timeRange, chartType = "overview" }: AnalyticsChartsProps) {
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

  if (chartType === "transactions") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Transaction Volume</CardTitle>
            <CardDescription>Total transactions processed over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="transactions" stroke="#164e63" fill="#164e63" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Fraud Detection</CardTitle>
            <CardDescription>Approved vs blocked transactions</CardDescription>
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
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center space-x-4 mt-4">
              {pieData.map((entry) => (
                <div key={entry.name} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-sm">
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
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Risk Score Trends</CardTitle>
            <CardDescription>Average risk score over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="riskScorePercent" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Security Alerts</CardTitle>
            <CardDescription>Alert volume over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="alerts" fill="#dc2626" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Default overview charts
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Transaction Activity</CardTitle>
          <CardDescription>Transaction volume and blocked attempts</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="transactions" stroke="#164e63" strokeWidth={2} name="Total" />
              <Line type="monotone" dataKey="blocked" stroke="#dc2626" strokeWidth={2} name="Blocked" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Risk Assessment</CardTitle>
          <CardDescription>Average risk score and security alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="riskScorePercent"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.3}
                name="Risk Score %"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
