"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Smartphone, ArrowLeft, Shield, AlertTriangle, Lock, Phone, CheckCircle, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"

type MenuState = "main" | "register" | "verify" | "support" | "transactions"

export default function USSDPage() {
  const router = useRouter()
  const [currentMenu, setCurrentMenu] = useState<MenuState>("main")
  const [input, setInput] = useState("")
  const [response, setResponse] = useState("")
  const [transactionId, setTransactionId] = useState("")
  const [userName, setUserName] = useState("")

  const handleMenuSelect = (option: string) => {
    switch (option) {
      case "1":
        setResponse("Balance: KSh 45,230.50\nAvailable: KSh 43,100.25\nLast updated: Today 14:32\n\nPress 0 for main menu")
        break
      case "2":
        setCurrentMenu("transactions")
        setResponse("Loading transaction history...")
        setTimeout(() => {
          setResponse(
            "Recent Transactions:\n\n1. KSh 2,500 - Mpesa Transfer\n   Status: ✅ APPROVED\n   Risk: Low (2/10)\n   Time: Today 13:45\n\n2. KSh 850 - Airtime Purchase\n   Status: ✅ APPROVED\n   Risk: Low (1/10)\n   Time: Today 12:30\n\n3. KSh 15,000 - Bank Transfer\n   Status: ❌ DECLINED\n   Risk: High (8/10)\n   Reason: Fraud Alert - Face mismatch\n   Time: Today 11:15\n\n4. KSh 5,200 - Online Payment\n   Status: ⏳ PENDING\n   Risk: Medium (5/10)\n   Reason: Unusual merchant\n   Time: Today 10:00\n\nPress 0 for main menu"
          )
        }, 1500)
        break
      case "3":
        setCurrentMenu("verify")
        setResponse("Enter Transaction ID to verify:\n(Format: TXN123456)")
        break
      case "4":
        setResponse(
          "🚨 SUSPICIOUS ACTIVITY REPORTED\n\nReference: SA-2024-001\nTimestamp: " + new Date().toLocaleString() + "\n\nOur security team will investigate within 24 hours.\n\nThank you for keeping your account safe!\n\nEmergency Support: *911#\n\nPress 0 for main menu"
        )
        break
      case "5":
        setResponse(
          "⚠️ ACCOUNT LOCKED SUCCESSFULLY\n\nYour account is now secured against unauthorized access.\n\nTo unlock:\n• Visit nearest branch with ID\n• Call support: 0800-FRAUD-HELP\n• Use mobile app with biometrics\n\nEmergency Support: *911#\n\nYour safety is our priority! 🛡️"
        )
        break
      case "6":
        setCurrentMenu("register")
        setResponse("Welcome to Face-to-Phone USSD!\n\nEnter your full name to register:")
        break
      case "7":
        setCurrentMenu("support")
        setResponse("Loading support options...")
        setTimeout(() => {
          setResponse("Support Options:\n\n1. Chat with Agent (Available)\n2. Request Callback (24/7)\n3. Emergency Line (Immediate)\n4. Branch Locator (Nearby)\n5. Fraud Helpline (Dedicated)\n\nSelect option or press 0 for main menu")
        }, 1000)
        break
      default:
        setResponse("Invalid option. Please try again.\n\nPress 0 for main menu")
    }
  }

  const handleRegister = () => {
    if (input.trim()) {
      setUserName(input)
      setResponse(
        `🎉 Welcome to our Super Power App!\n\nHi ${input}!\n\nYour USSD access is now active.\nYou can now use *123# anytime for:\n• Balance checks\n• Transaction verification\n• Fraud reporting\n• Account security\n\nStay safe with Face-to-Phone! 🛡️\n\nPress 0 for main menu`
      )
      setInput("")
      // Store registration in localStorage for demo
      localStorage.setItem("ussd_registered_user", input)
    }
  }

  const handleVerifyTransaction = () => {
    if (transactionId.trim()) {
      const mockResults = [
        {
          status: "approved",
          message: `✅ TRANSACTION APPROVED\n\nID: ${transactionId}\nAmount: KSh 5,000\nRecipient: John Doe\nStatus: Completed\nFraud Score: Low (2/10)\nBiometric: Face verified ✓\nTime: ${new Date().toLocaleString()}\n\nTransaction is safe! 🛡️`
        },
        {
          status: "pending", 
          message: `⏳ TRANSACTION PENDING\n\nID: ${transactionId}\nAmount: KSh 25,000\nRecipient: Unknown Merchant\nStatus: Under Review\nFraud Score: High (8/10)\nReason: Unusual amount + time\n\nAction Required:\n• Biometric verification needed\n• Visit branch or use mobile app\n\nEstimated resolution: 2 hours`
        },
        {
          status: "blocked",
          message: `❌ TRANSACTION BLOCKED\n\nID: ${transactionId}\nAmount: KSh 50,000\nRecipient: Suspicious Account\nStatus: Fraud Prevention\nFraud Score: Critical (10/10)\n\nReasons:\n• Face verification failed\n• Device fingerprint mismatch\n• Unusual transaction pattern\n\nYour account is safe! 🛡️\nNo money was transferred.`
        }
      ]
      const result = mockResults[Math.floor(Math.random() * mockResults.length)]
      setResponse(result.message + "\n\nPress 0 for main menu")
      setTransactionId("")
    }
  }

  const handleSupportOption = (option: string) => {
    const supportResponses = {
      "1": "🤖 CHAT AGENT CONNECTED\n\nAgent Sarah: Hello! I'm here to help with your Face-to-Phone account.\n\nHow can I assist you today?\n• Account security\n• Transaction issues\n• Fraud concerns\n• Technical support\n\nType your message or press 0 for main menu",
      "2": "📞 CALLBACK REQUESTED\n\nWe'll call you within 15 minutes at your registered number.\n\nCallback ID: CB-2024-001\nEstimated time: 10-15 minutes\nTopic: General Support\n\nYou can continue using USSD while waiting.\n\nPress 0 for main menu",
      "3": "🚨 EMERGENCY LINE\n\nConnecting to emergency support...\n\nFor immediate fraud concerns:\n• Call: 0800-FRAUD-911\n• SMS: HELP to 40404\n• WhatsApp: +254-FRAUD-HELP\n\nAvailable 24/7 in English & Swahili\n\nPress 0 for main menu",
      "4": "📍 BRANCH LOCATOR\n\nNearest branches:\n\n1. Westlands Branch\n   Distance: 2.3 km\n   Open: Mon-Fri 8AM-5PM\n   Services: Full service\n\n2. CBD Branch\n   Distance: 4.1 km\n   Open: Mon-Sat 8AM-6PM\n   Services: Full service\n\n3. Eastlands Branch\n   Distance: 6.8 km\n   Open: Mon-Fri 9AM-4PM\n   Services: Basic service\n\nPress 0 for main menu",
      "5": "🛡️ FRAUD HELPLINE\n\nDedicated fraud support:\n\nHotline: 0800-NO-FRAUD\nWhatsApp: +254-FRAUD-STOP\nEmail: fraud@facephone.co.ke\n\nAvailable 24/7\nResponse time: < 5 minutes\n\nFor immediate threats:\n• Lock account: Press 5 from main menu\n• Report fraud: Press 4 from main menu\n\nPress 0 for main menu"
    }
    
    setResponse(supportResponses[option as keyof typeof supportResponses] || "Invalid option. Press 0 for main menu")
  }

  const resetToMain = () => {
    setCurrentMenu("main")
    setResponse("")
    setInput("")
    setTransactionId("")
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
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 glow pulse-glow">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-lg">Face-to-Phone USSD</CardTitle>
            <p className="text-sm text-muted-foreground">*123# Menu System</p>
            {userName && (
              <Badge variant="outline" className="glass border-secondary/30 text-secondary mt-2">
                Registered: {userName}
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            {currentMenu === "main" && (
              <div className="space-y-3">
                <div className="text-center text-sm font-mono bg-gradient-to-r from-primary/10 to-secondary/10 p-3 rounded-lg border border-primary/20">
                  *123# Face-to-Phone Menu
                </div>
                <div className="space-y-2">
                  {[
                    { option: "1. Check Balance", icon: "💰" },
                    { option: "2. Review Transaction Status", icon: "📊" },
                    { option: "3. Verify Transaction (Enter Txn ID)", icon: "🔍" },
                    { option: "4. Report Suspicious Activity", icon: "🚨" },
                    { option: "5. Lock Account Now", icon: "🔒" },
                    { option: "6. Register to Use USSD Flow", icon: "📝" },
                    { option: "7. Request Support", icon: "🆘" },
                  ].map((item, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start text-left glass border-primary/20 hover:bg-primary/10 bg-transparent ripple-effect"
                      onClick={() => handleMenuSelect((index + 1).toString())}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.option}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {currentMenu === "register" && (
              <div className="space-y-4">
                <div className="text-sm font-mono bg-gradient-to-r from-secondary/10 to-accent/10 p-3 rounded-lg border border-secondary/20">
                  📝 Register for USSD Access
                </div>
                <Input
                  placeholder="Enter your full name"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="glass"
                />
                <div className="flex gap-2">
                  <Button onClick={handleRegister} className="flex-1 bg-gradient-to-r from-primary to-secondary ripple-effect">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Register
                  </Button>
                  <Button variant="outline" onClick={resetToMain} className="glass">
                    Back
                  </Button>
                </div>
              </div>
            )}

            {currentMenu === "verify" && (
              <div className="space-y-4">
                <div className="text-sm font-mono bg-gradient-to-r from-accent/10 to-primary/10 p-3 rounded-lg border border-accent/20">
                  🔍 Transaction Verification
                </div>
                <Input
                  placeholder="Enter Transaction ID (e.g., TXN123456)"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="glass"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleVerifyTransaction}
                    className="flex-1 bg-gradient-to-r from-secondary to-accent ripple-effect"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Verify
                  </Button>
                  <Button variant="outline" onClick={resetToMain} className="glass">
                    Back
                  </Button>
                </div>
              </div>
            )}

            {currentMenu === "support" && (
              <div className="space-y-3">
                <div className="text-sm font-mono bg-gradient-to-r from-destructive/10 to-secondary/10 p-3 rounded-lg border border-destructive/20">
                  🆘 Support Options
                </div>
                <div className="space-y-2">
                  {[
                    { label: "1. Chat with Agent", icon: Phone, color: "primary" },
                    { label: "2. Request Callback", icon: Phone, color: "secondary" },
                    { label: "3. Emergency Line", icon: AlertTriangle, color: "destructive" },
                    { label: "4. Branch Locator", icon: Shield, color: "accent" },
                    { label: "5. Fraud Helpline", icon: Lock, color: "destructive" },
                  ].map((option, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className={`w-full justify-start text-left glass border-${option.color}/20 hover:bg-${option.color}/10 bg-transparent ripple-effect`}
                      onClick={() => handleSupportOption((index + 1).toString())}
                    >
                      <option.icon className="w-4 h-4 mr-2" />
                      {option.label}
                    </Button>
                  ))}
                </div>
                <Button variant="outline" onClick={resetToMain} className="w-full glass">
                  0. Back to Main Menu
                </Button>
              </div>
            )}

            {currentMenu === "transactions" && (
              <div className="space-y-3">
                <div className="text-sm font-mono bg-gradient-to-r from-secondary/10 to-primary/10 p-3 rounded-lg border border-secondary/20">
                  📊 Transaction History
                </div>
                <Button variant="outline" onClick={resetToMain} className="w-full glass">
                  0. Back to Main Menu
                </Button>
              </div>
            )}

            {/* Response Display */}
            {response && (
              <div className="mt-4 p-4 bg-gradient-to-r from-secondary/10 to-accent/10 border border-secondary/20 rounded-lg slide-in">
                <div className="flex items-start space-x-2">
                  <Shield className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <div className="text-sm font-mono whitespace-pre-line text-secondary-foreground">{response}</div>
                </div>
                {response.includes("Press 0 for main menu") && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={resetToMain} 
                    className="mt-3 glass border-primary/30 text-primary"
                  >
                    0. Main Menu
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Emergency Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="glass border-destructive/30 text-destructive hover:bg-destructive/10 bg-transparent ripple-effect"
            onClick={() => handleMenuSelect("5")}
          >
            <Lock className="w-4 h-4 mr-2" />
            🚨 Emergency Lock
          </Button>
          <Button
            variant="outline"
            className="glass border-accent/30 text-accent hover:bg-accent/10 bg-transparent ripple-effect"
            onClick={() => handleMenuSelect("4")}
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            📢 Report Fraud
          </Button>
        </div>

        {/* Demo Info */}
        <Card className="glass mt-6 border-primary/20">
          <CardContent className="p-4">
            <div className="text-center">
              <Badge variant="outline" className="glass border-primary/30 text-primary mb-2">
                Demo Mode
              </Badge>
              <p className="text-xs text-muted-foreground">
                This USSD simulator demonstrates offline-capable fraud prevention features for feature phones across Africa.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}