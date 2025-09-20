// Fraud Detection Engine - Rule-based system with hooks for ML models
// This is a placeholder implementation for the hackathon demo

interface TransactionData {
  amount: number
  recipient: string
  timestamp: Date
  userVerified: boolean
}

interface FraudResult {
  isBlocked: boolean
  riskScore: number
  reasons: string[]
  riskLevel: "low" | "medium" | "high"
}

interface UserProfile {
  averageTransactionAmount: number
  transactionHistory: Array<{
    amount: number
    timestamp: Date
    recipient: string
  }>
  lastTransactionTime: Date | null
  suspiciousActivityCount: number
}

export class FraudDetection {
  private static readonly STORAGE_KEY = "user_profile"
  private static readonly MAX_AMOUNT_MULTIPLIER = 3
  private static readonly SUSPICIOUS_HOURS_START = 22 // 10 PM
  private static readonly SUSPICIOUS_HOURS_END = 6 // 6 AM
  private static readonly RAPID_TRANSACTION_THRESHOLD = 5 * 60 * 1000 // 5 minutes

  // Analyze transaction for fraud indicators
  static async analyzeTransaction(transaction: TransactionData): Promise<FraudResult> {
    console.log("[FraudDetection] Analyzing transaction:", transaction)

    const userProfile = this.getUserProfile()
    const reasons: string[] = []
    let riskScore = 0

    // Rule 1: Biometric verification failed
    if (!transaction.userVerified) {
      reasons.push("Biometric verification failed - impostor detected")
      riskScore += 0.8
    }

    // Rule 2: Amount significantly higher than average
    if (userProfile.averageTransactionAmount > 0) {
      const amountRatio = transaction.amount / userProfile.averageTransactionAmount
      if (amountRatio > this.MAX_AMOUNT_MULTIPLIER) {
        reasons.push(
          `Transaction amount ${amountRatio.toFixed(1)}× above normal baseline ($${userProfile.averageTransactionAmount.toFixed(2)})`,
        )
        riskScore += Math.min(0.6, (amountRatio - this.MAX_AMOUNT_MULTIPLIER) * 0.2)
      }
    }

    // Rule 3: Transaction during suspicious hours
    const hour = transaction.timestamp.getHours()
    if (hour >= this.SUSPICIOUS_HOURS_START || hour <= this.SUSPICIOUS_HOURS_END) {
      reasons.push(`Transaction attempted during suspicious hours (${hour}:00)`)
      riskScore += 0.3
    }

    // Rule 4: Rapid successive transactions
    if (userProfile.lastTransactionTime) {
      const timeDiff = transaction.timestamp.getTime() - userProfile.lastTransactionTime.getTime()
      if (timeDiff < this.RAPID_TRANSACTION_THRESHOLD) {
        reasons.push("Rapid successive transactions detected")
        riskScore += 0.4
      }
    }

    // Rule 5: Large round amounts (potential money laundering)
    if (transaction.amount >= 1000 && transaction.amount % 100 === 0) {
      reasons.push("Large round amount transaction - potential money laundering pattern")
      riskScore += 0.2
    }

    // Rule 6: New recipient with large amount
    const isNewRecipient = !userProfile.transactionHistory.some((t) => t.recipient === transaction.recipient)
    if (isNewRecipient && transaction.amount > 500) {
      reasons.push("Large transaction to new recipient")
      riskScore += 0.3
    }

    // Rule 7: Simulated SIM swap detection (random for demo)
    if (Math.random() < 0.1) {
      // 10% chance for demo
      reasons.push("Potential SIM swap detected - device fingerprint mismatch")
      riskScore += 0.7
    }

    // Rule 8: Velocity check - too many transactions in short period
    const recentTransactions = userProfile.transactionHistory.filter(
      (t) => transaction.timestamp.getTime() - t.timestamp.getTime() < 24 * 60 * 60 * 1000, // 24 hours
    )
    if (recentTransactions.length >= 5) {
      reasons.push("Transaction velocity limit exceeded (5+ transactions in 24h)")
      riskScore += 0.4
    }

    // Determine risk level and blocking decision
    const riskLevel: "low" | "medium" | "high" = riskScore >= 0.7 ? "high" : riskScore >= 0.4 ? "medium" : "low"
    const isBlocked = riskScore >= 0.6 || reasons.some((r) => r.includes("Biometric verification failed"))

    // Update user profile
    this.updateUserProfile(transaction)

    // Log the fraud analysis
    this.logFraudAnalysis({
      transaction,
      riskScore,
      reasons,
      riskLevel,
      isBlocked,
      timestamp: new Date(),
    })

    const result: FraudResult = {
      isBlocked,
      riskScore: Math.min(1, riskScore),
      reasons,
      riskLevel,
    }

    console.log("[FraudDetection] Analysis result:", result)
    return result
  }

