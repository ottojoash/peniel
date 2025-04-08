"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Download, FileText, BarChart3, TrendingUp, DollarSign, Users, BedDouble } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart as RePieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts"

// Mock data for reports
const occupancyData = [
  { month: "Jan", occupancy: 65 },
  { month: "Feb", occupancy: 72 },
  { month: "Mar", occupancy: 78 },
  { month: "Apr", occupancy: 74 },
  { month: "May", occupancy: 82 },
  { month: "Jun", occupancy: 89 },
  { month: "Jul", occupancy: 95 },
  { month: "Aug", occupancy: 92 },
  { month: "Sep", occupancy: 87 },
  { month: "Oct", occupancy: 81 },
  { month: "Nov", occupancy: 75 },
  { month: "Dec", occupancy: 85 },
]

const revenueData = [
  { month: "Jan", rooms: 12500, restaurant: 5800, events: 3200, other: 1500 },
  { month: "Feb", rooms: 13200, restaurant: 6100, events: 2800, other: 1600 },
  { month: "Mar", rooms: 14800, restaurant: 6500, events: 4200, other: 1700 },
  { month: "Apr", rooms: 14200, restaurant: 6300, events: 3800, other: 1650 },
  { month: "May", rooms: 15500, restaurant: 6800, events: 4500, other: 1800 },
  { month: "Jun", rooms: 18200, restaurant: 7500, events: 5200, other: 2100 },
  { month: "Jul", rooms: 21500, restaurant: 8200, events: 6500, other: 2400 },
  { month: "Aug", rooms: 20800, restaurant: 8000, events: 6200, other: 2300 },
  { month: "Sep", rooms: 18500, restaurant: 7200, events: 5500, other: 2000 },
  { month: "Oct", rooms: 16200, restaurant: 6700, events: 4800, other: 1900 },
  { month: "Nov", rooms: 14500, restaurant: 6200, events: 3500, other: 1700 },
  { month: "Dec", rooms: 17800, restaurant: 7800, events: 8500, other: 2200 },
]

const bookingSourceData = [
  { name: "Direct Website", value: 45 },
  { name: "Online Travel Agencies", value: 30 },
  { name: "Phone/Email", value: 15 },
  { name: "Walk-in", value: 5 },
  { name: "Travel Agents", value: 5 },
]

const roomTypeData = [
  { name: "Executive Conference Block", value: 35 },
  { name: "Executive RBLK & Cottages", value: 25 },
  { name: "Family Room", value: 20 },
  { name: "Economy Room", value: 10 },
  { name: "Deluxe Twin Room", value: 10 },
]

