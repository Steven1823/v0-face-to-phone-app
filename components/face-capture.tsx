"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Camera, RotateCcw, Check } from "lucide-react"

interface FaceCaptureProps {
  onCapture: (imageData: string) => void
  isProcessing: boolean
}

export function FaceCapture({ onCapture, isProcessing }: FaceCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [faceDetected, setFaceDetected] = useState(false)

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: "user",
        },
      })

      setStream(mediaStream)
      setHasPermission(true)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error("[FaceCapture] Camera access denied:", error)
      setHasPermission(false)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
  }, [stream])

  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convert to base64
    const imageData = canvas.toDataURL("image/jpeg", 0.8)
    setCapturedImage(imageData)

    // Simulate face detection
    setTimeout(() => {
      setFaceDetected(true)
      onCapture(imageData)
    }, 500)
  }, [onCapture])

  const retakePhoto = useCallback(() => {
    setCapturedImage(null)
    setFaceDetected(false)
    startCamera()
  }, [startCamera])

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [startCamera, stopCamera])

  if (hasPermission === false) {
    return (
      <Alert className="border-destructive/50 bg-destructive/10">
        <Camera className="h-4 w-4" />
        <AlertDescription className="text-destructive">
          Camera access is required for face enrollment. Please enable camera permissions and refresh the page.
        </AlertDescription>
      </Alert>
    )
  }

  if (hasPermission === null) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Requesting camera access...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Camera Preview */}
      <div className="relative bg-black rounded-lg overflow-hidden">
        {!capturedImage ? (
          <>
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto" />
            {/* Face detection overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-80 border-2 border-primary rounded-lg opacity-50">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-primary"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-primary"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-primary"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-primary"></div>
              </div>
            </div>
          </>
        ) : (
          <div className="relative">
            <img src={capturedImage || "/placeholder.svg"} alt="Captured face" className="w-full h-auto" />
            {faceDetected && (
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                <Check className="w-4 h-4" />
                <span>Face Detected</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Instructions */}
      <Alert>
        <Camera className="h-4 w-4" />
        <AlertDescription>
          {!capturedImage
            ? "Position your face within the frame and ensure good lighting. Click capture when ready."
            : "Face captured successfully! The system is processing your biometric data."}
        </AlertDescription>
      </Alert>

      {/* Controls */}
      <div className="flex justify-center space-x-4">
        {!capturedImage ? (
          <Button onClick={captureImage} disabled={isProcessing} size="lg" className="px-8">
            <Camera className="w-4 h-4 mr-2" />
            Capture Face
          </Button>
        ) : (
          <Button
            onClick={retakePhoto}
            disabled={isProcessing}
            variant="outline"
            size="lg"
            className="px-8 bg-transparent"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Retake Photo
          </Button>
        )}
      </div>

      {/* Processing indicator */}
      {isProcessing && (
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-primary">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span>Processing biometric data...</span>
          </div>
        </div>
      )}
    </div>
  )
}
