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
  const [isStable, setIsStable] = useState(false)

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
          facingMode: "user",
          frameRate: { ideal: 30, min: 15 },
        },
      })

      setStream(mediaStream)
      setHasPermission(true)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
        videoRef.current.onloadedmetadata = () => {
          setTimeout(() => setIsStable(true), 1000)
        }
      }
    } catch (error) {
      console.error("Camera access denied:", error)
      setHasPermission(false)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
      setIsStable(false)
    }
  }, [stream])

  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    if (!context) return

    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 720

    context.filter = "contrast(1.1) brightness(1.05) saturate(1.1)"
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    const imageData = canvas.toDataURL("image/jpeg", 0.92)
    setCapturedImage(imageData)

    setFaceDetected(true)
    onCapture(imageData)
  }, [onCapture])

  const retakePhoto = useCallback(() => {
    setCapturedImage(null)
    setFaceDetected(false)
    setIsStable(false)
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
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-auto transform scale-x-[-1]" />
            {isStable && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-80 border-2 border-primary rounded-lg opacity-70 transition-opacity duration-300">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 border border-primary rounded-full opacity-50"></div>
                </div>
              </div>
            )}
            {isStable && (
              <div className="absolute top-4 left-4 bg-green-500/80 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>Ready</span>
              </div>
            )}
          </>
        ) : (
          <div className="relative">
            <img src={capturedImage || "/placeholder.svg"} alt="Captured face" className="w-full h-auto" />
            {faceDetected && (
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                <Check className="w-4 h-4" />
                <span>Face Captured</span>
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
            ? isStable
              ? "Position your face within the frame and ensure good lighting. Click capture when ready."
              : "Initializing camera... Please wait."
            : "Face captured successfully! The system is processing your biometric data."}
        </AlertDescription>
      </Alert>

      {/* Controls */}
      <div className="flex justify-center space-x-4">
        {!capturedImage ? (
          <Button onClick={captureImage} disabled={isProcessing || !isStable} size="lg" className="px-8">
            <Camera className="w-4 h-4 mr-2" />
            {isStable ? "Capture Face" : "Preparing..."}
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
