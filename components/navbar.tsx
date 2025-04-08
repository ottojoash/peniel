"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Rooms", href: "/rooms" },
    { name: "Restaurant", href: "/restaurant" },
    { name: "Kids Park", href: "/kids-park" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm py-2" : "bg-transparent py-4",
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="relative z-10">
          <div className="flex items-center gap-2">
            <div className="relative h-10 w-10">
              <Image src="/placeholder.svg?height=40&width=40" alt="Peniel Beach Hotel Logo" width={40} height={40} />
            </div>
            <div className={cn("font-serif text-lg transition-colors", isScrolled ? "text-primary" : "text-white")}>
              Peniel Beach Hotel
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                "font-medium hover:text-primary transition-colors",
                isScrolled ? "text-foreground" : "text-white",
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <div className={cn("flex items-center gap-2", isScrolled ? "text-foreground" : "text-white")}>
            <Phone className="h-4 w-4" />
            <span className="font-medium">+1 (234) 567-8900</span>
          </div>
          <Button className="bg-primary hover:bg-primary/90">Book Now</Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden relative z-10" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? (
            <X className={isScrolled ? "text-foreground" : "text-white"} />
          ) : (
            <Menu className={isScrolled ? "text-foreground" : "text-white"} />
          )}
        </button>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-background z-[5] pt-20 px-6">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-foreground font-medium text-lg py-2 border-b border-muted"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="flex items-center gap-2 py-2 border-b border-muted">
                <Phone className="h-4 w-4" />
                <span className="font-medium">+1 (234) 567-8900</span>
              </div>
              <Button className="bg-primary hover:bg-primary/90 mt-4">Book Now</Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

