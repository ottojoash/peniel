"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Calendar,
  CreditCard,
  Home,
  Hotel,
  Image,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Users,
  FileText,
  Database,
} from "lucide-react"

const AdminSidebar = () => {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`)
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Bookings", href: "/admin/bookings", icon: Calendar },
    { name: "Rooms", href: "/admin/rooms", icon: Hotel },
    { name: "Guests", href: "/admin/guests", icon: Users },
    { name: "Calendar", href: "/admin/calendar", icon: Calendar },
    { name: "Gallery", href: "/admin/gallery", icon: Image },
    { name: "Messages", href: "/admin/messages", icon: MessageSquare },
    { name: "Payments", href: "/admin/payments", icon: CreditCard },
    { name: "Reports", href: "/admin/reports", icon: FileText },
    { name: "Setup", href: "/admin/setup", icon: Database },
    { name: "Settings", href: "/admin/settings", icon: Settings },
    { name: "Website", href: "/", icon: Home },
  ]

  return (
    <div className="w-64 bg-white border-r h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        <h1 className="text-xl font-bold">Peniel Beach Hotel</h1>
        <p className="text-sm text-muted-foreground">Admin Dashboard</p>
      </div>
      <nav className="px-3 py-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  isActive(item.href) ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default AdminSidebar

