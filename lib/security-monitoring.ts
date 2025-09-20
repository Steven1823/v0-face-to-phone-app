// Real-time security monitoring and alerting system

interface SecurityAlert {
  id: string
  type: "fraud_attempt" | "biometric_failure" | "suspicious_login" | "system_anomaly"
  severity: "low" | "medium" | "high" | "critical"
  title: string
  description: string
  timestamp: Date
  metadata: Record<string, any>
  resolved: boolean
  resolvedAt?: Date
  resolvedBy?: string
}

export class SecurityMonitoring {
  private static readonly ALERTS_KEY = "security_alerts"
  private static readonly MAX_ALERTS = 200

  // Generate security alert
  static generateAlert(
    type: SecurityAlert["type"],
    severity: SecurityAlert["severity"],
    title: string,
    description: string,
    metadata: Record<string, any> = {},
  ): SecurityAlert {
    const alert: SecurityAlert = {
      id: crypto.randomUUID(),
      type,
      severity,
      title,
      description,
      timestamp: new Date(),
      metadata,
      resolved: false,
    }

    this.storeAlert(alert)
    console.log(`[SecurityMonitoring] Alert generated:`, alert)

    return alert
  }

  // Store alert
  private static storeAlert(alert: SecurityAlert): void {
    const alerts = this.getAlerts()
    alerts.unshift(alert) // Add to beginning

    // Keep only recent alerts
    if (alerts.length > this.MAX_ALERTS) {
      alerts.splice(this.MAX_ALERTS)
    }

    localStorage.setItem(this.ALERTS_KEY, JSON.stringify(alerts))
  }

  // Get all alerts
  static getAlerts(): SecurityAlert[] {
    try {
      const stored = localStorage.getItem(this.ALERTS_KEY)
      if (!stored) return []

      return JSON.parse(stored).map((alert: any) => ({
        ...alert,
        timestamp: new Date(alert.timestamp),
        resolvedAt: alert.resolvedAt ? new Date(alert.resolvedAt) : undefined,
      }))
    } catch (error) {
      console.error("[SecurityMonitoring] Failed to load alerts:", error)
      return []
    }
  }

  // Get alerts by severity
  static getAlertsBySeverity(severity: SecurityAlert["severity"]): SecurityAlert[] {
    return this.getAlerts().filter((alert) => alert.severity === severity)
  }

  // Get unresolved alerts
  static getUnresolvedAlerts(): SecurityAlert[] {
    return this.getAlerts().filter((alert) => !alert.resolved)
  }

  // Resolve alert
  static resolveAlert(alertId: string, resolvedBy = "system"): boolean {
    const alerts = this.getAlerts()
    const alertIndex = alerts.findIndex((alert) => alert.id === alertId)

    if (alertIndex === -1) return false

    alerts[alertIndex].resolved = true
    alerts[alertIndex].resolvedAt = new Date()
    alerts[alertIndex].resolvedBy = resolvedBy

    localStorage.setItem(this.ALERTS_KEY, JSON.stringify(alerts))
    console.log(`[SecurityMonitoring] Alert resolved:`, alerts[alertIndex])

    return true
  }

  // Get alert statistics
  static getAlertStats(): {
    total: number
    unresolved: number
    critical: number
    high: number
    medium: number
    low: number
    last24Hours: number
  } {
    const alerts = this.getAlerts()
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000)

    return {
      total: alerts.length,
      unresolved: alerts.filter((a) => !a.resolved).length,
      critical: alerts.filter((a) => a.severity === "critical").length,
      high: alerts.filter((a) => a.severity === "high").length,
      medium: alerts.filter((a) => a.severity === "medium").length,
      low: alerts.filter((a) => a.severity === "low").length,
      last24Hours: alerts.filter((a) => a.timestamp >= last24Hours).length,
    }
  }

  // Monitor transaction for security events
  static monitorTransaction(transaction: any, fraudResult: any): void {
    if (fraudResult.isBlocked) {
      this.generateAlert(
        "fraud_attempt",
        fraudResult.riskLevel === "high" ? "critical" : "high",
        `Fraudulent transaction blocked - $${transaction.amount}`,
        `Transaction to ${transaction.recipient} was blocked due to: ${fraudResult.reasons.join(", ")}`,
        {
          amount: transaction.amount,
          recipient: transaction.recipient,
          riskScore: fraudResult.riskScore,
          reasons: fraudResult.reasons,
        },
      )
    }

    if (fraudResult.reasons.some((r: string) => r.includes("Biometric verification failed"))) {
      this.generateAlert(
        "biometric_failure",
        "critical",
        "Biometric authentication failure",
        "Potential impostor attempt detected - biometric verification failed",
        {
          transaction: transaction,
          failureType: "biometric_mismatch",
        },
      )
    }

    if (fraudResult.riskScore > 0.5 && !fraudResult.isBlocked) {
      this.generateAlert(
        "suspicious_login",
        "medium",
        "Suspicious transaction approved with elevated risk",
        `Transaction approved but flagged with ${(fraudResult.riskScore * 100).toFixed(1)}% risk score`,
        {
          transaction: transaction,
          riskScore: fraudResult.riskScore,
        },
      )
    }
  }

  // Clear all alerts (for demo reset)
  static clearAlerts(): void {
    localStorage.removeItem(this.ALERTS_KEY)
    console.log("[SecurityMonitoring] All alerts cleared")
  }
}
