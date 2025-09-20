interface StorageConfig {
  dbName: string
  version: number
  stores: string[]
}

interface EncryptedData {
  data: string
  iv: string
  timestamp: number
}

interface UserProfile {
  id: string
  accountType: "individual" | "business"
  fullName: string
  phoneNumber: string
  email: string
  businessName?: string
  photo?: string
  createdAt: number
  trustScore: number
}

interface BiometricTemplate {
  id: string
  userId: string
  type: "face" | "voice"
  template: string // encrypted biometric data
  confidence: number
  createdAt: number
}

interface TransactionRecord {
  id: string
  userId: string
  recipient: string
  amount: number
  currency: string
  status: "pending" | "completed" | "blocked" | "failed"
  fraudScore: number
  fraudReasons: string[]
  biometricVerified: boolean
  timestamp: number
  deviceFingerprint: string
  location?: { lat: number; lng: number }
}

interface SecurityEvent {
  id: string
  userId: string
  type: "login" | "transaction" | "biometric_failure" | "fraud_attempt" | "device_change"
  severity: "low" | "medium" | "high" | "critical"
  description: string
  metadata: Record<string, any>
  timestamp: number
  resolved: boolean
}

class OfflineStorage {
  private db: IDBDatabase | null = null
  private cryptoKey: CryptoKey | null = null
  private config: StorageConfig = {
    dbName: "FaceToPhoneDB",
    version: 1,
    stores: ["users", "biometrics", "transactions", "security_events", "settings", "fraud_patterns"],
  }

  async initialize(): Promise<void> {
    await this.initializeDatabase()
    await this.initializeCrypto()
  }

