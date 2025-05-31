'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSignOut, setIsSignOut] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()
  
  const pathname = usePathname();
  const handleSignOut = async () => {
    try{
      setIsSignOut(true)
      await signOut()
      toast.success(`Signed out successfully!`)
      router.push('/login')
    }
    catch(error){
      setIsSignOut(false)
      toast.error(error+'signed out failed!')
    }
    finally {
      setIsSignOut(false)
    }
  }
  const isActive = (path: string) => pathname === path;

  // Get first name from full name
  const firstName = session?.user?.name?.split(' ')[0] || '';

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-bold text-primary">
              Kaarbi
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link 
                href="/cars" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/cars") ? "text-primary" : "text-gray-600"
                }`}
              >
                Browse Cars
              </Link>
              <Link 
                href="/sell" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/seller") ? "text-primary" : "text-gray-600"
                }`}
              >
                Sell Your Car
              </Link>
              <Link 
                href="/about" 
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive("/about") ? "text-primary" : "text-gray-600"
                }`}
              >
                About
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
            <div className="hidden md:flex items-center gap-4">
              {session ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'User avatar'}
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-500" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      Hi, {firstName}
                    </span>
                  </div>
                  <Button 
                    className='cursor-pointer right-0 w-36 bg-white text-black'
                    variant={'outline'}
                    onClick={handleSignOut}
                    disabled={isSignOut}
                  >
                    {isSignOut ? (
                      <>
                        <LogOut className='mr-2 h-4 w-4' />Signing Out...
                      </>
                    ) : (
                      <>
                        <LogOut className='mr-2 h-4 w-4' />Sign Out
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <>
                  <Button variant="outline" asChild>
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-4 space-y-4">
            {session && (
              <div className="flex items-center gap-2 pb-4 border-b">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User avatar'}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500" />
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700">
                  Hi, {firstName}
                </span>
              </div>
            )}
            <Link 
              href="/cars" 
              className={`block text-sm font-medium transition-colors hover:text-primary ${
                isActive("/cars") ? "text-primary" : "text-gray-600"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Browse Cars
            </Link>
            <Link 
              href="/sell" 
              className={`block text-sm font-medium transition-colors hover:text-primary ${
                isActive("/seller") ? "text-primary" : "text-gray-600"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sell Your Car
            </Link>
            <Link 
              href="/about" 
              className={`block text-sm font-medium transition-colors hover:text-primary ${
                isActive("/about") ? "text-primary" : "text-gray-600"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <div className="pt-4 space-y-2">
              {session ? (
                <Button 
                  variant="destructive" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => {
                    handleSignOut()
                    setIsMobileMenuOpen(false)
                  }}
                  disabled={isSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              ) : (
                <>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 