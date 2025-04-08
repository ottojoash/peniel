"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import RevenueChart from "@/components/admin/revenue-chart"
import OccupancyChart from "@/components/admin/occupancy-chart"

export default function DashboardCharts() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>Daily revenue for the current month</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <RevenueChart />
        </CardContent>
      </Card>

      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Occupancy Rate</CardTitle>
          <CardDescription>Room occupancy for the last 30 days</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <OccupancyChart />
        </CardContent>
      </Card>
    </div>
  )
}

