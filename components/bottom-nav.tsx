"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, CreditCard, Shield, Settings, BarChart3 } from "lucide-react"

const navItems = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/transaction", icon: CreditCard, label: "Pay" },
  { href: "/alerts", icon: Shield, label: "Security" },
  { href: "/demo", icon: BarChart3, label: "Demo" },
  { href: "/settings", icon: Settings, label: "Settings" },
]

export function BottomNav() {
  const pathname = usePathname()

  // Don't show bottom nav on auth pages
  if (pathname === "/" || pathname === "/auth" || pathname === "/enrollment") {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-md border-t border-white/10 z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all ${
                isActive ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
