"use client"

import { useState, useEffect } from "react"
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
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Download,
  Plus,
  Mail,
  Phone,
  Loader2,
  RefreshCw,
  Calendar,
  Users,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import GuestDetailsDialog from "@/components/admin/guest-details-dialog"
import { getGuests, getRecentGuests } from "@/app/actions/guest-actions"
import { toast } from "@/hooks/use-toast"
import GuestForm from "@/components/admin/guest-form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"

export default function GuestsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedGuest, setSelectedGuest] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false)
  const [guests, setGuests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState("recent")
  const [timeRange, setTimeRange] = useState("1")

  const fetchGuests = async (tab: string = activeTab) => {
    setIsLoading(true)
    setError(null)
    try {
      let result

      if (tab === "recent") {
        result = await getRecentGuests(Number.parseInt(timeRange))
      } else {
        result = await getGuests()
      }

      if (result.error) {
        setError(result.error)
        toast({
          title: "Error",
          description: `Failed to fetch guests: ${result.error}`,
          variant: "destructive",
        })
      } else {
        setGuests(result.data || [])
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while fetching guests")
      toast({
        title: "Error",
        description: err.message || "An error occurred while fetching guests",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGuests()
  }, [])

  useEffect(() => {
    fetchGuests(activeTab)
  }, [activeTab, timeRange])

  // Filter guests based on search term and status filter
  const filteredGuests = guests.filter((guest) => {
    const fullName = `${guest.first_name} ${guest.last_name}`.toLowerCase()
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      (guest.id?.toString() || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (guest.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (guest.phone || "").toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || guest.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredGuests.length / itemsPerPage)
  const paginatedGuests = filteredGuests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

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
        return <Badge>Active</Badge>
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setCurrentPage(1) // Reset to first page when changing tabs
  }

  // Get the date range description
  const getDateRangeDescription = () => {
    const months = Number.parseInt(timeRange)
    const today = new Date()
    const startDate = new Date()
    startDate.setMonth(today.getMonth() - months)

    return `${format(startDate, "MMMM d, yyyy")} - ${format(today, "MMMM d, yyyy")}`
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
          <Button onClick={() => setIsAddGuestOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Guest
          </Button>
        </div>
      </div>

      <Tabs defaultValue="recent" value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="mb-4">
          <TabsTrigger value="recent">
            <Calendar className="h-4 w-4 mr-2" />
            Recent Check-ins
          </TabsTrigger>
          <TabsTrigger value="all">
            <Users className="h-4 w-4 mr-2" />
            All Guests
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-lg font-medium">Recent Guest Check-ins</h3>
                  <p className="text-sm text-muted-foreground">
                    Showing guests who checked in during: {getDateRangeDescription()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Time range:</span>
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Past month</SelectItem>
                      <SelectItem value="3">Past 3 months</SelectItem>
                      <SelectItem value="6">Past 6 months</SelectItem>
                      <SelectItem value="12">Past year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>{activeTab === "recent" ? "Recent Check-ins" : "All Guests"}</CardTitle>
          <CardDescription>
            {activeTab === "recent"
              ? `Guests who checked in during the selected time period (${getDateRangeDescription()})`
              : "View and manage all guest profiles and preferences"}
          </CardDescription>
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
                  <TableHead>Country</TableHead>
                  <TableHead>Total Stays</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">Loading guests...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10">
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-red-500 mb-2">{error}</p>
                        <Button variant="outline" size="sm" onClick={() => fetchGuests(activeTab)}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Try Again
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedGuests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                      {activeTab === "recent"
                        ? `No guests checked in during ${getDateRangeDescription()}`
                        : "No guests found matching your search criteria"}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedGuests.map((guest) => (
                    <TableRow key={guest.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage
                              src={`/placeholder.svg?height=40&width=40&text=${guest.first_name?.charAt(0) || "G"}`}
                            />
                            <AvatarFallback>{guest.first_name?.charAt(0) || "G"}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {guest.first_name} {guest.last_name}
                            </div>
                            <div className="text-xs text-muted-foreground">ID: {guest.id}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          {guest.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{guest.email}</span>
                            </div>
                          )}
                          {guest.phone && (
                            <div className="flex items-center gap-1 mt-1">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              <span className="text-sm">{guest.phone}</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{guest.country || "—"}</TableCell>
                      <TableCell>{guest.bookings?.length || 0}</TableCell>
                      <TableCell>{guest.created_at ? new Date(guest.created_at).toLocaleDateString() : "—"}</TableCell>
                      <TableCell>{getStatusBadge(guest.status || "active")}</TableCell>
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
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedGuest(guest)
                                setIsDetailsOpen(true)
                                setTimeout(() => setIsEditing(true), 100)
                              }}
                            >
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

          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          setCurrentPage(page)
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedGuest && (
        <GuestDetailsDialog
          guest={selectedGuest}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
          onGuestUpdated={() => fetchGuests(activeTab)}
        />
      )}

      <Dialog open={isAddGuestOpen} onOpenChange={setIsAddGuestOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Add New Guest</DialogTitle>
            <DialogDescription>Enter the guest's information to create a new profile.</DialogDescription>
          </DialogHeader>
          <GuestForm
            onSuccess={() => {
              setIsAddGuestOpen(false)
              fetchGuests(activeTab)
              toast({
                title: "Guest created",
                description: "The guest has been created successfully.",
              })
            }}
            onCancel={() => setIsAddGuestOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
