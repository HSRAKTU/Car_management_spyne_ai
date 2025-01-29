import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { CarCard } from "../CarCard"
import { CarModal } from "../CarModal" // Import the CarModal component
import { AddCarModal } from "./AddCarModal"
import { UpdateCarModal } from "./UpdateCarModal"
import { DeleteConfirmationModal } from "./DeleteConfirmationModal"
import { useToast } from "@/hooks/use-toast"

export default function UserListings() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false) 
  const [selectedCar, setSelectedCar] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchUserCars()
  }, [])

  const fetchUserCars = async () => {
    try {
      setLoading(true)
      const response = await axios.get("/api/v1/car/user-products")
      setCars(response.data.data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user's cars",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddCar = () => {
    setShowAddModal(true)
  }

  const handleUpdateCar = (car) => {
    setSelectedCar(car)
    setShowUpdateModal(true)
  }

  const handleDeleteCar = (car) => {
    setSelectedCar(car)
    setShowDeleteModal(true)
  }

  const handleReadMore = (car) => {
    // New function to handle "Read More" click
    setSelectedCar(car)
    setShowPreviewModal(true)
  }

  const confirmDeleteCar = async () => {
    try {
      await axios.delete(`/api/v1/car/delete-product/${selectedCar._id}`)
      toast({
        title: "Success",
        description: "Car deleted successfully",
      })
      fetchUserCars()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete car",
        variant: "destructive",
      })
    } finally {
      setShowDeleteModal(false)
      setSelectedCar(null)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Cars</h1>
        <Button onClick={handleAddCar}>
          <Plus className="mr-2 h-4 w-4" /> Add Car
        </Button>
      </div>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => (
            <div key={car._id} className="relative">
              <CarCard car={car} onReadMore={() => handleReadMore(car)} />
              <div className="absolute top-2 right-2 flex space-x-2">
                <Button size="sm" variant="secondary" onClick={() => handleUpdateCar(car)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDeleteCar(car)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddCarModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onCarAdded={fetchUserCars} />

      <UpdateCarModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onCarUpdated={fetchUserCars}
        car={selectedCar}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteCar}
        carTitle={selectedCar?.title}
      />

      {selectedCar && (
        <CarModal car={selectedCar} isOpen={showPreviewModal} onClose={() => setShowPreviewModal(false)} />
      )}
    </div>
  )
}

