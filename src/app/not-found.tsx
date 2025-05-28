'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const pathname = usePathname()
  
  const getErrorMessage = () => {
    if (pathname.startsWith('/cars/')) {
      return {
        title: "Car Not Found",
        description: "The car you're looking for doesn't exist or has been removed.",
        suggestion: "Try browsing our available cars instead."
      }
    }
    
    if (pathname.startsWith('/models/')) {
      return {
        title: "Model Not Found",
        description: "The car model you're looking for doesn't exist in our database.",
        suggestion: "Check out our available car models."
      }
    }

    return {
      title: "Page Not Found",
      description: "The page you're looking for doesn't exist or has been moved.",
      suggestion: "Try going back to the homepage."
    }
  }

  const error = getErrorMessage()

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold">{error.title}</h2>
          <p className="text-gray-600">{error.description}</p>
          <p className="text-gray-500">{error.suggestion}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline">
            <Link href="/" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button asChild>
            <Link href="/cars" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Browse Cars
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
} 