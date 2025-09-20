"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PWAInstaller } from "@/components/pwa-installer"
import { Shield, Smartphone, Eye, Mic, AlertTriangle, BarChart3, WifiOff, Zap } from "lucide-react"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const currentUserId = localStorage.getItem("currentUserId")
    if (currentUserId) {
      router.push("/dashboard")
    }
  }, [router])

  const handleGetStarted = () => {
    router.push("/auth")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10">
      <PWAInstaller />

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative border-b border-white/10 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center glow">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Face-to-Phone
                </h1>
                <p className="text-sm text-accent font-medium">Connecting Humans to AI</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="glass border-accent/30 text-accent">
                <WifiOff className="w-3 h-3 mr-1" />
                Offline Ready
              </Badge>
              <Badge variant="outline" className="glass border-primary/30 text-primary">
                <Zap className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Next-Gen Biometric Security</span>
          </div>

          <h2 className="text-5xl font-bold text-foreground mb-6 text-balance">
            Secure Banking with
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent block">
              AI Fraud Detection
            </span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8 text-pretty">
            Experience the future of banking with offline-first biometric authentication, real-time fraud detection, and
            comprehensive security analytics.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleGetStarted}
              size="lg"
              className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 glow text-lg px-8 py-6"
            >
              Get Started
              <Shield className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="glass border-white/20 hover:bg-white/5 text-lg px-8 py-6 bg-transparent"
            >
              Watch Demo
              <Eye className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Feature Showcase */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="glass glow-blue hover:glow-blue transition-all duration-300 border-secondary/20">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-secondary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4 glow-blue">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-secondary">Face Recognition</CardTitle>
              <CardDescription className="text-muted-foreground">
                Advanced facial biometric enrollment with liveness detection
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="glass glow-green hover:glow-green transition-all duration-300 border-accent/20">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-2xl flex items-center justify-center mx-auto mb-4 glow-green">
                <Mic className="w-8 h-8 text-black" />
              </div>
              <CardTitle className="text-xl text-accent">Voice Passphrase</CardTitle>
              <CardDescription className="text-muted-foreground">
                Multi-factor authentication with voice pattern recognition
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="glass glow-red hover:glow-red transition-all duration-300 border-destructive/20">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-destructive to-primary rounded-2xl flex items-center justify-center mx-auto mb-4 glow-red">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-destructive">AI Fraud Detection</CardTitle>
              <CardDescription className="text-muted-foreground">
                Real-time anomaly detection with ML-powered threat analysis
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="glass glow hover:glow transition-all duration-300 border-primary/20">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 glow">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl text-primary">Security Analytics</CardTitle>
              <CardDescription className="text-muted-foreground">
                Comprehensive insights and threat intelligence dashboard
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Demo Features */}
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-foreground mb-8">Hackathon Demo Features</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="glass border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-center space-x-2 text-accent">
                  <Smartphone className="w-6 h-6" />
                  <span>Offline-First</span>
                </CardTitle>
                <CardDescription>
                  Works completely offline with encrypted local storage and PWA capabilities
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-center space-x-2 text-primary">
                  <Shield className="w-6 h-6" />
                  <span>Biometric Simulation</span>
                </CardTitle>
                <CardDescription>Realistic face and voice recognition with fraud attempt simulation</CardDescription>
              </CardHeader>
            </Card>

            <Card className="glass border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-center space-x-2 text-destructive">
                  <AlertTriangle className="w-6 h-6" />
                  <span>Attack Scenarios</span>
                </CardTitle>
                <CardDescription>Pre-built fraud scenarios with GPS tracking and security alerts</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Technical Stack */}
        <Card className="glass max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-foreground mb-4">Built for Hackathon Excellence</CardTitle>
            <CardDescription className="text-lg">
              Cutting-edge technology stack designed for impressive demonstrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Badge variant="outline" className="glass border-primary/30 text-primary justify-center py-2">
                PWA Ready
              </Badge>
              <Badge variant="outline" className="glass border-secondary/30 text-secondary justify-center py-2">
                WebCrypto
              </Badge>
              <Badge variant="outline" className="glass border-accent/30 text-accent justify-center py-2">
                IndexedDB
              </Badge>
              <Badge variant="outline" className="glass border-destructive/30 text-destructive justify-center py-2">
                ML Simulation
              </Badge>
              <Badge variant="outline" className="glass border-primary/30 text-primary justify-center py-2">
                Biometric APIs
              </Badge>
              <Badge variant="outline" className="glass border-secondary/30 text-secondary justify-center py-2">
                Fraud Engine
              </Badge>
              <Badge variant="outline" className="glass border-accent/30 text-accent justify-center py-2">
                Real-time Analytics
              </Badge>
              <Badge variant="outline" className="glass border-destructive/30 text-destructive justify-center py-2">
                GPS Tracking
              </Badge>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
