"use client"

import { AlertTriangle, Shield, Database } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface OfflineBannerProps {
  isOffline: boolean
}

export function OfflineBanner({ isOffline }: OfflineBannerProps) {
  if (!isOffline) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-slate-900 border-b border-slate-700 px-4 py-2">
      <div className="flex items-center justify-center space-x-4 text-sm">
        <div className="flex items-center space-x-2 text-orange-400">
          <AlertTriangle className="h-4 w-4" />
          <span className="font-medium">Offline Mode Active</span>
        </div>

        <Badge variant="outline" className="text-green-400 border-green-400">
          <Shield className="w-3 h-3 mr-1" />
          Local Security Running
        </Badge>

        <Badge variant="outline" className="text-blue-400 border-blue-400">
          <Database className="w-3 h-3 mr-1" />
          Data Stored Locally
        </Badge>
      </div>
    </div>
  )
}
