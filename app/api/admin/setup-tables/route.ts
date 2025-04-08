import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })

  try {
    // Create function to create events table
    await supabase.rpc("create_events_table_function", {}, { count: "exact" })

    // Create function to create bookings table
    await supabase.rpc("create_bookings_table_function", {}, { count: "exact" })

    // Create function to create rooms table
    await supabase.rpc("create_rooms_table_function", {}, { count: "exact" })

    return NextResponse.json({ success: true, message: "Setup functions created successfully" })
  } catch (error) {
    console.error("Error creating setup functions:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

