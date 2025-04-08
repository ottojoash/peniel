"use client"

import type { ReactNode } from "react"
import { ErrorBoundary } from "react-error-boundary"
import AdminSidebar from "@/components/admin/admin-sidebar"
// import AdminAuthCheck from "@/components/admin/admin-auth-check"

function ErrorFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="text-center p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-4">There was an error loading the admin dashboard.</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-white rounded-md">
          Try again
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    // <AdminAuthCheck>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <div className="min-h-screen bg-muted/30 flex">
          <AdminSidebar />
          <div className="flex-1 flex flex-col">
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </ErrorBoundary>
    // </AdminAuthCheck>
  )
}