const guestNationalityData = [
  { name: "Uganda", value: 30 },
  { name: "Kenya", value: 15 },
  { name: "Tanzania", value: 10 },
  { name: "United States", value: 12 },
  { name: "United Kingdom", value: 8 },
  { name: "China", value: 7 },
  { name: "South Africa", value: 6 },
  { name: "Other", value: 12 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658", "#8dd1e1"]

export default function ReportsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [reportPeriod, setReportPeriod] = useState("year")

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground">View performance metrics and business insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "MMMM yyyy") : <span>Pick a month</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Reports
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">Report Period:</span>
        </div>
        <Select value={reportPeriod} onValueChange={setReportPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Current Month</SelectItem>
            <SelectItem value="quarter">Current Quarter</SelectItem>
            <SelectItem value="year">Year to Date</SelectItem>
            <SelectItem value="custom">Custom Range</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="revenue" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Revenue
          </TabsTrigger>
          <TabsTrigger value="occupancy" className="flex items-center gap-2">
            <BedDouble className="h-4 w-4" />
            Occupancy
          </TabsTrigger>
          <TabsTrigger value="guests" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Guest Analytics
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$245,680</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">+12.5%</span> from last year
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Average Occupancy</CardTitle>
                <BedDouble className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78.5%</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">+5.2%</span> from last year
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3,245</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">+8.7%</span> from last year
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Average Daily Rate</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$85.40</div>
                <p className="text-xs text-muted-foreground flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">+3.2%</span> from last year
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Month</CardTitle>
                <CardDescription>Monthly revenue breakdown for the current year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                      <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                      <Legend />
                      <Bar dataKey="rooms" name="Rooms" fill="#0088FE" />
                      <Bar dataKey="restaurant" name="Restaurant" fill="#00C49F" />
                      <Bar dataKey="events" name="Events" fill="#FFBB28" />
                      <Bar dataKey="other" name="Other" fill="#FF8042" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Booking Sources</CardTitle>
                <CardDescription>Distribution of booking channels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={bookingSourceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {bookingSourceData.map((entry, index) => (
                          <Pie key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Analysis</CardTitle>
              <CardDescription>Detailed breakdown of revenue streams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                    <Legend />
                    <Line type="monotone" dataKey="rooms" name="Rooms" stroke="#0088FE" strokeWidth={2} />
                    <Line type="monotone" dataKey="restaurant" name="Restaurant" stroke="#00C49F" strokeWidth={2} />
                    <Line type="monotone" dataKey="events" name="Events" stroke="#FFBB28" strokeWidth={2} />
                    <Line type="monotone" dataKey="other" name="Other" stroke="#FF8042" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Room Type</CardTitle>
                <CardDescription>Distribution of revenue across room types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={roomTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {roomTypeData.map((entry, index) => (
                          <Pie key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">RevPAR (Revenue Per Available Room)</span>
                      <span className="text-sm font-medium">$67.20</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: "75%" }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">+8.5% from last year</p>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">ADR (Average Daily Rate)</span>
                      <span className="text-sm font-medium">$85.40</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: "82%" }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">+3.2% from last year</p>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">TRevPAR (Total Revenue Per Available Room)</span>
                      <span className="text-sm font-medium">$112.30</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: "88%" }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">+10.1% from last year</p>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">GOPPAR (Gross Operating Profit Per Available Room)</span>
                      <span className="text-sm font-medium">$45.80</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">+5.7% from last year</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Occupancy Tab */}
        <TabsContent value="occupancy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Occupancy Rate</CardTitle>
              <CardDescription>Monthly occupancy rates for the current year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={occupancyData}>
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `${value}%`} />
                    <Tooltip formatter={(value) => [`${value}%`, "Occupancy Rate"]} />
                    <Bar dataKey="occupancy" name="Occupancy Rate" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Occupancy by Room Type</CardTitle>
                <CardDescription>Occupancy rates for different room types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Executive Conference Block</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Executive RBLK & Cottages</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: "92%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Family Room</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: "78%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Economy Room</span>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Deluxe Twin Room</span>
                      <span className="text-sm font-medium">72%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: "72%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Occupancy Metrics</CardTitle>
                <CardDescription>Key occupancy indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border rounded-lg p-4 text-center">
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Average Length of Stay</h3>
                      <p className="text-2xl font-bold">2.8 days</p>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Booking Lead Time</h3>
                      <p className="text-2xl font-bold">18 days</p>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Cancellation Rate</h3>
                      <p className="text-2xl font-bold">8.5%</p>
                    </div>
                    <div className="border rounded-lg p-4 text-center">
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">No-Show Rate</h3>
                      <p className="text-2xl font-bold">2.1%</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Occupancy by Day of Week</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="w-20 text-sm">Monday</span>
                        <div className="flex-1 h-2 bg-muted rounded-full">
                          <div className="h-2 bg-primary rounded-full" style={{ width: "65%" }}></div>
                        </div>
                        <span className="w-10 text-right text-sm">65%</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-20 text-sm">Tuesday</span>
                        <div className="flex-1 h-2 bg-muted rounded-full">
                          <div className="h-2 bg-primary rounded-full" style={{ width: "68%" }}></div>
                        </div>
                        <span className="w-10 text-right text-sm">68%</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-20 text-sm">Wednesday</span>
                        <div className="flex-1 h-2 bg-muted rounded-full">
                          <div className="h-2 bg-primary rounded-full" style={{ width: "72%" }}></div>
                        </div>
                        <span className="w-10 text-right text-sm">72%</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-20 text-sm">Thursday</span>
                        <div className="flex-1 h-2 bg-muted rounded-full">
                          <div className="h-2 bg-primary rounded-full" style={{ width: "75%" }}></div>
                        </div>
                        <span className="w-10 text-right text-sm">75%</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-20 text-sm">Friday</span>
                        <div className="flex-1 h-2 bg-muted rounded-full">
                          <div className="h-2 bg-primary rounded-full" style={{ width: "92%" }}></div>
                        </div>
                        <span className="w-10 text-right text-sm">92%</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-20 text-sm">Saturday</span>
                        <div className="flex-1 h-2 bg-muted rounded-full">
                          <div className="h-2 bg-primary rounded-full" style={{ width: "95%" }}></div>
                        </div>
                        <span className="w-10 text-right text-sm">95%</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-20 text-sm">Sunday</span>
                        <div className="flex-1 h-2 bg-muted rounded-full">
                          <div className="h-2 bg-primary rounded-full" style={{ width: "85%" }}></div>
                        </div>
                        <span className="w-10 text-right text-sm">85%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Guest Analytics Tab */}
        <TabsContent value="guests" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Guest Nationality</CardTitle>
                <CardDescription>Distribution of guests by country of origin</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={guestNationalityData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {guestNationalityData.map((entry, index) => (
                          <Pie key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Guest Demographics</CardTitle>
                <CardDescription>Guest profile analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Guest Age Groups</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="w-20 text-sm">18-24</span>
                        <div className="flex-1 h-2 bg-muted rounded-full">
                          <div className="h-2 bg-primary rounded-full" style={{ width: "12%" }}></div>
                        </div>
                        <span className="w-10 text-right text-sm">12%</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-20 text-sm">25-34</span>
                        <div className="flex-1 h-2 bg-muted rounded-full">
                          <div className="h-2 bg-primary rounded-full" style={{ width: "28%" }}></div>
                        </div>
                        <span className="w-10 text-right text-sm">28%</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-20 text-sm">35-44</span>
                        <div className="flex-1 h-2 bg-muted rounded-full">
                          <div className="h-2 bg-primary rounded-full" style={{ width: "35%" }}></div>
                        </div>
                        <span className="w-10 text-right text-sm">35%</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-20 text-sm">45-54</span>
                        <div className="flex-1 h-2 bg-muted rounded-full">
                          <div className="h-2 bg-primary rounded-full" style={{ width: "18%" }}></div>
                        </div>
                        <span className="w-10 text-right text-sm">18%</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-20 text-sm">55+</span>
                        <div className="flex-1 h-2 bg-muted rounded-full">
                          <div className="h-2 bg-primary rounded-full" style={{ width: "7%" }}></div>
                        </div>
                        <span className="w-10 text-right text-sm">7%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Purpose of Stay</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <span className="w-20 text-sm">Leisure</span>
                        <div className="flex-1 h-2 bg-muted rounded-full">
                          <div className="h-2 bg-primary rounded-full" style={{ width: "65%" }}></div>
                        </div>
                        <span className="w-10 text-right text-sm">65%</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-20 text-sm">Business</span>
                        <div className="flex-1 h-2 bg-muted rounded-full">
                          <div className="h-2 bg-primary rounded-full" style={{ width: "25%" }}></div>
                        </div>
                        <span className="w-10 text-right text-sm">25%</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-20 text-sm">Events</span>
                        <div className="flex-1 h-2 bg-muted rounded-full">
                          <div className="h-2 bg-primary rounded-full" style={{ width: "10%" }}></div>
                        </div>
                        <span className="w-10 text-right text-sm">10%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Guest Satisfaction</CardTitle>
              <CardDescription>Analysis of guest feedback and ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium mb-4">Overall Satisfaction Score</h3>
                  <div className="flex items-center justify-center">
                    <div className="relative h-40 w-40">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl font-bold">4.7</span>
                      </div>
                      <svg viewBox="0 0 100 100" className="h-full w-full">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="hsl(22, 65%, 57%)"
                          strokeWidth="10"
                          strokeDasharray="283"
                          strokeDashoffset="28.3"
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-center text-sm text-muted-foreground mt-2">Based on 1,245 reviews</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-4">Satisfaction by Category</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Cleanliness</span>
                        <span className="text-sm">4.8/5</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "96%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Staff & Service</span>
                        <span className="text-sm">4.9/5</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "98%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Comfort</span>
                        <span className="text-sm">4.6/5</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "92%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Facilities</span>
                        <span className="text-sm">4.5/5</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "90%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Value for Money</span>
                        <span className="text-sm">4.4/5</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "88%" }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Location</span>
                        <span className="text-sm">4.7/5</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "94%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

