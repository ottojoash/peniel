import Image from "next/image"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function FullMenuPage() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Header */}
      <section className="relative h-[30vh] w-full">
        <Image
          src="/placeholder.svg?height=600&width=1920"
          alt="Peniel Beach Hotel Menu"
          fill
          priority
          className="object-cover brightness-[0.65]"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-3xl md:text-5xl font-serif text-white mb-4">Full Menu</h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl">Peniel Beach Hotel Restaurant</p>
        </div>
      </section>

      {/* Menu Content */}
      <section className="py-12 px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/restaurant"
            className="flex items-center gap-1 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Restaurant
          </Link>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif mb-2">Peniel Beach Hotel Menu</h2>
            <p className="text-muted-foreground">Opening Hours: 8:00 AM - 8:00 PM Daily</p>
            <p className="text-primary font-medium mt-2">Eat at Your Comfort</p>
          </div>

          <div className="space-y-12">
            {/* Main Meals */}
            <div>
              <h3 className="text-2xl font-serif mb-4">Main Meals</h3>
              <Separator className="mb-6" />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Sausage/Chips</h4>
                    <p className="text-sm text-muted-foreground">Grilled sausage served with crispy chips</p>
                  </div>
                  <div className="font-bold">UGX 20,000</div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Chicken Stew</h4>
                    <p className="text-sm text-muted-foreground">Served with either posho, chapati, or rice</p>
                  </div>
                  <div className="font-bold">UGX 35,000</div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Beef Stew</h4>
                    <p className="text-sm text-muted-foreground">Served with either posho, chapati, or rice</p>
                  </div>
                  <div className="font-bold">UGX 30,000</div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Fish/Chips (Big Size)</h4>
                    <p className="text-sm text-muted-foreground">Fresh fish served with a side of crispy chips</p>
                  </div>
                  <div className="font-bold">UGX 50,000</div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Fish/Chips (Medium)</h4>
                    <p className="text-sm text-muted-foreground">Fresh fish served with a side of crispy chips</p>
                  </div>
                  <div className="font-bold">UGX 40,000</div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Fish/Chips (Small)</h4>
                    <p className="text-sm text-muted-foreground">Fresh fish served with a side of crispy chips</p>
                  </div>
                  <div className="font-bold">UGX 30,000</div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Chicken/Chips</h4>
                    <p className="text-sm text-muted-foreground">Tender chicken served with a side of crispy chips</p>
                  </div>
                  <div className="font-bold">UGX 30,000</div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Fried Eggs/Chips</h4>
                    <p className="text-sm text-muted-foreground">Perfectly fried eggs with a side of chips</p>
                  </div>
                  <div className="font-bold">UGX 20,000</div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Wet Fried Fish</h4>
                    <p className="text-sm text-muted-foreground">Delicious fried fish in savory sauce</p>
                  </div>
                  <div className="font-bold">UGX 45,000</div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Wet Fried Chicken</h4>
                    <p className="text-sm text-muted-foreground">Tender fried chicken in savory sauce</p>
                  </div>
                  <div className="font-bold">UGX 35,000</div>
                </div>
              </div>
            </div>

            {/* Buffet Options */}
            <div>
              <h3 className="text-2xl font-serif mb-4">Buffet Options</h3>
              <Separator className="mb-6" />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Mini Buffet</h4>
                    <p className="text-sm text-muted-foreground">
                      Includes matooke, rice, Irish, chapati with beef, chicken, g-nuts, greens, fruits, and soft drinks
                    </p>
                  </div>
                  <div className="font-bold">UGX 35,000</div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Full Buffet</h4>
                    <p className="text-sm text-muted-foreground">
                      Includes matooke, Irish, chapati, gonja, pumpkins, rice with beef, chicken, g-nuts, peas/fresh
                      peas, greens, salads, soft drinks, and fruits
                    </p>
                  </div>
                  <div className="font-bold">UGX 50,000</div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Special Mini Buffet</h4>
                    <p className="text-sm text-muted-foreground">
                      Includes goats meat, fish kebab, chicken, salads, and gonja
                    </p>
                  </div>
                  <div className="font-bold">UGX 60,000</div>
                </div>
              </div>
            </div>

            {/* Light Meals & Snacks */}
            <div>
              <h3 className="text-2xl font-serif mb-4">Light Meals & Snacks</h3>
              <Separator className="mb-6" />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Chapati/Vegetables</h4>
                    <p className="text-sm text-muted-foreground">Fresh chapati served with sautéed vegetables</p>
                  </div>
                  <div className="font-bold">UGX 20,000</div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Rice/Vegetables</h4>
                    <p className="text-sm text-muted-foreground">Steamed rice with sautéed vegetables</p>
                  </div>
                  <div className="font-bold">UGX 20,000</div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Plain Chips</h4>
                    <p className="text-sm text-muted-foreground">Crispy potato chips</p>
                  </div>
                  <div className="font-bold">UGX 10,000</div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Plain Plantain</h4>
                    <p className="text-sm text-muted-foreground">Fried plantain</p>
                  </div>
                  <div className="font-bold">UGX 15,000</div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Fruit Platter</h4>
                    <p className="text-sm text-muted-foreground">Assortment of fresh seasonal fruits</p>
                  </div>
                  <div className="font-bold">UGX 15,000</div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Salads</h4>
                    <p className="text-sm text-muted-foreground">Fresh garden salad with dressing</p>
                  </div>
                  <div className="font-bold">UGX 15,000</div>
                </div>
              </div>
            </div>

            {/* Drinks & Beverages */}
            <div>
              <h3 className="text-2xl font-serif mb-4">Drinks & Beverages</h3>
              <Separator className="mb-6" />

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Sodas</h4>
                    <p className="text-sm text-muted-foreground">Various soft drinks</p>
                  </div>
                  <div className="font-bold">UGX 2,000</div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Water</h4>
                    <p className="text-sm text-muted-foreground">Bottled mineral water</p>
                  </div>
                  <div className="font-bold">UGX 2,000</div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Watermelon Juice</h4>
                    <p className="text-sm text-muted-foreground">Fresh watermelon juice</p>
                  </div>
                  <div className="font-bold">UGX 10,000</div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Pineapple Juice</h4>
                    <p className="text-sm text-muted-foreground">Fresh pineapple juice</p>
                  </div>
                  <div className="font-bold">UGX 10,000</div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Mango Juice</h4>
                    <p className="text-sm text-muted-foreground">Fresh mango juice</p>
                  </div>
                  <div className="font-bold">UGX 10,000</div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Cocktail Juice</h4>
                    <p className="text-sm text-muted-foreground">Mixed fruit juice blend</p>
                  </div>
                  <div className="font-bold">UGX 15,000</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-6">
              All prices are in Ugandan Shillings (UGX) and inclusive of taxes.
              <br />
              For reservations or special dietary requirements, please contact us.
            </p>

            <Button className="bg-primary hover:bg-primary/90">Book a Table</Button>
          </div>
        </div>
      </section>
    </main>
  )
}

