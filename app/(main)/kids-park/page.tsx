import Image from "next/image"
import { Clock, CalendarRange, Users, Shield, Heart, Sparkles, CheckCircle2, Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ActivityCard from "@/components/activity-card"
import PricingTable from "@/components/pricing-table"
import FAQAccordion from "@/components/faq-accordion"

export default function KidsParkPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full">
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Peniel Beach Hotel Kids Park"
          fill
          priority
          className="object-cover brightness-[0.65]"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <Badge className="bg-primary mb-4">Fun for All Ages</Badge>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif text-white mb-4">Kids Park & Activities</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-8">
            A magical playground where children create unforgettable memories
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-md font-medium transition-colors">
              Explore Activities
            </Button>
            <Button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 px-8 py-3 rounded-md font-medium transition-colors">
              Book a Visit
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="relative z-10 px-4 md:px-0">
        <div className="max-w-6xl mx-auto -mt-16 bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="p-6 flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Clock className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Opening Hours</h3>
                <p className="text-muted-foreground text-sm">Daily: 9:00 AM - 6:00 PM</p>
                <p className="text-muted-foreground text-sm">Weekends & Holidays: 8:00 AM - 7:00 PM</p>
              </div>
            </div>
            <div className="p-6 flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Age Groups</h3>
                <p className="text-muted-foreground text-sm">Toddler Zone: 2-4 years</p>
                <p className="text-muted-foreground text-sm">Kids Zone: 5-12 years</p>
              </div>
            </div>
            <div className="p-6 flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Safety First</h3>
                <p className="text-muted-foreground text-sm">Trained supervisors on duty</p>
                <p className="text-muted-foreground text-sm">Regular equipment maintenance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-primary mb-4">Fun & Safe</Badge>
              <h2 className="text-3xl md:text-4xl font-serif mb-6">A Playground Paradise for Your Little Ones</h2>
              <p className="text-muted-foreground mb-6">
                At Peniel Beach Hotel, we understand that happy children mean happy parents. Our Kids Park is designed
                to provide endless entertainment for children of all ages while giving parents peace of mind knowing
                their little ones are safe and having fun.
              </p>
              <p className="text-muted-foreground mb-8">
                From exciting rides to refreshing swimming pools, our Kids Park offers a variety of activities to keep
                your children engaged and entertained throughout your stay.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>Trained staff supervision</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>Safe equipment</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>First aid facilities</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>Regular maintenance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>Age-appropriate zones</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span>Shaded rest areas</span>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=800&width=600"
                alt="Children playing at Kids Park"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-16 bg-muted/30 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-primary mb-4">Endless Fun</Badge>
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Our Activities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover the exciting activities available at our Kids Park
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ActivityCard
              title="Caterpillar Train"
              description="A fun ride for kids to enjoy the day. Our colorful train takes children on an exciting journey around the park."
              imageSrc="/placeholder.svg?height=400&width=600"
              ageRange="3-10 years"
              duration="10 minutes per ride"
            />

            <ActivityCard
              title="Bouncing Castles"
              description="Kids can jump and have endless fun! Our bouncing castles provide a safe environment for children to bounce and play."
              imageSrc="/placeholder.svg?height=400&width=600"
              ageRange="4-12 years"
              duration="30 minutes sessions"
            />

            <ActivityCard
              title="Swimming Pool"
              description="Safe and enjoyable swimming for kids. Our shallow pools are perfect for children to splash and play under supervision."
              imageSrc="/placeholder.svg?height=400&width=600"
              ageRange="All ages (with supervision)"
              duration="Open during park hours"
            />

            <ActivityCard
              title="Slides"
              description="Exciting slides for endless fun. Children can enjoy our colorful slides of various heights and speeds."
              imageSrc="/placeholder.svg?height=400&width=600"
              ageRange="4-12 years"
              duration="Open during park hours"
            />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            <ActivityCard
              title="Face Painting"
              description="Transform into favorite characters with our artistic face painting service available on weekends."
              imageSrc="/placeholder.svg?height=400&width=600"
              ageRange="All ages"
              duration="Weekends only"
            />

            <ActivityCard
              title="Arts & Crafts"
              description="Creative sessions where children can make souvenirs and art pieces to take home."
              imageSrc="/placeholder.svg?height=400&width=600"
              ageRange="4-12 years"
              duration="Scheduled sessions daily"
            />

            <ActivityCard
              title="Mini Golf"
              description="A fun mini golf course designed specifically for children to learn and enjoy the game."
              imageSrc="/placeholder.svg?height=400&width=600"
              ageRange="6-12 years"
              duration="Open during park hours"
            />

            <ActivityCard
              title="Playground"
              description="Traditional playground with swings, seesaws, and climbing frames for classic outdoor fun."
              imageSrc="/placeholder.svg?height=400&width=600"
              ageRange="3-12 years"
              duration="Open during park hours"
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-primary mb-4">Affordable Fun</Badge>
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Pricing & Packages</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect package for your children's adventure
            </p>
          </div>

          <Tabs defaultValue="day-passes" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto md:grid-cols-3">
              <TabsTrigger value="day-passes">Day Passes</TabsTrigger>
              <TabsTrigger value="hotel-guests">Hotel Guests</TabsTrigger>
              <TabsTrigger value="memberships">Memberships</TabsTrigger>
            </TabsList>

            <TabsContent value="day-passes" className="mt-6">
              <PricingTable
                title="Day Pass Options"
                description="Single day access to our Kids Park"
                options={[
                  {
                    name: "Standard Day Pass",
                    price: "15,000",
                    description: "Access to all basic activities",
                    features: [
                      "Playground access",
                      "Swimming pool access",
                      "Slides access",
                      "Bouncing castles",
                      "1 Caterpillar train ride",
                    ],
                  },
                  {
                    name: "Premium Day Pass",
                    price: "25,000",
                    description: "Full access to all activities",
                    features: [
                      "All Standard Pass features",
                      "Unlimited train rides",
                      "Arts & Crafts session",
                      "Face painting (weekends)",
                      "Mini Golf access",
                      "Snack and drink included",
                    ],
                    highlighted: true,
                  },
                  {
                    name: "Family Day Pass",
                    price: "50,000",
                    description: "For families with up to 4 children",
                    features: [
                      "All Premium Pass features",
                      "For up to 4 children",
                      "Dedicated supervisor",
                      "Reserved seating area",
                      "Family lunch discount (10%)",
                    ],
                  },
                ]}
              />
            </TabsContent>

            <TabsContent value="hotel-guests" className="mt-6">
              <PricingTable
                title="Hotel Guest Packages"
                description="Special rates for hotel guests"
                options={[
                  {
                    name: "Complimentary Access",
                    price: "Free",
                    description: "For hotel guests staying 2+ nights",
                    features: [
                      "Playground access",
                      "Swimming pool access",
                      "Slides access",
                      "1 Caterpillar train ride per day",
                    ],
                  },
                  {
                    name: "Guest Premium Package",
                    price: "10,000",
                    description: "Enhanced experience for hotel guests",
                    features: [
                      "All Complimentary features",
                      "Unlimited train rides",
                      "Bouncing castles",
                      "Arts & Crafts session",
                      "Face painting (weekends)",
                      "Mini Golf access",
                    ],
                    highlighted: true,
                  },
                  {
                    name: "Extended Family Package",
                    price: "30,000",
                    description: "For hotel guests with extended family visitors",
                    features: [
                      "All Guest Premium features",
                      "For up to 6 children",
                      "Includes non-hotel guest children",
                      "Reserved seating area",
                      "15% discount on food and beverages",
                    ],
                  },
                ]}
              />
            </TabsContent>

            <TabsContent value="memberships" className="mt-6">
              <PricingTable
                title="Membership Options"
                description="Regular visitors save with our membership packages"
                options={[
                  {
                    name: "Monthly Membership",
                    price: "100,000",
                    description: "Unlimited access for 30 days",
                    features: [
                      "Unlimited park access for 1 month",
                      "All activities included",
                      "10% discount on food and beverages",
                      "1 free guest pass",
                      "Priority access during peak times",
                    ],
                  },
                  {
                    name: "Quarterly Membership",
                    price: "250,000",
                    description: "3 months of unlimited fun",
                    features: [
                      "Unlimited park access for 3 months",
                      "All activities included",
                      "15% discount on food and beverages",
                      "3 free guest passes",
                      "Priority access during peak times",
                      "1 free birthday party package",
                    ],
                    highlighted: true,
                  },
                  {
                    name: "Annual Membership",
                    price: "800,000",
                    description: "Best value for regular visitors",
                    features: [
                      "Unlimited park access for 12 months",
                      "All activities included",
                      "20% discount on food and beverages",
                      "10 free guest passes",
                      "Priority access during peak times",
                      "2 free birthday party packages",
                      "Exclusive member events",
                    ],
                  },
                ]}
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Birthday Parties */}
      <section className="py-16 bg-primary/10 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <Badge className="bg-primary mb-4">Celebrate</Badge>
              <h2 className="text-3xl md:text-4xl font-serif mb-6">Birthday Parties</h2>
              <p className="text-muted-foreground mb-6">
                Make your child's birthday unforgettable with our special birthday packages. We take care of everything
                from decorations to activities, allowing you to relax and enjoy the celebration.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-1 bg-primary rounded-full mt-1"></div>
                  <div>
                    <h3 className="font-medium">Basic Package - UGX 300,000</h3>
                    <p className="text-muted-foreground">
                      For up to 10 children, includes park access, dedicated party area, cake, and basic decorations.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-1 bg-primary rounded-full mt-1"></div>
                  <div>
                    <h3 className="font-medium">Premium Package - UGX 500,000</h3>
                    <p className="text-muted-foreground">
                      For up to 15 children, includes all basic features plus themed decorations, party bags, and
                      special activities.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-1 bg-primary rounded-full mt-1"></div>
                  <div>
                    <h3 className="font-medium">Deluxe Package - UGX 800,000</h3>
                    <p className="text-muted-foreground">
                      For up to 20 children, includes all premium features plus professional photographer, custom cake,
                      and exclusive use of certain facilities.
                    </p>
                  </div>
                </div>
              </div>

              <Button className="bg-primary hover:bg-primary/90">Book a Birthday Party</Button>
            </div>
            <div className="order-1 md:order-2 relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=800&width=600"
                alt="Children's birthday party"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Parent Amenities */}
      <section className="py-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-primary mb-4">For Parents</Badge>
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Parent Amenities</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We ensure parents are comfortable while their children play
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Coffee className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-2">Café & Lounge</h3>
                <p className="text-muted-foreground">
                  Relax in our comfortable parent lounge with café service, Wi-Fi, and a clear view of the play areas.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-2">Wellness Corner</h3>
                <p className="text-muted-foreground">
                  Enjoy quick massage services, relaxation areas, and wellness activities while your children play.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium mb-2">Family Activities</h3>
                <p className="text-muted-foreground">
                  Participate in scheduled family activities where parents and children can create memories together.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about our Kids Park
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <FAQAccordion
              items={[
                {
                  question: "What ages are appropriate for the Kids Park?",
                  answer:
                    "Our Kids Park is designed for children aged 2-12 years. We have dedicated areas for different age groups: Toddler Zone (2-4 years) and Kids Zone (5-12 years).",
                },
                {
                  question: "Do parents need to stay with their children?",
                  answer:
                    "Parents of children under 5 years must remain in the park. For children 5-12 years, parents can use our parent lounges while keeping an eye on their children, or leave them under the supervision of our trained staff for up to 3 hours (additional charges may apply).",
                },
                {
                  question: "What safety measures are in place?",
                  answer:
                    "We prioritize safety with trained supervisors, regular equipment maintenance, first aid facilities, CCTV monitoring, secure entry/exit points, and strict hygiene protocols.",
                },
                {
                  question: "Are food and drinks available in the Kids Park?",
                  answer:
                    "Yes, we have a café serving child-friendly meals, snacks, and beverages. We also accommodate special dietary requirements with advance notice.",
                },
                {
                  question: "How do I book a birthday party?",
                  answer:
                    "Birthday parties can be booked at least 7 days in advance by contacting our events team. We recommend booking earlier during peak seasons to secure your preferred date and time.",
                },
                {
                  question: "What should my child wear to the Kids Park?",
                  answer:
                    "Comfortable play clothes and closed-toe shoes are recommended. For water activities, please bring swimwear, towels, and a change of clothes. We also sell essential items in our park shop.",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto relative z-10 bg-primary/95 rounded-xl p-8 md:p-12 text-white">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif mb-4">Ready for a Day of Fun?</h2>
              <p className="mb-6 text-white/90">
                Book your visit to our Kids Park today and give your children an unforgettable experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-white text-primary hover:bg-white/90 px-8 py-3 rounded-md font-medium transition-colors">
                  Book Now
                </Button>
                <Button className="bg-transparent hover:bg-white/10 border border-white/50 px-8 py-3 rounded-md font-medium transition-colors">
                  Contact Us
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                  <CalendarRange className="h-6 w-6 text-white" />
                  <span className="font-medium">Special Offer</span>
                </div>
                <h3 className="text-2xl font-serif mb-2">20% Off Family Passes</h3>
                <p className="text-white/80 mb-4">Valid on weekdays until end of month</p>
                <Button className="w-full bg-white text-primary hover:bg-white/90 px-4 py-2 rounded-md font-medium transition-colors">
                  Claim Offer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

