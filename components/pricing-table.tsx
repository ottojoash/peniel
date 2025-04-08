import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface PricingOption {
  name: string
  price: string
  description: string
  features: string[]
  highlighted?: boolean
}

interface PricingTableProps {
  title: string
  description: string
  options: PricingOption[]
}

export default function PricingTable({ title, description, options }: PricingTableProps) {
  return (
    <div>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-serif mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {options.map((option, index) => (
          <Card
            key={index}
            className={`overflow-hidden ${option.highlighted ? "border-primary shadow-md relative" : ""}`}
          >
            {option.highlighted && (
              <div className="absolute top-0 left-0 right-0 bg-primary text-white text-center py-1 text-sm font-medium">
                Most Popular
              </div>
            )}

            <CardContent className={`p-6 ${option.highlighted ? "pt-10" : "pt-6"}`}>
              <h4 className="text-xl font-medium mb-1">{option.name}</h4>
              <p className="text-sm text-muted-foreground mb-4">{option.description}</p>

              <div className="mb-6">
                <span className="text-3xl font-bold">UGX {option.price}</span>
                {option.price !== "Free" && <span className="text-muted-foreground text-sm"> per visit</span>}
              </div>

              <ul className="space-y-2">
                {option.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="p-6 pt-0">
              <Button
                className={`w-full ${option.highlighted ? "bg-primary hover:bg-primary/90" : ""}`}
                variant={option.highlighted ? "default" : "outline"}
              >
                Select Package
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

