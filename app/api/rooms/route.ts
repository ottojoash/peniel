import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Query rooms with their related room types
    const { data: rooms, error } = await supabase
      .from("rooms")
      .select(`
        *,
        room_type:room_type_id (id, name)
      `)
      .order("name")

    if (error) {
      console.error("Error fetching rooms:", error)
      return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 })
    }

    return NextResponse.json(rooms)
  } catch (error) {
    console.error("Unexpected error in rooms API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const supabase = createServerSupabaseClient()
    const formData = await request.json()

    // Insert the new room
    const { data, error } = await supabase
      .from("rooms")
      .insert({
        name: formData.name,
        description: formData.description,
        room_type_id: formData.roomTypeId,
        price_per_night: formData.price,
        max_occupancy: formData.maxOccupancy,
        is_published: formData.isPublished,
        // Add other fields as needed
      })
      .select()

    if (error) {
      console.error("Error creating room:", error)
      return NextResponse.json({ error: "Failed to create room" }, { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Unexpected error in room creation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

