"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// Get all events
export async function getEvents() {
  const supabase = createServerSupabaseClient()

  try {
    // Check if events table exists by trying to query it
    const { data, error } = await supabase.from("events").select("*").order("start_date", { ascending: true })

    if (error) {
      // If there's an error (like table doesn't exist), return empty array
      console.error("Error fetching events:", error)
      return []
    }

    // Transform events to match calendar format
    return data.map((event) => ({
      id: `event-${event.id}`,
      title: event.title,
      start: event.start_date,
      end: event.end_date,
      type: event.event_type || "EVENT",
      description: event.description,
      location: event.location,
      url: `/admin/events/${event.id}`,
    }))
  } catch (error) {
    console.error("Error in getEvents:", error)
    return [] // Return empty array if there's an error
  }
}

// Create a new event
export async function createEvent(formData: FormData) {
  const supabase = createServerSupabaseClient()

  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const location = formData.get("location") as string
    const startDate = formData.get("startDate") as string
    const endDate = formData.get("endDate") as string
    const eventType = formData.get("eventType") as string

    const { data, error } = await supabase
      .from("events")
      .insert({
        title,
        description,
        location,
        start_date: startDate,
        end_date: endDate,
        event_type: eventType,
      })
      .select()

    if (error) {
      console.error("Error creating event:", error)
      return { success: false, error: "Failed to create event: " + error.message }
    }

    revalidatePath("/admin/bookings/calendar")
    return { success: true, event: data[0] }
  } catch (error: any) {
    console.error("Error creating event:", error)
    return {
      success: false,
      error: "Failed to create event. Please try again. " + (error.message || ""),
    }
  }
}

// Get a single event by ID
export async function getEventById(id: number) {
  const supabase = createServerSupabaseClient()

  try {
    const { data, error } = await supabase.from("events").select("*").eq("id", id).single()

    if (error) {
      console.error(`Error fetching event ${id}:`, error)
      throw new Error("Failed to fetch event")
    }

    return data
  } catch (error) {
    console.error(`Error in getEventById:`, error)
    throw error
  }
}

// Update an event
export async function updateEvent(id: number, formData: FormData) {
  const supabase = createServerSupabaseClient()

  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const location = formData.get("location") as string
    const startDate = formData.get("startDate") as string
    const endDate = formData.get("endDate") as string
    const eventType = formData.get("eventType") as string

    const { error } = await supabase
      .from("events")
      .update({
        title,
        description,
        location,
        start_date: startDate,
        end_date: endDate,
        event_type: eventType,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) {
      console.error(`Error updating event ${id}:`, error)
      return { success: false, error: "Failed to update event: " + error.message }
    }

    revalidatePath("/admin/bookings/calendar")
    return { success: true }
  } catch (error: any) {
    console.error(`Error updating event ${id}:`, error)
    return {
      success: false,
      error: "Failed to update event. Please try again. " + (error.message || ""),
    }
  }
}

// Delete an event
export async function deleteEvent(id: number) {
  const supabase = createServerSupabaseClient()

  try {
    const { error } = await supabase.from("events").delete().eq("id", id)

    if (error) {
      console.error(`Error deleting event ${id}:`, error)
      throw new Error("Failed to delete event: " + error.message)
    }

    revalidatePath("/admin/bookings/calendar")
    return { success: true }
  } catch (error: any) {
    console.error(`Error deleting event ${id}:`, error)
    return {
      success: false,
      error: "Failed to delete event. Please try again. " + (error.message || ""),
    }
  }
}

