"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BedDouble, CreditCard, Percent, UtensilsCrossed } from "lucide-react"

export default function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
          <BedDouble className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">245</div>
          <div className="text-xs text-muted-foreground flex items-center mt-1">
            <Badge className="bg-emerald-500 text-white mr-1 px-1">+12%</Badge>
            <span>from last month</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Revenue</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$24,780</div>
          <div className="text-xs text-muted-foreground flex items-center mt-1">
            <Badge className="bg-emerald-500 text-white mr-1 px-1">+18%</Badge>
            <span>from last month</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">78%</div>
          <div className="text-xs text-muted-foreground flex items-center mt-1">
            <Badge className="bg-emerald-500 text-white mr-1 px-1">+5%</Badge>
            <span>from last month</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Restaurant Orders</CardTitle>
          <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">156</div>
          <div className="text-xs text-muted-foreground flex items-center mt-1">
            <Badge className="bg-red-500 text-white mr-1 px-1">-3%</Badge>
            <span>from last month</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

