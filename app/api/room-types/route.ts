import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    const { data: roomTypes, error } = await supabase.from("room_types").select("*").order("name")

    if (error) {
      console.error("Error fetching room types:", error)
      return NextResponse.json({ error: "Failed to fetch room types" }, { status: 500 })
    }

    return NextResponse.json(roomTypes)
  } catch (error) {
    console.error("Unexpected error in room types API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const supabase = createServerSupabaseClient()
    const formData = await request.json()

    const { data, error } = await supabase
      .from("room_types")
      .insert({
        name: formData.name,
        description: formData.description,
      })
      .select()

    if (error) {
      console.error("Error creating room type:", error)
      return NextResponse.json({ error: "Failed to create room type" }, { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Unexpected error in room type creation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

