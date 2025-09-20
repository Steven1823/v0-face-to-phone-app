"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, X, AlertTriangle, Send, Bot } from "lucide-react"

interface ChatMessage {
  id: string
  type: "user" | "bot"
  message: string
  timestamp: Date
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    // Initialize with welcome message
    if (messages.length === 0) {
      setMessages([
        {
          id: "1",
          type: "bot",
          message:
            "👋 Hi! I'm your Fraud Prevention Assistant. I can help you stay safe from scams and suspicious activities. Ask me anything!",
          timestamp: new Date(),
        },
      ])
    }
  }, [messages.length])

  const fraudTips = [
    "🔒 Never share your PIN or biometric data with anyone",
    "📱 Be cautious of SIM swap attacks - contact your carrier if you lose signal unexpectedly",
    "🌍 Verify transactions from unusual locations before proceeding",
    "⚡ Multiple rapid transactions may indicate account compromise",
    "👁️ Always verify your identity with biometrics for high-value transactions",
    "🛡️ Report suspicious activities immediately using the alert button",
  ]

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      message: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue.toLowerCase())
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        message: botResponse,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const getBotResponse = (input: string): string => {
    if (input.includes("fraud") || input.includes("scam")) {
      return "🛡️ Here are key fraud prevention tips:\n\n• Never share your login credentials\n• Verify unusual transactions\n• Use biometric authentication\n• Report suspicious activities immediately\n\nWould you like specific advice about any type of fraud?"
    }

    if (input.includes("sim swap") || input.includes("sim")) {
      return "📱 SIM Swap Protection:\n\n• Contact your carrier immediately if you lose signal\n• Set up carrier security PIN\n• Use app-based 2FA instead of SMS when possible\n• Monitor for unexpected account access notifications"
    }

    if (input.includes("biometric") || input.includes("face") || input.includes("voice")) {
      return "👁️ Biometric Security Tips:\n\n• Keep your face and voice samples private\n• Re-enroll if you notice authentication issues\n• Use multiple biometric factors for high-value transactions\n• Never let others use your biometric data"
    }

    if (input.includes("transaction") || input.includes("payment")) {
      return "💳 Transaction Security:\n\n• Verify recipient details carefully\n• Check transaction amounts before confirming\n• Use biometric verification for large amounts\n• Monitor your account regularly for unauthorized transactions"
    }

    return (
      fraudTips[Math.floor(Math.random() * fraudTips.length)] +
      "\n\nNeed help with something specific? Ask me about fraud prevention, SIM swaps, biometric security, or transaction safety!"
    )
  }

  const reportFraud = () => {
    const alertMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "bot",
      message:
        "🚨 Fraud Report Initiated\n\nI've logged your fraud report. Here's what happens next:\n\n1. Your account is temporarily secured\n2. All transactions are flagged for review\n3. Security team will investigate\n4. You'll receive updates via secure notifications\n\nStay safe! 🛡️",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, alertMessage])
  }

  return (
    <>
      {/* Floating chat button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-40 pulse-gold ${isOpen ? "hidden" : ""}`}
        size="lg"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Chat widget */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 h-96 shadow-2xl z-50 flex flex-col slide-in-right">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-sm">Fraud Coach</CardTitle>
                  <CardDescription className="text-xs">AI Security Assistant</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-3">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-3">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] p-2 rounded-lg text-sm ${
                      message.type === "user" ? "bg-primary text-white" : "bg-muted text-foreground"
                    }`}
                  >
                    <div className="whitespace-pre-line">{message.message}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted p-2 rounded-lg text-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick actions */}
            <div className="flex space-x-2 mb-3">
              <Button variant="outline" size="sm" onClick={reportFraud} className="flex-1 text-xs bg-transparent">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Report Fraud
              </Button>
            </div>

            {/* Input */}
            <div className="flex space-x-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about fraud prevention..."
                className="flex-1 text-sm"
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <Button onClick={handleSendMessage} size="sm" disabled={!inputValue.trim() || isTyping}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
