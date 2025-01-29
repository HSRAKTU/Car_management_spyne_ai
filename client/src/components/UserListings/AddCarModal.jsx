import { useState } from "react"
import axios from "axios"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function AddCarModal({ isOpen, onClose, onCarAdded }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)

    const formData = new FormData()
    formData.append("title", title)
    formData.append("description", description)
    formData.append("tags", JSON.stringify(tags.split(",").map((tag) => tag.trim())))
    images.forEach((image) => formData.append("images", image))

    try {
      await axios.post("/api/v1/car/create-product", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      toast({
        title: "Success",
        description: "Car added successfully",
      })
      onCarAdded()
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add car",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setImages((prevImages) => [...prevImages, ...files].slice(0, 10))
  }

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Car</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="images">Images (max 10)</Label>
            <Input id="images" type="file" multiple accept="image/*" onChange={handleImageChange} />
          </div>
          <div className="flex flex-wrap gap-2">
            {images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image) || "/placeholder.svg"}
                  alt={`Preview ${index}`}
                  className="w-20 h-20 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
          <Button type="submit" disabled={uploading}>
            {uploading ? "Adding..." : "Add Car"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

