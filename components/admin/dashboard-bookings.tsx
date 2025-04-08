import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"
import { Suspense } from "react"
import RecentBookings from "@/components/admin/recent-bookings"

export default function DashboardBookings() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>Latest guest reservations</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="h-8">
          View All
          <ArrowUpRight className="ml-2 h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<div>Loading recent bookings...</div>}>
          <RecentBookings />
        </Suspense>
      </CardContent>
    </Card>
  )
}

