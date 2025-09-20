export class FingerprintAuth {
  private static instance: FingerprintAuth

  static getInstance(): FingerprintAuth {
    if (!FingerprintAuth.instance) {
      FingerprintAuth.instance = new FingerprintAuth()
    }
    return FingerprintAuth.instance
  }

  async isSupported(): Promise<boolean> {
    try {
      if (!navigator.credentials || !window.PublicKeyCredential) {
        return false
      }

      // Check if the feature is explicitly disabled by permissions policy
      if (document.featurePolicy && document.featurePolicy.allowsFeature) {
        const allowed = document.featurePolicy.allowsFeature("publickey-credentials-create")
        if (!allowed) {
          console.log("WebAuthn disabled by permissions policy")
          return false
        }
      }

      // Check if the feature is available in this context
      if (typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === "function") {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        return available
      }

      return true
    } catch (error) {
      console.warn("WebAuthn support check failed:", error)
      return false
    }
  }

  async register(userId: string, userName: string): Promise<boolean> {
    try {
      const isSupported = await this.isSupported()
      if (!isSupported) {
        console.log("WebAuthn not supported or disabled, using simulation mode")
        return await this.simulateFingerprint(userId)
      }

      try {
        const testChallenge = new Uint8Array(1)
        crypto.getRandomValues(testChallenge)
      } catch (error) {
        console.log("Crypto API not available, falling back to simulation")
        return await this.simulateFingerprint(userId)
      }

      const challenge = new Uint8Array(32)
      crypto.getRandomValues(challenge)

      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: "Face-to-Phone",
          id: window.location.hostname === "localhost" ? "localhost" : window.location.hostname,
        },
        user: {
          id: new TextEncoder().encode(userId),
          name: userName,
          displayName: userName,
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" }, // ES256
        ],
        authenticatorSelection: {
          userVerification: "preferred",
          residentKey: "preferred",
        },
        timeout: 30000,
        attestation: "none",
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
      if (error.message && error.message.includes("publickey-credentials-create")) {
        console.log("WebAuthn blocked by permissions policy, using simulation mode")
      } else {
        console.log("WebAuthn failed, falling back to fingerprint simulation mode")
      }
      return await this.simulateFingerprint(userId)
    }
  }

  async authenticate(userId: string): Promise<boolean> {
    try {
      const storedCredential = localStorage.getItem(`fingerprint_${userId}`)
      if (!storedCredential) {
        console.log("No stored credential, using simulation mode")
        return await this.simulateFingerprint(userId)
      }

      const credentialData = JSON.parse(storedCredential)

      if (credentialData.simulated) {
        return await this.simulateFingerprint(userId)
      }

      const isSupported = await this.isSupported()
      if (!isSupported) {
        console.log("WebAuthn not supported or disabled, using simulation mode")
        return await this.simulateFingerprint(userId)
      }

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
        timeout: 30000,
        userVerification: "preferred",
      }

      const assertion = (await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      })) as PublicKeyCredential

      return !!assertion
    } catch (error) {
      console.error("Fingerprint authentication failed:", error)
      if (error.message && error.message.includes("publickey-credentials")) {
        console.log("WebAuthn blocked by permissions policy, using simulation mode")
      } else {
        console.log("WebAuthn failed, falling back to fingerprint simulation mode")
      }
      return await this.simulateFingerprint(userId)
    }
  }

  async simulateFingerprint(userId?: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Store simulated credential for consistency
        const currentUserId = userId || localStorage.getItem("currentUserId")
        if (currentUserId) {
          const simulatedCredential = {
            simulated: true,
            userId: currentUserId,
            createdAt: new Date().toISOString(),
          }
          localStorage.setItem(`fingerprint_${currentUserId}`, JSON.stringify(simulatedCredential))
        }

        // 95% success rate for demo
        resolve(Math.random() > 0.05)
      }, 2000)
    })
  }

  async isSimulationMode(): Promise<boolean> {
    return !(await this.isSupported())
  }
}

export const fingerprintAuth = FingerprintAuth.getInstance()
