import { Badge } from "@/components/ui/badge"

interface MenuItem {
  name: string
  description: string
  price: string
  highlight?: boolean
}

interface MenuSectionProps {
  title: string
  description: string
  items: MenuItem[]
}

export default function MenuSection({ title, description, items }: MenuSectionProps) {
  return (
    <div>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-serif mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {items.map((item, index) => (
          <div
            key={index}
            className={`p-6 border rounded-lg ${item.highlight ? "bg-primary/5 border-primary/20" : ""}`}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-lg font-medium">{item.name}</h4>
              <div className="text-right">
                <span className={`font-bold ${item.highlight ? "text-primary" : ""}`}>UGX {item.price}</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm mb-2">{item.description}</p>
            {item.highlight && <Badge className="bg-primary mt-2">Chef's Recommendation</Badge>}
          </div>
        ))}
      </div>
    </div>
  )
}

