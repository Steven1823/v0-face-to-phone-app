export class FingerprintAuth {
  private static instance: FingerprintAuth

  static getInstance(): FingerprintAuth {
    if (!FingerprintAuth.instance) {
      FingerprintAuth.instance = new FingerprintAuth()
    }
    return FingerprintAuth.instance
  }

  async isSupported(): Promise<boolean> {
    return !!(navigator.credentials && window.PublicKeyCredential)
  }

  async register(userId: string, userName: string): Promise<boolean> {
    try {
      if (!(await this.isSupported())) {
        throw new Error("WebAuthn not supported")
      }

      const challenge = new Uint8Array(32)
      crypto.getRandomValues(challenge)

      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: "Face-to-Phone",
          id: window.location.hostname,
        },
        user: {
          id: new TextEncoder().encode(userId),
          name: userName,
          displayName: userName,
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" }, // ES256
          { alg: -257, type: "public-key" }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
        },
        timeout: 60000,
        attestation: "direct",
      }

      const credential = (await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      })) as PublicKeyCredential

      if (credential) {
        // Store credential info locally
        const credentialData = {
          id: credential.id,
          rawId: Array.from(new Uint8Array(credential.rawId)),
          type: credential.type,
          userId,
          createdAt: new Date().toISOString(),
        }

        localStorage.setItem(`fingerprint_${userId}`, JSON.stringify(credentialData))
        return true
      }

      return false
    } catch (error) {
      console.error("Fingerprint registration failed:", error)
      return false
    }
  }

  async authenticate(userId: string): Promise<boolean> {
    try {
      if (!(await this.isSupported())) {
        throw new Error("WebAuthn not supported")
      }

      const storedCredential = localStorage.getItem(`fingerprint_${userId}`)
      if (!storedCredential) {
        throw new Error("No fingerprint registered for this user")
      }

      const credentialData = JSON.parse(storedCredential)
      const challenge = new Uint8Array(32)
      crypto.getRandomValues(challenge)

      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge,
        allowCredentials: [
          {
            id: new Uint8Array(credentialData.rawId),
            type: "public-key",
          },
        ],
        timeout: 60000,
        userVerification: "required",
      }

      const assertion = (await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      })) as PublicKeyCredential

      return !!assertion
    } catch (error) {
      console.error("Fingerprint authentication failed:", error)
      return false
    }
  }

  async simulateFingerprint(): Promise<boolean> {
    // Simulate fingerprint scan for demo purposes
    return new Promise((resolve) => {
      setTimeout(() => {
        // 90% success rate for demo
        resolve(Math.random() > 0.1)
      }, 2000)
    })
  }
}

export const fingerprintAuth = FingerprintAuth.getInstance()
