import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function GET(request, { params }) {
  try {
    const supabase = createServerSupabaseClient()
    const { id } = params

    const { data: room, error } = await supabase
      .from("rooms")
      .select(`
        *,
        room_type:room_type_id (id, name)
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error(`Error fetching room ${id}:`, error)
      return NextResponse.json({ error: "Failed to fetch room" }, { status: 500 })
    }

    return NextResponse.json(room)
  } catch (error) {
    console.error("Unexpected error in room API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const supabase = createServerSupabaseClient()
    const { id } = params
    const formData = await request.json()

    const { data, error } = await supabase
      .from("rooms")
      .update({
        name: formData.name,
        description: formData.description,
        room_type_id: formData.roomTypeId,
        price_per_night: formData.price,
        max_occupancy: formData.maxOccupancy,
        is_published: formData.isPublished,
        // Add other fields as needed
      })
      .eq("id", id)
      .select()

    if (error) {
      console.error(`Error updating room ${id}:`, error)
      return NextResponse.json({ error: "Failed to update room" }, { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Unexpected error in room update:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const supabase = createServerSupabaseClient()
    const { id } = params

    const { error } = await supabase.from("rooms").delete().eq("id", id)

    if (error) {
      console.error(`Error deleting room ${id}:`, error)
      return NextResponse.json({ error: "Failed to delete room" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unexpected error in room deletion:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

