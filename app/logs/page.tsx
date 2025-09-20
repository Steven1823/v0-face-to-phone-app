"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BottomNav } from "@/components/bottom-nav"
import { eventLogger } from "@/lib/event-logger"
import { Download, Filter, Search, Shield, AlertTriangle, Clock, User, Bot } from "lucide-react"

interface LogEvent {
  id: string
  timestamp: Date
  type: "login" | "fraud_alert" | "ai_action" | "chatbot_message" | "transaction" | "biometric" | "system"
  severity: "low" | "medium" | "high" | "critical"
  userId?: string
  details: Record<string, any>
  encrypted: boolean
}

export default function LogsPage() {
  const [events, setEvents] = useState<LogEvent[]>([])
  const [filteredEvents, setFilteredEvents] = useState<LogEvent[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadEvents()
  }, [])

  useEffect(() => {
    filterEvents()
  }, [events, searchTerm, typeFilter, severityFilter])

  const loadEvents = async () => {
    try {
      const allEvents = await eventLogger.getEvents()
      setEvents(allEvents)
    } catch (error) {
      console.error("Failed to load events:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filterEvents = () => {
    let filtered = [...events]

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (event.userId && event.userId.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((event) => event.type === typeFilter)
    }

    if (severityFilter !== "all") {
      filtered = filtered.filter((event) => event.severity === severityFilter)
    }

    setFilteredEvents(filtered)
  }

  const exportLogs = async () => {
    try {
      const blob = await eventLogger.exportToPDF()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `face-to-phone-security-logs-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      await eventLogger.logEvent("system", "low", {
        action: "logs_exported",
        format: "json",
        eventCount: filteredEvents.length,
      })
    } catch (error) {
      console.error("Export failed:", error)
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case "login":
        return User
      case "fraud_alert":
        return AlertTriangle
      case "ai_action":
        return Bot
      case "chatbot_message":
        return Bot
      case "transaction":
        return Shield
      case "biometric":
        return Shield
      case "system":
        return Clock
      default:
        return Clock
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "high":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "low":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen animated-bg flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading security logs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen animated-bg pb-20">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center space-x-2">
              <Shield className="w-6 h-6 text-primary" />
              <span>Security Event Logs</span>
            </h1>
            <p className="text-muted-foreground">Comprehensive audit trail and security monitoring</p>
          </div>
          <Button onClick={exportLogs} className="glass bg-gradient-to-r from-primary to-secondary">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
        </div>

        {/* Filters */}
        <Card className="glass mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="fraud_alert">Fraud Alert</SelectItem>
                  <SelectItem value="ai_action">AI Action</SelectItem>
                  <SelectItem value="chatbot_message">Chatbot</SelectItem>
                  <SelectItem value="transaction">Transaction</SelectItem>
                  <SelectItem value="biometric">Biometric</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Event Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="glass">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{events.length}</div>
              <div className="text-sm text-muted-foreground">Total Events</div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-500">
                {events.filter((e) => e.severity === "critical").length}
              </div>
              <div className="text-sm text-muted-foreground">Critical</div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-500">
                {events.filter((e) => e.severity === "high").length}
              </div>
              <div className="text-sm text-muted-foreground">High Priority</div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-500">{events.filter((e) => e.type === "login").length}</div>
              <div className="text-sm text-muted-foreground">Login Events</div>
            </CardContent>
          </Card>
        </div>

        {/* Events List */}
        <Card className="glass">
          <CardHeader>
            <CardTitle>Event Timeline</CardTitle>
            <CardDescription>
              Showing {filteredEvents.length} of {events.length} events
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredEvents.map((event) => {
                const IconComponent = getEventIcon(event.type)
                return (
                  <div key={event.id} className="flex items-start space-x-3 p-3 border rounded-lg glass slide-in">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${getSeverityColor(event.severity)}`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-sm">{event.type.replace("_", " ").toUpperCase()}</span>
                          <Badge className={getSeverityColor(event.severity)}>{event.severity}</Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">{event.timestamp.toLocaleString()}</span>
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        ID: {event.id}
                        {event.userId && ` • User: ${event.userId.substring(0, 8)}...`}
                      </div>
                      {event.encrypted && (
                        <div className="text-xs text-primary mt-1 flex items-center">
                          <Shield className="w-3 h-3 mr-1" />
                          Encrypted Event Data
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
              {filteredEvents.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">No events match your current filters</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}
