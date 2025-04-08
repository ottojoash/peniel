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
import { Search, Filter, MoreHorizontal, Eye, Download, Plus, CreditCard, Receipt, FileText } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePickerWithRange } from "@/components/admin/date-range-picker"
import PaymentDetailsDialog from "@/components/admin/payment-details-dialog"

// Mock data for payments
const payments = [
  {
    id: "P-1001",
    bookingId: "B-1001",
    guestName: "John Smith",
    amount: 240,
    method: "credit_card",
    status: "completed",
    date: "2025-03-10T14:30:00Z",
    cardInfo: {
      type: "Visa",
      last4: "4242",
    },
  },
  {
    id: "P-1002",
    bookingId: "B-1002",
    guestName: "Sarah Johnson",
    amount: 400,
    method: "bank_transfer",
    status: "pending",
    date: "2025-03-11T09:15:00Z",
  },
  {
    id: "P-1003",
    bookingId: "B-1003",
    guestName: "Michael Wong",
    amount: 190,
    method: "credit_card",
    status: "completed",
    date: "2025-03-09T16:45:00Z",
    cardInfo: {
      type: "Mastercard",
      last4: "5678",
    },
  },
  {
    id: "P-1004",
    bookingId: "B-1004",
    guestName: "Emily Davis",
    amount: 149,
    method: "paypal",
    status: "completed",
    date: "2025-03-12T11:20:00Z",
  },
  {
    id: "P-1005",
    bookingId: "B-1005",
    guestName: "Robert Chen",
    amount: 150,
    method: "credit_card",
    status: "refunded",
    date: "2025-03-08T13:10:00Z",
    cardInfo: {
      type: "Visa",
      last4: "1234",
    },
  },
  {
    id: "P-1006",
    bookingId: "B-1006",
    guestName: "Lisa Kim",
    amount: 320,
    method: "mobile_money",
    status: "completed",
    date: "2025-03-13T10:05:00Z",
  },
  {
    id: "P-1007",
    bookingId: "B-1007",
    guestName: "David Wilson",
    amount: 400,
    method: "cash",
    status: "completed",
    date: "2025-03-14T15:30:00Z",
  },
  {
    id: "P-1008",
    bookingId: "B-1008",
    guestName: "Jennifer Lee",
    amount: 120,
    method: "credit_card",
    status: "completed",
    date: "2025-03-12T09:45:00Z",
    cardInfo: {
      type: "Amex",
      last4: "9876",
    },
  },
]

