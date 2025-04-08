"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, CreditCard, CalendarCheck, Percent, BedDouble, UtensilsCrossed, Loader2 } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart } from "recharts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function ClientDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [occupancyData, setOccupancyData] = useState<any[]>([])
  const [recentBookings, setRecentBookings] = useState<any[]>([])

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setRevenueData(generateRevenueData())
      setOccupancyData(generateOccupancyData())
      fetchRecentBookings()
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const fetchRecentBookings = async () => {
    try {
      const supabase = createClientComponentClient()
      const { data } = await supabase
        .from("bookings")
        .select(`
          id, 
          guest_name, 
          status, 
          check_in_date, 
          check_out_date, 
          total_amount, 
          created_at,
          room:room_id (name)
        `)
        .order("created_at", { ascending: false })
        .limit(5)

      setRecentBookings(data || [])
    } catch (error) {
      console.error("Error fetching bookings:", error)
      // Set some mock data if fetch fails
      setRecentBookings([
        {
          id: 1,
          guest_name: "John Doe",
          status: "confirmed",
          check_in_date: "2023-05-15",
          check_out_date: "2023-05-18",
          total_amount: 450,
          created_at: "2023-05-10",
          room: { name: "Deluxe Room" },
        },
        {
          id: 2,
          guest_name: "Jane Smith",
          status: "checked-in",
          check_in_date: "2023-05-12",
          check_out_date: "2023-05-14",
          total_amount: 320,
          created_at: "2023-05-08",
          room: { name: "Standard Room" },
        },
      ])
    }
  }

  // Mock data generators
  const generateRevenueData = () => {
    const data = []
    const daysInMonth = 30

    for (let i = 1; i <= daysInMonth; i++) {
      data.push({
        date: `${i}`,
        revenue: Math.floor(Math.random() * 1000) + 500,
      })
    }

    return data
  }

  const generateOccupancyData = () => {
    const data = []
    const daysInMonth = 30

    for (let i = 1; i <= daysInMonth; i++) {
      data.push({
        date: `${i}`,
        occupancy: Math.floor(Math.random() * 40) + 60, // Between 60% and 100%
      })
    }

    return data
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-blue-500">Confirmed</Badge>
      case "checked-in":
        return <Badge className="bg-green-500">Checked In</Badge>
      case "checked-out":
        return <Badge className="bg-purple-500">Checked Out</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your hotel performance and recent activities</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Download Report</Button>
          <Button>
            <CalendarCheck className="mr-2 h-4 w-4" />
            View Calendar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
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

          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Daily revenue for the current month</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      formatter={(value: number) => [`$${value}`, "Revenue"]}
                      labelFormatter={(label) => `Day ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(22, 65%, 57%)"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Occupancy Rate</CardTitle>
                <CardDescription>Room occupancy for the last 30 days</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={occupancyData}>
                    <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, "Occupancy"]}
                      labelFormatter={(label) => `Day ${label}`}
                    />
                    <Bar dataKey="occupancy" fill="hsl(22, 65%, 57%)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Bookings */}
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
              <div className="space-y-4">
                {recentBookings.length === 0 ? (
                  <div className="text-muted-foreground text-center py-4">No recent bookings found</div>
                ) : (
                  recentBookings.map((booking) => (
                    <Link
                      key={booking.id}
                      href={`/admin/bookings/${booking.id}`}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <Avatar>
                        <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${booking.guest_name.charAt(0)}`} />
                        <AvatarFallback>{booking.guest_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <div className="font-medium truncate">{booking.guest_name}</div>
                          {getStatusBadge(booking.status)}
                        </div>
                        <div className="text-sm text-muted-foreground truncate">
                          {booking.room?.name || "Room not specified"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(booking.check_in_date).toLocaleDateString()} -{" "}
                          {new Date(booking.check_out_date).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${booking.total_amount}</div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(booking.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bookings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Booking Analytics</CardTitle>
              <CardDescription>Detailed booking statistics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground">Booking analytics content would go here</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analytics</CardTitle>
              <CardDescription>Detailed revenue statistics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground">Revenue analytics content would go here</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

