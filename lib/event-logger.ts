interface LogEvent {
  id: string
  timestamp: Date
  type: "login" | "fraud_alert" | "ai_action" | "chatbot_message" | "transaction" | "biometric" | "system"
  severity: "low" | "medium" | "high" | "critical"
  userId?: string
  details: Record<string, any>
  encrypted: boolean
}

class EventLogger {
  private events: LogEvent[] = []
  private readonly storageKey = "face_to_phone_events"

  async logEvent(
    type: LogEvent["type"],
    severity: LogEvent["severity"],
    details: Record<string, any>,
    userId?: string,
  ): Promise<void> {
    const event: LogEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      type,
      severity,
      userId,
      details,
      encrypted: true,
    }

    // Encrypt sensitive data
    const encryptedEvent = await this.encryptEvent(event)
    this.events.push(encryptedEvent)

    // Store in localStorage (in production, use IndexedDB)
    localStorage.setItem(this.storageKey, JSON.stringify(this.events))

    console.log(`[EventLogger] ${severity.toUpperCase()}: ${type}`, details)
  }

  private async encryptEvent(event: LogEvent): Promise<LogEvent> {
    try {
      // In production, use WebCrypto API for real encryption
      const encryptedDetails = btoa(JSON.stringify(event.details))
      return {
        ...event,
        details: { encrypted: encryptedDetails },
        encrypted: true,
      }
    } catch (error) {
      console.error("Encryption failed:", error)
      return event
    }
  }

  async getEvents(filters?: {
    type?: LogEvent["type"]
    severity?: LogEvent["severity"]
    userId?: string
    startDate?: Date
    endDate?: Date
  }): Promise<LogEvent[]> {
    let filteredEvents = [...this.events]

    if (filters) {
      if (filters.type) {
        filteredEvents = filteredEvents.filter((e) => e.type === filters.type)
      }
      if (filters.severity) {
        filteredEvents = filteredEvents.filter((e) => e.severity === filters.severity)
      }
      if (filters.userId) {
        filteredEvents = filteredEvents.filter((e) => e.userId === filters.userId)
      }
      if (filters.startDate) {
        filteredEvents = filteredEvents.filter((e) => e.timestamp >= filters.startDate!)
      }
      if (filters.endDate) {
        filteredEvents = filteredEvents.filter((e) => e.timestamp <= filters.endDate!)
      }
    }

    return filteredEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  async exportToPDF(): Promise<Blob> {
    // Simulate PDF generation (in production, use jsPDF or similar)
    const events = await this.getEvents()
    const reportData = {
      generatedAt: new Date().toISOString(),
      totalEvents: events.length,
      events: events.map((e) => ({
        id: e.id,
        timestamp: e.timestamp.toISOString(),
        type: e.type,
        severity: e.severity,
        userId: e.userId || "anonymous",
        encrypted: e.encrypted,
      })),
    }

    const jsonString = JSON.stringify(reportData, null, 2)
    return new Blob([jsonString], { type: "application/json" })
  }

  // Predefined logging methods for common events
  async logLogin(userId: string, success: boolean, method: string): Promise<void> {
    await this.logEvent(
      "login",
      success ? "low" : "medium",
      {
        success,
        method,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
      },
      userId,
    )
  }

  async logFraudAlert(userId: string, alertType: string, riskScore: number, details: any): Promise<void> {
    await this.logEvent(
      "fraud_alert",
      riskScore > 0.8 ? "critical" : "high",
      {
        alertType,
        riskScore,
        details,
        location: "simulated_location",
      },
      userId,
    )
  }

  async logAIAction(action: string, confidence: number, details: any): Promise<void> {
    await this.logEvent("ai_action", confidence > 0.9 ? "low" : "medium", {
      action,
      confidence,
      details,
      model: "fraud_detection_v1",
    })
  }

  async logChatbotMessage(userId: string, message: string, language: string): Promise<void> {
    await this.logEvent(
      "chatbot_message",
      "low",
      {
        message: message.substring(0, 100), // Truncate for privacy
        language,
        messageLength: message.length,
      },
      userId,
    )
  }

  async logTransaction(userId: string, amount: number, type: string, status: string): Promise<void> {
    await this.logEvent(
      "transaction",
      status === "failed" ? "medium" : "low",
      {
        amount,
        type,
        status,
        currency: "KSH",
      },
      userId,
    )
  }

  async logBiometricEvent(userId: string, type: string, success: boolean, confidence?: number): Promise<void> {
    await this.logEvent(
      "biometric",
      success ? "low" : "medium",
      {
        type,
        success,
        confidence,
        device: "web_browser",
      },
      userId,
    )
  }
}

export const eventLogger = new EventLogger()

// Auto-log system events
eventLogger.logEvent("system", "low", {
  event: "logger_initialized",
  userAgent: navigator.userAgent,
  timestamp: new Date().toISOString(),
})
