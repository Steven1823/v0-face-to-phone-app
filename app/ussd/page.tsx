"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Smartphone, ArrowLeft, Shield, AlertTriangle, Lock, Phone } from "lucide-react"
import { useRouter } from "next/navigation"

export default function USSDPage() {
  const router = useRouter()
  let currentMenu = "main"
  const [input, setInput] = useState("")
  const [response, setResponse] = useState("")
  const [transactionId, setTransactionId] = useState("")

  const handleMenuSelect = (option: string) => {
    switch (option) {
      case "1":
        setResponse("Balance: KSh 45,230.50\nAvailable: KSh 43,100.25\nLast updated: Today 14:32")
        break
      case "2":
        currentMenu = "transactions"
        setResponse(
          "Recent Transactions:\n1. KSh 2,500 - Mpesa Transfer (Approved)\n2. KSh 850 - Airtime Purchase (Approved)\n3. KSh 15,000 - Bank Transfer (Declined - Fraud Alert)",
        )
        break
      case "3":
        currentMenu = "verify"
        setResponse("Enter Transaction ID to verify:")
        break
      case "4":
        setResponse(
          "Suspicious Activity Reported.\nReference: SA-2024-001\nOur team will investigate within 24hrs.\nThank you for keeping your account safe!",
        )
        break
      case "5":
        setResponse(
          "⚠️ ACCOUNT LOCKED SUCCESSFULLY\nYour account is now secured.\nTo unlock, visit nearest branch with ID.\nEmergency Support: *911#",
        )
        break
      case "6":
        currentMenu = "register"
        setResponse("Enter your full name:")
        break
      case "7":
        currentMenu = "support"
        setResponse("Support Options:\n1. Chat with Agent\n2. Request Callback\n3. Emergency Line\n4. Branch Locator")
        break
      default:
        setResponse("Invalid option. Please try again.")
    }
  }

  const handleRegister = () => {
    if (input.trim()) {
      setResponse(
        `Welcome to our Super Power App!\nHi ${input}! Your USSD access is now active.\nYou can now use *123# anytime.\nStay safe with Face-to-Phone! 🛡️`,
      )
      setInput("")
    }
  }

  const handleVerifyTransaction = () => {
    if (transactionId.trim()) {
      const mockResults = [
        "✅ Transaction APPROVED\nID: " +
          transactionId +
          "\nAmount: KSh 5,000\nRecipient: John Doe\nStatus: Completed\nFraud Score: Low (2/10)",
        "⚠️ Transaction PENDING\nID: " +
          transactionId +
          "\nAmount: KSh 25,000\nRecipient: Unknown\nStatus: Under Review\nFraud Score: High (8/10)\nAction Required: Biometric verification needed",
        "❌ Transaction BLOCKED\nID: " +
          transactionId +
          "\nAmount: KSh 50,000\nRecipient: Suspicious Account\nStatus: Fraud Prevention\nFraud Score: Critical (10/10)\nYour account is safe!",
      ]
      setResponse(mockResults[Math.floor(Math.random() * mockResults.length)])
      setTransactionId("")
    }
  }

  return (
    <div className="min-h-screen animated-bg p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-foreground">USSD Simulator</h1>
          <Badge variant="outline" className="glass border-primary/30 text-primary">
            <Smartphone className="w-3 h-3 mr-1" />
            *123#
          </Badge>
        </div>

        {/* Phone Simulator */}
        <Card className="glass glow mb-6">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 glow">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-lg">Face-to-Phone USSD</CardTitle>
            <p className="text-sm text-muted-foreground">*123# Menu System</p>
          </CardHeader>
          <CardContent>
            {currentMenu === "main" && (
              <div className="space-y-3">
                <div className="text-center text-sm font-mono bg-muted p-3 rounded-lg">*123# Face-to-Phone Menu</div>
                <div className="space-y-2">
                  {[
                    "1. Check Balance",
                    "2. Review Transaction Status",
                    "3. Verify Transaction (Enter Txn ID)",
                    "4. Report Suspicious Activity",
                    "5. Lock Account Now",
                    "6. Register to Use USSD Flow",
                    "7. Request Support",
                  ].map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left glass border-primary/20 hover:bg-primary/10 bg-transparent"
                      onClick={() => handleMenuSelect((index + 1).toString())}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {currentMenu === "register" && (
              <div className="space-y-4">
                <div className="text-sm font-mono bg-muted p-3 rounded-lg">Register for USSD Access</div>
                <Input
                  placeholder="Enter your full name"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="glass"
                />
                <div className="flex gap-2">
                  <Button onClick={handleRegister} className="flex-1 bg-gradient-to-r from-primary to-secondary">
                    Register
                  </Button>
                  <Button variant="outline" onClick={() => (currentMenu = "main")} className="glass">
                    Back
                  </Button>
                </div>
              </div>
            )}

            {currentMenu === "verify" && (
              <div className="space-y-4">
                <div className="text-sm font-mono bg-muted p-3 rounded-lg">Transaction Verification</div>
                <Input
                  placeholder="Enter Transaction ID (e.g., TXN123456)"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="glass"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleVerifyTransaction}
                    className="flex-1 bg-gradient-to-r from-secondary to-accent"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Verify
                  </Button>
                  <Button variant="outline" onClick={() => (currentMenu = "main")} className="glass">
                    Back
                  </Button>
                </div>
              </div>
            )}

            {currentMenu === "support" && (
              <div className="space-y-3">
                <div className="text-sm font-mono bg-muted p-3 rounded-lg">Support Options</div>
                <div className="space-y-2">
                  {[
                    { label: "1. Chat with Agent", icon: Phone },
                    { label: "2. Request Callback", icon: Phone },
                    { label: "3. Emergency Line", icon: AlertTriangle },
                    { label: "4. Branch Locator", icon: Shield },
                  ].map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left glass border-accent/20 hover:bg-accent/10 bg-transparent"
                      onClick={() =>
                        setResponse(`${option.label} - Feature coming soon!\nFor immediate help, call: 0800-FRAUD-HELP`)
                      }
                    >
                      <option.icon className="w-4 h-4 mr-2" />
                      {option.label}
                    </Button>
                  ))}
                </div>
                <Button variant="outline" onClick={() => (currentMenu = "main")} className="w-full glass">
                  Back to Main Menu
                </Button>
              </div>
            )}

            {/* Response Display */}
            {response && (
              <div className="mt-4 p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Shield className="w-5 h-5 text-secondary mt-0.5" />
                  <div className="text-sm font-mono whitespace-pre-line text-secondary-foreground">{response}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="glass border-destructive/30 text-destructive hover:bg-destructive/10 bg-transparent"
            onClick={() => handleMenuSelect("5")}
          >
            <Lock className="w-4 h-4 mr-2" />
            Emergency Lock
          </Button>
          <Button
            variant="outline"
            className="glass border-accent/30 text-accent hover:bg-accent/10 bg-transparent"
            onClick={() => handleMenuSelect("4")}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Report Fraud
          </Button>
        </div>
      </div>
    </div>
  )
}
