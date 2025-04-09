"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

// Get all guests
export async function getGuests() {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("guests")
    .select(`
      *,
      bookings(id, booking_reference, check_in_date, check_out_date, status)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching guests:", error)
    return { error: error.message, data: [] }
  }

  return { data, error: null }
}

// Get guest by ID
export async function getGuestById(id: number) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("guests")
    .select(`
      *,
      bookings(
        id, 
        booking_reference, 
        check_in_date, 
        check_out_date, 
        status,
        payment_status,
        total_amount,
        room_id,
        rooms(id, name)
      )
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error fetching guest ${id}:`, error)
    return { error: error.message, data: null }
  }

  return { data, error: null }
}

// Create a new guest
export async function createGuest(formData: FormData) {
  const supabase = createServerSupabaseClient()

  try {
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string
    const city = formData.get("city") as string
    const state = formData.get("state") as string
    const postalCode = formData.get("postalCode") as string
    const country = formData.get("country") as string
    const notes = formData.get("notes") as string

    if (!firstName || !lastName) {
      return { success: false, error: "First name and last name are required" }
    }

    const { data, error } = await supabase
      .from("guests")
      .insert({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        address,
        city,
        state,
        postal_code: postalCode,
        country,
        notes,
      })
      .select()

    if (error) throw error

    revalidatePath("/admin/guests")

    return { success: true, guestId: data[0].id, error: null }
  } catch (error: any) {
    console.error("Error creating guest:", error)
    return { success: false, error: error.message || "Failed to create guest" }
  }
}

// Update a guest
export async function updateGuest(id: number, formData: FormData) {
  const supabase = createServerSupabaseClient()

  try {
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const email = formData.get("email") as string
    const phone = formData.get("phone") as string
    const address = formData.get("address") as string
    const city = formData.get("city") as string
    const state = formData.get("state") as string
    const postalCode = formData.get("postalCode") as string
    const country = formData.get("country") as string
    const notes = formData.get("notes") as string

    if (!firstName || !lastName) {
      return { success: false, error: "First name and last name are required" }
    }

    const { error } = await supabase
      .from("guests")
      .update({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        address,
        city,
        state,
        postal_code: postalCode,
        country,
        notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)

    if (error) throw error

    revalidatePath("/admin/guests")
    revalidatePath(`/admin/guests/${id}`)

    return { success: true, error: null }
  } catch (error: any) {
    console.error(`Error updating guest ${id}:`, error)
    return { success: false, error: error.message || "Failed to update guest" }
  }
}

// Delete a guest
export async function deleteGuest(id: number) {
  const supabase = createServerSupabaseClient()

  try {
    // Check if guest has bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("id")
      .eq("guest_id", id)
      .limit(1)

    if (bookingsError) throw bookingsError

    if (bookings && bookings.length > 0) {
      return {
        success: false,
        error: "Cannot delete guest with existing bookings",
      }
    }

    const { error } = await supabase.from("guests").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/admin/guests")

    return { success: true, error: null }
  } catch (error: any) {
    console.error(`Error deleting guest ${id}:`, error)
    return { success: false, error: error.message || "Failed to delete guest" }
  }
}

// Search guests
export async function searchGuests(query: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("guests")
    .select("id, first_name, last_name, email, phone")
    .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
    .order("last_name")
    .limit(10)

  if (error) {
    console.error(`Error searching guests with query "${query}":`, error)
    return { error: error.message, data: [] }
  }

  return { data, error: null }
}

// Get guest statistics
export async function getGuestStatistics() {
  const supabase = createServerSupabaseClient()

  try {
    // Total guests
    const { count: totalGuests, error: countError } = await supabase
      .from("guests")
      .select("*", { count: "exact", head: true })

    if (countError) throw countError

    // New guests this month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { count: newGuestsThisMonth, error: newGuestsError } = await supabase
      .from("guests")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfMonth.toISOString())

    if (newGuestsError) throw newGuestsError

    // Returning guests (guests with more than one booking)
    const { data: returningGuestsData, error: returningGuestsError } = await supabase.rpc(
      "count_guests_with_multiple_bookings",
    )

    let returningGuests = 0
    if (returningGuestsError) {
      console.error("Error counting returning guests:", returningGuestsError)
      // Fallback if the RPC function doesn't exist
      const { data: bookingsPerGuest, error: fallbackError } = await supabase
        .from("bookings")
        .select("guest_id, count")
        .select("guest_id")
        .select("count(*)")
        .group("guest_id")
        .having("count(*) > 1")

      if (!fallbackError && bookingsPerGuest) {
        returningGuests = bookingsPerGuest.length
      }
    } else {
      returningGuests = returningGuestsData || 0
    }

    return {
      totalGuests: totalGuests || 0,
      newGuestsThisMonth: newGuestsThisMonth || 0,
      returningGuests,
      error: null,
    }
  } catch (error: any) {
    console.error("Error fetching guest statistics:", error)
    return {
      totalGuests: 0,
      newGuestsThisMonth: 0,
      returningGuests: 0,
      error: error.message,
    }
  }
}
