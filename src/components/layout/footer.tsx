import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Kaarbi
            </h3>
            <p className="text-sm text-gray-600 max-w-sm">
              Find your perfect car with confidence. We make car buying and selling simple, safe, and secure.
            </p>
            <div className="flex items-center gap-4">
              <Link 
                href="#" 
                className="text-gray-400 hover:text-primary transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link 
                href="#" 
                className="text-gray-400 hover:text-primary transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link 
                href="#" 
                className="text-gray-400 hover:text-primary transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link 
                href="#" 
                className="text-gray-400 hover:text-primary transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="font-semibold text-gray-900">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/cars" 
                  className="text-sm text-gray-600 hover:text-primary transition-colors duration-200 flex items-center gap-2"
                >
                  Browse Cars
                </Link>
              </li>
              <li>
                <Link 
                  href="/sell" 
                  className="text-sm text-gray-600 hover:text-primary transition-colors duration-200 flex items-center gap-2"
                >
                  Sell Your Car
                </Link>
              </li>
              <li>
                <Link 
                  href="/about" 
                  className="text-sm text-gray-600 hover:text-primary transition-colors duration-200 flex items-center gap-2"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-semibold text-gray-900">Contact Us</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <a href="mailto:support@kaarbi.com" className="hover:text-primary transition-colors duration-200">
                  support@kaarbi.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <a href="tel:+15551234567" className="hover:text-primary transition-colors duration-200">
                  (555) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>511 Monroe St, Detroit, MI 48226, USA</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Kaarbi. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <Link 
                href="/privacy" 
                className="hover:text-primary transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="hover:text-primary transition-colors duration-200"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 