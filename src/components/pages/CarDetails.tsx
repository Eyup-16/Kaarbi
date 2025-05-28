'use client'

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Gauge, 
  Fuel, 
  Cog, 
  Users, 
  Shield, 
  Phone, 
  Mail, 
  MessageSquare,
  Heart,
  Share2,
  Star
} from "lucide-react";
import { notFound } from "next/navigation";

// Mock data - replace with actual API call
const mockCars = [
  {
    id: "1",
    title: "2023 Toyota Camry",
    price: 25000,
    year: 2023,
    mileage: 15000,
    location: "New York, NY",
    imageUrl: "https://images.unsplash.com/photo-1624578571415-09e9b1991929?q=80&w=3063&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    condition: "used",
    make: "Toyota",
    model: "Camry",
    trim: "XSE",
    color: "Pearl White",
    transmission: "Automatic",
    fuelType: "Gasoline",
    engine: "2.5L 4-Cylinder",
    horsepower: "203 hp",
    torque: "184 lb-ft",
    drivetrain: "FWD",
    features: [
      "Leather Seats",
      "Sunroof",
      "Navigation System",
      "Bluetooth",
      "Backup Camera",
      "Apple CarPlay",
      "Android Auto",
      "Lane Departure Warning",
      "Adaptive Cruise Control",
      "Blind Spot Monitoring"
    ],
    description: "This beautiful 2023 Toyota Camry XSE is in excellent condition with low mileage. It features a premium interior with leather seats, sunroof, and the latest technology including Apple CarPlay and Android Auto. The car has been well-maintained and comes with a clean history report.",
    images: [
      "https://images.unsplash.com/photo-1624578571415-09e9b1991929?q=80&w=3063&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=800&h=600&fit=crop",
    ],
    seller: {
      name: "John Smith",
      rating: 4.8,
      reviews: 127,
      memberSince: "2020",
      verified: true,
      phone: "+1 (555) 123-4567",
      email: "john.smith@example.com"
    }
  },
  {
    id: "2",
    title: "2024 Tesla Model 3",
    price: 45000,
    year: 2024,
    mileage: 0,
    location: "Los Angeles, CA",
    imageUrl: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop",
    condition: "new",
    make: "Tesla",
    model: "Model 3",
    trim: "Long Range",
    color: "Midnight Silver",
    transmission: "Automatic",
    fuelType: "Electric",
    engine: "Dual Motor AWD",
    horsepower: "283 hp",
    torque: "330 lb-ft",
    drivetrain: "AWD",
    features: [
      "Autopilot",
      "Premium Sound System",
      "Glass Roof",
      "Wireless Charging",
      "Sentry Mode",
      "Dog Mode",
      "Netflix & YouTube",
      "Spotify",
      "Navigation",
      "Summon"
    ],
    description: "Brand new 2024 Tesla Model 3 Long Range with all the latest features. This electric vehicle offers impressive range, quick acceleration, and cutting-edge technology. The minimalist interior is complemented by the panoramic glass roof and premium sound system.",
    images: [
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=800&h=600&fit=crop",
    ],
    seller: {
      name: "Tesla Motors",
      rating: 4.9,
      reviews: 892,
      memberSince: "2018",
      verified: true,
      phone: "+1 (555) 987-6543",
      email: "sales@tesla.com"
    }
  }
];

interface CarDetailsProps {
  id: string;
}

export default function CarDetails({ id }: CarDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const carData = mockCars.find(car => car.id === id);

  if (!carData) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{carData.title}</h1>
          <p className="text-gray-600">{carData.location}</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => setIsFavorite(!isFavorite)}>
            <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button variant="outline" size="icon">
            <Share2 className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images and Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <Image
                src={carData.images[selectedImage]}
                alt={carData.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {carData.images.map((image, index) => (
                <button
                  key={index}
                  className={`relative h-24 rounded-lg overflow-hidden ${
                    selectedImage === index ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image}
                    alt={`${carData.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="prose max-w-none">
                <p>{carData.description}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>{carData.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-primary" />
                  <span>{carData.mileage.toLocaleString()} mi</span>
                </div>
                <div className="flex items-center gap-2">
                  <Fuel className="h-5 w-5 text-primary" />
                  <span>{carData.fuelType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Cog className="h-5 w-5 text-primary" />
                  <span>{carData.transmission}</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="specifications" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Engine</h3>
                  <p>{carData.engine}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Horsepower</h3>
                  <p>{carData.horsepower}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Torque</h3>
                  <p>{carData.torque}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Drivetrain</h3>
                  <p>{carData.drivetrain}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Color</h3>
                  <p>{carData.color}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Trim</h3>
                  <p>{carData.trim}</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="features" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {carData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Price and Contact */}
        <div className="space-y-8">
          {/* Price Card */}
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-3xl font-bold">${carData.price.toLocaleString()}</h2>
              <Badge variant={carData.condition === "new" ? "default" : "secondary"}>
                {carData.condition}
              </Badge>
            </div>
            <div className="space-y-2">
              <Button className="w-full" size="lg">
                <Phone className="mr-2 h-5 w-5" />
                Contact Seller
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                <MessageSquare className="mr-2 h-5 w-5" />
                Send Message
              </Button>
            </div>
          </div>

          {/* Seller Card */}
          <div className="bg-white rounded-lg border p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{carData.seller.name}</h3>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(carData.seller.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    ({carData.seller.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Verified Seller</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Member since {carData.seller.memberSince}</span>
              </div>
            </div>
            <div className="pt-4 space-y-2">
              <Button variant="outline" className="w-full" size="sm">
                <Mail className="mr-2 h-4 w-4" />
                {carData.seller.email}
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                <Phone className="mr-2 h-4 w-4" />
                {carData.seller.phone}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 