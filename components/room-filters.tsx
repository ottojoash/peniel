"use client"

import { useState } from "react"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, SlidersHorizontal } from "lucide-react"

export default function RoomFilters() {
  const [isOpen, setIsOpen] = useState(false)
  const [priceRange, setPriceRange] = useState([50, 150])

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="border rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 bg-muted/30">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5" />
          <h2 className="font-medium">Filter Rooms</h2>
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1">
            {isOpen ? "Hide Filters" : "Show Filters"}
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent>
        <div className="p-4 grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h3 className="font-medium mb-3">Price Range</h3>
            <div className="px-2">
              <Slider
                defaultValue={[50, 150]}
                max={300}
                step={5}
                value={priceRange}
                onValueChange={setPriceRange}
                className="mb-2"
              />
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Room Type</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="economy" />
                <Label htmlFor="economy">Economy</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="standard" />
                <Label htmlFor="standard">Standard</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="deluxe" />
                <Label htmlFor="deluxe">Deluxe</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="executive" />
                <Label htmlFor="executive">Executive</Label>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Amenities</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="wifi" />
                <Label htmlFor="wifi">Free WiFi</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="breakfast" />
                <Label htmlFor="breakfast">Breakfast Included</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="ac" />
                <Label htmlFor="ac">Air Conditioning</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="tv" />
                <Label htmlFor="tv">TV</Label>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Guests</h3>
            <Select defaultValue="any">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                <SelectItem value="1">1 Person</SelectItem>
                <SelectItem value="2">2 People</SelectItem>
                <SelectItem value="3">3 People</SelectItem>
                <SelectItem value="4">4+ People</SelectItem>
              </SelectContent>
            </Select>

            <h3 className="font-medium mb-3 mt-4">Sort By</h3>
            <Select defaultValue="recommended">
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Recommended" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Guest Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-2">
          <Button variant="outline">Reset Filters</Button>
          <Button className="bg-primary hover:bg-primary/90">Apply Filters</Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}

