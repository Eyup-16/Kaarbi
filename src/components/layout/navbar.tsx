'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Menu, X, LogOut, User, Settings, Shield, MessageSquare, Heart, Car } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSignOut, setIsSignOut] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  
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

  // Check if user has admin access
  const hasAdminAccess = session?.user?.role === 'SUPER_ADMIN' || session?.user?.role === 'ADMIN';

  // Handle click outside mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        mobileButtonRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        !mobileButtonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-8">
            <Link href="/" className="text-xl sm:text-2xl font-bold text-primary">
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

          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Search className="h-5 w-5" />
            </Button>
            <div className="hidden md:flex items-center gap-4">
              {session ? (
                <div className="flex items-center gap-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="relative h-8 w-8 rounded-full p-0 hover:bg-gray-100"
                      >
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
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {session.user?.email}
                          </p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/profile" className="cursor-pointer">
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      {hasAdminAccess && (
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="cursor-pointer">
                            <Shield className="mr-2 h-4 w-4" />
                            <span>Admin Panel</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      {!hasAdminAccess && (
                        <>
                          <DropdownMenuItem asChild>
                            <Link href="/favorites" className="cursor-pointer">
                              <Heart className="mr-2 h-4 w-4" />
                              <span>Favorite Cars</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href="/my-cars" className="cursor-pointer">
                              <Car className="mr-2 h-4 w-4" />
                              <span>My Cars</span>
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuItem asChild>
                        <Link href="/support" className="cursor-pointer">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          <span>Support</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings" className="cursor-pointer">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer text-red-600 focus:text-red-600"
                        onClick={handleSignOut}
                        disabled={isSignOut}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>{isSignOut ? "Signing out..." : "Sign out"}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
              ref={mobileButtonRef}
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
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
        <div 
          ref={mobileMenuRef}
          className="md:hidden border-t bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 shadow-lg"
          role="menu"
          aria-label="Mobile navigation menu"
        >
          <div className="container mx-auto px-4 py-4 space-y-3">
            {session && (
              <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || 'User avatar'}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-gray-500" />
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">Hi, {firstName}!</p>
                  <p className="text-xs text-gray-500">{session.user?.email}</p>
                </div>
              </div>
            )}
            <Link 
              href="/cars" 
              className={`block py-3 px-4 rounded-lg text-base font-medium transition-all duration-200 ${
                isActive("/cars") 
                  ? "text-primary bg-primary/10 border-l-4 border-primary" 
                  : "text-gray-700 hover:text-primary hover:bg-gray-50"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
              role="menuitem"
            >
              🚗 Browse Cars
            </Link>
            <Link 
              href="/sell" 
              className={`block py-3 px-4 rounded-lg text-base font-medium transition-all duration-200 ${
                isActive("/seller") 
                  ? "text-primary bg-primary/10 border-l-4 border-primary" 
                  : "text-gray-700 hover:text-primary hover:bg-gray-50"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
              role="menuitem"
            >
              💰 Sell Your Car
            </Link>
            <Link 
              href="/about" 
              className={`block py-3 px-4 rounded-lg text-base font-medium transition-all duration-200 ${
                isActive("/about") 
                  ? "text-primary bg-primary/10 border-l-4 border-primary" 
                  : "text-gray-700 hover:text-primary hover:bg-gray-50"
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
              role="menuitem"
            >
              ℹ️ About
            </Link>
            {session && (
              <>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide px-4 mb-2">Account</p>
                  <Link 
                    href="/profile" 
                    className="block py-3 px-4 rounded-lg text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                    role="menuitem"
                  >
                    👤 Profile
                  </Link>
                  {hasAdminAccess && (
                    <Link 
                      href="/admin" 
                      className="block py-3 px-4 rounded-lg text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                      role="menuitem"
                    >
                      🛡️ Admin Panel
                    </Link>
                  )}
                  {!hasAdminAccess && (
                    <>
                      <Link 
                        href="/favorites" 
                        className="block py-3 px-4 rounded-lg text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-all duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                        role="menuitem"
                      >
                        ❤️ Favorite Cars
                      </Link>
                      <Link 
                        href="/my-cars" 
                        className="block py-3 px-4 rounded-lg text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-all duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                        role="menuitem"
                      >
                        🚙 My Cars
                      </Link>
                    </>
                  )}
                  <Link 
                    href="/support" 
                    className="block py-3 px-4 rounded-lg text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                    role="menuitem"
                  >
                    💬 Support
                  </Link>
                  <Link 
                    href="/settings" 
                    className="block py-3 px-4 rounded-lg text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                    role="menuitem"
                  >
                    ⚙️ Settings
                  </Link>
                </div>
              </>
            )}
            <div className="border-t border-gray-200 pt-4 mt-4">
              {session ? (
                <Button 
                  variant="destructive" 
                  className="w-full flex items-center justify-center gap-2 py-3 text-base font-medium"
                  onClick={() => {
                    handleSignOut()
                    setIsMobileMenuOpen(false)
                  }}
                  disabled={isSignOut}
                >
                  <LogOut className="h-5 w-5" />
                  {isSignOut ? "Signing out..." : "Sign Out"}
                </Button>
              ) : (
                <div className="space-y-3">
                  <Button variant="outline" className="w-full py-3 text-base font-medium" asChild>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button className="w-full py-3 text-base font-medium" asChild>
                    <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
} 