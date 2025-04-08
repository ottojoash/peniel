import { redirect } from "next/navigation"

export default function NewBookingRedirectPage() {
  redirect("/admin/bookings/add")
}

