"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// Update room availability for a single date
export async function updateRoomAvailability(
  roomId: number,
  date: string,
  isAvailable: boolean,
  priceOverride?: number,
  notes?: string,
) {
  const supabase = createServerSupabaseClient()

  try {
    // Upsert the room availability
    const { error } = await supabase.from("room_availability").upsert(
      {
        room_id: roomId,
        date: date,
        is_available: isAvailable,
        price_override: priceOverride,
        notes: notes,
      },
      { onConflict: "room_id,date" },
    )

    if (error) {
      console.error(`Error updating availability for room ${roomId} on ${date}:`, error)
      return { success: false, error: "Failed to update availability" }
    }

    revalidatePath("/admin/availability")
    return { success: true }
  } catch (error) {
    console.error(`Error in updateRoomAvailability:`, error)
    return { success: false, error: "Failed to update availability. Please try again." }
  }
}

// Bulk update room availability for a date range
export async function bulkUpdateRoomAvailability(
  roomId: number,
  startDate: string,
  endDate: string,
  isAvailable: boolean,
  priceOverride?: number,
  notes?: string,
) {
  const supabase = createServerSupabaseClient()

  try {
    // Generate dates array
    const dates = getDatesArray(startDate, endDate)

    // Prepare data for bulk upsert
    const updates = dates.map((date) => ({
      room_id: roomId,
      date: date,
      is_available: isAvailable,
      price_override: priceOverride,
      notes: notes,
    }))

    // Upsert the room availability
    const { error } = await supabase.from("room_availability").upsert(updates, { onConflict: "room_id,date" })

    if (error) {
      console.error(`Error bulk updating availability for room ${roomId} from ${startDate} to ${endDate}:`, error)
      return { success: false, error: "Failed to bulk update availability" }
    }

    revalidatePath("/admin/availability")
    return { success: true }
  } catch (error) {
    console.error(`Error in bulkUpdateRoomAvailability:`, error)
    return { success: false, error: "Failed to bulk update availability. Please try again." }
  }
}

// Helper function to generate an array of dates between two dates
function getDatesArray(startDate: string, endDate: string): string[] {
  const dates = []
  const currentDate = new Date(startDate)
  const endDateObj = new Date(endDate)

  while (currentDate <= endDateObj) {
    dates.push(currentDate.toISOString().split("T")[0])
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return dates
}

