"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Menu, Search, Flag, Shield, AlertTriangle, CheckCircle, XCircle, Eye, Filter } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { SideMenu } from "@/components/side-menu"
import { OfflineBanner } from "@/components/offline-banner"

interface Transaction {
  id: string
  amount: number
  recipient: string
  timestamp: Date
  status: "pending" | "approved" | "flagged" | "blocked"
  riskScore: number
  method: string
  location: string
  suspicious: boolean
}

export default function TransactionsPage() {
  const [isOffline, setIsOffline] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<"all" | "flagged" | "suspicious">("all")
  const [showMockData, setShowMockData] = useState(false)

  useEffect(() => {
    const offlineMode = localStorage.getItem("offlineMode") === "true"
    setIsOffline(offlineMode)

    // Generate mock transactions
    const mockTransactions: Transaction[] = [
      {
        id: "TXN001",
        amount: 15000,
        recipient: "John Doe",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        status: "flagged",
        riskScore: 85,
        method: "Mobile Money",
        location: "Nairobi, Kenya",
        suspicious: true,
      },
      {
        id: "TXN002",
        amount: 5000,
        recipient: "Mary Smith",
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        status: "approved",
        riskScore: 15,
        method: "Bank Transfer",
        location: "Lagos, Nigeria",
        suspicious: false,
      },
      {
        id: "TXN003",
        amount: 25000,
        recipient: "Unknown User",
        timestamp: new Date(Date.now() - 1000 * 60 * 90),
        status: "blocked",
        riskScore: 95,
        method: "Mobile Money",
        location: "Unknown Location",
        suspicious: true,
      },
    ]

    setTransactions(mockTransactions)
  }, [])

  const toggleOfflineMode = () => {
    const newOfflineMode = !isOffline
    setIsOffline(newOfflineMode)
    localStorage.setItem("offlineMode", newOfflineMode.toString())
  }

  const flagTransaction = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "flagged" as const, suspicious: true } : t)),
    )
  }

  const approveTransaction = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "approved" as const, suspicious: false } : t)),
    )
  }

  const blockTransaction = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "blocked" as const, suspicious: true } : t)),
    )
  }

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "flagged" && t.status === "flagged") ||
      (filterStatus === "suspicious" && t.suspicious)
    return matchesSearch && matchesFilter
  })

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
                <h1 className="text-xl font-bold flex items-center space-x-2 text-white">
                  <Shield className="w-5 h-5 text-blue-400" />
                  <span>Transaction Review</span>
                </h1>
                <p className="text-sm text-white/80">Monitor and review banking transactions for security</p>
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
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Search and Filter Controls */}
          <Card
            className={`${isOffline ? "bg-purple-900/30 border-purple-500/30" : "bg-white/10 border-white/20"} backdrop-blur-sm`}
          >
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
                    <Input
                      placeholder="Search transactions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-4 h-4 text-white/70" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white"
                  >
                    <option value="all">All Transactions</option>
                    <option value="flagged">Flagged Only</option>
                    <option value="suspicious">Suspicious Only</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions List */}
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <Card
                key={transaction.id}
                className={`${isOffline ? "bg-purple-900/30 border-purple-500/30" : "bg-white/10 border-white/20"} backdrop-blur-sm`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          transaction.status === "approved"
                            ? "bg-green-500"
                            : transaction.status === "flagged"
                              ? "bg-yellow-500"
                              : transaction.status === "blocked"
                                ? "bg-red-500"
                                : "bg-blue-500"
                        }`}
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-white">{transaction.id}</span>
                          <Badge
                            variant={
                              transaction.status === "approved"
                                ? "default"
                                : transaction.status === "flagged"
                                  ? "secondary"
                                  : transaction.status === "blocked"
                                    ? "destructive"
                                    : "outline"
                            }
                          >
                            {transaction.status}
                          </Badge>
                          {transaction.suspicious && (
                            <Badge variant="destructive" className="bg-red-500/20 text-red-300">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Suspicious
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-white/70 mt-1">
                          KES {transaction.amount.toLocaleString()} to {transaction.recipient}
                        </div>
                        <div className="text-xs text-white/50 mt-1">
                          {transaction.method} • {transaction.location} • {transaction.timestamp.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm text-white/70">Risk Score</div>
                        <div
                          className={`text-lg font-bold ${
                            transaction.riskScore >= 80
                              ? "text-red-400"
                              : transaction.riskScore >= 50
                                ? "text-yellow-400"
                                : "text-green-400"
                          }`}
                        >
                          {transaction.riskScore}%
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => flagTransaction(transaction.id)}
                          className="text-yellow-400 border-yellow-400 hover:bg-yellow-400/20"
                        >
                          <Flag className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => approveTransaction(transaction.id)}
                          className="text-green-400 border-green-400 hover:bg-green-400/20"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => blockTransaction(transaction.id)}
                          className="text-red-400 border-red-400 hover:bg-red-400/20"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {showMockData && (
            <Card
              className={`${isOffline ? "bg-purple-900/30 border-purple-500/30" : "bg-white/10 border-white/20"} backdrop-blur-sm`}
            >
              <CardHeader>
                <CardTitle className="text-white">Mock Data Information</CardTitle>
                <CardDescription className="text-white/70">
                  This is sample data showing how the transaction review system works with real banking data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">67%</div>
                    <div className="text-sm text-white/70">Approved Transactions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">23%</div>
                    <div className="text-sm text-white/70">Flagged for Review</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">10%</div>
                    <div className="text-sm text-white/70">Blocked Transactions</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
