"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, X, Shield, Lock, Phone, AlertTriangle, Send, Globe } from "lucide-react"

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
  const [tipCounter, setTipCounter] = useState(0)

  const fraudTips = {
    en: [
      "💡 Tip: Real banks never ask for OTPs via phone calls.",
      "🔒 Tip: Never share your PIN or password with anyone.",
      "📱 Tip: If you see a SIM swap alert, lock your account immediately.",
      "👆 Tip: Use fingerprint verification for high-value transfers.",
      "✅ Tip: Always verify transaction details before confirming.",
      "🚨 Tip: Report suspicious SMS messages immediately.",
      "🔄 Tip: Keep your banking app updated for latest security features.",
      "🕐 Tip: Avoid banking transactions during unusual hours (2-6 AM).",
      "🌍 Tip: Be cautious of transactions from unknown locations.",
      "💰 Tip: Set daily transaction limits to prevent large unauthorized transfers."
    ],
    sw: [
      "💡 Kidokezo: Benki halisi haziulizi OTP kupitia simu.",
      "🔒 Kidokezo: Usimshirikishe mtu yeyote PIN au password yako.",
      "📱 Kidokezo: Ukiona onyo la SIM swap, funga akaunti yako mara moja.",
      "👆 Kidokezo: Tumia uthibitisho wa kidole kwa uhamisho wa pesa nyingi.",
      "✅ Kidokezo: Hakikisha maelezo ya muamala kabla ya kuthibitisha.",
      "🚨 Kidokezo: Ripoti ujumbe wa SMS wa mashaka mara moja.",
      "🔄 Kidokezo: Weka programu ya benki yako sasa kwa usalama zaidi.",
      "🕐 Kidokezo: Epuka miamala ya benki wakati wa kawaida (2-6 asubuhi).",
      "🌍 Kidokezo: Kuwa mwangalifu na miamala kutoka maeneo yasiyojulikana.",
      "💰 Kidokezo: Weka kikomo cha miamala ya kila siku kuzuia uhamisho mkubwa usioruhusiwa."
    ],
  }

  const responses = {
    en: {
      greeting: "🛡️ Hello! I'm your AI Fraud Coach. How can I help keep you safe today?",
      help: "I can help you with:\n• Fraud prevention tips\n• Account security\n• Reporting suspicious activity\n• Transaction verification\n• Emergency account locking",
      lock: "🚨 I'll help you lock your account immediately for security. Please confirm this action by typing 'CONFIRM LOCK'.",
      report: "📝 Please describe the suspicious activity you'd like to report. I'll log it securely and alert our security team.",
      support: "📞 Connecting you to our support team. They'll be with you shortly. Average wait time: 2 minutes.",
      fraud_detected: "⚠️ FRAUD ALERT: Suspicious activity detected on your account. I recommend locking your account immediately.",
      transaction_blocked: "🛑 Transaction blocked for your safety. High fraud risk detected. Your money is secure.",
      sim_swap: "🚨 SIM SWAP ALERT: Your SIM card may have been cloned. Lock your account NOW and contact support immediately!"
    },
    sw: {
      greeting: "🛡️ Hujambo! Mimi ni Mkocha wako wa AI wa Kuzuia Ulaghai. Ninawezaje kukusaidia kuwa salama leo?",
      help: "Ninaweza kukusaidia na:\n• Vidokezo vya kuzuia ulaghai\n• Usalama wa akaunti\n• Kuripoti shughuli za mashaka\n• Uthibitisho wa miamala\n• Kufunga akaunti kwa haraka",
      lock: "🚨 Nitakusaidia kufunga akaunti yako mara moja kwa usalama. Tafadhali thibitisha hatua hii kwa kuandika 'THIBITISHA KUFUNGA'.",
      report: "📝 Tafadhali eleza shughuli za mashaka unazotaka kuripoti. Nitazirekodi kwa usalama na kuonya timu yetu ya usalama.",
      support: "📞 Ninakuunganisha na timu yetu ya msaada. Watakuwa nawe hivi karibuni. Muda wa kusubiri wastani: dakika 2.",
      fraud_detected: "⚠️ ONYO LA ULAGHAI: Shughuli za mashaka zimegunduliwa kwenye akaunti yako. Napendekeza ufunge akaunti yako mara moja.",
      transaction_blocked: "🛑 Muamala umezuiliwa kwa usalama wako. Hatari kubwa ya ulaghai imegunduliwa. Pesa zako ni salama.",
      sim_swap: "🚨 ONYO LA SIM SWAP: SIM yako inaweza kuwa imenakiliwa. Funga akaunti yako SASA na wasiliana na msaada mara moja!"
    },
  }

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      addBotMessage(responses[language].greeting)
    }
  }, [isOpen, language])

  useEffect(() => {
    // Send proactive fraud tips every 45 seconds when chat is open
    const interval = setInterval(() => {
      if (isOpen && messages.length > 0) {
        const tips = fraudTips[language]
        const tip = tips[tipCounter % tips.length]
        addBotMessage(tip)
        setTipCounter(prev => prev + 1)
      }
    }, 45000)

    return () => clearInterval(interval)
  }, [isOpen, language, tipCounter, messages.length])

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
    }, 1000 + Math.random() * 1000) // Variable typing delay for realism
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

    // Enhanced response logic with more scenarios
    if (userInput.includes("help") || userInput.includes("msaada")) {
      addBotMessage(responses[language].help)
    } else if (userInput.includes("lock") || userInput.includes("funga")) {
      addBotMessage(responses[language].lock)
    } else if (userInput.includes("confirm lock") || userInput.includes("thibitisha kufunga")) {
      addBotMessage(language === "en" ? 
        "🔒 ACCOUNT LOCKED SUCCESSFULLY! Your account is now secure. To unlock, visit a branch with ID or call support." :
        "🔒 AKAUNTI IMEFUNGWA KWA MAFANIKIO! Akaunti yako sasa ni salama. Kufungua, tembelea tawi na kitambulisho au piga msaada.")
    } else if (userInput.includes("report") || userInput.includes("ripoti")) {
      addBotMessage(responses[language].report)
    } else if (userInput.includes("support") || userInput.includes("msaada")) {
      addBotMessage(responses[language].support)
    } else if (userInput.includes("fraud") || userInput.includes("ulaghai")) {
      addBotMessage(responses[language].fraud_detected)
    } else if (userInput.includes("sim") || userInput.includes("swap")) {
      addBotMessage(responses[language].sim_swap)
    } else if (userInput.includes("transaction") || userInput.includes("muamala")) {
      addBotMessage(responses[language].transaction_blocked)
    } else {
      // Provide contextual tips based on keywords
      const tips = fraudTips[language]
      let selectedTip = tips[Math.floor(Math.random() * tips.length)]
      
      if (userInput.includes("otp") || userInput.includes("pin")) {
        selectedTip = tips[0] // OTP tip
      } else if (userInput.includes("sms") || userInput.includes("message")) {
        selectedTip = tips[5] // SMS tip
      } else if (userInput.includes("transfer") || userInput.includes("send")) {
        selectedTip = tips[3] // Fingerprint tip
      }
      
      addBotMessage(selectedTip)
    }

    setInput("")
  }

  return (
    <>
      {/* Floating Button with notification badge */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary glow pulse-glow shadow-lg"
          >
            <MessageCircle className="w-6 h-6 text-white" />
          </Button>
          {/* Notification badge */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center animate-pulse">
            <span className="text-xs text-white font-bold">!</span>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-96 z-50">
          <Card className="glass glow h-full flex flex-col border-primary/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center glow pulse-glow">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">AI Fraud Coach</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs glass border-secondary/30 text-secondary">
                        Online
                      </Badge>
                      <Badge variant="outline" className="text-xs glass border-accent/30 text-accent">
                        24/7
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setLanguage(language === "en" ? "sw" : "en")}
                    className="text-xs glass"
                  >
                    <Globe className="w-3 h-3 mr-1" />
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
              <div className="flex-1 overflow-y-auto space-y-3 mb-3 scroll-smooth">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.isBot ? "justify-start" : "justify-end"} slide-in`}>
                    <div
                      className={`max-w-[80%] p-3 rounded-lg text-sm ${
                        message.isBot
                          ? "bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 text-primary-foreground"
                          : "bg-gradient-to-r from-secondary/10 to-accent/10 border border-secondary/20 text-secondary-foreground"
                      }`}
                    >
                      {message.text}
                      <div className="text-xs opacity-60 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start slide-in">
                    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 p-3 rounded-lg text-sm">
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
                  className="text-xs glass border-destructive/30 text-destructive hover:bg-destructive/10 bg-transparent ripple-effect"
                  onClick={() => addUserMessage(language === "en" ? "Lock Account" : "Funga Akaunti")}
                >
                  <Lock className="w-3 h-3 mr-1" />
                  {language === "en" ? "🚨 Lock" : "🚨 Funga"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs glass border-accent/30 text-accent hover:bg-accent/10 bg-transparent ripple-effect"
                  onClick={() => addUserMessage(language === "en" ? "Report Fraud" : "Ripoti Ulaghai")}
                >
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {language === "en" ? "📢 Report" : "📢 Ripoti"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs glass border-primary/30 text-primary hover:bg-primary/10 bg-transparent ripple-effect"
                  onClick={() => addUserMessage(language === "en" ? "Call Support" : "Piga Msaada")}
                >
                  <Phone className="w-3 h-3 mr-1" />
                  {language === "en" ? "📞 Support" : "📞 Msaada"}
                </Button>
              </div>

              {/* Input */}
              <div className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={language === "en" ? "Ask about fraud prevention..." : "Uliza kuhusu kuzuia ulaghai..."}
                  className="glass text-sm"
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                />
                <Button size="sm" onClick={handleSend} className="bg-gradient-to-r from-primary to-secondary ripple-effect">
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