import { useState, useEffect, useRef, useCallback } from "react"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Search } from "lucide-react"
import { CarCard } from "../CarCard"
import { CarModal } from "../CarModal"

export default function Listings() {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  // For infinite scrolling
  const [page, setPage] = useState(1)

  // For searching: typed value vs active search
  // (optional approach: if you want immediate search on keystroke, skip the “pending” part)
  const [searchInput, setSearchInput] = useState("")   // what the user is currently typing
  const [searchTerm, setSearchTerm] = useState("")     // actual search query we use for fetching

  // For modal
  const [selectedCar, setSelectedCar] = useState(null)

  // ------------------------------------------
  // Fetch Cars
  // ------------------------------------------
  const fetchCars = useCallback(
    async (pageToLoad, query) => {
      // Prevent overlapping requests
      if (loading) return
      setLoading(true)

      try {
        const limit = 9

        const response = await axios.get("/api/v1/car/list-products", {
          params: {
            page: pageToLoad,
            limit,
            query: query || "",
          },
        })

        const { docs: newCars, totalPages } = response.data.data

        // If pageToLoad === 1, we reset the list
        if (pageToLoad === 1) {
          setCars(newCars)
        } else {
          setCars((prev) => [...prev, ...newCars])
        }

        // Decide if there's more to load
        if (pageToLoad >= totalPages || newCars.length < limit) {
          setHasMore(false)
        } else {
          setHasMore(true)
        }
      } catch (error) {
        console.error("Error fetching cars:", error)
      } finally {
        setLoading(false)
      }
    },
    [loading]
  )

  // ------------------------------------------
  // useEffect to load data
  // (depends on page + searchTerm)
  // ------------------------------------------
  useEffect(() => {
    fetchCars(page, searchTerm)
  }, [page, searchTerm])

  // ------------------------------------------
  // Handle Search Form
  // ------------------------------------------
  const handleSearchSubmit = (e) => {
    e.preventDefault()

    // If the user hits Search, commit the typed text to “searchTerm”
    // and reset the listing state:
    setSearchTerm(searchInput)
    setPage(1)
    setCars([])
    setHasMore(true)
  }

  // ------------------------------------------
  // Infinite Scroll Intersection Observer
  // ------------------------------------------
  const observer = useRef(null)
  const lastCarRef = useCallback(
    (node) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prevPage) => prevPage + 1)
        }
      })

      if (node) observer.current.observe(node)
    },
    [loading, hasMore]
  )

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="flex mb-4 gap-2">
        <Input
          type="text"
          placeholder="Search cars..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Button type="submit">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>

      {/* Car Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car, index) => {
          // Attach a ref to the last item to trigger infinite scroll
          if (index === cars.length - 1) {
            return (
              <div ref={lastCarRef} key={car._id}>
                <CarCard car={car} onReadMore={() => setSelectedCar(car)} />
              </div>
            )
          }
          return (
            <CarCard
              key={car._id}
              car={car}
              onReadMore={() => setSelectedCar(car)}
            />
          )
        })}
      </div>

      {/* Show spinner ONLY if loading AND we still think there's more */}
      {loading && hasMore && (
        <div className="flex justify-center mt-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      {/* Car Modal */}
      {selectedCar && (
        <CarModal
          car={selectedCar}
          isOpen={!!selectedCar}
          onClose={() => setSelectedCar(null)}
        />
      )}
    </div>
  )
}
