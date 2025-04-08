"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { ReactNode } from "react"

export default function AdminAuthCheck({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication...")
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!session) {
          console.log("No session found, redirecting to login")
          router.push("/admin/login")
          return
        }

        console.log("Session found, user is authenticated")
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Auth check error:", error)
        router.push("/admin/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event)
      if (event === "SIGNED_IN" && session) {
        setIsAuthenticated(true)
      } else if (event === "SIGNED_OUT") {
        setIsAuthenticated(false)
        router.push("/admin/login")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase.auth])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}

