"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Users,
  Shield,
  BarChart3,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react"
import { useRouter } from "next/navigation"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

export default function BusinessDashboard() {
  const router = useRouter()
  const [userRole, setUserRole] = useState<"owner" | "staff">("owner")
  const [revenueData] = useState([
    { month: "Jan", revenue: 45000, transactions: 120 },
    { month: "Feb", revenue: 52000, transactions: 145 },
    { month: "Mar", revenue: 48000, transactions: 132 },
    { month: "Apr", revenue: 61000, transactions: 167 },
    { month: "May", revenue: 55000, transactions: 154 },
    { month: "Jun", revenue: 67000, transactions: 189 },
  ])

  const [riskData] = useState([
    { name: "Low Risk", value: 75, color: "#228b22" },
    { name: "Medium Risk", value: 20, color: "#d4af37" },
    { name: "High Risk", value: 5, color: "#dc2626" },
  ])

  const [flaggedTransactions] = useState([
    {
      id: "TXN-001",
      amount: 25000,
      customer: "John Doe",
      riskScore: 8.5,
      status: "pending",
      reason: "High amount + unusual time",
    },
    {
      id: "TXN-002",
      amount: 15000,
      customer: "Jane Smith",
      riskScore: 7.2,
      status: "approved",
      reason: "Biometric mismatch resolved",
    },
    {
      id: "TXN-003",
      amount: 50000,
      customer: "Mike Johnson",
      riskScore: 9.1,
      status: "blocked",
      reason: "Multiple fraud indicators",
    },
  ])

  return (
    <div className="min-h-screen animated-bg p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.back()} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Business Dashboard</h1>
              <p className="text-muted-foreground">Real-time fraud monitoring & analytics</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge
              variant="outline"
              className={`glass ${userRole === "owner" ? "border-primary/30 text-primary" : "border-secondary/30 text-secondary"}`}
            >
              {userRole === "owner" ? "Owner" : "Staff"}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setUserRole(userRole === "owner" ? "staff" : "owner")}
              className="glass"
            >
              Switch Role
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="glass glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">KSh 328,000</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline w-3 h-3 mr-1" />
                +12.5% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="glass glow-green">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Safe Transactions</CardTitle>
              <Shield className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">1,247</div>
              <p className="text-xs text-muted-foreground">95.2% success rate</p>
            </CardContent>
          </Card>

          <Card className="glass glow-red">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Flagged Transactions</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">63</div>
              <p className="text-xs text-muted-foreground">4.8% of total transactions</p>
            </CardContent>
          </Card>

          <Card className="glass glow-blue">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">2,847</div>
              <p className="text-xs text-muted-foreground">+8.2% new users this month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="glass">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Flagged Transactions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            {userRole === "owner" && <TabsTrigger value="staff">Staff Management</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    <span>Revenue Trend</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(212, 175, 55, 0.1)" />
                      <XAxis dataKey="month" stroke="rgba(212, 175, 55, 0.5)" />
                      <YAxis stroke="rgba(212, 175, 55, 0.5)" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                          border: "1px solid rgba(212, 175, 55, 0.3)",
                          borderRadius: "8px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#d4af37"
                        strokeWidth={3}
                        dot={{ fill: "#d4af37", strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Risk Distribution */}
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-secondary" />
                    <span>Risk Distribution</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={riskData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {riskData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center space-x-4 mt-4">
                    {riskData.map((entry, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                        <span className="text-sm text-muted-foreground">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <span>Flagged Transactions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {flaggedTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg glass"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            transaction.status === "approved"
                              ? "bg-secondary"
                              : transaction.status === "blocked"
                                ? "bg-destructive"
                                : "bg-primary"
                          }`}
                        ></div>
                        <div>
                          <p className="font-medium">{transaction.id}</p>
                          <p className="text-sm text-muted-foreground">{transaction.customer}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">KSh {transaction.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Risk: {transaction.riskScore}/10</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {transaction.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="glass border-secondary/30 text-secondary bg-transparent"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="glass border-destructive/30 text-destructive bg-transparent"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Block
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="outline" className="glass bg-transparent">
                          <Eye className="w-4 h-4 mr-1" />
                          Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-lg">Fraud Prevention</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-secondary mb-2">KSh 2.4M</div>
                  <p className="text-sm text-muted-foreground">Prevented losses this month</p>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-lg">Detection Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">97.8%</div>
                  <p className="text-sm text-muted-foreground">AI accuracy rate</p>
                </CardContent>
              </Card>

              <Card className="glass">
                <CardHeader>
                  <CardTitle className="text-lg">Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-accent mb-2">1.2s</div>
                  <p className="text-sm text-muted-foreground">Average detection time</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {userRole === "owner" && (
            <TabsContent value="staff" className="space-y-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-accent" />
                    <span>Staff Management</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Alice Johnson", role: "Senior Analyst", status: "online", transactions: 45 },
                      { name: "Bob Smith", role: "Fraud Specialist", status: "offline", transactions: 32 },
                      { name: "Carol Davis", role: "Risk Manager", status: "online", transactions: 28 },
                    ].map((staff, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-border rounded-lg glass"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`w-3 h-3 rounded-full ${staff.status === "online" ? "bg-secondary" : "bg-muted"}`}
                          ></div>
                          <div>
                            <p className="font-medium">{staff.name}</p>
                            <p className="text-sm text-muted-foreground">{staff.role}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{staff.transactions} transactions</p>
                          <p className="text-sm text-muted-foreground">Today</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  )
}
