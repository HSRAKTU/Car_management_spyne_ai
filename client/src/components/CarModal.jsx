import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, User, Clock, ChevronDown } from "lucide-react"

export function CarModal({ car, isOpen, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageAspectRatio, setImageAspectRatio] = useState(16 / 9)
  const [showScrollIndicator, setShowScrollIndicator] = useState(false)
  const imageRef = useRef(null)
  const contentRef = useRef(null)

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % car.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + car.images.length) % car.images.length)
  }

  useEffect(() => {
    const img = new Image()
    img.onload = () => {
      setImageAspectRatio(img.width / img.height)
    }
    img.src = car.images[currentImageIndex]
  }, [car.images, currentImageIndex])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        prevImage()
      } else if (event.key === "ArrowRight") {
        nextImage()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [nextImage, prevImage]) // Added nextImage and prevImage to dependencies

  useEffect(() => {
    if (contentRef.current) {
      const isScrollable = contentRef.current.scrollHeight > contentRef.current.clientHeight
      setShowScrollIndicator(isScrollable)

      const handleScroll = () => {
        if (contentRef.current.scrollTop > 0) {
          setShowScrollIndicator(false)
        }
      }

      contentRef.current.addEventListener("scroll", handleScroll)
      return () => {
        if (contentRef.current) {
          contentRef.current.removeEventListener("scroll", handleScroll)
        }
      }
    }
  }, [isOpen, imageAspectRatio])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90vw] sm:max-h-[90vh] p-0" ref={contentRef}>
        <div className="p-6 overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{car.title}</DialogTitle>
          </DialogHeader>
          <div className="relative" style={{ paddingTop: `${(1 / imageAspectRatio) * 100}%` }}>
            <img
              ref={imageRef}
              src={car.images[currentImageIndex] || "/placeholder.svg"}
              alt={car.title}
              className="absolute top-0 left-0 w-full h-full object-contain rounded-md"
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-4 mt-4">
            <p>{car.description}</p>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
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
          </div>
        </div>
        {showScrollIndicator && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white py-2 px-4 flex items-center justify-center animate-bounce">
            <ChevronDown className="h-6 w-6 mr-2" />
            Scroll down for details
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

