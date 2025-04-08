import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function POST(request, { params }) {
  try {
    const supabase = createServerSupabaseClient()
    const { id } = params

    const { data, error } = await supabase.from("rooms").update({ is_published: true }).eq("id", id).select()

    if (error) {
      console.error(`Error publishing room ${id}:`, error)
      return NextResponse.json({ error: "Failed to publish room" }, { status: 500 })
    }

    return NextResponse.json(data[0])
  } catch (error) {
    console.error("Unexpected error in room publishing:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

