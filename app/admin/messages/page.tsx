"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Search, Filter, MoreHorizontal, Eye, Reply, Trash2, Archive, Star, StarOff } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MessageDetailsDialog from "@/components/admin/message-details-dialog"

// Mock data for messages
const messages = [
  {
    id: "M-1001",
    name: "John Smith",
    email: "john.smith@example.com",
    subject: "Booking Inquiry",
    message:
      "Hello, I'm interested in booking a room for 4 nights in July. Do you have availability for a family of 4? We would need a room with two queen beds or a suite. Also, is breakfast included in the room rate? Thank you.",
    status: "unread",
    priority: "normal",
    createdAt: "2025-03-20T14:30:00Z",
    category: "booking",
  },
  {
    id: "M-1002",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    subject: "Special Dietary Requirements",
    message:
      "Hi, I have a reservation for next weekend and wanted to inform you about my dietary restrictions. I'm allergic to nuts and gluten. Will your restaurant be able to accommodate these restrictions? I would appreciate if you could confirm this before my arrival.",
    status: "read",
    priority: "high",
    createdAt: "2025-03-19T09:15:00Z",
    category: "restaurant",
  },
  {
    id: "M-1003",
    name: "Michael Wong",
    email: "michael.w@example.com",
    subject: "Airport Transfer",
    message:
      "Good day, I will be arriving at Entebbe International Airport on March 24th at 2:30 PM. Do you offer airport transfer services? If yes, what is the cost and how can I book this service? My flight number is EK123.",
    status: "replied",
    priority: "normal",
    createdAt: "2025-03-18T16:45:00Z",
    category: "service",
  },
  {
    id: "M-1004",
    name: "Emily Davis",
    email: "emily.d@example.com",
    subject: "Wedding Venue Inquiry",
    message:
      "Hello, my fiancé and I are planning our wedding for next year and we're considering your hotel as a venue. Could you please provide information about your wedding packages, capacity, and availability for June 2026? We're expecting around 100 guests.",
    status: "unread",
    priority: "high",
    createdAt: "2025-03-17T11:20:00Z",
    category: "event",
  },
  {
    id: "M-1005",
    name: "Robert Chen",
    email: "robert.c@example.com",
    subject: "Complaint about Room Cleanliness",
    message:
      "I'm currently staying in room 302 and I'm very disappointed with the cleanliness of the room. The bathroom wasn't properly cleaned and there are stains on the carpet. I've reported this to the front desk but no action has been taken yet. I expect better service for the price I'm paying.",
    status: "read",
    priority: "urgent",
    createdAt: "2025-03-16T13:10:00Z",
    category: "complaint",
  },
  {
    id: "M-1006",
    name: "Lisa Kim",
    email: "lisa.k@example.com",
    subject: "Kids Park Activities",
    message:
      "Hi there, I'm planning to stay at your hotel next month with my two children (ages 5 and 8). Could you please provide more information about the kids park activities? Are there supervised activities throughout the day? Also, is there an additional cost for these activities?",
    status: "archived",
    priority: "normal",
    createdAt: "2025-03-15T10:05:00Z",
    category: "kids-park",
  },
  {
    id: "M-1007",
    name: "David Wilson",
    email: "david.w@example.com",
    subject: "Lost Item",
    message:
      "I stayed at your hotel last weekend (Room 415) and I believe I left my silver watch in the room. It has great sentimental value to me. Could you please check if it was found by the housekeeping staff? I would greatly appreciate your help in this matter.",
    status: "replied",
    priority: "high",
    createdAt: "2025-03-14T15:30:00Z",
    category: "lost-found",
  },
  {
    id: "M-1008",
    name: "Jennifer Lee",
    email: "jennifer.l@example.com",
    subject: "Feedback on Recent Stay",
    message:
      "I wanted to thank you for the wonderful stay at your hotel last week. The staff was incredibly friendly and helpful, especially the restaurant manager who went out of his way to accommodate our late dinner request. The room was comfortable and the view was spectacular. We will definitely be returning in the future!",
    status: "read",
    priority: "normal",
    createdAt: "2025-03-13T09:45:00Z",
    category: "feedback",
  },
]

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("inbox")
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Filter messages based on search term, status filter, and active tab
  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || message.status === statusFilter
    const matchesCategory = categoryFilter === "all" || message.category === categoryFilter

    // Filter based on active tab
    if (activeTab === "inbox") {
      return matchesSearch && matchesStatus && matchesCategory && message.status !== "archived"
    } else if (activeTab === "archived") {
      return matchesSearch && message.status === "archived" && matchesCategory
    } else if (activeTab === "starred") {
      return matchesSearch && message.priority === "high" && matchesCategory
    }

    return false
  })

  const openMessageDetails = (message: any) => {
    setSelectedMessage(message)
    setTimeout(() => {
      setIsDetailsOpen(true)
    }, 0)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "unread":
        return <Badge className="bg-blue-500">Unread</Badge>
      case "read":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Read
          </Badge>
        )
      case "replied":
        return <Badge className="bg-green-500">Replied</Badge>
      case "archived":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Archived
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge className="bg-red-500">Urgent</Badge>
      case "high":
        return <Badge className="bg-yellow-500">High</Badge>
      case "normal":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Normal
          </Badge>
        )
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">Manage and respond to customer inquiries</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Archive className="mr-2 h-4 w-4" />
            Archive Selected
          </Button>
          <Button>
            <Reply className="mr-2 h-4 w-4" />
            Compose
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Messages</CardTitle>
          <CardDescription>View and respond to messages from your website visitors</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <TabsList>
                <TabsTrigger value="inbox" className="relative">
                  Inbox
                  <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center bg-primary text-xs">
                    {messages.filter((m) => m.status !== "archived").length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="starred">
                  Starred
                  <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center bg-yellow-500 text-xs">
                    {messages.filter((m) => m.priority === "high").length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger value="archived">
                  Archived
                  <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center bg-muted text-xs">
                    {messages.filter((m) => m.status === "archived").length}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search messages..."
                    className="pl-8 w-full md:w-[200px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="booking">Booking</SelectItem>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                      <SelectItem value="service">Service</SelectItem>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="complaint">Complaint</SelectItem>
                      <SelectItem value="kids-park">Kids Park</SelectItem>
                      <SelectItem value="lost-found">Lost & Found</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">From</TableHead>
                    <TableHead className="w-[300px]">Subject</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        No messages found matching your search criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMessages.map((message) => (
                      <TableRow
                        key={message.id}
                        className={message.status === "unread" ? "font-medium bg-muted/20" : ""}
                      >
                        <TableCell>
                          <div className="font-medium">{message.name}</div>
                          <div className="text-xs text-muted-foreground">{message.email}</div>
                        </TableCell>
                        <TableCell>
                          <div className="truncate max-w-[300px]">{message.subject}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {message.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{getPriorityBadge(message.priority)}</TableCell>
                        <TableCell>{getStatusBadge(message.status)}</TableCell>
                        <TableCell>{new Date(message.createdAt).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openMessageDetails(message)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Message
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Reply className="mr-2 h-4 w-4" />
                                Reply
                              </DropdownMenuItem>
                              {message.priority !== "high" ? (
                                <DropdownMenuItem>
                                  <Star className="mr-2 h-4 w-4" />
                                  Mark as Important
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem>
                                  <StarOff className="mr-2 h-4 w-4" />
                                  Remove Importance
                                </DropdownMenuItem>
                              )}
                              {message.status !== "archived" ? (
                                <DropdownMenuItem>
                                  <Archive className="mr-2 h-4 w-4" />
                                  Archive
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem>
                                  <Archive className="mr-2 h-4 w-4" />
                                  Unarchive
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">3</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {selectedMessage && (
        <MessageDetailsDialog message={selectedMessage} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} />
      )}
    </div>
  )
}

