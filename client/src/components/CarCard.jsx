import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, User } from "lucide-react"

export function CarCard({ car, onReadMore }) {
  return (
    <Card className="overflow-hidden">
      <img src={car.images[0] || "/placeholder.svg"} alt={car.title} className="w-full h-48 object-cover" />
      <CardHeader>
        <CardTitle className="line-clamp-1">{car.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{car.description}</p>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
          <User size={16} />
          <span>{car.username}</span>
          <Clock size={16} />
          <span>{new Date(car.createdAt).toLocaleDateString()}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {car.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onReadMore} variant="secondary" className="w-full">
          Read More
        </Button>
      </CardFooter>
    </Card>
  )
}

