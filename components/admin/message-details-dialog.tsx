"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Calendar, Tag, Flag } from "lucide-react"

interface MessageDetailsDialogProps {
  message: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function MessageDetailsDialog({ message, open, onOpenChange }: MessageDetailsDialogProps) {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {message.subject} {getStatusBadge(message.status)}
          </DialogTitle>
          <DialogDescription>
            Message ID: {message.id} | Received: {new Date(message.createdAt).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{message.name}</span>
              <span className="text-muted-foreground">&lt;{message.email}&gt;</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{new Date(message.createdAt).toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-1">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <Badge variant="outline" className="capitalize">
                  {message.category}
                </Badge>
              </div>

              <div className="flex items-center gap-1">
                <Flag className="h-4 w-4 text-muted-foreground" />
                {getPriorityBadge(message.priority)}
              </div>
            </div>
          </div>

          <Separator />

          <div className="p-4 border rounded-md bg-muted/20 min-h-[200px]">
            <p className="whitespace-pre-line">{message.message}</p>
          </div>

          {message.status === "replied" && (
            <div className="space-y-2">
              <h3 className="font-medium">Previous Reply</h3>
              <div className="p-4 border rounded-md bg-muted/10">
                <p className="text-muted-foreground">
                  Thank you for your message. We have received your inquiry and will process it accordingly. A member of
                  our team will be in touch with you shortly.
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Sent: {new Date(new Date(message.createdAt).getTime() + 86400000).toLocaleString()}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="font-medium">Reply</h3>
            <Textarea placeholder="Type your reply here..." className="min-h-[150px]" />
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none">
              Save Draft
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none">
              Archive
            </Button>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-none" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="flex-1 sm:flex-none">Send Reply</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

