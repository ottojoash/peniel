import Image from "next/image"
import { Clock, MapPin, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MenuSection from "@/components/menu-section"
import TestimonialCarousel from "@/components/testimonial-carousel"

export default function RestaurantPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative h-[60vh] w-full">
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Peniel Beach Hotel Restaurant"
          fill
          priority
          className="object-cover brightness-[0.65]"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif text-white mb-4">Dining at Peniel Beach</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-8">
            Experience delicious local and international cuisine in a beautiful setting
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-md font-medium transition-colors">
              View Menu
            </Button>
            <Button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 px-8 py-3 rounded-md font-medium transition-colors">
              Book a Table
            </Button>
          </div>
        </div>
      </section>

      {/* Restaurant Info */}
      <section className="py-12 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-serif mb-6">Eat at Your Comfort</h2>
              <p className="text-muted-foreground mb-6">
                Our restaurant offers a delightful culinary experience with a variety of local and international dishes.
                Whether you're looking for traditional Ugandan cuisine or international favorites, our skilled chefs
                prepare each meal with fresh, locally-sourced ingredients.
              </p>
              <p className="text-muted-foreground mb-8">
                Enjoy your meal in our spacious dining area with beautiful views or opt for room service to dine in the
                comfort of your accommodation.
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Opening Hours</h3>
                    <p className="text-muted-foreground">8:00 AM - 8:00 PM</p>
                    <p className="text-muted-foreground">Daily</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h3 className="font-medium">Reservations</h3>
                    <p className="text-muted-foreground">+256 123 456 789</p>
                    <p className="text-muted-foreground">restaurant@penielbeach.com</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=800&width=600"
                alt="Restaurant interior"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Menu Tabs */}
      <section className="py-12 bg-muted/30 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif mb-4">Our Menu</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our diverse menu featuring local Ugandan specialties and international favorites
            </p>
          </div>

          <Tabs defaultValue="main-dishes" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 h-auto p-1">
                <TabsTrigger value="main-dishes" className="py-2 px-4">
                  Main Dishes
                </TabsTrigger>
                <TabsTrigger value="buffet" className="py-2 px-4">
                  Buffet
                </TabsTrigger>
                <TabsTrigger value="snacks" className="py-2 px-4">
                  Snacks
                </TabsTrigger>
                <TabsTrigger value="drinks" className="py-2 px-4">
                  Drinks
                </TabsTrigger>
                <TabsTrigger value="specials" className="py-2 px-4">
                  Specials
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="main-dishes">
              <MenuSection
                title="Main Dishes"
                description="Our signature dishes prepared with fresh ingredients"
                items={[
                  {
                    name: "Beef Stew",
                    description: "Served with your choice of posho, chapati, or rice",
                    price: "30,000",
                  },
                  {
                    name: "Chicken Stew",
                    description: "Served with your choice of posho, chapati, or rice",
                    price: "35,000",
                  },
                  {
                    name: "Fish/Chips (Big Size)",
                    description: "Fresh fish served with a side of crispy chips",
                    price: "50,000",
                  },
                  {
                    name: "Fish/Chips (Medium)",
                    description: "Fresh fish served with a side of crispy chips",
                    price: "40,000",
                  },
                  {
                    name: "Fish/Chips (Small)",
                    description: "Fresh fish served with a side of crispy chips",
                    price: "30,000",
                  },
                  {
                    name: "Chicken/Chips",
                    description: "Tender chicken served with a side of crispy chips",
                    price: "30,000",
                  },
                  { name: "Wet Fried Fish", description: "Delicious fried fish in savory sauce", price: "45,000" },
                  { name: "Wet Fried Chicken", description: "Tender fried chicken in savory sauce", price: "35,000" },
                ]}
              />
            </TabsContent>

            <TabsContent value="buffet">
              <MenuSection
                title="Buffet Options"
                description="All-you-can-eat selections for a complete dining experience"
                items={[
                  {
                    name: "Mini Buffet",
                    description:
                      "Includes matooke, rice, Irish, chapati with beef, chicken, g-nuts, greens, fruits, and soft drinks",
                    price: "35,000",
                    highlight: true,
                  },
                  {
                    name: "Full Buffet",
                    description:
                      "Includes matooke, Irish, chapati, gonja, pumpkins, rice with beef, chicken, g-nuts, peas/fresh peas, greens, salads, soft drinks, and fruits",
                    price: "50,000",
                    highlight: true,
                  },
                  {
                    name: "Special Mini Buffet",
                    description: "Includes goats meat, fish kebab, chicken, salads, and gonja",
                    price: "60,000",
                    highlight: true,
                  },
                ]}
              />
            </TabsContent>

            <TabsContent value="snacks">
              <MenuSection
                title="Snacks & Light Meals"
                description="Perfect for a quick bite or light meal"
                items={[
                  { name: "Sausage/Chips", description: "Grilled sausage served with crispy chips", price: "20,000" },
                  {
                    name: "Fried Eggs/Chips",
                    description: "Perfectly fried eggs with a side of chips",
                    price: "20,000",
                  },
                  {
                    name: "Chapati/Vegetables",
                    description: "Fresh chapati served with sautéed vegetables",
                    price: "20,000",
                  },
                  { name: "Rice/Vegetables", description: "Steamed rice with sautéed vegetables", price: "20,000" },
                  { name: "Plain Chips", description: "Crispy potato chips", price: "10,000" },
                  { name: "Plain Plantain", description: "Fried plantain", price: "15,000" },
                  { name: "Fruit Platter", description: "Assortment of fresh seasonal fruits", price: "15,000" },
                  { name: "Salads", description: "Fresh garden salad with dressing", price: "15,000" },
                ]}
              />
            </TabsContent>

            <TabsContent value="drinks">
              <MenuSection
                title="Drinks & Beverages"
                description="Refreshing options to complement your meal"
                items={[
                  { name: "Sodas", description: "Various soft drinks", price: "2,000" },
                  { name: "Water", description: "Bottled mineral water", price: "2,000" },
                  { name: "Watermelon Juice", description: "Fresh watermelon juice", price: "10,000" },
                  { name: "Pineapple Juice", description: "Fresh pineapple juice", price: "10,000" },
                  { name: "Mango Juice", description: "Fresh mango juice", price: "10,000" },
                  { name: "Cocktail Juice", description: "Mixed fruit juice blend", price: "15,000" },
                ]}
              />
            </TabsContent>

            <TabsContent value="specials">
              <MenuSection
                title="Chef's Specials"
                description="Signature dishes recommended by our chef"
                items={[
                  {
                    name: "Fish Kebab",
                    description: "Grilled fish skewers with vegetables",
                    price: "35,000",
                    highlight: true,
                  },
                  {
                    name: "Goat's Meat Stew",
                    description: "Slow-cooked goat meat in rich sauce, served with your choice of side",
                    price: "40,000",
                    highlight: true,
                  },
                  {
                    name: "Special Chicken Platter",
                    description: "Combination of grilled and fried chicken with sides",
                    price: "45,000",
                    highlight: true,
                  },
                ]}
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Food Gallery */}
      <section className="py-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif mb-4">Food Gallery</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">A visual feast of our delicious offerings</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="relative group overflow-hidden rounded-lg">
                <div className="aspect-square relative">
                  <Image
                    src={`/placeholder.svg?height=400&width=400&text=Dish+${item}`}
                    alt={`Food item ${item}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <p className="text-white font-medium">View Dish</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-muted/30 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif mb-4">What Our Guests Say</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Hear from guests who have enjoyed dining at our restaurant
            </p>
          </div>

          <TestimonialCarousel />
        </div>
      </section>

      {/* Private Dining */}
      <section className="py-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=800&width=600"
                alt="Private dining area"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-serif mb-6">Private Dining & Events</h2>
              <p className="text-muted-foreground mb-6">
                Host your special occasions in our private dining areas. Whether it's a romantic dinner, family
                celebration, or business meeting, we can accommodate your needs with customized menus and dedicated
                service.
              </p>
              <p className="text-muted-foreground mb-8">
                Our events team will work with you to create a memorable experience tailored to your preferences.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-1 bg-primary rounded-full mt-1"></div>
                  <div>
                    <h3 className="font-medium">Celebrations</h3>
                    <p className="text-muted-foreground">Birthdays, anniversaries, and special occasions</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-1 bg-primary rounded-full mt-1"></div>
                  <div>
                    <h3 className="font-medium">Business Meetings</h3>
                    <p className="text-muted-foreground">Professional settings with catering options</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-1 bg-primary rounded-full mt-1"></div>
                  <div>
                    <h3 className="font-medium">Group Dining</h3>
                    <p className="text-muted-foreground">Accommodating groups of various sizes</p>
                  </div>
                </div>
              </div>

              <Button className="mt-8 bg-primary hover:bg-primary/90">Inquire About Events</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Location & Contact */}
      <section className="py-16 bg-primary/10 px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-serif mb-6">Find Us</h2>
              <div className="flex items-start gap-3 mb-4">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Location</h3>
                  <p className="text-muted-foreground">Plot 110-120 Circular Road Bugonga</p>
                  <p className="text-muted-foreground">Opposite the old Airport, Entebbe</p>
                </div>
              </div>

              <div className="flex items-start gap-3 mb-4">
                <Phone className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Contact</h3>
                  <p className="text-muted-foreground">+256 123 456 789</p>
                  <p className="text-muted-foreground">restaurant@penielbeach.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3 mb-8">
                <Clock className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">Hours</h3>
                  <p className="text-muted-foreground">Open Daily: 8:00 AM - 8:00 PM</p>
                </div>
              </div>

              <Button className="bg-primary hover:bg-primary/90">Get Directions</Button>
            </div>

            <div className="relative h-[300px] rounded-lg overflow-hidden">
              <Image
                src="/placeholder.svg?height=600&width=800&text=Map"
                alt="Map location"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-serif mb-4">Ready to Dine With Us?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Make a reservation or stop by during our opening hours for a delightful culinary experience
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Book a Table
            </Button>
            <Button size="lg" variant="outline">
              View Full Menu
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}

