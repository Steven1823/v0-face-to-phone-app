interface LogEvent {
  id: string
  timestamp: Date
  type: "login" | "fraud_alert" | "ai_action" | "chatbot_message" | "transaction" | "biometric" | "ussd" | "sms_scan" | "sim_swap"
  userId?: string
  details: Record<string, any>
  severity: "low" | "medium" | "high" | "critical"
  encrypted: boolean
  location?: { lat: number; lng: number; city: string }
  deviceFingerprint?: string
}

class EventLogger {
  private events: LogEvent[] = []
  private readonly STORAGE_KEY = "face_to_phone_events"
  private encryptionKey: CryptoKey | null = null

  async initialize(): Promise<void> {
    await this.initializeEncryption()
    await this.loadFromStorage()
  }

  private async initializeEncryption(): Promise<void> {
    try {
      // Generate or retrieve encryption key
      const keyData = localStorage.getItem("event_logger_key")
      
      if (keyData) {
        const keyBuffer = new Uint8Array(JSON.parse(keyData))
        this.encryptionKey = await crypto.subtle.importKey(
          "raw",
          keyBuffer,
          { name: "AES-GCM" },
          false,
          ["encrypt", "decrypt"]
        )
      } else {
        this.encryptionKey = await crypto.subtle.generateKey(
          { name: "AES-GCM", length: 256 },
          true,
          ["encrypt", "decrypt"]
        )
        
        const keyBuffer = await crypto.subtle.exportKey("raw", this.encryptionKey)
        localStorage.setItem("event_logger_key", JSON.stringify(Array.from(new Uint8Array(keyBuffer))))
      }
    } catch (error) {
      console.error("[EventLogger] Encryption initialization failed:", error)
    }
  }

  async logEvent(
    type: LogEvent["type"],
    details: Record<string, any>,
    severity: LogEvent["severity"] = "low",
    userId?: string,
  ): Promise<void> {
    try {
      const event: LogEvent = {
        id: this.generateId(),
        timestamp: new Date(),
        type,
        userId,
        details: await this.encryptData(details),
        severity,
        encrypted: true,
        location: await this.getCurrentLocation(),
        deviceFingerprint: this.generateDeviceFingerprint(),
      }

      this.events.push(event)
      await this.saveToStorage()

      // Log to console for demo purposes with enhanced formatting
      console.log(`🛡️ [Face-to-Phone] Event logged: ${type.toUpperCase()} - ${severity.toUpperCase()}`, {
        id: event.id,
        timestamp: event.timestamp.toISOString(),
        details: details, // Show unencrypted details in console for demo
        location: event.location,
        deviceFingerprint: event.deviceFingerprint?.substring(0, 16) + "..."
      })

      // Trigger real-time alerts for critical events
      if (severity === "critical") {
        this.triggerCriticalAlert(type, details)
      }
    } catch (error) {
      console.error("[EventLogger] Failed to log event:", error)
    }
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
    const pdfContent = this.generatePDFContent(events)

    // Create encrypted PDF content
    const encryptedContent = await this.encryptData({ content: pdfContent })
    const finalContent = `FACE-TO-PHONE ENCRYPTED SECURITY LOG\n\nThis document contains encrypted security event data.\nDecryption key required for viewing.\n\nEncrypted Data:\n${JSON.stringify(encryptedContent, null, 2)}`

    const blob = new Blob([finalContent], { type: "application/pdf" })

    console.log("🔒 [EventLogger] Encrypted PDF export generated with", events.length, "events")
    return blob
  }

  private async triggerCriticalAlert(type: string, details: any): Promise<void> {
    // Simulate critical alert system
    console.warn("🚨 CRITICAL SECURITY ALERT:", type, details)
    
    // In a real app, this would:
    // - Send push notification
    // - Alert security team
    // - Trigger automated responses
    // - Log to external security systems
  }

