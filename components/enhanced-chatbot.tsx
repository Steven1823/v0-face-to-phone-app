"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, X, Shield, Lock, Phone, AlertTriangle, Send } from "lucide-react"

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
  language: "en" | "sw"
}

export function EnhancedChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [language, setLanguage] = useState<"en" | "sw">("en")
  const [isTyping, setIsTyping] = useState(false)

  const fraudTips = {
    en: [
      "Tip: Real banks never ask for OTPs via phone calls.",
      "Tip: Never share your PIN or password with anyone.",
      "Tip: If you see a SIM swap alert, lock your account immediately.",
      "Tip: Use fingerprint verification for high-value transfers.",
      "Tip: Always verify transaction details before confirming.",
      "Tip: Report suspicious SMS messages immediately.",
      "Tip: Keep your banking app updated for latest security features.",
    ],
    sw: [
      "Kidokezo: Benki halisi haziulizi OTP kupitia simu.",
      "Kidokezo: Usimshirikishe mtu yeyote PIN au password yako.",
      "Kidokezo: Ukiona onyo la SIM swap, funga akaunti yako mara moja.",
      "Kidokezo: Tumia uthibitisho wa kidole kwa uhamisho wa pesa nyingi.",
      "Kidokezo: Hakikisha maelezo ya muamala kabla ya kuthibitisha.",
      "Kidokezo: Ripoti ujumbe wa SMS wa mashaka mara moja.",
      "Kidokezo: Weka programu ya benki yako sasa kwa usalama zaidi.",
    ],
  }

  const responses = {
    en: {
      greeting: "Hello! I'm your AI Fraud Coach. How can I help keep you safe today?",
      help: "I can help you with fraud prevention tips, account security, and reporting suspicious activity.",
      lock: "I'll help you lock your account immediately for security. Please confirm this action.",
      report: "Please describe the suspicious activity you'd like to report. I'll log it securely.",
      support: "Connecting you to our support team. They'll be with you shortly.",
    },
    sw: {
      greeting: "Hujambo! Mimi ni Mkocha wako wa AI wa Kuzuia Ulaghai. Ninawezaje kukusaidia kuwa salama leo?",
      help: "Ninaweza kukusaidia na vidokezo vya kuzuia ulaghai, usalama wa akaunti, na kuripoti shughuli za mashaka.",
      lock: "Nitakusaidia kufunga akaunti yako mara moja kwa usalama. Tafadhali thibitisha hatua hii.",
      report: "Tafadhali eleza shughuli za mashaka unazotaka kuripoti. Nitazirekodi kwa usalama.",
      support: "Ninakuunganisha na timu yetu ya msaada. Watakuwa nawe hivi karibuni.",
    },
  }

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage(responses[language].greeting)
    }
  }, [isOpen, language])

  useEffect(() => {
    // Send daily fraud tip
    const interval = setInterval(() => {
      if (isOpen) {
        const tips = fraudTips[language]
        const randomTip = tips[Math.floor(Math.random() * tips.length)]
        addBotMessage(randomTip)
      }
    }, 30000) // Every 30 seconds for demo

    return () => clearInterval(interval)
  }, [isOpen, language])

  const addBotMessage = (text: string) => {
    setIsTyping(true)
    setTimeout(() => {
      const newMessage: Message = {
        id: Date.now().toString(),
        text,
        isBot: true,
        timestamp: new Date(),
        language,
      }
      setMessages((prev) => [...prev, newMessage])
      setIsTyping(false)
    }, 1000)
  }

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      timestamp: new Date(),
      language,
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const handleSend = () => {
    if (!input.trim()) return

    addUserMessage(input)
    const userInput = input.toLowerCase()

    // Simple response logic
    if (userInput.includes("help") || userInput.includes("msaada")) {
      addBotMessage(responses[language].help)
    } else if (userInput.includes("lock") || userInput.includes("funga")) {
      addBotMessage(responses[language].lock)
    } else if (userInput.includes("report") || userInput.includes("ripoti")) {
      addBotMessage(responses[language].report)
    } else if (userInput.includes("support") || userInput.includes("msaada")) {
      addBotMessage(responses[language].support)
    } else {
      const tips = fraudTips[language]
      const randomTip = tips[Math.floor(Math.random() * tips.length)]
      addBotMessage(randomTip)
    }

    setInput("")
  }

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary glow pulse-glow z-40"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 z-50">
          <Card className="glass glow h-full flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center glow">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">AI Fraud Coach</CardTitle>
                    <Badge variant="outline" className="text-xs glass border-primary/30 text-primary">
                      Online
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLanguage(language === "en" ? "sw" : "en")}
                    className="text-xs"
                  >
                    {language === "en" ? "SW" : "EN"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-3">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-3">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                    <div
                      className={`max-w-[80%] p-2 rounded-lg text-sm ${
                        message.isBot
                          ? "bg-primary/10 border border-primary/20 text-primary-foreground"
                          : "bg-secondary/10 border border-secondary/20 text-secondary-foreground"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-primary/10 border border-primary/20 p-2 rounded-lg text-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-1 mb-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs glass border-destructive/30 text-destructive hover:bg-destructive/10 bg-transparent"
                  onClick={() => addUserMessage(language === "en" ? "Lock Account" : "Funga Akaunti")}
                >
                  <Lock className="w-3 h-3 mr-1" />
                  {language === "en" ? "Lock" : "Funga"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs glass border-accent/30 text-accent hover:bg-accent/10 bg-transparent"
                  onClick={() => addUserMessage(language === "en" ? "Report Transaction" : "Ripoti Muamala")}
                >
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {language === "en" ? "Report" : "Ripoti"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs glass border-primary/30 text-primary hover:bg-primary/10 bg-transparent"
                  onClick={() => addUserMessage(language === "en" ? "Call Support" : "Piga Msaada")}
                >
                  <Phone className="w-3 h-3 mr-1" />
                  {language === "en" ? "Support" : "Msaada"}
                </Button>
              </div>

              {/* Input */}
              <div className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={language === "en" ? "Type your message..." : "Andika ujumbe wako..."}
                  className="glass text-sm"
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                />
                <Button size="sm" onClick={handleSend} className="bg-gradient-to-r from-primary to-secondary">
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
