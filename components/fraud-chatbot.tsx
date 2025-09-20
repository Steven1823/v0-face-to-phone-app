"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Shield, AlertTriangle, X, Send } from "lucide-react"

interface ChatMessage {
  id: string
  type: "bot" | "user"
  message: string
  timestamp: Date
}

export function FraudChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "bot",
      message:
        "Hi! I'm your AI Fraud Coach. I can help you stay safe from scams and fraud. What would you like to know?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")

  const fraudTips = [
    "Never share your PIN or password with anyone",
    "Always verify transaction details before confirming",
    "Be cautious of unsolicited calls asking for personal info",
    "Check your account regularly for unauthorized transactions",
    "Use biometric authentication when available",
  ]

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      message: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate bot response
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        message: getBotResponse(inputMessage),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
    }, 1000)

    setInputMessage("")
  }

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes("fraud") || input.includes("scam")) {
      return "🛡️ Great question! Here are key fraud prevention tips: Always verify the sender's identity, never share sensitive info via phone/email, and trust your instincts if something feels suspicious."
    }

    if (input.includes("pin") || input.includes("password")) {
      return "🔒 Your PIN/password should never be shared with anyone - not even bank staff! Always enter it privately and change it regularly."
    }

    if (input.includes("transaction") || input.includes("payment")) {
      return "💳 Before any transaction: 1) Verify recipient details 2) Check the amount 3) Use biometric verification 4) Keep transaction receipts"
    }

    return "🤖 I'm here to help keep you safe! You can ask me about fraud prevention, secure transactions, or report suspicious activity."
  }

  const reportFraud = () => {
    const alertMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "bot",
      message:
        "🚨 Fraud report initiated! Your report has been logged and our security team will investigate. Stay vigilant and avoid any suspicious activities.",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, alertMessage])
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary chatbot-pulse z-40"
        size="icon"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center p-4">
          <Card className="w-full max-w-md h-96 glass animate-in slide-in-from-bottom-4">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span>AI Fraud Coach</span>
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>

            <CardContent className="flex flex-col h-full">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"} slide-in`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.type === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <p className="text-sm">{msg.message}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => setInputMessage("How to prevent fraud?")}
                >
                  Fraud Tips
                </Badge>
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:bg-destructive/10 text-destructive border-destructive"
                  onClick={reportFraud}
                >
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Report Fraud
                </Badge>
              </div>

              {/* Input */}
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about fraud prevention..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} size="icon" className="ripple-effect">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
