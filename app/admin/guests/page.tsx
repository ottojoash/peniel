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
import { Search, Filter, MoreHorizontal, Eye, Edit, Trash2, Download, Plus, Mail, Phone } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import GuestDetailsDialog from "@/components/admin/guest-details-dialog"

// Mock data for guests
const guests = [
  {
    id: "G-1001",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+256 772 123 456",
    nationality: "United States",
    address: "123 Main St, New York, NY 10001",
    passportNumber: "A12345678",
    totalStays: 3,
    totalSpent: 720,
    lastStay: "2025-03-10",
    status: "active",
    notes: "Prefers rooms with ocean view. Allergic to nuts.",
    createdAt: "2024-12-15T14:30:00Z",
  },
  {
    id: "G-1002",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+256 752 987 654",
    nationality: "United Kingdom",
    address: "45 Park Lane, London, SW1X 7QA",
    passportNumber: "B87654321",
    totalStays: 1,
    totalSpent: 400,
    lastStay: "2025-03-26",
    status: "active",
    notes: "First time guest. Celebrating anniversary.",
    createdAt: "2025-01-11T09:15:00Z",
  },
  {
    id: "G-1003",
    name: "Michael Wong",
    email: "michael.w@example.com",
    phone: "+256 772 456 789",
    nationality: "Singapore",
    address: "78 Orchard Road, Singapore, 238839",
    passportNumber: "S9876543C",
    totalStays: 5,
    totalSpent: 1250,
    lastStay: "2025-02-15",
    status: "active",
    notes: "Frequent business traveler. Member of loyalty program.",
    createdAt: "2024-10-09T16:45:00Z",
  },
  {
    id: "G-1004",
    name: "Emily Davis",
    email: "emily.d@example.com",
    phone: "+256 752 345 678",
    nationality: "Canada",
    address: "567 Yonge St, Toronto, ON M4Y 1Z4",
    passportNumber: "C5432198",
    totalStays: 2,
    totalSpent: 298,
    lastStay: "2025-01-27",
    status: "inactive",
    notes: "Prefers quiet rooms away from elevator.",
    createdAt: "2024-11-12T11:20:00Z",
  },
  {
    id: "G-1005",
    name: "Robert Chen",
    email: "robert.c@example.com",
    phone: "+256 772 234 567",
    nationality: "China",
    address: "890 Nanjing Road, Shanghai, 200000",
    passportNumber: "E12345678",
    totalStays: 1,
    totalSpent: 150,
    lastStay: "2024-12-25",
    status: "blacklisted",
    notes: "Blacklisted due to property damage during last stay.",
    createdAt: "2024-09-08T13:10:00Z",
  },
  {
    id: "G-1006",
    name: "Lisa Kim",
    email: "lisa.k@example.com",
    phone: "+256 752 876 543",
    nationality: "South Korea",
    address: "123 Gangnam-daero, Seoul, 06000",
    passportNumber: "M9876543",
    totalStays: 4,
    totalSpent: 980,
    lastStay: "2025-03-05",
    status: "active",
    notes: "Prefers high floor rooms. Speaks limited English.",
    createdAt: "2024-08-13T10:05:00Z",
  },
  {
    id: "G-1007",
    name: "David Wilson",
    email: "david.w@example.com",
    phone: "+256 772 765 432",
    nationality: "Australia",
    address: "45 George St, Sydney, NSW 2000",
    passportNumber: "PA12345",
    totalStays: 2,
    totalSpent: 650,
    lastStay: "2025-02-14",
    status: "active",
    notes: "Traveling with family. Requires extra beds.",
    createdAt: "2024-11-14T15:30:00Z",
  },
  {
    id: "G-1008",
    name: "Jennifer Lee",
    email: "jennifer.l@example.com",
    phone: "+256 752 654 321",
    nationality: "United States",
    address: "789 Oak St, San Francisco, CA 94102",
    passportNumber: "A98765432",
    totalStays: 1,
    totalSpent: 120,
    lastStay: "2025-01-26",
    status: "active",
    notes: "Vegetarian diet. Interested in local tours.",
    createdAt: "2025-01-12T09:45:00Z",
  },
]

export default function GuestsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedGuest, setSelectedGuest] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Filter guests based on search term and status filter
  const filteredGuests = guests.filter((guest) => {
    const matchesSearch =
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.phone.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || guest.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const openGuestDetails = (guest: any) => {
    setSelectedGuest(guest)
    setTimeout(() => {
      setIsDetailsOpen(true)
    }, 0)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Active</Badge>
      case "inactive":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Inactive
          </Badge>
        )
      case "blacklisted":
        return <Badge className="bg-red-500">Blacklisted</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Guests</h1>
          <p className="text-muted-foreground">Manage and track all guest information</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Guest
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Guests</CardTitle>
          <CardDescription>View and manage guest profiles and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, phone, or ID..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="blacklisted">Blacklisted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Nationality</TableHead>
                  <TableHead>Total Stays</TableHead>
                  <TableHead>Last Stay</TableHead>
                  <TableHead>Total Spent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGuests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                      No guests found matching your search criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredGuests.map((guest) => (
                    <TableRow key={guest.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={`/placeholder.svg?height=40&width=40&text=${guest.name.charAt(0)}`} />
                            <AvatarFallback>{guest.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{guest.name}</div>
                            <div className="text-xs text-muted-foreground">{guest.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{guest.email}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Phone className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">{guest.phone}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{guest.nationality}</TableCell>
                      <TableCell>{guest.totalStays}</TableCell>
                      <TableCell>{new Date(guest.lastStay).toLocaleDateString()}</TableCell>
                      <TableCell>${guest.totalSpent}</TableCell>
                      <TableCell>{getStatusBadge(guest.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openGuestDetails(guest)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Guest
                            </DropdownMenuItem>
                            {guest.status !== "blacklisted" ? (
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Blacklist Guest
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                Remove from Blacklist
                              </DropdownMenuItem>
                            )}
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
        </CardContent>
      </Card>

      {selectedGuest && (
        <GuestDetailsDialog guest={selectedGuest} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} />
      )}
    </div>
  )
}

