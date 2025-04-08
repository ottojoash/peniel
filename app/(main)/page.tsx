import Image from "next/image"
import { Calendar } from "lucide-react"
import BookingForm from "@/components/booking-form"
import FeaturedRooms from "@/components/featured-rooms"
import Amenities from "@/components/amenities"
import Testimonials from "@/components/testimonials"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full">
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Peniel Beach Hotel"
          fill
          priority
          className="object-cover brightness-[0.65]"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-serif text-white mb-4">Your Perfect Beach Getaway</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-8">
            Experience luxury and comfort at Peniel Beach Hotel, where unforgettable memories await
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-md font-medium transition-colors">
              Book Now
            </button>
            <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 px-8 py-3 rounded-md font-medium transition-colors">
              Explore Rooms
            </button>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="relative z-10 px-4 md:px-0">
        <div className="max-w-6xl mx-auto -mt-16 bg-white rounded-lg shadow-xl overflow-hidden">
          <BookingForm />
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif mb-6">Welcome to Peniel Beach Hotel</h2>
              <p className="text-muted-foreground mb-6">
                Nestled along the pristine shores, Peniel Beach Hotel offers a perfect blend of luxury, comfort, and
                natural beauty. Our hotel is designed to provide you with an unforgettable vacation experience.
              </p>
              <p className="text-muted-foreground mb-8">
                Whether you're seeking a romantic getaway, a family vacation, or a peaceful retreat, our dedicated staff
                is committed to ensuring your stay exceeds expectations.
              </p>
              <button className="flex items-center gap-2 text-primary font-medium hover:underline">
                Learn more about us
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image src="/placeholder.svg?height=800&width=600" alt="Hotel exterior" fill className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-16 md:py-24 bg-muted/30 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Our Rooms & Suites</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our carefully designed rooms and suites that offer comfort, luxury, and all the amenities you
              need for a perfect stay.
            </p>
          </div>
          <FeaturedRooms />
          <div className="text-center mt-12">
            <button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-md font-medium transition-colors">
              View All Rooms
            </button>
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Hotel Amenities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enjoy our premium facilities designed to make your stay comfortable and memorable.
            </p>
          </div>
          <Amenities />
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-muted/30 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Guest Experiences</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See what our guests have to say about their stay at Peniel Beach Hotel.
            </p>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-6xl mx-auto relative z-10 bg-primary/95 rounded-xl p-8 md:p-12 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif mb-4">Ready for an Unforgettable Vacation?</h2>
              <p className="mb-6 text-white/90">
                Book your stay now and enjoy special rates for your dream vacation at Peniel Beach Hotel.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-white text-primary hover:bg-white/90 px-8 py-3 rounded-md font-medium transition-colors">
                  Book Now
                </button>
                <button className="bg-transparent hover:bg-white/10 border border-white/50 px-8 py-3 rounded-md font-medium transition-colors">
                  Contact Us
                </button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="h-6 w-6 text-white" />
                  <span className="font-medium">Special Offer</span>
                </div>
                <h3 className="text-2xl font-serif mb-2">15% Off Summer Bookings</h3>
                <p className="text-white/80 mb-4">Valid until August 31st</p>
                <button className="w-full bg-white text-primary hover:bg-white/90 px-4 py-2 rounded-md font-medium transition-colors">
                  Claim Offer
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

