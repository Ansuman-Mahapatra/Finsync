"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  ArrowLeftRight,
  Upload,
  BarChart3,
  Settings,
  LogOut,
  TrendingUp,
  Menu,
  X,
  Building2,
  Calculator,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MerchantLayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: "Dashboard", href: "/merchant/dashboard", icon: LayoutDashboard },
  { name: "Transactions", href: "/merchant/transactions", icon: ArrowLeftRight },
  { name: "Accounting", href: "/merchant/accounting", icon: Calculator },
  { name: "Bulk Upload", href: "/merchant/upload", icon: Upload },
  { name: "Analytics", href: "/merchant/analytics", icon: BarChart3 },
  { name: "Business Profile", href: "/merchant/profile", icon: Building2 },
  { name: "Settings", href: "/merchant/settings", icon: Settings },
]

export function MerchantLayout({ children }: MerchantLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    localStorage.clear()
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-card border-r border-border transition-transform duration-300 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <Link href="/merchant/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="text-xl font-semibold text-foreground block">FinSync</span>
                <span className="text-xs text-muted-foreground">Business</span>
              </div>
            </Link>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn("w-full justify-start", isActive && "bg-primary/10 text-primary hover:bg-primary/20")}
                  >
                    <item.icon className="w-4 h-4 mr-3" />
                    {item.name}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-border bg-background px-4 py-3 lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <span className="font-semibold text-foreground text-sm">FinSync</span>
              <span className="text-xs text-muted-foreground ml-1">Business</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
