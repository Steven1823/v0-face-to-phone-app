// Biometric data storage with WebCrypto encryption
// This is a placeholder implementation for the hackathon demo

export class BiometricStorage {
  private static readonly STORAGE_KEY_FACE = "face_biometric_data"
  private static readonly STORAGE_KEY_VOICE = "voice_biometric_data"
  private static readonly STORAGE_KEY_SALT = "biometric_salt"

  // Generate or retrieve encryption key
  private static async getEncryptionKey(): Promise<CryptoKey> {
    let salt = localStorage.getItem(this.STORAGE_KEY_SALT)

    if (!salt) {
      const saltArray = crypto.getRandomValues(new Uint8Array(16))
      salt = Array.from(saltArray)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
      localStorage.setItem(this.STORAGE_KEY_SALT, salt)
    }

    const encoder = new TextEncoder()
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode("biometric-key-" + salt),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"],
    )

    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt: encoder.encode(salt),
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"],
    )
  }

  // Encrypt data
  private static async encryptData(data: string): Promise<string> {
    const key = await this.getEncryptionKey()
    const encoder = new TextEncoder()
    const iv = crypto.getRandomValues(new Uint8Array(12))

    const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoder.encode(data))

    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength)
    combined.set(iv)
    combined.set(new Uint8Array(encrypted), iv.length)

    return Array.from(combined)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
  }

  // Decrypt data
  private static async decryptData(encryptedHex: string): Promise<string> {
    const key = await this.getEncryptionKey()
    const encrypted = new Uint8Array(encryptedHex.match(/.{1,2}/g)!.map((byte) => Number.parseInt(byte, 16)))

    const iv = encrypted.slice(0, 12)
    const data = encrypted.slice(12)

    const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data)

    return new TextDecoder().decode(decrypted)
  }

  // Store face biometric data
  static async storeFaceData(imageData: string): Promise<void> {
    try {
      // In a real implementation, this would extract face embeddings using face-api.js
      const faceEmbedding = await this.simulateFaceEmbedding(imageData)
      const encrypted = await this.encryptData(JSON.stringify(faceEmbedding))

      localStorage.setItem(this.STORAGE_KEY_FACE, encrypted)
      console.log("[BiometricStorage] Face data stored securely")
    } catch (error) {
      console.error("[BiometricStorage] Failed to store face data:", error)
      throw new Error("Failed to store face biometric data")
    }
  }

  // Store voice biometric data
  static async storeVoiceData(audioBlob: Blob): Promise<void> {
    try {
      // In a real implementation, this would extract voice features using whisper.cpp or MFCC
      const voiceFeatures = await this.simulateVoiceFeatures(audioBlob)
      const encrypted = await this.encryptData(JSON.stringify(voiceFeatures))

      localStorage.setItem(this.STORAGE_KEY_VOICE, encrypted)
      console.log("[BiometricStorage] Voice data stored securely")
    } catch (error) {
      console.error("[BiometricStorage] Failed to store voice data:", error)
      throw new Error("Failed to store voice biometric data")
    }
  }

  // Verify face biometric
  static async verifyFace(imageData: string): Promise<{ match: boolean; confidence: number }> {
    try {
      const storedData = localStorage.getItem(this.STORAGE_KEY_FACE)
      if (!storedData) {
        throw new Error("No face biometric data found")
      }

      const decrypted = await this.decryptData(storedData)
      const storedEmbedding = JSON.parse(decrypted)
      const currentEmbedding = await this.simulateFaceEmbedding(imageData)

      // Simulate face matching with some randomness for demo
      const similarity = this.calculateSimilarity(storedEmbedding, currentEmbedding)
      const match = similarity > 0.8

      console.log("[BiometricStorage] Face verification:", { match, confidence: similarity })
      return { match, confidence: similarity }
    } catch (error) {
      console.error("[BiometricStorage] Face verification failed:", error)
      return { match: false, confidence: 0 }
    }
  }

  // Verify voice biometric
  static async verifyVoice(audioBlob: Blob): Promise<{ match: boolean; confidence: number }> {
    try {
      const storedData = localStorage.getItem(this.STORAGE_KEY_VOICE)
      if (!storedData) {
        throw new Error("No voice biometric data found")
      }

      const decrypted = await this.decryptData(storedData)
      const storedFeatures = JSON.parse(decrypted)
      const currentFeatures = await this.simulateVoiceFeatures(audioBlob)

      // Simulate voice matching with some randomness for demo
      const similarity = this.calculateSimilarity(storedFeatures, currentFeatures)
      const match = similarity > 0.75

      console.log("[BiometricStorage] Voice verification:", { match, confidence: similarity })
      return { match, confidence: similarity }
    } catch (error) {
      console.error("[BiometricStorage] Voice verification failed:", error)
      return { match: false, confidence: 0 }
    }
  }

  // Check if biometric data exists
  static hasBiometricData(): boolean {
    return !!(localStorage.getItem(this.STORAGE_KEY_FACE) && localStorage.getItem(this.STORAGE_KEY_VOICE))
  }

  // Clear all biometric data
  static clearBiometricData(): void {
    localStorage.removeItem(this.STORAGE_KEY_FACE)
    localStorage.removeItem(this.STORAGE_KEY_VOICE)
    localStorage.removeItem(this.STORAGE_KEY_SALT)
    console.log("[BiometricStorage] All biometric data cleared")
  }

  // Simulate face embedding extraction (placeholder for face-api.js)
  private static async simulateFaceEmbedding(imageData: string): Promise<number[]> {
    // In real implementation, use face-api.js to extract 128-dimensional face embedding
    const hash = await this.hashString(imageData)
    return Array.from({ length: 128 }, (_, i) => (hash.charCodeAt(i % hash.length) / 255) * 2 - 1)
  }

  // Simulate voice feature extraction (placeholder for whisper.cpp/MFCC)
  private static async simulateVoiceFeatures(audioBlob: Blob): Promise<number[]> {
    // In real implementation, extract MFCC features or use whisper.cpp embeddings
    const arrayBuffer = await audioBlob.arrayBuffer()
    const hash = await this.hashArrayBuffer(arrayBuffer)
    return Array.from({ length: 64 }, (_, i) => (hash.charCodeAt(i % hash.length) / 255) * 2 - 1)
  }

  // Calculate similarity between two feature vectors
  private static calculateSimilarity(vec1: number[], vec2: number[]): number {
    if (vec1.length !== vec2.length) return 0

    let dotProduct = 0
    let norm1 = 0
    let norm2 = 0

    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i]
      norm1 += vec1[i] * vec1[i]
      norm2 += vec2[i] * vec2[i]
    }

    const similarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2))

    // Add some randomness for demo purposes (0.7-0.95 for legitimate users)
    const randomFactor = 0.8 + Math.random() * 0.15
    return Math.min(0.95, similarity * randomFactor)
  }

  // Hash string for simulation
  private static async hashString(str: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(str)
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => String.fromCharCode(b)).join("")
  }

  // Hash ArrayBuffer for simulation
  private static async hashArrayBuffer(buffer: ArrayBuffer): Promise<string> {
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map((b) => String.fromCharCode(b)).join("")
  }
}