  private async initializeDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.config.dbName, this.config.version)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create object stores
        if (!db.objectStoreNames.contains("users")) {
          const userStore = db.createObjectStore("users", { keyPath: "id" })
          userStore.createIndex("email", "email", { unique: true })
          userStore.createIndex("phoneNumber", "phoneNumber", { unique: true })
        }

        if (!db.objectStoreNames.contains("biometrics")) {
          const biometricStore = db.createObjectStore("biometrics", { keyPath: "id" })
          biometricStore.createIndex("userId", "userId")
          biometricStore.createIndex("type", "type")
        }

        if (!db.objectStoreNames.contains("transactions")) {
          const transactionStore = db.createObjectStore("transactions", { keyPath: "id" })
          transactionStore.createIndex("userId", "userId")
          transactionStore.createIndex("timestamp", "timestamp")
          transactionStore.createIndex("status", "status")
        }

        if (!db.objectStoreNames.contains("security_events")) {
          const securityStore = db.createObjectStore("security_events", { keyPath: "id" })
          securityStore.createIndex("userId", "userId")
          securityStore.createIndex("type", "type")
          securityStore.createIndex("severity", "severity")
          securityStore.createIndex("timestamp", "timestamp")
        }

        if (!db.objectStoreNames.contains("settings")) {
          db.createObjectStore("settings", { keyPath: "key" })
        }

        if (!db.objectStoreNames.contains("fraud_patterns")) {
          const fraudStore = db.createObjectStore("fraud_patterns", { keyPath: "id" })
          fraudStore.createIndex("userId", "userId")
          fraudStore.createIndex("pattern", "pattern")
        }
      }
    })
  }

  private async initializeCrypto(): Promise<void> {
    // Generate or retrieve encryption key
    const keyData = localStorage.getItem("face-to-phone-key")

    if (keyData) {
      // Import existing key
      const keyBuffer = new Uint8Array(JSON.parse(keyData))
      this.cryptoKey = await crypto.subtle.importKey("raw", keyBuffer, { name: "AES-GCM" }, false, [
        "encrypt",
        "decrypt",
      ])
    } else {
      // Generate new key
      this.cryptoKey = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"])

      // Export and store key
      const keyBuffer = await crypto.subtle.exportKey("raw", this.cryptoKey)
      localStorage.setItem("face-to-phone-key", JSON.stringify(Array.from(new Uint8Array(keyBuffer))))
    }
  }

  private async encrypt(data: any): Promise<EncryptedData> {
    if (!this.cryptoKey) throw new Error("Crypto key not initialized")

    const iv = crypto.getRandomValues(new Uint8Array(12))
    const encodedData = new TextEncoder().encode(JSON.stringify(data))

    const encryptedBuffer = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, this.cryptoKey, encodedData)

    return {
      data: Array.from(new Uint8Array(encryptedBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""),
      iv: Array.from(iv)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join(""),
      timestamp: Date.now(),
    }
  }

  private async decrypt(encryptedData: EncryptedData): Promise<any> {
    if (!this.cryptoKey) throw new Error("Crypto key not initialized")

    const iv = new Uint8Array(encryptedData.iv.match(/.{2}/g)!.map((byte) => Number.parseInt(byte, 16)))
    const data = new Uint8Array(encryptedData.data.match(/.{2}/g)!.map((byte) => Number.parseInt(byte, 16)))

    const decryptedBuffer = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, this.cryptoKey, data)

    const decryptedText = new TextDecoder().decode(decryptedBuffer)
    return JSON.parse(decryptedText)
  }

  // User management
  async createUser(userData: Omit<UserProfile, "id" | "createdAt" | "trustScore">): Promise<UserProfile> {
    const user: UserProfile = {
      ...userData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      trustScore: 85, // Initial trust score
    }

    await this.store("users", user)
    return user
  }

  async getUser(id: string): Promise<UserProfile | null> {
    return this.retrieve("users", id)
  }

  async getUserByEmail(email: string): Promise<UserProfile | null> {
    return this.retrieveByIndex("users", "email", email)
  }

  async updateUser(id: string, updates: Partial<UserProfile>): Promise<void> {
    const user = await this.getUser(id)
    if (user) {
      await this.store("users", { ...user, ...updates })
    }
  }

  // Biometric management
  async storeBiometric(biometric: Omit<BiometricTemplate, "id" | "createdAt">): Promise<string> {
    const template: BiometricTemplate = {
      ...biometric,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    }

    await this.store("biometrics", template)
    return template.id
  }

  async getBiometrics(userId: string): Promise<BiometricTemplate[]> {
    return this.retrieveAllByIndex("biometrics", "userId", userId)
  }

  async getBiometricsByType(userId: string, type: "face" | "voice"): Promise<BiometricTemplate[]> {
    const biometrics = await this.getBiometrics(userId)
    return biometrics.filter((b) => b.type === type)
  }

  // Transaction management
  async storeTransaction(transaction: Omit<TransactionRecord, "id" | "timestamp">): Promise<string> {
    const record: TransactionRecord = {
      ...transaction,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    }

    await this.store("transactions", record)
    return record.id
  }

  async getTransactions(userId: string): Promise<TransactionRecord[]> {
    const transactions = await this.retrieveAllByIndex("transactions", "userId", userId)
    return transactions.sort((a, b) => b.timestamp - a.timestamp)
  }

  async getTransactionsByStatus(userId: string, status: TransactionRecord["status"]): Promise<TransactionRecord[]> {
    const transactions = await this.getTransactions(userId)
    return transactions.filter((t) => t.status === status)
  }

  // Security event management
  async logSecurityEvent(event: Omit<SecurityEvent, "id" | "timestamp" | "resolved">): Promise<string> {
    const securityEvent: SecurityEvent = {
      ...event,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      resolved: false,
    }

    await this.store("security_events", securityEvent)
    return securityEvent.id
  }

  async getSecurityEvents(userId: string): Promise<SecurityEvent[]> {
    const events = await this.retrieveAllByIndex("security_events", "userId", userId)
    return events.sort((a, b) => b.timestamp - a.timestamp)
  }

  async getUnresolvedSecurityEvents(userId: string): Promise<SecurityEvent[]> {
    const events = await this.getSecurityEvents(userId)
    return events.filter((e) => !e.resolved)
  }

  async resolveSecurityEvent(eventId: string): Promise<void> {
    const event = await this.retrieve("security_events", eventId)
    if (event) {
      await this.store("security_events", { ...event, resolved: true })
    }
  }

  // Generic storage methods
  private async store(storeName: string, data: any): Promise<void> {
    if (!this.db) throw new Error("Database not initialized")

    const encryptedData = await this.encrypt(data)

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readwrite")
      const store = transaction.objectStore(storeName)
      const request = store.put({ ...data, _encrypted: encryptedData })

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  private async retrieve(storeName: string, key: string): Promise<any> {
    if (!this.db) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readonly")
      const store = transaction.objectStore(storeName)
      const request = store.get(key)

      request.onerror = () => reject(request.error)
      request.onsuccess = async () => {
        if (request.result && request.result._encrypted) {
          try {
            const decrypted = await this.decrypt(request.result._encrypted)
            resolve(decrypted)
          } catch (error) {
            reject(error)
          }
        } else {
          resolve(request.result || null)
        }
      }
    })
  }

  private async retrieveByIndex(storeName: string, indexName: string, value: any): Promise<any> {
    if (!this.db) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readonly")
      const store = transaction.objectStore(storeName)
      const index = store.index(indexName)
      const request = index.get(value)

      request.onerror = () => reject(request.error)
      request.onsuccess = async () => {
        if (request.result && request.result._encrypted) {
          try {
            const decrypted = await this.decrypt(request.result._encrypted)
            resolve(decrypted)
          } catch (error) {
            reject(error)
          }
        } else {
          resolve(request.result || null)
        }
      }
    })
  }

  private async retrieveAllByIndex(storeName: string, indexName: string, value: any): Promise<any[]> {
    if (!this.db) throw new Error("Database not initialized")

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([storeName], "readonly")
      const store = transaction.objectStore(storeName)
      const index = store.index(indexName)
      const request = index.getAll(value)

      request.onerror = () => reject(request.error)
      request.onsuccess = async () => {
        const results = []
        for (const item of request.result) {
          if (item._encrypted) {
            try {
              const decrypted = await this.decrypt(item._encrypted)
              results.push(decrypted)
            } catch (error) {
              console.error("Failed to decrypt item:", error)
            }
          } else {
            results.push(item)
          }
        }
        resolve(results)
      }
    })
  }

  // Settings management
  async setSetting(key: string, value: any): Promise<void> {
    await this.store("settings", { key, value })
  }

  async getSetting(key: string): Promise<any> {
    const setting = await this.retrieve("settings", key)
    return setting?.value || null
  }

  // Data export/import for backup
  async exportData(userId: string): Promise<string> {
    const userData = await this.getUser(userId)
    const biometrics = await this.getBiometrics(userId)
    const transactions = await this.getTransactions(userId)
    const securityEvents = await this.getSecurityEvents(userId)

    const exportData = {
      user: userData,
      biometrics,
      transactions,
      securityEvents,
      exportedAt: Date.now(),
    }

    return JSON.stringify(exportData)
  }

  // Clear all data (for testing/reset)
  async clearAllData(): Promise<void> {
    if (!this.db) throw new Error("Database not initialized")

    const storeNames = Array.from(this.db.objectStoreNames)

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeNames, "readwrite")

      transaction.onerror = () => reject(transaction.error)
      transaction.oncomplete = () => resolve()

      storeNames.forEach((storeName) => {
        transaction.objectStore(storeName).clear()
      })
    })
  }
}

export const offlineStorage = new OfflineStorage()
export type { UserProfile, BiometricTemplate, TransactionRecord, SecurityEvent }
