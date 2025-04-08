"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import NewBookingForm from "@/components/admin/new-booking-form"

export default function ClientNewBookingPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading delay to ensure client-side rendering
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading booking form...</p>
        </div>
      </div>
    )
  }

  return <NewBookingForm />
}

