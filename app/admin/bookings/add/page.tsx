import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getRoomsWithRetry } from "@/app/actions/booking-actions"
import { AlertCircle } from "lucide-react"
import BookingForm from "@/components/admin/booking-form"

export const dynamic = "force-dynamic"

export default async function AddBookingPage() {
  // Fetch rooms data server-side with retry logic
  const { success, rooms, error } = await getRoomsWithRetry()

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Add New Booking</h1>
          <p className="text-muted-foreground">Create a new booking for a guest</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/bookings">Cancel</Link>
        </Button>
      </div>

      {!success && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load rooms from the database. {error}
            <div className="mt-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/bookings/add">Retry</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
        </CardHeader>
        <CardContent>
          <BookingForm rooms={rooms || []} />
        </CardContent>
      </Card>
    </div>
  )
}

