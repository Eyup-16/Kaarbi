'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Car, Shield, TrendingUp, Users, Search } from "lucide-react";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";

export default function HomePage() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/5 to-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Find Your Perfect Car with Confidence
              </h1>
              <p className="text-lg text-gray-600">
                Browse through thousands of verified cars, connect with trusted sellers, and drive away in your dream car.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/cars">
                    Browse Cars
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/sell">Sell Your Car</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] lg:h-[500px]">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl" />
              <Image
                src="/images/hero-car.jpg"
                alt="Luxury car"
                width={500}
                height={500}
                className="absolute inset-0 w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Kaarbi?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We make car buying and selling simple, safe, and secure with our comprehensive platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6 rounded-xl bg-white border hover:shadow-lg transition-shadow">
              <Car className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Wide Selection</h3>
              <p className="text-gray-600">
                Browse through thousands of verified cars from trusted sellers.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border hover:shadow-lg transition-shadow">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Safe & Secure</h3>
              <p className="text-gray-600">
                Every car is verified and every transaction is protected.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border hover:shadow-lg transition-shadow">
              <TrendingUp className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-600">
                Get the best deals with our competitive pricing system.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border hover:shadow-lg transition-shadow">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
              <p className="text-gray-600">
                Our team of experts is here to help you every step of the way.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-20">
        <div className="container mx-auto px-4 text-center">
          {session ? (
            <>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Start Your Car Search
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto mb-8">
                Browse through our extensive collection of cars and find your perfect match.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/cars">
                  Browse Cars
                  <Search className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </>
          ) : (
            <>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Find Your Dream Car?
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto mb-8">
                Join thousands of satisfied customers who found their perfect car on Kaarbi.
              </p>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/signup">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </>
          )}
        </div>
      </section>
    </div>
  );
}