// Mock data for invoices
const invoices = [
  {
    id: "INV-1001",
    bookingId: "B-1001",
    guestName: "John Smith",
    amount: 240,
    status: "paid",
    issueDate: "2025-03-10T10:30:00Z",
    dueDate: "2025-03-10T14:30:00Z",
  },
  {
    id: "INV-1002",
    bookingId: "B-1002",
    guestName: "Sarah Johnson",
    amount: 400,
    status: "unpaid",
    issueDate: "2025-03-11T08:15:00Z",
    dueDate: "2025-03-18T08:15:00Z",
  },
  {
    id: "INV-1003",
    bookingId: "B-1003",
    guestName: "Michael Wong",
    amount: 190,
    status: "paid",
    issueDate: "2025-03-09T12:45:00Z",
    dueDate: "2025-03-09T16:45:00Z",
  },
  {
    id: "INV-1004",
    bookingId: "B-1004",
    guestName: "Emily Davis",
    amount: 149,
    status: "paid",
    issueDate: "2025-03-12T09:20:00Z",
    dueDate: "2025-03-12T11:20:00Z",
  },
  {
    id: "INV-1005",
    bookingId: "B-1005",
    guestName: "Robert Chen",
    amount: 150,
    status: "refunded",
    issueDate: "2025-03-08T10:10:00Z",
    dueDate: "2025-03-08T13:10:00Z",
  },
]

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [methodFilter, setMethodFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("payments")
  const [selectedPayment, setSelectedPayment] = useState<any>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  // Filter payments based on search term, status filter, and method filter
  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.guestName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    const matchesMethod = methodFilter === "all" || payment.method === methodFilter

    // Filter by date range if set
    let matchesDateRange = true
    if (dateRange.from && dateRange.to) {
      const paymentDate = new Date(payment.date)
      matchesDateRange = paymentDate >= dateRange.from && paymentDate <= dateRange.to
    }

    return matchesSearch && matchesStatus && matchesMethod && matchesDateRange
  })

  // Filter invoices based on search term and status filter
  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.guestName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || invoice.status === statusFilter

    // Filter by date range if set
    let matchesDateRange = true
    if (dateRange.from && dateRange.to) {
      const invoiceDate = new Date(invoice.issueDate)
      matchesDateRange = invoiceDate >= dateRange.from && invoiceDate <= dateRange.to
    }

    return matchesSearch && matchesStatus && matchesDateRange
  })

  const openPaymentDetails = (payment: any) => {
    setSelectedPayment(payment)
    setTimeout(() => {
      setIsDetailsOpen(true)
    }, 0)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
      case "paid":
        return <Badge className="bg-green-500">Completed</Badge>
      case "pending":
      case "unpaid":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>
      case "refunded":
        return (
          <Badge variant="outline" className="text-red-600 border-red-600">
            Refunded
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getPaymentMethodBadge = (method: string) => {
    switch (method) {
      case "credit_card":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <CreditCard className="h-3 w-3" /> Credit Card
          </Badge>
        )
      case "bank_transfer":
        return <Badge variant="outline">Bank Transfer</Badge>
      case "paypal":
        return <Badge variant="outline">PayPal</Badge>
      case "mobile_money":
        return <Badge variant="outline">Mobile Money</Badge>
      case "cash":
        return <Badge variant="outline">Cash</Badge>
      default:
        return <Badge variant="outline">{method}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">Manage payments and invoices</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Record Payment
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Financial Transactions</CardTitle>
          <CardDescription>View and manage all payment transactions and invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <TabsList>
                <TabsTrigger value="payments" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Payments
                </TabsTrigger>
                <TabsTrigger value="invoices" className="flex items-center gap-2">
                  <Receipt className="h-4 w-4" />
                  Invoices
                </TabsTrigger>
              </TabsList>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    className="pl-8 w-full md:w-[200px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <DatePickerWithRange dateRange={dateRange} setDateRange={setDateRange} />
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {activeTab === "payments" && (
                  <div className="flex items-center gap-2">
                    <Select value={methodFilter} onValueChange={setMethodFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Methods</SelectItem>
                        <SelectItem value="credit_card">Credit Card</SelectItem>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="mobile_money">Mobile Money</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>

            <TabsContent value="payments" className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Payment ID</TableHead>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Guest</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                          No payments found matching your search criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-medium">{payment.id}</TableCell>
                          <TableCell>{payment.bookingId}</TableCell>
                          <TableCell>{payment.guestName}</TableCell>
                          <TableCell>${payment.amount}</TableCell>
                          <TableCell>{getPaymentMethodBadge(payment.method)}</TableCell>
                          <TableCell>{getStatusBadge(payment.status)}</TableCell>
                          <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openPaymentDetails(payment)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Receipt className="mr-2 h-4 w-4" />
                                  Generate Receipt
                                </DropdownMenuItem>
                                {payment.status === "completed" && (
                                  <DropdownMenuItem>
                                    <FileText className="mr-2 h-4 w-4" />
                                    Issue Refund
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
            </TabsContent>

            <TabsContent value="invoices" className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Invoice ID</TableHead>
                      <TableHead>Booking ID</TableHead>
                      <TableHead>Guest</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInvoices.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                          No invoices found matching your search criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredInvoices.map((invoice) => (
                        <TableRow key={invoice.id}>
                          <TableCell className="font-medium">{invoice.id}</TableCell>
                          <TableCell>{invoice.bookingId}</TableCell>
                          <TableCell>{invoice.guestName}</TableCell>
                          <TableCell>${invoice.amount}</TableCell>
                          <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                          <TableCell>{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
                          <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Invoice
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="mr-2 h-4 w-4" />
                                  Download PDF
                                </DropdownMenuItem>
                                {invoice.status === "unpaid" && (
                                  <DropdownMenuItem>
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Record Payment
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
            </TabsContent>

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

      {selectedPayment && (
        <PaymentDetailsDialog payment={selectedPayment} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} />
      )}
    </div>
  )
}

