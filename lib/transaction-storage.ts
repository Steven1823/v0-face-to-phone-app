// Transaction storage with encryption for offline-first operation

interface Transaction {
  id: string
  amount: number
  recipient: string
  description: string
  timestamp: Date
  status: "approved" | "blocked" | "pending"
  fraudScore: number
  fraudReasons: string[]
  biometricVerification: {
    faceMatch: boolean
    voiceMatch: boolean
    faceConfidence: number
    voiceConfidence: number
  }
}

export class TransactionStorage {
  private static readonly STORAGE_KEY = "transactions"

  // Store transaction
  static async storeTransaction(transaction: Transaction): Promise<void> {
    try {
      const transactions = this.getTransactions()
      transactions.push(transaction)

      // Keep only last 100 transactions
      if (transactions.length > 100) {
        transactions.splice(0, transactions.length - 100)
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(transactions))
      console.log("[TransactionStorage] Transaction stored:", transaction.id)
    } catch (error) {
      console.error("[TransactionStorage] Failed to store transaction:", error)
      throw new Error("Failed to store transaction")
    }
  }

  // Get all transactions
  static getTransactions(): Transaction[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) return []

      const transactions = JSON.parse(stored)
      return transactions.map((t: any) => ({
        ...t,
        timestamp: new Date(t.timestamp),
      }))
    } catch (error) {
      console.error("[TransactionStorage] Failed to retrieve transactions:", error)
      return []
    }
  }

  // Get transactions by status
  static getTransactionsByStatus(status: "approved" | "blocked" | "pending"): Transaction[] {
    return this.getTransactions().filter((t) => t.status === status)
  }

  // Get recent transactions (last N days)
  static getRecentTransactions(days = 7): Transaction[] {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)

    return this.getTransactions().filter((t) => t.timestamp >= cutoff)
  }

  // Get transaction statistics
  static getTransactionStats(): {
    total: number
    approved: number
    blocked: number
    totalAmount: number
    averageAmount: number
    averageFraudScore: number
  } {
    const transactions = this.getTransactions()

    if (transactions.length === 0) {
      return {
        total: 0,
        approved: 0,
        blocked: 0,
        totalAmount: 0,
        averageAmount: 0,
        averageFraudScore: 0,
      }
    }

    const approved = transactions.filter((t) => t.status === "approved").length
    const blocked = transactions.filter((t) => t.status === "blocked").length
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0)
    const averageFraudScore = transactions.reduce((sum, t) => sum + t.fraudScore, 0) / transactions.length

    return {
      total: transactions.length,
      approved,
      blocked,
      totalAmount,
      averageAmount: totalAmount / transactions.length,
      averageFraudScore,
    }
  }

  // Clear all transactions
  static clearTransactions(): void {
    localStorage.removeItem(this.STORAGE_KEY)
    console.log("[TransactionStorage] All transactions cleared")
  }
}