  private async getCurrentLocation(): Promise<{ lat: number; lng: number; city: string } | undefined> {
    // Simulate location for demo (in real app, use geolocation API)
    const locations = [
      { lat: -1.2921, lng: 36.8219, city: "Nairobi, Kenya" },
      { lat: -4.0435, lng: 39.6682, city: "Mombasa, Kenya" },
      { lat: 0.3476, lng: 32.5825, city: "Kampala, Uganda" },
      { lat: -6.7924, lng: 39.2083, city: "Dar es Salaam, Tanzania" },
    ]
    return locations[Math.floor(Math.random() * locations.length)]
  }

  private generateDeviceFingerprint(): string {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.textBaseline = "top"
      ctx.font = "14px Arial"
      ctx.fillText("Face-to-Phone Device Fingerprint", 2, 2)
    }

    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${screen.width}x${screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      canvasFingerprint: canvas.toDataURL(),
      hardwareConcurrency: navigator.hardwareConcurrency,
      deviceMemory: (navigator as any).deviceMemory || "unknown",
      timestamp: Date.now(),
    }

    return btoa(JSON.stringify(fingerprint))
  }

  private generatePDFContent(events: LogEvent[]): string {
    let content = "FACE-TO-PHONE SECURITY EVENT LOG\n"
    content += "=================================\n\n"
    content += `Generated: ${new Date().toISOString()}\n`
    content += `Total Events: ${events.length}\n`
    content += `Classification: CONFIDENTIAL\n`
    content += `Encryption: AES-256-GCM\n\n`

    // Summary statistics
    const severityCounts = events.reduce((acc, event) => {
      acc[event.severity] = (acc[event.severity] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    content += "SUMMARY:\n"
    content += `Critical: ${severityCounts.critical || 0}\n`
    content += `High: ${severityCounts.high || 0}\n`
    content += `Medium: ${severityCounts.medium || 0}\n`
    content += `Low: ${severityCounts.low || 0}\n\n`

    content += "DETAILED EVENTS:\n"
    content += "================\n\n"

    events.forEach((event, index) => {
      content += `Event ${index + 1}:\n`
      content += `  ID: ${event.id}\n`
      content += `  Timestamp: ${event.timestamp.toISOString()}\n`
      content += `  Type: ${event.type.toUpperCase()}\n`
      content += `  Severity: ${event.severity.toUpperCase()}\n`
      content += `  User ID: ${event.userId || "N/A"}\n`
      content += `  Location: ${event.location?.city || "Unknown"}\n`
      content += `  Device: ${event.deviceFingerprint?.substring(0, 32)}...\n`
      content += `  Details: ${JSON.stringify(event.details, null, 4)}\n`
      content += "\n" + "─".repeat(50) + "\n\n"
    })

    content += "\nEND OF REPORT\n"
    content += `Report generated by Face-to-Phone Security System v2.0\n`
    content += `© 2024 Face-to-Phone Technologies. All rights reserved.\n`

    return content
  }

  private async encryptData(data: Record<string, any>): Promise<Record<string, any>> {
    if (!this.encryptionKey) {
      return data // Fallback to unencrypted if key not available
    }

    try {
      const iv = crypto.getRandomValues(new Uint8Array(12))
      const encodedData = new TextEncoder().encode(JSON.stringify(data))
      
      const encryptedBuffer = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        this.encryptionKey,
        encodedData
      )

      return {
        encrypted: Array.from(new Uint8Array(encryptedBuffer)).map(b => b.toString(16).padStart(2, '0')).join(''),
        iv: Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join(''),
        timestamp: Date.now(),
      }
    } catch (error) {
      console.error("[EventLogger] Encryption failed:", error)
      return data
    }
  }

  private async decryptData(encryptedData: Record<string, any>): Promise<Record<string, any>> {
    if (!this.encryptionKey || !encryptedData.encrypted) {
      return encryptedData
    }

    try {
      const iv = new Uint8Array(encryptedData.iv.match(/.{2}/g)!.map((byte: string) => parseInt(byte, 16)))
      const data = new Uint8Array(encryptedData.encrypted.match(/.{2}/g)!.map((byte: string) => parseInt(byte, 16)))

      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        this.encryptionKey,
        data
      )

      const decryptedText = new TextDecoder().decode(decryptedBuffer)
      return JSON.parse(decryptedText)
    } catch (error) {
      console.error("[EventLogger] Decryption failed:", error)
      return encryptedData
    }
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
      console.error("[EventLogger] Failed to save events to storage:", error)
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
      console.error("[EventLogger] Failed to load events from storage:", error)
    }
  }

  // Enhanced demo method with more realistic events
  async generateSampleEvents(): Promise<void> {
    const sampleEvents = [
      {
        type: "login" as const,
        details: { 
          method: "biometric", 
          success: true, 
          location: "Nairobi, Kenya",
          faceConfidence: 0.95,
          voiceConfidence: 0.92
        },
        severity: "low" as const,
      },
      {
        type: "fraud_alert" as const,
        details: {
          transactionId: "TXN-001",
          amount: 25000,
          reason: "Unusual transaction time + face mismatch",
          riskScore: 8.5,
          blocked: true,
          fraudType: "biometric_spoofing"
        },
        severity: "critical" as const,
      },
      {
        type: "ai_action" as const,
        details: {
          action: "transaction_blocked",
          confidence: 0.95,
          model: "fraud_detection_v2",
          processingTime: 127,
          features: ["amount_anomaly", "time_anomaly", "biometric_mismatch"]
        },
        severity: "high" as const,
      },
      {
        type: "chatbot_message" as const,
        details: {
          message: "User asked about fraud prevention tips",
          language: "en",
          response_type: "tip",
          session_duration: 180,
          tips_provided: 3
        },
        severity: "low" as const,
      },
      {
        type: "ussd" as const,
        details: {
          menu_option: "5",
          action: "account_lock",
          success: true,
          phone_number: "+254712345678",
          session_id: "USSD-2024-001"
        },
        severity: "medium" as const,
      },
      {
        type: "sms_scan" as const,
        details: {
          sender: "MPESA",
          content: "Your OTP is 123456. Do not share with anyone.",
          fraud_keywords: ["OTP", "urgent"],
          risk_score: 0.3,
          legitimate: true
        },
        severity: "low" as const,
      },
      {
        type: "sim_swap" as const,
        details: {
          old_device: "Samsung Galaxy A10",
          new_device: "iPhone 12",
          location_change: true,
          network_change: true,
          confidence: 0.89
        },
        severity: "critical" as const,
      }
    ]

    for (const event of sampleEvents) {
      await this.logEvent(event.type, event.details, event.severity, "demo_user")
      // Add small delay between events for realism
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  // Get analytics for dashboard
  getAnalytics(): {
    totalEvents: number
    criticalEvents: number
    fraudAttempts: number
    successfulLogins: number
    averageRiskScore: number
  } {
    const totalEvents = this.events.length
    const criticalEvents = this.events.filter(e => e.severity === "critical").length
    const fraudAttempts = this.events.filter(e => e.type === "fraud_alert").length
    const successfulLogins = this.events.filter(e => e.type === "login").length
    
    // Calculate average risk score from fraud events
    const fraudEvents = this.events.filter(e => e.type === "fraud_alert")
    const averageRiskScore = fraudEvents.length > 0 
      ? fraudEvents.reduce((sum, e) => sum + (e.details.riskScore || 0), 0) / fraudEvents.length
      : 0

    return {
      totalEvents,
      criticalEvents,
      fraudAttempts,
      successfulLogins,
      averageRiskScore
    }
  }
}

export const eventLogger = new EventLogger()

// Initialize logger
eventLogger.initialize()