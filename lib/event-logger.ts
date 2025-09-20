interface LogEvent {
  id: string
  timestamp: Date
  type: "login" | "fraud_alert" | "ai_action" | "chatbot_message" | "transaction" | "biometric" | "ussd"
  userId?: string
  details: Record<string, any>
  severity: "low" | "medium" | "high" | "critical"
  encrypted: boolean
}

class EventLogger {
  private events: LogEvent[] = []
  private readonly STORAGE_KEY = "face_to_phone_events"

  async logEvent(
    type: LogEvent["type"],
    details: Record<string, any>,
    severity: LogEvent["severity"] = "low",
    userId?: string,
  ): Promise<void> {
    const event: LogEvent = {
      id: this.generateId(),
      timestamp: new Date(),
      type,
      userId,
      details: await this.encryptData(details),
      severity,
      encrypted: true,
    }

    this.events.push(event)
    await this.saveToStorage()

    // Log to console for demo purposes
    console.log(`[v0] Event logged: ${type} - ${severity}`, details)
  }

  async getEvents(filter?: {
    type?: LogEvent["type"]
    severity?: LogEvent["severity"]
    userId?: string
    startDate?: Date
    endDate?: Date
  }): Promise<LogEvent[]> {
    let filteredEvents = [...this.events]

    if (filter) {
      if (filter.type) {
        filteredEvents = filteredEvents.filter((e) => e.type === filter.type)
      }
      if (filter.severity) {
        filteredEvents = filteredEvents.filter((e) => e.severity === filter.severity)
      }
      if (filter.userId) {
        filteredEvents = filteredEvents.filter((e) => e.userId === filter.userId)
      }
      if (filter.startDate) {
        filteredEvents = filteredEvents.filter((e) => e.timestamp >= filter.startDate!)
      }
      if (filter.endDate) {
        filteredEvents = filteredEvents.filter((e) => e.timestamp <= filter.endDate!)
      }
    }

    // Decrypt details for viewing
    for (const event of filteredEvents) {
      if (event.encrypted) {
        event.details = await this.decryptData(event.details)
      }
    }

    return filteredEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  async exportToPDF(filter?: Parameters<typeof this.getEvents>[0]): Promise<Blob> {
    const events = await this.getEvents(filter)

    // Create a simple text-based PDF content
    const pdfContent = this.generatePDFContent(events)

    // In a real implementation, you'd use a PDF library like jsPDF
    // For demo purposes, we'll create a text blob
    const blob = new Blob([pdfContent], { type: "application/pdf" })

    console.log("[v0] PDF export generated with", events.length, "events")
    return blob
  }

  private generatePDFContent(events: LogEvent[]): string {
    let content = "FACE-TO-PHONE SECURITY EVENT LOG\n"
    content += "================================\n\n"
    content += `Generated: ${new Date().toISOString()}\n`
    content += `Total Events: ${events.length}\n\n`

    events.forEach((event, index) => {
      content += `Event ${index + 1}:\n`
      content += `  ID: ${event.id}\n`
      content += `  Timestamp: ${event.timestamp.toISOString()}\n`
      content += `  Type: ${event.type}\n`
      content += `  Severity: ${event.severity}\n`
      content += `  User ID: ${event.userId || "N/A"}\n`
      content += `  Details: ${JSON.stringify(event.details, null, 2)}\n`
      content += "\n---\n\n"
    })

    return content
  }

  private async encryptData(data: Record<string, any>): Promise<Record<string, any>> {
    // In a real implementation, use WebCrypto API for encryption
    // For demo purposes, we'll just encode it
    const jsonString = JSON.stringify(data)
    const encoded = btoa(jsonString)
    return { encrypted: encoded }
  }

  private async decryptData(encryptedData: Record<string, any>): Promise<Record<string, any>> {
    // In a real implementation, use WebCrypto API for decryption
    // For demo purposes, we'll just decode it
    if (encryptedData.encrypted) {
      const decoded = atob(encryptedData.encrypted)
      return JSON.parse(decoded)
    }
    return encryptedData
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  private async saveToStorage(): Promise<void> {
    try {
      const serializedEvents = JSON.stringify(
        this.events.map((event) => ({
          ...event,
          timestamp: event.timestamp.toISOString(),
        })),
      )
      localStorage.setItem(this.STORAGE_KEY, serializedEvents)
    } catch (error) {
      console.error("[v0] Failed to save events to storage:", error)
    }
  }

  async loadFromStorage(): Promise<void> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        this.events = parsed.map((event: any) => ({
          ...event,
          timestamp: new Date(event.timestamp),
        }))
      }
    } catch (error) {
      console.error("[v0] Failed to load events from storage:", error)
    }
  }

  // Demo method to generate sample events
  async generateSampleEvents(): Promise<void> {
    const sampleEvents = [
      {
        type: "login" as const,
        details: { method: "biometric", success: true, location: "Nairobi, Kenya" },
        severity: "low" as const,
      },
      {
        type: "fraud_alert" as const,
        details: {
          transactionId: "TXN-001",
          amount: 25000,
          reason: "Unusual transaction time",
          riskScore: 8.5,
        },
        severity: "high" as const,
      },
      {
        type: "ai_action" as const,
        details: {
          action: "transaction_blocked",
          confidence: 0.95,
          model: "fraud_detection_v2",
        },
        severity: "medium" as const,
      },
      {
        type: "chatbot_message" as const,
        details: {
          message: "User asked about fraud prevention tips",
          language: "en",
          response_type: "tip",
        },
        severity: "low" as const,
      },
    ]

    for (const event of sampleEvents) {
      await this.logEvent(event.type, event.details, event.severity, "demo_user")
    }
  }
}

export const eventLogger = new EventLogger()

// Initialize logger
eventLogger.loadFromStorage()