  static async analyzeTransactionWithML(transaction: TransactionData): Promise<FraudResult> {
    console.log("[FraudDetection] Running ML-enhanced analysis:", transaction)

    // Run standard rule-based analysis first
    const ruleBasedResult = await this.analyzeTransaction(transaction)

    // Placeholder for ML model integration
    // In a real implementation, this would call TensorFlow Lite or ONNX models
    const mlRiskScore = await this.simulateMLAnalysis(transaction)

    // Combine rule-based and ML scores
    const combinedScore = Math.max(ruleBasedResult.riskScore, mlRiskScore)
    const enhancedReasons = [...ruleBasedResult.reasons]

    if (mlRiskScore > 0.7) {
      enhancedReasons.push("ML model detected anomalous transaction pattern")
    }

    if (mlRiskScore > 0.8) {
      enhancedReasons.push("Deep learning model flagged high-risk behavioral indicators")
    }

    const result: FraudResult = {
      ...ruleBasedResult,
      riskScore: combinedScore,
      reasons: enhancedReasons,
      riskLevel: combinedScore >= 0.7 ? "high" : combinedScore >= 0.4 ? "medium" : "low",
    }

    console.log("[FraudDetection] ML-enhanced result:", result)
    return result
  }

  // Simulate attack scenarios for demo
  static simulateAttack(attackType: "face_spoof" | "voice_clone" | "large_amount" | "suspicious_time"): FraudResult {
    const baseTransaction = {
      amount: 100,
      recipient: "Demo Recipient",
      timestamp: new Date(),
      userVerified: true,
    }

    switch (attackType) {
      case "face_spoof":
        return {
          isBlocked: true,
          riskScore: 0.95,
          reasons: ["Biometric verification failed - face spoofing detected", "Impostor attempt blocked"],
          riskLevel: "high",
        }

      case "voice_clone":
        return {
          isBlocked: true,
          riskScore: 0.9,
          reasons: ["Biometric verification failed - voice cloning detected", "Synthetic voice pattern identified"],
          riskLevel: "high",
        }

      case "large_amount":
        return {
          isBlocked: true,
          riskScore: 0.8,
          reasons: [
            "Transaction amount 10.0× above normal baseline ($50.00)",
            "Large round amount transaction - potential money laundering pattern",
          ],
          riskLevel: "high",
        }

      case "suspicious_time":
        return {
          isBlocked: true,
          riskScore: 0.7,
          reasons: [
            "Transaction attempted during suspicious hours (2:00)",
            "Rapid successive transactions detected",
            "Potential SIM swap detected - device fingerprint mismatch",
          ],
          riskLevel: "high",
        }

      default:
        return {
          isBlocked: false,
          riskScore: 0.1,
          reasons: [],
          riskLevel: "low",
        }
    }
  }

  static generateDeviceFingerprint(): string {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.textBaseline = "top"
      ctx.font = "14px Arial"
      ctx.fillText("Device fingerprint", 2, 2)
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
    }

