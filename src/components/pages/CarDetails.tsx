'use client'

import { useState, useEffect } from "react";
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
  Phone, 
  Mail, 
  MessageSquare,
  Heart,
  Share2,
  Star,
  Users,
  Shield
} from "lucide-react";
import { notFound } from "next/navigation";

interface Car {
  id: string;
  title: string;
  price: number;
  year: number;
  mileage: number;
  location: string;
  imageUrl: string;
  condition: string;
  make: string;
  model: string;
  status: string;
  
  // Additional specifications
  trim?: string | null;
  color?: string | null;
  engine?: string | null;
  transmission?: string | null;
  fuelType?: string | null;
  drivetrain?: string | null;
  horsepower?: string | null;
  torque?: string | null;
  mpgCity?: number | null;
  mpgHighway?: number | null;
  features?: string[];
  description?: string | null;
  
  createdAt: string;
  updatedAt: string;
  userId: string | null;
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    image: string | null;
    createdAt: string;
  };
}

interface CarDetailsProps {
  id: string;
}

export default function CarDetails({ id }: CarDetailsProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [carData, setCarData] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch car data from API
  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/cars/${id}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            notFound();
          }
          throw new Error('Failed to fetch car details');
        }

        const data = await response.json();
        setCarData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch car details');
      } finally {
        setLoading(false);
      }
    };

    fetchCar();
  }, [id]);

  // Add useEffect to check if car is in favorites
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!session) return;

      try {
        const response = await fetch('/api/favorites');
        if (!response.ok) throw new Error('Failed to fetch favorites');
        
        const favorites = await response.json();
        setIsFavorite(favorites.some((car: Car) => car.id === id));
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    checkFavoriteStatus();
  }, [session, id]);

  // Early returns for loading and error states
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-2/3" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <div className="h-[500px] bg-gray-200 rounded-xl" />
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="bg-white rounded-xl border shadow-sm p-8 space-y-6">
                <div className="h-12 bg-gray-200 rounded" />
                <div className="space-y-3">
                  <div className="h-12 bg-gray-200 rounded" />
                  <div className="h-12 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !carData) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2 text-red-600">
            {error || 'Car not found'}
          </h3>
          <p className="text-gray-600">
            The car you&apos;re looking for might have been removed or doesn&apos;t exist.
          </p>
        </div>
      </div>
    );
  }

  // Get car images (fallback to single image if no images array)
  const carImages = [carData.imageUrl]; // For now, just use the single image from the database

  const handleFavorite = async () => {
    if (!session) {
      router.push('/login');
      return;
    }

    try {
      if (isFavorite) {
        // Remove from favorites
        const response = await fetch(`/api/favorites/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to remove from favorites');
        }
        
        setIsFavorite(false);
        toast.success("Removed from favorites");
      } else {
        // Add to favorites
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            carId: id,
            ...carData
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to add to favorites');
        }
        
        setIsFavorite(true);
        toast.success("Added to favorites");
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error(error instanceof Error ? error.message : "Failed to update favorites");
    }
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
                src={carImages[selectedImage]}
                alt={carData.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority
              />
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
                <p className="text-gray-600 leading-relaxed">
                  {carData.description || `This ${carData.year} ${carData.make} ${carData.model} is in ${carData.condition} condition 
                  with ${carData.mileage.toLocaleString()} miles. Located in ${carData.location}.`}
                </p>
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
                  <div className="h-6 w-6 text-primary flex items-center justify-center">
                    <span className="text-lg font-bold">C</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Condition</p>
                    <p className="font-semibold capitalize">{carData.condition}</p>
                  </div>
                </div>
                {carData.fuelType ? (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Fuel className="h-6 w-6 text-primary" />
                    <div>
                      <p className="text-sm text-gray-500">Fuel Type</p>
                      <p className="font-semibold">{carData.fuelType}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="h-6 w-6 text-primary flex items-center justify-center">
                      <span className="text-lg font-bold">L</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-semibold">{carData.location}</p>
                    </div>
                  </div>
                )}
                
                {carData.transmission && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Cog className="h-6 w-6 text-primary" />
                    <div>
                      <p className="text-sm text-gray-500">Transmission</p>
                      <p className="font-semibold">{carData.transmission}</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="specifications" className="mt-8 space-y-6">
              {/* Basic Vehicle Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm text-gray-500 mb-1">Make</h4>
                    <p className="font-semibold">{carData.make}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm text-gray-500 mb-1">Model</h4>
                    <p className="font-semibold">{carData.model}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm text-gray-500 mb-1">Year</h4>
                    <p className="font-semibold">{carData.year}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm text-gray-500 mb-1">Condition</h4>
                    <p className="font-semibold capitalize">{carData.condition}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm text-gray-500 mb-1">Mileage</h4>
                    <p className="font-semibold">{carData.mileage.toLocaleString()} miles</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm text-gray-500 mb-1">Listed Date</h4>
                    <p className="font-semibold">{new Date(carData.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Detailed Specifications - Matching Sell Page Layout */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Detailed Specifications</h3>
                <div className="space-y-4">
                  {/* Row 1: Trim & Color */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm text-gray-500 mb-1">Trim</h4>
                      <p className="font-semibold">{carData.trim || "Not specified"}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm text-gray-500 mb-1">Color</h4>
                      <p className="font-semibold">{carData.color || "Not specified"}</p>
                    </div>
                  </div>

                  {/* Row 2: Transmission & Fuel Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm text-gray-500 mb-1">Transmission</h4>
                      <p className="font-semibold">{carData.transmission || "Not specified"}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm text-gray-500 mb-1">Fuel Type</h4>
                      <p className="font-semibold">{carData.fuelType || "Not specified"}</p>
                    </div>
                  </div>

                  {/* Row 3: Engine & Drivetrain */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm text-gray-500 mb-1">Engine</h4>
                      <p className="font-semibold">{carData.engine || "Not specified"}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm text-gray-500 mb-1">Drivetrain</h4>
                      <p className="font-semibold">
                        {carData.drivetrain === "FWD" ? "Front-Wheel Drive (FWD)" :
                         carData.drivetrain === "RWD" ? "Rear-Wheel Drive (RWD)" :
                         carData.drivetrain === "AWD" ? "All-Wheel Drive (AWD)" :
                         carData.drivetrain === "4WD" ? "Four-Wheel Drive (4WD)" :
                         carData.drivetrain || "Not specified"}
                      </p>
                    </div>
                  </div>

                  {/* Row 4: Horsepower & Torque */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm text-gray-500 mb-1">Horsepower</h4>
                      <p className="font-semibold">{carData.horsepower || "Not specified"}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm text-gray-500 mb-1">Torque</h4>
                      <p className="font-semibold">{carData.torque || "Not specified"}</p>
                    </div>
                  </div>

                  {/* Row 5: City MPG & Highway MPG */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm text-gray-500 mb-1">City MPG</h4>
                      <p className="font-semibold">{carData.mpgCity ? `${carData.mpgCity} MPG` : "Not specified"}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-sm text-gray-500 mb-1">Highway MPG</h4>
                      <p className="font-semibold">{carData.mpgHighway ? `${carData.mpgHighway} MPG` : "Not specified"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="features" className="mt-8">
              {carData.features && carData.features.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {carData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      <span className="font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No specific features listed for this vehicle.</p>
                  <p className="text-sm text-gray-400 mt-2">Contact the seller for more details about available features.</p>
                </div>
              )}
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
          {carData.user && (
            <div className="bg-white rounded-xl border shadow-sm p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{carData.user.name}</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">(Reviews coming soon)</span>
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
                  <span>Member since {new Date(carData.user.createdAt).getFullYear()}</span>
                </div>
              </div>
              <div className="pt-4 space-y-3">
                <Button variant="outline" className="w-full" size="sm">
                  <Mail className="mr-2 h-4 w-4" />
                  {carData.user.email}
                </Button>
                {carData.user.phone && (
                  <Button variant="outline" className="w-full" size="sm">
                    <Phone className="mr-2 h-4 w-4" />
                    {carData.user.phone}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
