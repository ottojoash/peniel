import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    const { data: roomFeatures, error } = await supabase.from("room_features").select("*").order("name")

    if (error) {
      console.error("Error fetching room features:", error)
      return NextResponse.json({ error: "Failed to fetch room features" }, { status: 500 })
    }

    return NextResponse.json(roomFeatures)
  } catch (error) {
    console.error("Unexpected error in room features API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const supabase = createServerSupabaseClient()
    const formData = await request.json()

    const { data, error } = await supabase
      .from("room_features")
      .insert({
        name: formData.name,
        icon: formData.icon,
      })
      .select()

    if (error) {
      console.error("Error creating room feature:", error)
      return NextResponse.json({ error: "Failed to create room feature" }, { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Unexpected error in room feature creation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

