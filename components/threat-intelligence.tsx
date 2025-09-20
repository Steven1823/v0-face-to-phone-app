"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Globe, Zap, Target, Brain, RefreshCw } from "lucide-react"

interface ThreatPattern {
  id: string
  name: string
  description: string
  severity: "low" | "medium" | "high" | "critical"
  confidence: number
  detectedCount: number
  lastSeen: Date
  indicators: string[]
}

interface MLModelMetrics {
  name: string
  accuracy: number
  precision: number
  recall: number
  f1Score: number
  lastTrained: Date
  status: "active" | "training" | "offline"
}

export function ThreatIntelligence() {
  const [threatPatterns, setThreatPatterns] = useState<ThreatPattern[]>([])
  const [mlModels, setMLModels] = useState<MLModelMetrics[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    loadThreatIntelligence()
  }, [])

  const loadThreatIntelligence = () => {
    setIsLoading(true)

    // Simulate threat patterns
    const patterns: ThreatPattern[] = [
      {
        id: "pattern-1",
        name: "Face Spoofing Attack",
        description: "Attempts to bypass facial recognition using photos or videos",
        severity: "critical",
        confidence: 0.92,
        detectedCount: 3,
        lastSeen: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        indicators: ["Low image quality", "Lack of depth perception", "Static facial features"],
      },
      {
        id: "pattern-2",
        name: "Voice Cloning",
        description: "Synthetic voice generation to bypass voice authentication",
        severity: "high",
        confidence: 0.87,
        detectedCount: 1,
        lastSeen: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        indicators: ["Unnatural speech patterns", "Audio compression artifacts", "Missing vocal nuances"],
      },
      {
        id: "pattern-3",
        name: "Transaction Velocity Attack",
        description: "Rapid succession of transactions to exploit timing windows",
        severity: "medium",
        confidence: 0.78,
        detectedCount: 5,
        lastSeen: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        indicators: ["Multiple transactions within minutes", "Consistent amounts", "Same recipient pattern"],
      },
      {
        id: "pattern-4",
        name: "SIM Swap Indicators",
        description: "Device fingerprint changes suggesting SIM swap attack",
        severity: "high",
        confidence: 0.83,
        detectedCount: 2,
        lastSeen: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        indicators: ["Device ID mismatch", "Location anomaly", "Network provider change"],
      },
    ]

    // Simulate ML model metrics
    const models: MLModelMetrics[] = [
      {
        name: "Face Anti-Spoofing Model",
        accuracy: 0.94,
        precision: 0.92,
        recall: 0.96,
        f1Score: 0.94,
        lastTrained: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        status: "active",
      },
      {
        name: "Voice Authenticity Detector",
        accuracy: 0.89,
        precision: 0.87,
        recall: 0.91,
        f1Score: 0.89,
        lastTrained: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        status: "active",
      },
      {
        name: "Behavioral Anomaly Model",
        accuracy: 0.86,
        precision: 0.84,
        recall: 0.88,
        f1Score: 0.86,
        lastTrained: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        status: "training",
      },
      {
        name: "Transaction Risk Scorer",
        accuracy: 0.91,
        precision: 0.89,
        recall: 0.93,
        f1Score: 0.91,
        lastTrained: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        status: "active",
      },
    ]

    setThreatPatterns(patterns)
    setMLModels(models)
    setIsLoading(false)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "secondary"
      case "medium":
        return "outline"
      default:
        return "outline"
    }
  }

  const getModelStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600"
      case "training":
        return "text-yellow-600"
      case "offline":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    return "Just now"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Threat Intelligence</h2>
          <p className="text-muted-foreground">Advanced threat detection and ML model performance</p>
        </div>
        <Button onClick={loadThreatIntelligence} disabled={isLoading} variant="outline">
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh Intelligence
        </Button>
      </div>

      {/* Threat Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-destructive" />
            <span>Active Threat Patterns</span>
          </CardTitle>
          <CardDescription>Detected attack patterns and their characteristics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {threatPatterns.map((pattern) => (
              <Card key={pattern.id} className="border-l-4 border-l-destructive">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{pattern.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getSeverityColor(pattern.severity) as any}>{pattern.severity}</Badge>
                      <Badge variant="outline">{pattern.detectedCount}x</Badge>
                    </div>
                  </div>
                  <CardDescription>{pattern.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Confidence</span>
                    <span className="text-sm">{(pattern.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={pattern.confidence * 100} className="h-2" />

                  <div>
                    <span className="text-sm font-medium">Last Seen: </span>
                    <span className="text-sm text-muted-foreground">{formatTimeAgo(pattern.lastSeen)}</span>
                  </div>

                  <div>
                    <span className="text-sm font-medium">Indicators:</span>
                    <ul className="mt-1 space-y-1">
                      {pattern.indicators.map((indicator, index) => (
                        <li key={index} className="text-xs text-muted-foreground flex items-center space-x-2">
                          <div className="w-1 h-1 bg-destructive rounded-full"></div>
                          <span>{indicator}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ML Model Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-primary" />
            <span>ML Model Performance</span>
          </CardTitle>
          <CardDescription>Machine learning model metrics and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {mlModels.map((model, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          model.status === "active"
                            ? "bg-green-500"
                            : model.status === "training"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      ></div>
                      <span className={`text-sm font-medium ${getModelStatusColor(model.status)}`}>{model.status}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Accuracy</span>
                        <span className="text-sm font-mono">{(model.accuracy * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={model.accuracy * 100} className="h-1 mt-1" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Precision</span>
                        <span className="text-sm font-mono">{(model.precision * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={model.precision * 100} className="h-1 mt-1" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Recall</span>
                        <span className="text-sm font-mono">{(model.recall * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={model.recall * 100} className="h-1 mt-1" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">F1 Score</span>
                        <span className="text-sm font-mono">{(model.f1Score * 100).toFixed(1)}%</span>
                      </div>
                      <Progress value={model.f1Score * 100} className="h-1 mt-1" />
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">Last trained: {formatTimeAgo(model.lastTrained)}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Global Threat Landscape */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="w-5 h-5 text-primary" />
              <span>Global Threats</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Face Spoofing</span>
                <Badge variant="destructive">High</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Voice Cloning</span>
                <Badge variant="secondary">Medium</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">SIM Swapping</span>
                <Badge variant="secondary">Medium</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Social Engineering</span>
                <Badge variant="outline">Low</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-secondary" />
              <span>Detection Speed</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">127ms</div>
                <p className="text-sm text-muted-foreground">Average detection time</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Face Analysis</span>
                  <span>45ms</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Voice Processing</span>
                  <span>62ms</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Risk Scoring</span>
                  <span>20ms</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span>Prevention Rate</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">99.2%</div>
                <p className="text-sm text-muted-foreground">Fraud prevention rate</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>False Positives</span>
                  <span>0.3%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>False Negatives</span>
                  <span>0.5%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>True Positives</span>
                  <span>99.2%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
