"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  Menu,
  Shield,
  Home,
  BarChart3,
  Settings,
  AlertTriangle,
  WifiOff,
  Wifi,
  Database,
  Lock,
  Hash,
} from "lucide-react"

interface SideMenuProps {
  isOffline: boolean
  onToggleOffline: () => void
}

export function SideMenu({ isOffline, onToggleOffline }: SideMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Shield, label: "Dashboard", path: "/dashboard" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: AlertTriangle, label: "Security Logs", path: "/logs" },
    { icon: Hash, label: "USSD Simulation", path: "/ussd" },
    { icon: Database, label: "Data Privacy", path: "/data-privacy" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ]

  const handleNavigation = (path: string) => {
    router.push(path)
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 glass">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className={`w-80 ${isOffline ? "bg-slate-900 border-slate-700" : "glass"}`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-8 pt-4">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center glow">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Face-to-Phone</h2>
              <p className="text-sm text-muted-foreground">Security Monitor</p>
            </div>
          </div>

          {/* Offline Toggle */}
          <div className="mb-6 p-4 rounded-lg border border-border bg-card/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Offline Mode</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleOffline}
                className={`${isOffline ? "text-orange-400" : "text-green-500"}`}
              >
                {isOffline ? <WifiOff className="h-4 w-4" /> : <Wifi className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {isOffline ? "All data stored locally" : "Connected to network"}
            </p>
            {isOffline && (
              <Badge variant="outline" className="mt-2 text-orange-400 border-orange-400">
                <Lock className="w-3 h-3 mr-1" />
                Local Security Active
              </Badge>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.path
                return (
                  <li key={item.path}>
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className={`w-full justify-start ${
                        isOffline ? "hover:bg-slate-800" : ""
                      } ${isActive ? (isOffline ? "bg-slate-700" : "bg-secondary/20") : ""}`}
                      onClick={() => handleNavigation(item.path)}
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      {item.label}
                    </Button>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="mt-auto pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground text-center">
              <p>Security Monitor v1.0</p>
              <p className="mt-1">{isOffline ? "Offline Mode Active" : "Connected"}</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
