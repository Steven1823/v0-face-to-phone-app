"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Database, Lock, Eye, Server, Smartphone, FileText, AlertTriangle, CheckCircle } from "lucide-react"

export default function DataPrivacyPage() {
  return (
    <div className="min-h-screen bg-background p-4 pt-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 glow">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Data Privacy & Security</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Understanding how Face-to-Phone protects your data and maintains your privacy
          </p>
        </div>

        {/* Core Principles */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="h-6 w-6 text-primary" />
              <span>Our Core Privacy Principles</span>
            </CardTitle>
            <CardDescription>
              Face-to-Phone is built on privacy-first principles with zero data collection
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Zero Data Collection</h3>
                <p className="text-sm text-muted-foreground">
                  We never collect, store, or transmit your personal data to our servers
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Smartphone className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Local Processing</h3>
                <p className="text-sm text-muted-foreground">All biometric processing happens locally on your device</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">End-to-End Security</h3>
                <p className="text-sm text-muted-foreground">Your data is encrypted and never leaves your device</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Segments */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Biometric Data */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-secondary" />
                <span>Biometric Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Local
                </Badge>
                <div>
                  <p className="font-medium">Face Recognition Templates</p>
                  <p className="text-sm text-muted-foreground">Stored in encrypted IndexedDB, never transmitted</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Local
                </Badge>
                <div>
                  <p className="font-medium">Voice Patterns</p>
                  <p className="text-sm text-muted-foreground">Processed locally using Web Audio API</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Local
                </Badge>
                <div>
                  <p className="font-medium">Fingerprint Data</p>
                  <p className="text-sm text-muted-foreground">Uses WebAuthn standard, stored in secure hardware</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Logs */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-accent" />
                <span>Security Logs</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Local
                </Badge>
                <div>
                  <p className="font-medium">Authentication Events</p>
                  <p className="text-sm text-muted-foreground">Login attempts and security events stored locally</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Local
                </Badge>
                <div>
                  <p className="font-medium">Fraud Detection Alerts</p>
                  <p className="text-sm text-muted-foreground">AI analysis results kept on device only</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Local
                </Badge>
                <div>
                  <p className="font-medium">Usage Analytics</p>
                  <p className="text-sm text-muted-foreground">App usage patterns for security optimization</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-primary" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Local
                </Badge>
                <div>
                  <p className="font-medium">Profile Data</p>
                  <p className="text-sm text-muted-foreground">Name, phone number stored in encrypted local storage</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Local
                </Badge>
                <div>
                  <p className="font-medium">ID/Passport Numbers</p>
                  <p className="text-sm text-muted-foreground">Encrypted with AES-256, never transmitted</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Local
                </Badge>
                <div>
                  <p className="font-medium">Security Preferences</p>
                  <p className="text-sm text-muted-foreground">App settings and security configurations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Network Data */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Server className="h-5 w-5 text-destructive" />
                <span>Network Data</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="text-red-600 border-red-600">
                  None
                </Badge>
                <div>
                  <p className="font-medium">No Server Communication</p>
                  <p className="text-sm text-muted-foreground">App works completely offline, no data transmission</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="text-red-600 border-red-600">
                  None
                </Badge>
                <div>
                  <p className="font-medium">No Analytics Tracking</p>
                  <p className="text-sm text-muted-foreground">No third-party analytics or tracking services</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="text-red-600 border-red-600">
                  None
                </Badge>
                <div>
                  <p className="font-medium">No Cloud Backup</p>
                  <p className="text-sm text-muted-foreground">Data never synchronized to cloud services</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technical Implementation */}
        <Card className="glass mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="h-6 w-6 text-accent" />
              <span>Technical Security Implementation</span>
            </CardTitle>
            <CardDescription>How we technically ensure your data privacy and security</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 flex items-center space-x-2">
                  <Database className="h-4 w-4" />
                  <span>Local Storage</span>
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• IndexedDB for structured data storage</li>
                  <li>• Web Crypto API for encryption</li>
                  <li>• Service Worker for offline functionality</li>
                  <li>• Local key generation and management</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3 flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Security Measures</span>
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• AES-256 encryption for sensitive data</li>
                  <li>• WebAuthn for secure authentication</li>
                  <li>• Content Security Policy (CSP)</li>
                  <li>• Secure random number generation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <span>Your Data Rights</span>
            </CardTitle>
            <CardDescription>Since all data is stored locally, you have complete control</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <h4 className="font-semibold mb-2">Complete Control</h4>
                <p className="text-sm text-muted-foreground">Delete app data anytime through browser settings</p>
              </div>
              <div className="text-center">
                <Eye className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <h4 className="font-semibold mb-2">Full Transparency</h4>
                <p className="text-sm text-muted-foreground">View all stored data through the app interface</p>
              </div>
              <div className="text-center">
                <Lock className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <h4 className="font-semibold mb-2">No Third Parties</h4>
                <p className="text-sm text-muted-foreground">Your data never shared with external services</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