    return btoa(JSON.stringify(fingerprint))
  }

  // Get user profile from storage
  private static getUserProfile(): UserProfile {
    const stored = localStorage.getItem(this.STORAGE_KEY)
    if (stored) {
      const profile = JSON.parse(stored)
      // Convert timestamp strings back to Date objects
      profile.transactionHistory = profile.transactionHistory.map((t: any) => ({
        ...t,
        timestamp: new Date(t.timestamp),
      }))
      if (profile.lastTransactionTime) {
        profile.lastTransactionTime = new Date(profile.lastTransactionTime)
      }
      return profile
    }

    return {
      averageTransactionAmount: 0,
      transactionHistory: [],
      lastTransactionTime: null,
      suspiciousActivityCount: 0,
    }
  }

  // Update user profile with new transaction
  private static updateUserProfile(transaction: TransactionData): void {
    const profile = this.getUserProfile()

    // Add to transaction history
    profile.transactionHistory.push({
      amount: transaction.amount,
      timestamp: transaction.timestamp,
      recipient: transaction.recipient,
    })

    // Keep only last 50 transactions
    if (profile.transactionHistory.length > 50) {
      profile.transactionHistory = profile.transactionHistory.slice(-50)
    }

    // Update average transaction amount
    const totalAmount = profile.transactionHistory.reduce((sum, t) => sum + t.amount, 0)
    profile.averageTransactionAmount = totalAmount / profile.transactionHistory.length

    // Update last transaction time
    profile.lastTransactionTime = transaction.timestamp

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(profile))
  }

  private static async simulateMLAnalysis(transaction: TransactionData): Promise<number> {
    // Simulate ML model processing time
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Simulate various ML features
    const features = {
      amountNormalized: Math.min(1, transaction.amount / 1000),
      timeOfDay: transaction.timestamp.getHours() / 24,
      dayOfWeek: transaction.timestamp.getDay() / 7,
      recipientEntropy: this.calculateStringEntropy(transaction.recipient),
      deviceFingerprint: this.generateDeviceFingerprint(),
    }

    // Simulate neural network prediction (random for demo)
    let mlScore = Math.random() * 0.3 // Base random score

    // Add some realistic patterns
    if (features.timeOfDay < 0.25 || features.timeOfDay > 0.92) {
      // Late night/early morning
      mlScore += 0.2
    }

    if (features.amountNormalized > 0.8) {
      // Large amounts
      mlScore += 0.3
    }

    if (features.recipientEntropy > 0.8) {
      // Random-looking recipient names
      mlScore += 0.2
    }

    return Math.min(1, mlScore)
  }

  private static calculateStringEntropy(str: string): number {
    const freq: { [key: string]: number } = {}

    for (const char of str.toLowerCase()) {
      freq[char] = (freq[char] || 0) + 1
    }

    let entropy = 0
    const len = str.length

    for (const count of Object.values(freq)) {
      const p = count / len
      entropy -= p * Math.log2(p)
    }

    return entropy / Math.log2(len) // Normalize
  }

  private static logFraudAnalysis(analysis: {
    transaction: TransactionData
    riskScore: number
    reasons: string[]
    riskLevel: string
    isBlocked: boolean
    timestamp: Date
  }): void {
    const logs = JSON.parse(localStorage.getItem("fraud_logs") || "[]")

    const enhancedLog = {
      id: crypto.randomUUID(),
      ...analysis,
      deviceFingerprint: this.generateDeviceFingerprint(),
      sessionId: sessionStorage.getItem("session_id") || "unknown",
      userAgent: navigator.userAgent,
      ipAddress: "simulated-ip", // In real app, would get from server
      geolocation: "simulated-location", // In real app, would use geolocation API
    }

    logs.push(enhancedLog)

    // Keep only last 100 logs
    if (logs.length > 100) {
      logs.splice(0, logs.length - 100)
    }

    localStorage.setItem("fraud_logs", JSON.stringify(logs))

    // Also log to console for demo purposes
    console.log("[FraudDetection] Enhanced fraud log:", enhancedLog)
  }

  // Get fraud analysis logs
  static getFraudLogs(): Array<{
    id: string
    transaction: TransactionData
    riskScore: number
    reasons: string[]
    riskLevel: string
    isBlocked: boolean
    timestamp: Date
  }> {
    const logs = JSON.parse(localStorage.getItem("fraud_logs") || "[]")
    return logs.map((log: any) => ({
      ...log,
      transaction: {
        ...log.transaction,
        timestamp: new Date(log.transaction.timestamp),
      },
      timestamp: new Date(log.timestamp),
    }))
  }

  // Clear all fraud data (for demo reset)
  static clearFraudData(): void {
    localStorage.removeItem(this.STORAGE_KEY)
    localStorage.removeItem("fraud_logs")
    console.log("[FraudDetection] All fraud data cleared")
  }
}
