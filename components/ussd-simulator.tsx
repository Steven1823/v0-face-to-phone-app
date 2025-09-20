"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Phone, ArrowLeft, CheckCircle } from "lucide-react"

interface USSDState {
  screen:
    | "dial"
    | "menu"
    | "balance"
    | "transactions"
    | "verify"
    | "report"
    | "lock"
    | "register"
    | "support"
    | "success"
  input: string
  history: string[]
}

export function USSDSimulator() {
  const [state, setState] = useState<USSDState>({
    screen: "dial",
    input: "",
    history: [],
  })

  const handleDial = () => {
    if (state.input === "*123#") {
      setState((prev) => ({
        ...prev,
        screen: "menu",
        history: [...prev.history, "Dialed *123#"],
      }))
    }
  }

  const handleMenuSelect = (option: number) => {
    const menuOptions = [
      "Check Balance",
      "Review Transaction Status",
      "Verify Transaction",
      "Report Suspicious Activity",
      "Lock Account Now",
      "Register to Use USSD Flow",
      "Request Support",
    ]

    setState((prev) => ({
      ...prev,
      history: [...prev.history, `Selected: ${menuOptions[option - 1]}`],
    }))

    switch (option) {
      case 1:
        setState((prev) => ({ ...prev, screen: "balance" }))
        break
      case 2:
        setState((prev) => ({ ...prev, screen: "transactions" }))
        break
      case 3:
        setState((prev) => ({ ...prev, screen: "verify" }))
        break
      case 4:
        setState((prev) => ({ ...prev, screen: "report" }))
        break
      case 5:
        setState((prev) => ({ ...prev, screen: "lock" }))
        break
      case 6:
        setState((prev) => ({ ...prev, screen: "register" }))
        break
      case 7:
        setState((prev) => ({ ...prev, screen: "support" }))
        break
    }
  }

  const handleRegister = () => {
    setState((prev) => ({
      ...prev,
      screen: "success",
      history: [...prev.history, "Registration completed"],
    }))
  }

  const resetToMenu = () => {
    setState((prev) => ({ ...prev, screen: "menu" }))
  }

  const resetToDial = () => {
    setState({ screen: "dial", input: "", history: [] })
  }

  return (
    <Card className="glass max-w-md mx-auto border-primary/20">
      <CardHeader className="text-center">
        <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-2 glow">
          <Phone className="w-6 h-6 text-white" />
        </div>
        <CardTitle className="text-primary">USSD Simulator</CardTitle>
        <Badge variant="outline" className="glass border-accent/30 text-accent w-fit mx-auto">
          Feature Phone Compatible
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Phone Screen */}
        <div className="bg-black/80 rounded-lg p-4 font-mono text-green-400 min-h-[300px] border border-green-400/30">
          {state.screen === "dial" && (
            <div className="space-y-4">
              <div className="text-center text-white mb-4">📱 Feature Phone</div>
              <div>Enter USSD Code:</div>
              <Input
                value={state.input}
                onChange={(e) => setState((prev) => ({ ...prev, input: e.target.value }))}
                placeholder="*123#"
                className="bg-black/50 border-green-400/50 text-green-400"
              />
              <Button
                onClick={handleDial}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={state.input !== "*123#"}
              >
                📞 Dial
              </Button>
            </div>
          )}

          {state.screen === "menu" && (
            <div className="space-y-2">
              <div className="text-center text-white mb-4">*123# Face-to-Phone Menu</div>
              <div className="space-y-1">
                <div>1. Check Balance</div>
                <div>2. Review Transaction Status</div>
                <div>3. Verify Transaction (Enter Txn ID)</div>
                <div>4. Report Suspicious Activity</div>
                <div>5. Lock Account Now</div>
                <div>6. Register to Use USSD Flow</div>
                <div>7. Request Support</div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <Button
                    key={num}
                    onClick={() => handleMenuSelect(num)}
                    variant="outline"
                    size="sm"
                    className="bg-green-600/20 border-green-400/50 text-green-400 hover:bg-green-600/40"
                  >
                    {num}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {state.screen === "balance" && (
            <div className="space-y-4">
              <div className="text-white">💰 Account Balance</div>
              <div>Current Balance: KSH 15,420.50</div>
              <div>Available: KSH 15,420.50</div>
              <div>Last Transaction: -KSH 500.00</div>
              <div className="text-yellow-400">Status: SECURE ✅</div>
              <Button
                onClick={resetToMenu}
                variant="outline"
                size="sm"
                className="bg-green-600/20 border-green-400/50 text-green-400"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Menu
              </Button>
            </div>
          )}

          {state.screen === "transactions" && (
            <div className="space-y-4">
              <div className="text-white">📋 Transaction Status</div>
              <div className="space-y-2 text-sm">
                <div>TXN001: KSH 500 - APPROVED ✅</div>
                <div>TXN002: KSH 1200 - APPROVED ✅</div>
                <div>TXN003: KSH 50000 - DECLINED ❌</div>
                <div className="text-red-400">Reason: Amount anomaly detected</div>
              </div>
              <Button
                onClick={resetToMenu}
                variant="outline"
                size="sm"
                className="bg-green-600/20 border-green-400/50 text-green-400"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Menu
              </Button>
            </div>
          )}

          {state.screen === "register" && (
            <div className="space-y-4">
              <div className="text-white">📝 Register for USSD</div>
              <div>Enter your name:</div>
              <Input placeholder="Full Name" className="bg-black/50 border-green-400/50 text-green-400" />
              <div>Create PIN:</div>
              <Input
                type="password"
                placeholder="4-digit PIN"
                className="bg-black/50 border-green-400/50 text-green-400"
              />
              <Button onClick={handleRegister} className="w-full bg-green-600 hover:bg-green-700">
                Register
              </Button>
            </div>
          )}

          {state.screen === "success" && (
            <div className="space-y-4 text-center">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
              <div className="text-white text-lg">Welcome to our Super Power App!</div>
              <div className="text-green-400">Registration successful! 🎉</div>
              <div className="text-sm">You can now use USSD services.</div>
              <Button onClick={resetToDial} className="w-full bg-green-600 hover:bg-green-700">
                Start Over
              </Button>
            </div>
          )}

          {state.screen === "lock" && (
            <div className="space-y-4 text-center">
              <div className="text-red-400 text-lg">🔒 ACCOUNT LOCKED</div>
              <div className="text-white">Your account has been secured.</div>
              <div className="text-yellow-400">Contact support to unlock.</div>
              <Button
                onClick={resetToMenu}
                variant="outline"
                size="sm"
                className="bg-green-600/20 border-green-400/50 text-green-400"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Menu
              </Button>
            </div>
          )}

          {state.screen === "support" && (
            <div className="space-y-4">
              <div className="text-white">📞 Support Request</div>
              <div>Connecting to agent...</div>
              <div className="text-green-400">Agent: Hello! How can I help?</div>
              <div className="text-blue-400">You: I need help with my account</div>
              <div className="text-green-400">Agent: I'll assist you right away.</div>
              <Button
                onClick={resetToMenu}
                variant="outline"
                size="sm"
                className="bg-green-600/20 border-green-400/50 text-green-400"
              >
                <ArrowLeft className="w-4 h-4 mr-1" /> Back to Menu
              </Button>
            </div>
          )}
        </div>

        {/* History */}
        {state.history.length > 0 && (
          <div className="text-xs text-muted-foreground">
            <div className="font-medium mb-1">Session History:</div>
            {state.history.map((item, index) => (
              <div key={index}>• {item}</div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
