import Link from 'next/link'
import { Button } from './button'
import { Car, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group cursor-pointer">
            <Car className="h-8 w-8 text-blue-600 transition-transform group-hover:scale-110" />
            <span className="text-2xl font-bold text-black group-hover:text-blue-600 transition-colors">KAARBI</span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-600" />
            ) : (
              <Menu className="h-6 w-6 text-gray-600" />
            )}
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/cars" className="text-gray-600 hover:text-blue-600 transition-colors relative group cursor-pointer">
              Browse Cars
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full" />
            </Link>
            <Link href="/sell" className="text-gray-600 hover:text-blue-600 transition-colors relative group cursor-pointer">
              Sell Your Car
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full" />
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-600 transition-colors relative group cursor-pointer">
              About Us
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full" />
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors relative group cursor-pointer">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover:w-full" />
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 cursor-pointer">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg cursor-pointer">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} transition-all duration-300 ease-in-out`}>
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white rounded-lg shadow-lg mt-2">
            <Link href="/cars" className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer">
              Browse Cars
            </Link>
            <Link href="/sell" className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer">
              Sell Your Car
            </Link>
            <Link href="/about" className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer">
              About Us
            </Link>
            <Link href="/contact" className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer">
              Contact
            </Link>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <Link href="/login" className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer">
                Sign In
              </Link>
              <Link href="/signup" className="block px-3 py-2 mt-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors cursor-pointer">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
} 