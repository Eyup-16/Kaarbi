"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Tag, MapPin, Calendar, Edit, Trash2, Gauge, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

interface CarForSale {
  id: string;
  title: string;
  price: number;
  year: number;
  mileage: number;
  location: string;
  imageUrl: string;
  condition: string;
  status: 'PENDING' | 'ACTIVE' | 'SOLD';
  make: string;
  model: string;
  createdAt: string;
  updatedAt: string;
}

export default function Mycars() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  
  // Check if user is admin
  const isAdminRole = session?.user?.role === 'ADMIN' || session?.user?.role === 'SUPER_ADMIN';
  const [carsForSale, setCarsForSale] = useState<CarForSale[]>([]);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'ACTIVE' | 'SOLD'>('ACTIVE');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [carToDelete, setCarToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
      return;
    }
    if (session) {
      fetchCars();
    }
  }, [session, isPending, router]);

  const fetchCars = async () => {
    try {
      const response = await fetch('/api/cars');
      if (!response.ok) throw new Error('Failed to fetch cars');
      const data = await response.json();
      // Ensure all cars have a condition, defaulting to 'active' if not set
      const carsWithCondition = data.map((car: CarForSale) => ({
        ...car,
        condition: car.condition || 'active'
      }));
      setCarsForSale(carsWithCondition);
    } catch (error) {
      console.error('Error fetching cars:', error);
      toast.error('Failed to load your car listings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    setCarToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!carToDelete) return;

    try {
      const response = await fetch(`/api/cars/${carToDelete}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete car');

      setCarsForSale(prev => prev.filter(car => car.id !== carToDelete));
      toast.success("Car listing has been removed");
    } catch (error) {
      console.error('Error deleting car:', error);
      toast.error('Failed to delete car listing');
    } finally {
      setShowDeleteDialog(false);
      setCarToDelete(null);
    }
  };

  const handleEdit = () => {
    toast.info("Edit Feature", {
      description: "Edit functionality will be implemented soon.",
    });
  };

  const handleMarkAsSold = async (id: string) => {
    try {
      const response = await fetch(`/api/cars/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'SOLD' }),
      });

      if (!response.ok) throw new Error('Failed to update car status');

      setCarsForSale(prev => prev.map(car => 
        car.id === id ? { ...car, status: 'SOLD' } : car
      ));
      toast.success("Car marked as sold");
    } catch (error) {
      console.error('Error updating car status:', error);
      toast.error('Failed to update car status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'sold':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const renderSkeleton = () => (
    <Card className="overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-64 h-48 bg-gray-100 animate-pulse" />
        <div className="flex-1 p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="h-6 w-48 bg-gray-100 animate-pulse rounded" />
              <div className="h-4 w-24 bg-gray-100 animate-pulse rounded" />
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-gray-100 animate-pulse rounded-md" />
              <div className="h-8 w-8 bg-gray-100 animate-pulse rounded-md" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="h-4 w-32 bg-gray-100 animate-pulse rounded" />
            <div className="h-4 w-32 bg-gray-100 animate-pulse rounded" />
            <div className="h-4 w-32 bg-gray-100 animate-pulse rounded" />
          </div>
          <Separator />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-4 w-24 bg-gray-100 animate-pulse rounded" />
            <div className="h-4 w-24 bg-gray-100 animate-pulse rounded" />
            <div className="h-4 w-24 bg-gray-100 animate-pulse rounded" />
            <div className="h-4 w-24 bg-gray-100 animate-pulse rounded" />
          </div>
        </div>
      </div>
    </Card>
  );

  const renderCars = (status: 'PENDING' | 'ACTIVE' | 'SOLD') => {
    if (isLoading) {
      return (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i}>{renderSkeleton()}</div>
          ))}
        </div>
      );
    }

    const filteredCars = carsForSale.filter(car => car.status === status);
    
    if (filteredCars.length === 0) {
      return (
        <div className="text-center py-12">
          <Car className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No {status.toLowerCase()} listings</h3>
          <p className="text-gray-500">You haven&apos;t listed any cars as {status.toLowerCase()} yet.</p>
         
        </div>
      );
    }

    return filteredCars.map(car => (
      <Card
        key={car.id}
        className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg"
      >
        <div className="flex flex-col md:flex-row">
          <div className="relative w-full md:w-64 h-48 md:h-auto">
            <div className="absolute top-3 left-3 z-10">
              <Badge variant="outline" className={getStatusColor(car.status)}>
                {car.status.charAt(0).toUpperCase() + car.status.slice(1).toLowerCase()}
              </Badge>
            </div>
            <div className="relative w-full h-full bg-gray-100">
              {car.imageUrl && !failedImages.has(car.imageUrl) ? (
                <div className="relative w-full h-full">
                  <Image
                    src={car.imageUrl}
                    alt={`${car.make} ${car.model}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={car.id === carsForSale[0]?.id}
                    onError={() => {
                      console.log('Image failed to load:', car.imageUrl);
                      setFailedImages(prev => new Set([...prev, car.imageUrl]));
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Car className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {car.make} {car.model}
                </h3>
                <p className="text-gray-500">{car.year}</p>
              </div>
              <div className="flex gap-2">
                {car.status === 'ACTIVE' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleMarkAsSold(car.id)}
                    className="hover:bg-green-50 hover:text-green-600"
                  >
                    Mark as Sold
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit()}
                  className="hover:bg-blue-50 hover:text-blue-600"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(car.id)}
                  className="hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-blue-600" />
                <span className="font-semibold text-lg">${car.price.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>{car.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>Listed: {new Date(car.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{car.mileage.toLocaleString()} km</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Make: {car.make}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Model: {car.model}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Condition: {car.condition}</span>
              </div>
            </div>
          </div>
        </div>

        {showDeleteDialog && carToDelete === car.id && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg text-center max-w-sm mx-4">
              <h3 className="text-lg font-semibold mb-2">Delete Car Listing</h3>
              <p className="text-gray-600 mb-4">Are you sure you want to delete this car listing? This action cannot be undone.</p>
              <div className="flex gap-4 justify-center">
                <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    ));
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to login
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Cars for Sale</h1>
          <p className="text-gray-500 mt-1">Manage your car listings</p>
        </div>
        {!isAdminRole && (
          <Link href="/sell">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Add New Car
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        )}
      </div>

      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('PENDING')}
              className={`${
                activeTab === 'PENDING'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Pending Approval
            </button>
            <button
              onClick={() => setActiveTab('ACTIVE')}
              className={`${
                activeTab === 'ACTIVE'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Active Listings
            </button>
            <button
              onClick={() => setActiveTab('SOLD')}
              className={`${
                activeTab === 'SOLD'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
            >
              Sold
            </button>
          </nav>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {renderCars(activeTab)}
      </div>
    </div>
  );
} 