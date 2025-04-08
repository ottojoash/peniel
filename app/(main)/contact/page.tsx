import Image from "next/image"
import Link from "next/link"
import { Phone, Mail, Clock, Facebook, Instagram, Twitter, MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import ContactForm from "@/components/contact-form"
import ContactInfo from "@/components/contact-info"
import FAQAccordion from "@/components/faq-accordion"

export default function ContactPage() {
  // FAQ items for the contact page
  const faqItems = [
    {
      question: "What are your check-in and check-out times?",
      answer:
        "Check-in time is 2:00 PM and check-out time is 11:00 AM. Early check-in or late check-out may be available upon request, subject to availability and additional charges may apply.",
    },
    {
      question: "Do you offer airport transfers?",
      answer:
        "Yes, we offer airport transfer services for our guests. Please contact our reception at least 24 hours in advance to arrange this service. Additional charges apply based on the type of vehicle and time of transfer.",
    },
    {
      question: "How far is the hotel from Entebbe International Airport?",
      answer:
        "Peniel Beach Hotel is located approximately 5 kilometers from Entebbe International Airport, which is about a 10-15 minute drive depending on traffic conditions.",
    },
    {
      question: "Is there a restaurant at the hotel?",
      answer:
        "Yes, we have an on-site restaurant that serves breakfast, lunch, and dinner. Our menu features a variety of local and international cuisine options to cater to all tastes.",
    },
    {
      question: "Do you have facilities for events and conferences?",
      answer:
        "Yes, we offer various event spaces suitable for conferences, weddings, and other special occasions. Please contact our events team for more information about capacity, pricing, and available services.",
    },
  ]

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative h-[40vh] w-full">
        <Image
          src="/placeholder.svg?height=800&width=1920"
          alt="Peniel Beach Hotel Contact"
          fill
          priority
          className="object-cover brightness-[0.65]"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <Badge className="bg-primary mb-4">Get In Touch</Badge>
          <h1 className="text-3xl md:text-5xl font-serif text-white mb-4">Contact Us</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl">
            We're here to answer any questions you may have about our hotel and services
          </p>
        </div>
      </section>

      {/* Contact Information and Form Section */}
      <section className="py-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-serif mb-6">Get In Touch</h2>
              <p className="text-muted-foreground mb-8">
                Whether you have a question about our rooms, restaurant, kids park, or any other services, our team is
                ready to answer all your questions.
              </p>

              <ContactInfo />

              <div className="mt-8">
                <h3 className="text-xl font-medium mb-4">Connect With Us</h3>
                <div className="flex gap-4">
                  <Link
                    href="#"
                    className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    <Facebook className="h-5 w-5" />
                  </Link>
                  <Link
                    href="#"
                    className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    <Instagram className="h-5 w-5" />
                  </Link>
                  <Link
                    href="#"
                    className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-medium">Send Us a Message</h2>
                  <p className="text-muted-foreground text-sm">We'll get back to you as soon as possible</p>
                </div>
              </div>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-8 px-4 md:px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif mb-4">Our Location</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Located opposite the old Airport in Entebbe, we offer a convenient and beautiful beachfront location
            </p>
          </div>

          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src="/placeholder.svg?height=800&width=1600&text=Google+Map"
              alt="Map location of Peniel Beach Hotel"
              fill
              className="object-cover"
            />
            {/* In a real implementation, this would be replaced with an actual Google Maps embed */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Link
                href="https://maps.google.com/?q=Plot+110-120+Circular+Road+Bugonga+Entebbe+Uganda"
                target="_blank"
                className="bg-primary text-white px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                Open in Google Maps
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif mb-4">Our Departments</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Contact the specific department for your inquiries
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg hover:border-primary/50 hover:bg-muted/30 transition-colors">
              <h3 className="text-xl font-medium mb-3">Reservations</h3>
              <p className="text-muted-foreground mb-4">
                For room bookings, availability inquiries, and special accommodation requests.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span>+256 772 485 887</span>
              </div>
              <div className="flex items-center gap-2 text-sm mt-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>reservations@penielbeachhotel.com</span>
              </div>
            </div>

            <div className="p-6 border rounded-lg hover:border-primary/50 hover:bg-muted/30 transition-colors">
              <h3 className="text-xl font-medium mb-3">Events & Conferences</h3>
              <p className="text-muted-foreground mb-4">
                For organizing events, conferences, weddings, and special celebrations.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span>+256 752 703 147</span>
              </div>
              <div className="flex items-center gap-2 text-sm mt-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>events@penielbeachhotel.com</span>
              </div>
            </div>

            <div className="p-6 border rounded-lg hover:border-primary/50 hover:bg-muted/30 transition-colors">
              <h3 className="text-xl font-medium mb-3">Restaurant</h3>
              <p className="text-muted-foreground mb-4">
                For table reservations, menu inquiries, and special dining arrangements.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span>+256 772 485 887</span>
              </div>
              <div className="flex items-center gap-2 text-sm mt-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>restaurant@penielbeachhotel.com</span>
              </div>
            </div>

            <div className="p-6 border rounded-lg hover:border-primary/50 hover:bg-muted/30 transition-colors">
              <h3 className="text-xl font-medium mb-3">Kids Park</h3>
              <p className="text-muted-foreground mb-4">
                For information about kids activities, birthday parties, and special programs.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span>+256 752 703 147</span>
              </div>
              <div className="flex items-center gap-2 text-sm mt-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>kidspark@penielbeachhotel.com</span>
              </div>
            </div>

            <div className="p-6 border rounded-lg hover:border-primary/50 hover:bg-muted/30 transition-colors">
              <h3 className="text-xl font-medium mb-3">Customer Service</h3>
              <p className="text-muted-foreground mb-4">
                For general inquiries, feedback, and assistance with any issues.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span>+256 772 485 887</span>
              </div>
              <div className="flex items-center gap-2 text-sm mt-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>info@penielbeachhotel.com</span>
              </div>
            </div>

            <div className="p-6 border rounded-lg hover:border-primary/50 hover:bg-muted/30 transition-colors">
              <h3 className="text-xl font-medium mb-3">Management</h3>
              <p className="text-muted-foreground mb-4">
                For business inquiries, partnerships, and administrative matters.
              </p>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-primary" />
                <span>+256 752 703 147</span>
              </div>
              <div className="flex items-center gap-2 text-sm mt-2">
                <Mail className="h-4 w-4 text-primary" />
                <span>management@penielbeachhotel.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find quick answers to common questions about our hotel and services
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <FAQAccordion items={faqItems} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto relative z-10 bg-primary/95 rounded-xl p-8 md:p-12 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif mb-4">Ready to Book Your Stay?</h2>
              <p className="mb-6 text-white/90">
                Contact our reservations team directly or book online for the best rates and availability.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/rooms"
                  className="bg-white text-primary hover:bg-white/90 px-8 py-3 rounded-md font-medium transition-colors inline-flex justify-center"
                >
                  Book Now
                </Link>
                <Link
                  href="tel:+256772485887"
                  className="bg-transparent hover:bg-white/10 border border-white/50 px-8 py-3 rounded-md font-medium transition-colors inline-flex justify-center"
                >
                  Call Us
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="h-6 w-6 text-white" />
                  <span className="font-medium">Reservations Office</span>
                </div>
                <h3 className="text-2xl font-serif mb-2">Open 24/7</h3>
                <p className="text-white/80 mb-4">We're always here to assist you</p>
                <Link
                  href="mailto:reservations@penielbeachhotel.com"
                  className="w-full bg-white text-primary hover:bg-white/90 px-4 py-2 rounded-md font-medium transition-colors inline-flex justify-center"
                >
                  Email Reservations
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

