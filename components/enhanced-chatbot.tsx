"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageCircle, Send, Shield, Lock, Phone, X, Bot } from "lucide-react"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  language: "en" | "sw"
  timestamp: Date
}

const fraudTips = {
  en: [
    "Tip: Real banks never ask for OTPs over the phone.",
    "Tip: If you see a SIM swap alert, lock your account immediately.",
    "Tip: Use fingerprint authentication for high-value transfers.",
    "Tip: Never share your PIN or password with anyone.",
    "Tip: Check your account regularly for unauthorized transactions.",
    "Tip: Be suspicious of urgent payment requests.",
    "Tip: Verify recipient details before sending money.",
  ],
  sw: [
    "Kidokezo: Benki halisi haziulizi OTP kwa simu.",
    "Kidokezo: Ukiona onyo la SIM swap, funga akaunti yako mara moja.",
    "Kidokezo: Tumia kidole chako kwa uhamisho wa pesa nyingi.",
    "Kidokezo: Usishiriki PIN au password yako na mtu yeyote.",
    "Kidokezo: Angalia akaunti yako mara kwa mara.",
    "Kidokezo: Kuwa na wasiwasi na maombi ya haraka ya malipo.",
    "Kidokezo: Thibitisha maelezo ya mpokeaji kabla ya kutuma pesa.",
  ],
}

export function EnhancedChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [language, setLanguage] = useState<"en" | "sw">("en")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Welcome message
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        type: "bot",
        content:
          language === "en"
            ? "Hello! I'm your AI Fraud Coach. I'm here to help keep your transactions safe. Ask me anything about fraud prevention!"
            : "Hujambo! Mimi ni Mkocha wako wa AI wa Ulaghai. Niko hapa kukusaidia kuweka miamala yako salama. Niulize chochote kuhusu kuzuia ulaghai!",
        language,
        timestamp: new Date(),
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, language])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      language,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(input, language)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: botResponse,
        language,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  const generateBotResponse = (userInput: string, lang: "en" | "sw"): string => {
    const input = userInput.toLowerCase()

    if (input.includes("otp") || input.includes("password")) {
      return lang === "en"
        ? "🛡️ Never share your OTP or password! Banks will never ask for these over phone or SMS. If someone asks, it's likely a scam."
        : "🛡️ Usishiriki OTP au password yako! Benki hazitauliza hivi kwa simu au SMS. Kama mtu anauliza, pengine ni ulaghai."
    }

    if (input.includes("suspicious") || input.includes("fraud")) {
      return lang === "en"
        ? "🚨 If you notice suspicious activity: 1) Lock your account immediately 2) Contact your bank 3) Report to authorities. Quick action prevents losses!"
        : "🚨 Ukiona shughuli za kutilia shaka: 1) Funga akaunti yako mara moja 2) Wasiliana na benki yako 3) Ripoti kwa mamlaka. Hatua za haraka zinazuia hasara!"
    }

    if (input.includes("transfer") || input.includes("send money")) {
      return lang === "en"
        ? "💰 Before sending money: 1) Verify recipient details 2) Use biometric authentication 3) Check transaction limits 4) Confirm with recipient via different channel."
        : "💰 Kabla ya kutuma pesa: 1) Thibitisha maelezo ya mpokeaji 2) Tumia uthibitishaji wa kibayolojia 3) Angalia mipaka ya miamala 4) Thibitisha na mpokeaji kwa njia nyingine."
    }

    // Random fraud tip
    const tips = fraudTips[lang]
    const randomTip = tips[Math.floor(Math.random() * tips.length)]

    return lang === "en"
      ? `I understand your concern. Here's a helpful tip: ${randomTip} Is there anything specific about fraud prevention you'd like to know?`
      : `Naelewa wasiwasi wako. Hapa kuna kidokezo cha kusaidia: ${randomTip} Je, kuna kitu maalum kuhusu kuzuia ulaghai ungependa kujua?`
  }

  const quickActions = [
    {
      label: language === "en" ? "Lock Account" : "Funga Akaunti",
      icon: Lock,
      action: () => alert(language === "en" ? "Account locked for security" : "Akaunti imefungwa kwa usalama"),
    },
    {
      label: language === "en" ? "Report Transaction" : "Ripoti Muamala",
      icon: Shield,
      action: () => alert(language === "en" ? "Transaction reported" : "Muamala umeripotiwa"),
    },
    {
      label: language === "en" ? "Call Support" : "Piga Msaada",
      icon: Phone,
      action: () => alert(language === "en" ? "Calling support..." : "Kupigia msaada..."),
    },
  ]

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg z-40 ${isOpen ? "hidden" : "animate-pulse"}`}
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 z-50">
          <Card className="glass h-full flex flex-col border-primary/20 shadow-2xl">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center animate-pulse">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-sm text-primary">AI Fraud Coach</CardTitle>
                    <div className="flex space-x-1">
                      <Button
                        variant={language === "en" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setLanguage("en")}
                        className="text-xs h-5 px-2"
                      >
                        EN
                      </Button>
                      <Button
                        variant={language === "sw" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setLanguage("sw")}
                        className="text-xs h-5 px-2"
                      >
                        SW
                      </Button>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-6 w-6 p-0">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-3 space-y-3">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] p-2 rounded-lg text-xs ${
                        message.type === "user" ? "bg-primary text-white" : "glass border border-white/10"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="glass border border-white/10 p-2 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce delay-100"></div>
                        <div className="w-1 h-1 bg-primary rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-1">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={action.action}
                    className="text-xs glass border-primary/30 h-6 bg-transparent"
                  >
                    <action.icon className="w-3 h-3 mr-1" />
                    {action.label}
                  </Button>
                ))}
              </div>

              {/* Input */}
              <div className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  placeholder={language === "en" ? "Ask about fraud prevention..." : "Uliza kuhusu kuzuia ulaghai..."}
                  className="text-xs glass border-white/20"
                />
                <Button
                  onClick={sendMessage}
                  size="sm"
                  className="bg-gradient-to-r from-primary to-secondary"
                  disabled={!input.trim()}
                >
                  <Send className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
