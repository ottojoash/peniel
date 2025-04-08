"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { CheckCircle2 } from "lucide-react"

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subject: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We'll get back to you soon!",
      })
    }, 1500)

    // In a real implementation, you would send the form data to your server
    // const response = await fetch('/api/contact', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData)
    // })
    //
    // if (response.ok) {
    //   setIsSubmitting(false)
    //   setIsSubmitted(true)
    //   toast({
    //     title: "Message Sent",
    //     description: "Thank you for contacting us. We'll get back to you soon!",
    //   })
    // } else {
    //   setIsSubmitting(false)
    //   toast({
    //     title: "Error",
    //     description: "There was a problem sending your message. Please try again.",
    //     variant: "destructive"
    //   })
    // }
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-medium mb-2">Thank You!</h3>
        <p className="text-muted-foreground text-center mb-6">
          Your message has been sent successfully. We'll get back to you as soon as possible.
        </p>
        <Button
          onClick={() => {
            setFormData({
              name: "",
              email: "",
              phone: "",
              subject: "",
              message: "",
            })
            setIsSubmitted(false)
          }}
        >
          Send Another Message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Your Name</Label>
          <Input id="name" name="name" placeholder="John Doe" required value={formData.name} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number (Optional)</Label>
        <Input id="phone" name="phone" placeholder="+256 7XX XXX XXX" value={formData.phone} onChange={handleChange} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Select onValueChange={handleSelectChange} value={formData.subject}>
          <SelectTrigger>
            <SelectValue placeholder="Select a subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">General Inquiry</SelectItem>
            <SelectItem value="reservation">Reservation Question</SelectItem>
            <SelectItem value="feedback">Feedback</SelectItem>
            <SelectItem value="complaint">Complaint</SelectItem>
            <SelectItem value="business">Business Proposal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Your Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="How can we help you?"
          rows={5}
          required
          value={formData.message}
          onChange={handleChange}
        />
      </div>

      <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  )
}

