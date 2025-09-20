"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, Square, Play, RotateCcw, Volume2 } from "lucide-react"

interface VoiceCaptureProps {
  onCapture: (audioBlob: Blob) => void
  isProcessing: boolean
}

const PASSPHRASE = "My voice is my password, verify me"

export function VoiceCapture({ onCapture, isProcessing }: VoiceCaptureProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const requestMicrophonePermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setHasPermission(true)

      // Stop the stream immediately as we just needed permission
      stream.getTracks().forEach((track) => track.stop())
    } catch (error) {
      console.error("[VoiceCapture] Microphone access denied:", error)
      setHasPermission(false)
    }
  }, [])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/wav" })
        setAudioBlob(blob)
        setAudioUrl(URL.createObjectURL(blob))

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("[VoiceCapture] Recording failed:", error)
      setHasPermission(false)
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isRecording])

  const playRecording = useCallback(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl)
      audio.play()
    }
  }, [audioUrl])

  const retakeRecording = useCallback(() => {
    setAudioBlob(null)
    setAudioUrl(null)
    setRecordingTime(0)

    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const submitRecording = useCallback(() => {
    if (audioBlob) {
      onCapture(audioBlob)
    }
  }, [audioBlob, onCapture])

  useEffect(() => {
    requestMicrophonePermission()

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [requestMicrophonePermission])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (hasPermission === false) {
    return (
      <Alert className="border-destructive/50 bg-destructive/10">
        <Mic className="h-4 w-4" />
        <AlertDescription className="text-destructive">
          Microphone access is required for voice enrollment. Please enable microphone permissions and refresh the page.
        </AlertDescription>
      </Alert>
    )
  }

  if (hasPermission === null) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Mic className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Requesting microphone access...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Passphrase Display */}
      <Card className="bg-secondary/10 border-secondary/20">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="font-semibold text-lg mb-2">Please say this passphrase:</h3>
            <p className="text-xl font-mono text-secondary bg-background px-4 py-2 rounded-lg border">"{PASSPHRASE}"</p>
          </div>
        </CardContent>
      </Card>

      {/* Recording Interface */}
      <div className="text-center space-y-6">
        {/* Visual Indicator */}
        <div className="relative">
          <div
            className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center transition-all duration-300 ${
              isRecording
                ? "bg-red-100 border-4 border-red-500 animate-pulse"
                : audioBlob
                  ? "bg-green-100 border-4 border-green-500"
                  : "bg-secondary/10 border-4 border-secondary/20"
            }`}
          >
            <Mic
              className={`w-12 h-12 ${isRecording ? "text-red-500" : audioBlob ? "text-green-500" : "text-secondary"}`}
            />
          </div>

          {isRecording && (
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-mono">
                {formatTime(recordingTime)}
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <Alert>
          <Volume2 className="h-4 w-4" />
          <AlertDescription>
            {!audioBlob && !isRecording && "Click the record button and clearly speak the passphrase above."}
            {isRecording && "Recording... Speak the passphrase clearly and naturally."}
            {audioBlob && !isRecording && "Recording complete! You can play it back or submit for processing."}
          </AlertDescription>
        </Alert>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          {!audioBlob && !isRecording && (
            <Button onClick={startRecording} disabled={isProcessing} size="lg" className="px-8">
              <Mic className="w-4 h-4 mr-2" />
              Start Recording
            </Button>
          )}

          {isRecording && (
            <Button onClick={stopRecording} variant="destructive" size="lg" className="px-8">
              <Square className="w-4 h-4 mr-2" />
              Stop Recording
            </Button>
          )}

          {audioBlob && !isRecording && (
            <div className="flex space-x-3">
              <Button onClick={playRecording} variant="outline" size="lg">
                <Play className="w-4 h-4 mr-2" />
                Play Back
              </Button>

              <Button onClick={retakeRecording} variant="outline" size="lg" disabled={isProcessing}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake
              </Button>

              <Button onClick={submitRecording} disabled={isProcessing} size="lg" className="px-8">
                <Mic className="w-4 h-4 mr-2" />
                Submit Voice
              </Button>
            </div>
          )}
        </div>

        {/* Processing indicator */}
        {isProcessing && (
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 text-secondary">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-secondary"></div>
              <span>Processing voice pattern...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
