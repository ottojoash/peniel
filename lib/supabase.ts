// import { createClient } from "@supabase/supabase-js"

// // Create a single supabase client for the entire server-side application
// export function createServerSupabaseClient() {
//   // Log environment variables (without exposing sensitive data)
//   console.log("SUPABASE_URL available:", !!process.env.SUPABASE_URL)
//   console.log("SUPABASE_SERVICE_ROLE_KEY available:", !!process.env.SUPABASE_SERVICE_ROLE_KEY)

//   // Use the environment variables directly from the workspace
//   const supabaseUrl = process.env.SUPABASE_URL
//   const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

//   if (!supabaseUrl || !supabaseKey) {
//     console.error("Missing Supabase environment variables")
//     throw new Error("Missing Supabase environment variables")
//   }

//   try {
//     return createClient(supabaseUrl, supabaseKey, {
//       auth: {
//         persistSession: false,
//       },
//       global: {
//         fetch: fetch.bind(globalThis),
//       },
//     })
//   } catch (error) {
//     console.error("Error creating Supabase client:", error)
//     throw error
//   }
// }

// // Create a singleton client for the browser to avoid multiple instances
// let clientSingleton: ReturnType<typeof createClient> | null = null

// export function createBrowserSupabaseClient() {
//   if (typeof window === "undefined") {
//     // Server-side - create a new instance each time
//     return createServerSupabaseClient()
//   }

//   // Client-side - use singleton
//   if (clientSingleton) return clientSingleton

//   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
//   const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

//   if (!supabaseUrl || !supabaseKey) {
//     console.error("Missing Supabase environment variables for browser client")
//     throw new Error("Missing Supabase environment variables")
//   }

//   try {
//     clientSingleton = createClient(supabaseUrl, supabaseKey)
//     return clientSingleton
//   } catch (error) {
//     console.error("Error creating browser Supabase client:", error)
//     throw error
//   }
// }

import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Create a Supabase client with service role for admin operations
export function createServiceSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase environment variables for service client")
    throw new Error("Missing Supabase environment variables")
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
  })
}

// Create a Supabase client for client components
export function createClientSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Missing Supabase environment variables for client")
    throw new Error("Missing Supabase environment variables")
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey)
}

// For server components and actions, always use the service role client
export function createServerSupabaseClient() {
  return createServiceSupabaseClient()
}
