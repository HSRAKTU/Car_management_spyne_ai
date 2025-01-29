import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetFooter, SheetTrigger } from "@/components/ui/sheet"
import { Globe, CarIcon as GarageIcon, LogOut, Menu } from "lucide-react"
import axios from "axios"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { ModeToggle } from "@/components/mode-toggle"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "@/lib/redux/features/authSlice"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog"

// A basic modal overlay for prompting login/signup
const AuthModal = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login or Sign Up Required</DialogTitle>
          <DialogDescription>You need to be logged in to access "My Garage".</DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button asChild>
            <Link to="/login">Login/Signup</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
const Header = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const { toast } = useToast()

  // Track whether the auth modal should be visible
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleLogout = async () => {
    try {
      await axios.post("/api/v1/user/logout", {
        withCredentials: true,
      })
      toast({
        title: "Logged Out",
      })
      dispatch(logout())

      navigate("/")
    } catch (error) {
      toast({
        title: "Logout failed",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      })
    }
  }

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/listings"
    }
    return location.pathname === path
  }

  // NavLinks component
  // We pass down a function to handle the case when the user is not authenticated
  const NavLinks = () => (
    <>
      {/* Global Listings */}
      <Link
        to="/"
        className={`flex items-center space-x-2 transition-colors ${
          isActive("/")
            ? "text-primary font-bold"
            : "text-muted-foreground hover:text-primary"
        }`}
      >
        <Globe size={20} />
        <span>Global Listings</span>
      </Link>

      {/* My Garage */}
      {isAuthenticated ? (
        <Link
          to="/my-garage"
          className={`flex items-center space-x-2 transition-colors ${
            isActive("/my-garage")
              ? "text-primary font-bold"
              : "text-muted-foreground hover:text-primary"
          }`}
        >
          <GarageIcon size={20} />
          <span>My Garage</span>
        </Link>
      ) : (
        <Link
          to="#"
          // When not authenticated, prevent navigation and show the Auth Modal
          onClick={(e) => {
            e.preventDefault()
            setShowAuthModal(true)
          }}
          className={`flex items-center space-x-2 transition-colors ${
            isActive("/my-garage")
              ? "text-primary font-bold"
              : "text-muted-foreground hover:text-primary"
          }`}
        >
          <GarageIcon size={20} />
          <span>My Garage</span>
        </Link>
      )}
    </>
  )

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-1">
          <span className="text-2xl md:text-3xl font-bold tracking-tight">Cars</span>
          <span className="bg-red-600 text-white text-2xl md:text-3xl font-bold px-2.5 py-0.5 rounded-lg tracking-tight">
            Hub
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLinks />
        </nav>

        {/* Mobile Navigation & Desktop Dropdown */}
        <div className="ml-4 flex items-center">
          <div className="flex space-x-4">
            <ModeToggle />
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild className="hidden md:flex">
                  <Avatar>
                    <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                    <AvatarFallback>
                      {user.fullName.charAt(0)}
                      {user.fullName.charAt(1)}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {user.fullName}
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    {user.username}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="hover:cursor-pointer text-orange-700 font-bold"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild className="hidden md:flex">
                <Link to="/login">Login/Signup</Link>
              </Button>
            )}
          </div>

          {/* Mobile Menu (Sheet) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col space-y-4 mt-8">
                <NavLinks />
              </nav>
              <SheetFooter className="absolute bottom-0 left-0 right-0 border-t p-4 mt-auto">
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                        <AvatarFallback>
                          {user.fullName.charAt(0)}
                          {user.fullName.charAt(1)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm font-medium">{user.fullName}</p>
                        <p className="text-xs text-muted-foreground">
                          ({user.role === "admin" ? "Admin" : "User"})
                        </p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                        <p className="text-xs text-muted-foreground">{user.username}</p>
                      </div>
                    </div>
                    <Button variant="destructive" className="w-full" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button asChild className="w-full">
                    <Link to="/login">Login/Signup</Link>
                  </Button>
                )}
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* The Auth Modal for unauthenticated "My Garage" click */}
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </header>
  )
}

export default Header
