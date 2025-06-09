"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Car, Tag, MapPin, Calendar, Edit, Trash2, Gauge, Plus, Search, Eye, TrendingUp, Clock, CheckCircle, XCircle, LoaderCircle, AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

interface CarStats {
  total: number;
  pending: number;
  active: number;
  sold: number;
  totalValue: number;
  avgPrice: number;
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
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [filterCondition, setFilterCondition] = useState("all");
  const [stats, setStats] = useState<CarStats>({
    total: 0,
    pending: 0,
    active: 0,
    sold: 0,
    totalValue: 0,
    avgPrice: 0
  });

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
      return;
    }
    if (session) {
      fetchCars();
    }
  }, [session, isPending, router]);

  useEffect(() => {
    const pending = carsForSale.filter(car => car.status === 'PENDING').length;
    const active = carsForSale.filter(car => car.status === 'ACTIVE').length;
    const sold = carsForSale.filter(car => car.status === 'SOLD').length;
    const totalValue = carsForSale.reduce((sum, car) => sum + car.price, 0);
    const avgPrice = carsForSale.length > 0 ? totalValue / carsForSale.length : 0;

    setStats({
      total: carsForSale.length,
      pending,
      active,
      sold,
      totalValue,
      avgPrice
    });
  }, [carsForSale]);

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

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'ACTIVE':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'SOLD':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200"><XCircle className="w-3 h-3 mr-1" />Sold</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getFilteredAndSortedCars = (status: 'PENDING' | 'ACTIVE' | 'SOLD') => {
    const filteredCars = carsForSale.filter(car => {
      const matchesStatus = car.status === status;
      const matchesSearch = searchQuery === "" || 
        car.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCondition = filterCondition === "all" || car.condition === filterCondition;
      
      return matchesStatus && matchesSearch && matchesCondition;
    });

    // Sort cars
    filteredCars.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'price-high':
          return b.price - a.price;
        case 'price-low':
          return a.price - b.price;
        case 'mileage-low':
          return a.mileage - b.mileage;
        case 'mileage-high':
          return b.mileage - a.mileage;
        default:
          return 0;
      }
    });

    return filteredCars;
  };

  const renderSkeleton = () => (
    <Card className="overflow-hidden animate-pulse">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-64 h-48 bg-gray-200" />
        <div className="flex-1 p-6 space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <div className="h-6 w-48 bg-gray-200 rounded" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-gray-200 rounded-md" />
              <div className="h-8 w-8 bg-gray-200 rounded-md" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
          <Separator />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </Card>
  );

  const renderCars = (status: 'PENDING' | 'ACTIVE' | 'SOLD') => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i}>{renderSkeleton()}</div>
          ))}
        </div>
      );
    }

    const filteredCars = getFilteredAndSortedCars(status);
    
    if (filteredCars.length === 0) {
      return (
        <Card className="p-12">
          <div className="text-center">
            <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery || filterCondition !== "all" ? "No matching cars found" : `No ${status.toLowerCase()} listings`}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || filterCondition !== "all" 
                ? "Try adjusting your search criteria or filters" 
                : `You haven't listed any cars as ${status.toLowerCase()} yet.`}
            </p>
            {status === 'ACTIVE' && !isAdminRole && (
              <Link href="/sell">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  List Your First Car
                </Button>
              </Link>
            )}
          </div>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-6">
        {filteredCars.map(car => (
          <Card
            key={car.id}
            className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] border-0 shadow-md"
          >
            <div className="flex flex-col lg:flex-row">
              <div className="relative w-full lg:w-80 h-48 sm:h-64 lg:h-auto">
                <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 flex gap-1 sm:gap-2">
                  {getStatusBadge(car.status)}
                  <Badge variant="secondary" className="bg-white/90 text-gray-700 text-xs sm:text-sm">
                    {car.condition}
                  </Badge>
                </div>
                <div className="relative w-full h-full bg-gradient-to-br from-gray-100 to-gray-200">
                  {car.imageUrl && !failedImages.has(car.imageUrl) ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={car.imageUrl}
                        alt={`${car.make} ${car.model}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 1024px) 100vw, 320px"
                        priority={car.id === carsForSale[0]?.id}
                        onError={() => {
                          console.log('Image failed to load:', car.imageUrl);
                          setFailedImages(prev => new Set([...prev, car.imageUrl]));
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Car className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 sm:mb-6 gap-3">
                  <div>
                    <h3 className="text-lg sm:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                      {car.make} {car.model}
                    </h3>
                    <p className="text-gray-500 font-medium text-sm sm:text-base">{car.year}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {car.status === 'ACTIVE' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsSold(car.id)}
                        className="hover:bg-green-50 hover:text-green-600 hover:border-green-300 transition-all text-xs sm:text-sm flex-1 sm:flex-initial"
                      >
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Mark as Sold</span>
                        <span className="sm:hidden">Sold</span>
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit()}
                      className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all p-2"
                    >
                      <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(car.id)}
                      className="hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all p-2"
                    >
                      <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-blue-50 rounded-lg">
                    <Tag className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    <div>
                      <p className="text-xs sm:text-sm text-blue-600 font-medium">Price</p>
                      <p className="text-lg sm:text-xl font-bold text-blue-900">${car.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-green-50 rounded-lg">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    <div>
                      <p className="text-xs sm:text-sm text-green-600 font-medium">Location</p>
                      <p className="font-semibold text-green-900 text-sm sm:text-base">{car.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-purple-50 rounded-lg sm:col-span-2 lg:col-span-1">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    <div>
                      <p className="text-xs sm:text-sm text-purple-600 font-medium">Listed</p>
                      <p className="font-semibold text-purple-900 text-sm sm:text-base">{new Date(car.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                    <span className="text-gray-600 font-medium">{car.mileage.toLocaleString()} km</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Make: <span className="font-medium">{car.make}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Model: <span className="font-medium">{car.model}</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Updated: <span className="font-medium">{new Date(car.updatedAt).toLocaleDateString()}</span></span>
                  </div>
                </div>
              </div>
            </div>

            {showDeleteDialog && carToDelete === car.id && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50">
                <Card className="p-6 shadow-2xl text-center max-w-sm mx-4">
                  <div className="flex justify-center mb-4">
                    <AlertTriangle className="w-12 h-12 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Car Listing</h3>
                  <p className="text-gray-600 mb-6">Are you sure you want to delete this car listing? This action cannot be undone.</p>
                  <div className="flex gap-3 justify-center">
                    <Button variant="destructive" onClick={confirmDelete} className="px-6">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                    <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="px-6">
                      Cancel
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </Card>
        ))}
      </div>
    );
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoaderCircle className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to login
  }

  return (
    <div className="container max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Header */}
      <div className="relative mb-8 sm:mb-12">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl -z-10 opacity-50"></div>
        
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="text-center lg:text-left">
              <div className="flex items-center gap-3 justify-center lg:justify-start mb-3">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <Car className="w-6 h-6 text-blue-600" />
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  My Car Listings
                </h1>
              </div>
              <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0">
                Manage and track your vehicle sales with our comprehensive dashboard
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-end">
              <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-1.5 bg-blue-50 rounded-lg">
                  <Car className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-sm font-medium text-gray-900">{stats.total}</p>
                  <p className="text-xs text-gray-500">Total Listings</p>
                </div>
              </div>
              
              {!isAdminRole && (
                <Link href="/sell" className="w-full sm:w-auto">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 rounded-xl w-full sm:w-auto transform hover:scale-105">
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Car
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
        <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="absolute inset-0 bg-gradient-to-br from-green-400/5 to-emerald-400/5"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">Active Listings</p>
                <p className="text-3xl font-bold text-green-800">{stats.active}</p>
                <p className="text-xs text-green-600 mt-1">Ready for buyers</p>
              </div>
              <div className="p-3 bg-green-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-yellow-50 to-amber-50">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-amber-400/5"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700 mb-1">Pending Approval</p>
                <p className="text-3xl font-bold text-yellow-800">{stats.pending}</p>
                <p className="text-xs text-yellow-600 mt-1">Under review</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Clock className="w-8 h-8 text-yellow-600" />
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-indigo-400/5"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">Cars Sold</p>
                <p className="text-3xl font-bold text-blue-800">{stats.sold}</p>
                <p className="text-xs text-blue-600 mt-1">Successfully sold</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 bg-gradient-to-br from-purple-50 to-violet-50">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-violet-400/5"></div>
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 mb-1">Total Value</p>
                <p className="text-2xl font-bold text-purple-800">${stats.totalValue.toLocaleString()}</p>
                <p className="text-xs text-purple-600 mt-1">Portfolio worth</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                <Tag className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-r from-white to-gray-50 mb-8 sm:mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
        <div className="relative p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Search className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">Search & Filter</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
          </div>
          
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <Input
                placeholder="Search cars by make, model, location, or any keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-4 text-base border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/80 backdrop-blur-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Sort by
                </label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/80 backdrop-blur-sm">
                    <SelectValue placeholder="Choose sorting option" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2 border-gray-100 shadow-xl">
                    <SelectItem value="newest" className="rounded-lg">🆕 Newest First</SelectItem>
                    <SelectItem value="oldest" className="rounded-lg">⏰ Oldest First</SelectItem>
                    <SelectItem value="price-high" className="rounded-lg">💰 Price: High to Low</SelectItem>
                    <SelectItem value="price-low" className="rounded-lg">💲 Price: Low to High</SelectItem>
                    <SelectItem value="mileage-low" className="rounded-lg">🚗 Mileage: Low to High</SelectItem>
                    <SelectItem value="mileage-high" className="rounded-lg">🛣️ Mileage: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Condition
                </label>
                <Select value={filterCondition} onValueChange={setFilterCondition}>
                  <SelectTrigger className="w-full h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-white/80 backdrop-blur-sm">
                    <SelectValue placeholder="Filter by condition" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2 border-gray-100 shadow-xl">
                    <SelectItem value="all" className="rounded-lg">🎯 All Conditions</SelectItem>
                    <SelectItem value="excellent" className="rounded-lg">⭐ Excellent</SelectItem>
                    <SelectItem value="good" className="rounded-lg">✅ Good</SelectItem>
                    <SelectItem value="fair" className="rounded-lg">⚖️ Fair</SelectItem>
                    <SelectItem value="poor" className="rounded-lg">⚠️ Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {(searchQuery || filterCondition !== "all") && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                    Search: &quot;{searchQuery}&quot;
                    <button onClick={() => setSearchQuery("")} className="ml-2 hover:text-blue-900">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {filterCondition !== "all" && (
                  <Badge variant="secondary" className="px-3 py-1 bg-green-100 text-green-800 rounded-full">
                    Condition: {filterCondition}
                    <button onClick={() => setFilterCondition("all")} className="ml-2 hover:text-green-900">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Main Content */}
      <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 to-purple-500/3"></div>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'PENDING' | 'ACTIVE' | 'SOLD')}>
          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between p-6 sm:p-8 pb-0 gap-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl">
                <Car className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">Your Listings</h3>
                <p className="text-sm text-gray-600">Browse and manage your car listings</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="overflow-x-auto w-full sm:w-auto">
                <TabsList className="bg-white border-2 border-gray-100 shadow-lg rounded-xl p-1 w-full sm:w-auto">
                  <TabsTrigger 
                    value="PENDING" 
                    className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
                  >
                    <Clock className="w-4 h-4" />
                    <span className="hidden sm:inline">Pending</span>
                    <span className="sm:hidden">P</span>
                    <Badge variant="secondary" className="ml-1 bg-white/20 text-current border-0">
                      {stats.pending}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="ACTIVE" 
                    className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Active</span>
                    <span className="sm:hidden">A</span>
                    <Badge variant="secondary" className="ml-1 bg-white/20 text-current border-0">
                      {stats.active}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="SOLD" 
                    className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
                  >
                    <XCircle className="w-4 h-4" />
                    <span className="hidden sm:inline">Sold</span>
                    <span className="sm:hidden">S</span>
                    <Badge variant="secondary" className="ml-1 bg-white/20 text-current border-0">
                      {stats.sold}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <Button 
                onClick={fetchCars} 
                variant="outline" 
                size="sm"
                disabled={isLoading}
                className="flex items-center gap-2 text-sm px-6 py-2 rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 bg-white/80 backdrop-blur-sm w-full sm:w-auto"
              >
                <LoaderCircle className={`w-4 h-4 ${isLoading ? 'animate-spin' : 'hidden'}`} />
                <Eye className={`w-4 h-4 ${isLoading ? 'hidden' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
                <span className="sm:hidden">⟳</span>
              </Button>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <TabsContent value="PENDING" className="mt-0">
              {renderCars('PENDING')}
            </TabsContent>

            <TabsContent value="ACTIVE" className="mt-0">
              {renderCars('ACTIVE')}
            </TabsContent>

            <TabsContent value="SOLD" className="mt-0">
              {renderCars('SOLD')}
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  );
}
