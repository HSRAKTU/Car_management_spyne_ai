import { useState, useEffect } from "react"
import axios from "axios"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function UpdateCarModal({ isOpen, onClose, onCarUpdated, car }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  
  // This holds the original images with stable indexes
  const [originalImages, setOriginalImages] = useState([])

  // For “removing” existing images
  const [removedIndexes, setRemovedIndexes] = useState([])

  // For “replacing” existing images – store files by their original index
  const [replacedFiles, setReplacedFiles] = useState({})

  // For adding brand new images (these do not map to existing indexes)
  const [newImages, setNewImages] = useState([])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (car) {
      setTitle(car.title)
      setDescription(car.description)
      setTags(car.tags.join(", "))

      // Build the stable array of existing images
      const stableImages = car.images.map((url, idx) => ({
        url,
        originalIndex: idx,
      }))
      setOriginalImages(stableImages)

      // Reset removed/replaced states
      setRemovedIndexes([])
      setReplacedFiles({})
      setNewImages([])
      setCurrentIndex(0)
    }
  }, [car])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append(
        "tags",
        JSON.stringify(tags.split(",").map((tag) => tag.trim()))
      )

      /**
       * Build the array of indexes to update or remove.
       * - If an index is in `removedIndexes` => we pass that index, but no file => removed
       * - If an index is replaced in `replacedFiles` => pass that index and also append the file => replaced
       */
      const indexesToUpdate = []

      originalImages.forEach(({ url, originalIndex }) => {
        const isRemoved = removedIndexes.includes(originalIndex)
        const hasReplacement = replacedFiles.hasOwnProperty(originalIndex)

        // If user wants to remove it:
        if (isRemoved) {
          indexesToUpdate.push(originalIndex)
          // No file appended => triggers removal in your backend
        }
        // If user wants to replace it with a file:
        else if (hasReplacement) {
          indexesToUpdate.push(originalIndex)
          formData.append("images", replacedFiles[originalIndex])
        }
        // Otherwise, do nothing -> keep the old image
      })

      // If we have any removals/replacements, pass them to the backend
      if (indexesToUpdate.length > 0) {
        formData.append("imageIndexesToUpdate", JSON.stringify(indexesToUpdate))
      }

      // Finally, handle brand NEW images that do not map to existing indexes
      // If new images exist but no imageIndexesToUpdate, the backend's "Case B" will append them.
      newImages.forEach((file) => {
        formData.append("images", file)
      })

      await axios.patch(`/api/v1/car/update-product/${car._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      toast({
        title: "Success",
        description: "Car updated successfully",
      })

      onCarUpdated()
      onClose()
    } catch (error) {
      console.error("Update error:", error)
      toast({
        title: "Error",
        description: "Failed to update car",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  /**
   * Remove an image from the existing array:
   * We do NOT splice the array, we simply mark the index as "removed"
   */
  const handleRemoveOriginalImage = (originalIndex) => {
    setRemovedIndexes((prev) => [...prev, originalIndex])
    // If there is a replaced file in replacedFiles, remove that too
    setReplacedFiles((prev) => {
      const updated = { ...prev }
      delete updated[originalIndex]
      return updated
    })

    // If currentIndex is out of range, adjust
    if (currentIndex >= originalImages.length - 1) {
      setCurrentIndex((prev) => Math.max(0, prev - 1))
    }
  }

  /**
   * If you want to replace an existing image (instead of removing),
   * you can prompt user to pick a file, then store it in replacedFiles[originalIndex].
   */
  const handleReplaceOriginalImage = (originalIndex, file) => {
    // Mark that we are NOT removing it
    setRemovedIndexes((prev) => prev.filter((idx) => idx !== originalIndex))

    setReplacedFiles((prev) => ({
      ...prev,
      [originalIndex]: file,
    }))
  }

  /**
   * Handle brand new images that the user wants to append
   */
  const handleNewImages = (e) => {
    const files = Array.from(e.target.files)
    // Keep total of old + new <= 10, if you want to enforce it
    const totalExisting = originalImages.length
    const totalRemoved = removedIndexes.length
    const netExisting = totalExisting - totalRemoved // how many “still active” old images
    const capacity = 10 - netExisting - newImages.length

    const accepted = files.slice(0, capacity)
    setNewImages((prev) => [...prev, ...accepted])
  }

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % originalImages.length)
  }

  const prevImage = () => {
    setCurrentIndex((prev) => {
      return (prev - 1 + originalImages.length) % originalImages.length
    })
  }

  /**
   * Helper to get the *actual* image URL or replaced file preview for the current index
   */
  const getCurrentImageSource = () => {
    if (!originalImages[currentIndex]) return "/placeholder.svg"

    const { url, originalIndex } = originalImages[currentIndex]

    // If this image is removed, show placeholder
    if (removedIndexes.includes(originalIndex)) {
      return "/placeholder.svg"
    }

    // If replaced, show local preview
    if (replacedFiles[originalIndex]) {
      return URL.createObjectURL(replacedFiles[originalIndex])
    }

    // Otherwise show the original URL
    return url
  }

  /**
   * Decide if the “Remove” button should be visible for the current image
   */
  const canRemoveCurrentImage = () => {
    if (!originalImages[currentIndex]) return false
    const originalIndex = originalImages[currentIndex].originalIndex
    return !removedIndexes.includes(originalIndex)
  }

  /**
   * Decide if we can “replace” the current image
   */
  const canReplaceCurrentImage = () => {
    if (!originalImages[currentIndex]) return false
    const originalIndex = originalImages[currentIndex].originalIndex
    // If it's already removed, no need to replace
    return !removedIndexes.includes(originalIndex)
  }

  const handleReplaceButtonClick = async (originalIndex) => {
    // Just an example: prompt a file input for one file
    const fileInput = document.createElement("input")
    fileInput.type = "file"
    fileInput.accept = "image/*"
    fileInput.onchange = (e) => {
      const file = e.target.files?.[0]
      if (file) {
        handleReplaceOriginalImage(originalIndex, file)
      }
    }
    fileInput.click()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Car</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          {/* Tags */}
          <div>
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          {/* Existing Images Carousel */}
          {originalImages.length > 0 && (
            <div>
              <Label>Existing Images</Label>
              <div className="relative">
                <img
                  src={getCurrentImageSource()}
                  alt={`Car image ${currentIndex + 1}`}
                  className="w-full h-48 object-cover rounded"
                />

                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                {canRemoveCurrentImage() && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() =>
                      handleRemoveOriginalImage(
                        originalImages[currentIndex].originalIndex
                      )
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {canReplaceCurrentImage() && (
                <div className="mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      handleReplaceButtonClick(
                        originalImages[currentIndex].originalIndex
                      )
                    }
                  >
                    Replace this Image
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Add new images (appended at the end) */}
          {/* Enforce that total images (kept + new) doesn't exceed 10, if desired */}
          <div>
            <Label>Add New Images</Label>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleNewImages}
            />
          </div>

          {/* Preview new images */}
          {newImages.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {newImages.map((file, idx) => (
                <div key={idx} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`New File Preview ${idx}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setNewImages((prev) => prev.filter((_, i) => i !== idx))
                    }
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Submit button */}
          <Button type="submit" disabled={uploading}>
            {uploading ? "Updating..." : "Update Car"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
