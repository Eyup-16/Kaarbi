'use client'

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
  Star,
  ChevronLeft,
  ChevronRight,
  Check
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
      "/images/cars/camry-1.jpg",
      "/images/cars/camry-2.jpg",
      "/images/cars/camry-3.jpg",
      "/images/cars/camry-4.jpg",
      "/images/cars/camry-1.jpg",
      "/images/cars/camry-1.jpg",
      "/images/cars/camry-1.jpg",
      "/images/cars/camry-1.jpg",
      "/images/cars/camry-1.jpg",
      "/images/cars/camry-1.jpg",
      "/images/cars/camry-1.jpg",
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
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isSharing, setIsSharing] = useState(false);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);

  const carData = mockCars.find(car => car.id === id);

  if (!carData) {
    notFound();
  }

  const handleScroll = (direction: 'left' | 'right') => {
    if (thumbnailContainerRef.current) {
      const container = thumbnailContainerRef.current;
      const scrollAmount = 200; // Adjust this value based on your needs
      const newPosition = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
      setScrollPosition(newPosition);
    }
  };

  // Function to scroll thumbnail into view
  const scrollThumbnailIntoView = (index: number) => {
    if (thumbnailContainerRef.current) {
      const container = thumbnailContainerRef.current;
      const thumbnailWidth = 112; // 28 (height) * 4 (gap)
      const containerWidth = container.clientWidth;
      const scrollLeft = container.scrollLeft;
      
      // Calculate the position of the thumbnail
      const thumbnailPosition = index * thumbnailWidth;
      
      // Check if the thumbnail is outside the visible area
      if (thumbnailPosition < scrollLeft || thumbnailPosition > scrollLeft + containerWidth - thumbnailWidth) {
        container.scrollTo({
          left: thumbnailPosition - (containerWidth / 2) + (thumbnailWidth / 2),
          behavior: 'smooth'
        });
      }
    }
  };

  // Update selected image and scroll thumbnail into view
  const updateSelectedImage = (index: number) => {
    setSelectedImage(index);
    scrollThumbnailIntoView(index);
  };

  const handleFavorite = () => {
    if (!session) {
      router.push('/login');
      return;
    }
    setIsFavorite(!isFavorite);
    // TODO: Implement favorite functionality with API
  };

  const handleContact = () => {
    if (!session) {
      router.push('/login');
      return;
    }
    // TODO: Implement contact functionality
  };

  const handleShare = async () => {
    try {
      setIsSharing(true);
      
      // Get the current URL
      const url = window.location.href;
      const title = carData.title;
      const text = `Check out this ${carData.year} ${carData.make} ${carData.model} on Kaarbi!`;

      // Try to use Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title,
          text,
          url,
        });
        toast.success("Shared successfully!");
      } else {
        // Fallback to clipboard copy
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!", {
          description: "The car listing link has been copied to your clipboard.",
        });
      }
    } catch (error) {
      // Handle errors (user cancelled share, etc.)
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error("Failed to share", {
          description: "Failed to share the listing. Please try again.",
        });
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">{carData.title}</h1>
          <div className="flex items-center gap-3 text-gray-600">
            <p className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {carData.year}
            </p>
            <span>•</span>
            <p>{carData.location}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleFavorite}
            className="hover:bg-red-50 transition-colors"
          >
            <Heart className={`h-5 w-5 transition-all duration-200 ${isFavorite ? "fill-red-500 text-red-500 scale-110" : ""}`} />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleShare}
            disabled={isSharing}
            className="hover:bg-gray-50 transition-colors"
          >
            {isSharing ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
            ) : (
              <Share2 className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column - Images and Details */}
        <div className="lg:col-span-2 space-y-12">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="relative h-[500px] rounded-xl overflow-hidden shadow-lg group">
              <Image
                src={carData.images[selectedImage]}
                alt={carData.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority
              />
              {/* Navigation Arrows for Main Image */}
              {carData.images.length > 1 && (
                <>
                  <button
                    onClick={() => {
                      const newIndex = selectedImage === 0 ? carData.images.length - 1 : selectedImage - 1;
                      updateSelectedImage(newIndex);
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={() => {
                      const newIndex = selectedImage === carData.images.length - 1 ? 0 : selectedImage + 1;
                      updateSelectedImage(newIndex);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>
            
            {/* Thumbnails Container */}
            <div className="relative">
              {carData.images.length > 4 && (
                <>
                  <button
                    onClick={() => handleScroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-md rounded-full p-2 z-10 hover:bg-gray-50"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleScroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-md rounded-full p-2 z-10 hover:bg-gray-50"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
              <div 
                ref={thumbnailContainerRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {carData.images.map((image, index) => (
                  <button
                    key={index}
                    className={`relative flex-shrink-0 h-28 w-28 rounded-lg overflow-hidden transition-all duration-200 hover:opacity-80 ${
                      selectedImage === index ? "ring-2 ring-primary ring-offset-2" : ""
                    }`}
                    onClick={() => updateSelectedImage(index)}
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
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3 p-1 bg-gray-100/50 rounded-lg">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
                Overview
              </TabsTrigger>
              <TabsTrigger value="specifications" className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
                Specifications
              </TabsTrigger>
              <TabsTrigger value="features" className="data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all">
                Features
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="mt-8 space-y-8">
              <div className="prose max-w-none">
                <p className="text-gray-600 leading-relaxed">{carData.description}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Calendar className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-sm text-gray-500">Year</p>
                    <p className="font-semibold">{carData.year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Gauge className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-sm text-gray-500">Mileage</p>
                    <p className="font-semibold">{carData.mileage.toLocaleString()} mi</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Fuel className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-sm text-gray-500">Fuel Type</p>
                    <p className="font-semibold">{carData.fuelType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Cog className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-sm text-gray-500">Transmission</p>
                    <p className="font-semibold">{carData.transmission}</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="specifications" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: "Engine", value: carData.engine },
                  { label: "Horsepower", value: carData.horsepower },
                  { label: "Torque", value: carData.torque },
                  { label: "Drivetrain", value: carData.drivetrain },
                  { label: "Color", value: carData.color },
                  { label: "Trim", value: carData.trim },
                ].map((spec, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm text-gray-500 mb-1">{spec.label}</h3>
                    <p className="font-semibold">{spec.value}</p>
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="features" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {carData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Price and Contact */}
        <div className="space-y-8">
          {/* Price Card */}
          <div className="bg-white rounded-xl border shadow-sm p-8 space-y-6 sticky top-8">
            <div className="flex justify-between items-center">
              <h2 className="text-4xl font-bold">${carData.price.toLocaleString()}</h2>
              <Badge 
                variant={carData.condition === "new" ? "default" : "secondary"}
                className="text-sm px-3 py-1"
              >
                {carData.condition}
              </Badge>
            </div>
            <div className="space-y-3">
              <Button className="w-full h-12 text-lg" size="lg" onClick={handleContact}>
                <Phone className="mr-2 h-5 w-5" />
                Contact Seller
              </Button>
              <Button variant="outline" className="w-full h-12 text-lg" size="lg">
                <MessageSquare className="mr-2 h-5 w-5" />
                Send Message
              </Button>
            </div>
          </div>

          {/* Seller Card */}
          <div className="bg-white rounded-xl border shadow-sm p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{carData.seller.name}</h3>
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
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Verified Seller</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Member since {carData.seller.memberSince}</span>
              </div>
            </div>
            <div className="pt-4 space-y-3">
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