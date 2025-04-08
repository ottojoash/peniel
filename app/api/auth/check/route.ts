import { createServerSupabaseClient } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Test the connection by getting the current user count
    const { data, error } = await supabase.auth.admin.listUsers()

    if (error) {
      throw error
    }

    return NextResponse.json({
      status: "success",
      message: "Supabase connection successful",
      userCount: data.users.length,
    })
  } catch (error) {
    console.error("Supabase connection error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to connect to Supabase",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

