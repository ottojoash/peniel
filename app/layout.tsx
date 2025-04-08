import type { ReactNode } from "react"
import "./globals.css"
import { Inter, Playfair_Display } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"

// Load fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
})

// Metadata for SEO
export const metadata: Metadata = {
  title: "Peniel Beach Hotel - Your Perfect Beach Getaway",
  description:
    "Experience luxury and comfort at Peniel Beach Hotel, where unforgettable memories await. Book your stay today!",
  generator: "v0.dev",
}

// Root layout component
export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
