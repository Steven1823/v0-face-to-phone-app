"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Menu, TrendingUp, AlertTriangle, Shield, Clock, CheckCircle, XCircle, Eye, BarChart3 } from "lucide-react"
import { SideMenu } from "@/components/side-menu"
import { OfflineBanner } from "@/components/offline-banner"

export default function BusinessDashboard() {
  const [userRole] = useState<"owner" | "staff">("owner") // Simulate role
  const [isOffline, setIsOffline] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showMockData, setShowMockData] = useState(false)

  useEffect(() => {
    const offlineMode = localStorage.getItem("offlineMode") === "true"
    setIsOffline(offlineMode)
  }, [])

  const toggleOfflineMode = () => {
    const newOfflineMode = !isOffline
    setIsOffline(newOfflineMode)
    localStorage.setItem("offlineMode", newOfflineMode.toString())
  }

  const revenueData = {
    today: 45620,
    week: 312450,
    month: 1245600,
    growth: 12.5,
  }

  const flaggedTransactions = [
    { id: "TXN001", amount: 50000, customer: "John Doe", risk: "High", reason: "Amount anomaly" },
    { id: "TXN002", amount: 25000, customer: "Jane Smith", risk: "Medium", reason: "New device" },
    { id: "TXN003", amount: 75000, customer: "Bob Wilson", risk: "High", reason: "Velocity check failed" },
  ]

  const pendingApprovals = [
    { id: "APP001", type: "Large Transfer", amount: 100000, customer: "Alice Brown", time: "5 min ago" },
    { id: "APP002", type: "Account Unlock", customer: "Mike Johnson", time: "12 min ago" },
    { id: "APP003", type: "Limit Increase", amount: 200000, customer: "Sarah Davis", time: "1 hour ago" },
  ]

  return (
    <div className={`min-h-screen ${isOffline ? "offline-animated-bg" : "animated-bg"}`}>
      <OfflineBanner isOffline={isOffline} />
      <SideMenu
        isOffline={isOffline}
        onToggleOffline={toggleOfflineMode}
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
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
                <h1 className="text-xl font-bold text-white">Business Dashboard</h1>
                <p className="text-sm text-white/80">
                  {userRole === "owner" ? "Owner View" : "Staff View"} • Real-time Analytics
                </p>
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMockData(!showMockData)}
                className="glass bg-transparent text-white border-white/30 hover:bg-white/20"
              >
                <Eye className="w-4 h-4 mr-2" />
                {showMockData ? "Hide" : "Show"} Mock Data
              </Button>
              <Badge variant="outline" className="text-yellow-300 border-yellow-400 bg-yellow-500/20">
                <Shield className="w-3 h-3 mr-1" />
                {userRole === "owner" ? "Full Access" : "Limited Access"}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {showMockData && (
            <div className="w-80 space-y-4">
              <Card
                className={`${isOffline ? "bg-purple-900/30 border-purple-500/30" : "bg-white/10 border-white/20"} backdrop-blur-sm`}
              >
                <CardHeader>
                  <CardTitle className="text-white">Mock Data Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">KES 2.4M</div>
                    <div className="text-sm text-white/70">Monthly Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">1,247</div>
                    <div className="text-sm text-white/70">Transactions Monitored</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">23</div>
                    <div className="text-sm text-white/70">Threats Blocked</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">98.7%</div>
                    <div className="text-sm text-white/70">Security Score</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex-1">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList
                className={`${isOffline ? "bg-purple-900/50 border-purple-500/30" : "bg-white/10 border-white/20"} backdrop-blur-sm`}
              >
                <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/20">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="transactions" className="text-white data-[state=active]:bg-white/20">
                  Transactions
                </TabsTrigger>
                <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-white/20">
                  Analytics
                </TabsTrigger>
                {userRole === "owner" && (
                  <TabsTrigger value="staff" className="text-white data-[state=active]:bg-white/20">
                    Staff
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card
                    className={`${isOffline ? "bg-purple-900/30 border-purple-500/30" : "bg-white/10 border-white/20"} backdrop-blur-sm chart-animate`}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-white/80">Today's Revenue</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-400">KSH {revenueData.today.toLocaleString()}</div>
                      <div className="flex items-center text-sm text-green-300 mt-1">
                        <TrendingUp className="w-3 h-3 mr-1" />+{revenueData.growth}%
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className={`${isOffline ? "bg-purple-900/30 border-purple-500/30" : "bg-white/10 border-white/20"} backdrop-blur-sm chart-animate`}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-white/80">This Week</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-blue-400">KSH {revenueData.week.toLocaleString()}</div>
                      <div className="text-sm text-white/70 mt-1">7 days</div>
                    </CardContent>
                  </Card>

                  <Card
                    className={`${isOffline ? "bg-purple-900/30 border-purple-500/30" : "bg-white/10 border-white/20"} backdrop-blur-sm chart-animate`}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-white/80">This Month</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-yellow-400">KSH {revenueData.month.toLocaleString()}</div>
                      <div className="text-sm text-white/70 mt-1">30 days</div>
                    </CardContent>
                  </Card>

                  <Card
                    className={`${isOffline ? "bg-purple-900/30 border-purple-500/30" : "bg-white/10 border-white/20"} backdrop-blur-sm chart-animate`}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm text-white/80">Flagged Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-400">{flaggedTransactions.length}</div>
                      <div className="text-sm text-white/70 mt-1">Requires attention</div>
                    </CardContent>
                  </Card>
                </div>

                <Card
                  className={`${isOffline ? "bg-purple-900/30 border-purple-500/30" : "bg-white/10 border-white/20"} backdrop-blur-sm`}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-white">
                      <AlertTriangle className="w-5 h-5 text-red-400" />
                      <span>Flagged Transactions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {flaggedTransactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-3 border border-white/20 rounded-lg backdrop-blur-sm"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                              <AlertTriangle className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                              <div className="font-medium text-white">{transaction.customer}</div>
                              <div className="text-sm text-white/70">
                                {transaction.id} • KSH {transaction.amount.toLocaleString()}
                              </div>
                              <div className="text-xs text-red-400">{transaction.reason}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="destructive" className="text-xs bg-red-500/20 text-red-300">
                              {transaction.risk} Risk
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              className="glass bg-transparent text-white border-white/30 hover:bg-white/20"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Review
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {userRole === "owner" && (
                  <Card
                    className={`${isOffline ? "bg-purple-900/30 border-purple-500/30" : "bg-white/10 border-white/20"} backdrop-blur-sm`}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-white">
                        <Clock className="w-5 h-5 text-blue-400" />
                        <span>Pending Approvals</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {pendingApprovals.map((approval) => (
                          <div
                            key={approval.id}
                            className="flex items-center justify-between p-3 border border-white/20 rounded-lg backdrop-blur-sm"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                                <Clock className="w-5 h-5 text-blue-400" />
                              </div>
                              <div>
                                <div className="font-medium text-white">{approval.type}</div>
                                <div className="text-sm text-white/70">
                                  {approval.customer} • {approval.time}
                                </div>
                                {approval.amount && (
                                  <div className="text-xs text-blue-400">KSH {approval.amount.toLocaleString()}</div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="glass border-green-500/30 text-green-400 bg-transparent hover:bg-green-500/20"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="glass border-red-500/30 text-red-400 bg-transparent hover:bg-red-500/20"
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                Decline
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card
                    className={`${isOffline ? "bg-purple-900/30 border-purple-500/30" : "bg-white/10 border-white/20"} backdrop-blur-sm chart-animate`}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-white">
                        <BarChart3 className="w-5 h-5 text-green-400" />
                        <span>Risk Distribution</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white">Low Risk</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 h-2 bg-green-500/20 rounded-full">
                              <div className="w-20 h-2 bg-green-500 rounded-full chart-bar-animate"></div>
                            </div>
                            <span className="text-sm font-medium text-white">85%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white">Medium Risk</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 h-2 bg-yellow-500/20 rounded-full">
                              <div className="w-3 h-2 bg-yellow-500 rounded-full chart-bar-animate"></div>
                            </div>
                            <span className="text-sm font-medium text-white">12%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white">High Risk</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-24 h-2 bg-red-500/20 rounded-full">
                              <div className="w-1 h-2 bg-red-500 rounded-full chart-bar-animate"></div>
                            </div>
                            <span className="text-sm font-medium text-white">3%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card
                    className={`${isOffline ? "bg-purple-900/30 border-purple-500/30" : "bg-white/10 border-white/20"} backdrop-blur-sm chart-animate`}
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2 text-white">
                        <TrendingUp className="w-5 h-5 text-blue-400" />
                        <span>Transaction Sparkline</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-32 flex items-end space-x-1">
                        {Array.from({ length: 20 }, (_, i) => (
                          <div
                            key={i}
                            className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-t flex-1 chart-bar-animate"
                            style={{
                              height: `${Math.random() * 100}%`,
                              animationDelay: `${i * 0.1}s`,
                            }}
                          />
                        ))}
                      </div>
                      <div className="text-sm text-white/70 mt-2">Last 20 transactions</div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
