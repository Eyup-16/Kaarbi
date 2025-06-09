"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";
import Link from "next/link";
import { useState, useCallback, useEffect } from "react";

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
  };
}

interface FilterState {
  search: string;
  minPrice: string;
  maxPrice: string;
  year: string;
  condition: string;
  mileage: number[];
}



function CarsFilter({ filters, onFilterChange }: { filters: FilterState; onFilterChange: (filters: FilterState) => void }) {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    onFilterChange({
      ...filters,
      [type === 'min' ? 'minPrice' : 'maxPrice']: value
    });
  };

  const handleYearChange = (value: string) => {
    onFilterChange({ ...filters, year: value });
  };

  const handleConditionChange = (value: string) => {
    onFilterChange({ ...filters, condition: value });
  };

  const handleMileageChange = (value: number[]) => {
    onFilterChange({ ...filters, mileage: value });
  };

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl">Filter Cars</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div className="space-y-2">
          <Label htmlFor="search" className="text-sm font-medium">Search</Label>
          <Input
            id="search"
            placeholder="Search by make, model..."
            className="w-full text-sm"
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Price Range</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min"
              className="w-full text-sm"
              value={filters.minPrice}
              onChange={(e) => handlePriceChange('min', e.target.value)}
            />
            <span className="text-sm text-gray-500">-</span>
            <Input
              type="number"
              placeholder="Max"
              className="w-full text-sm"
              value={filters.maxPrice}
              onChange={(e) => handlePriceChange('max', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Year</Label>
          <Select value={filters.year} onValueChange={handleYearChange}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Year</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
              <SelectItem value="2021">2021</SelectItem>
              <SelectItem value="2020">2020</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Condition</Label>
          <Select value={filters.condition} onValueChange={handleConditionChange}>
            <SelectTrigger className="text-sm">
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any Condition</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="used">Used</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Mileage</Label>
          <Slider
            value={filters.mileage}
            onValueChange={handleMileageChange}
            max={200000}
            step={1000}
            className="w-full"
          />
          <div className="flex justify-between text-xs sm:text-sm text-gray-500">
            <span>{filters.mileage[0].toLocaleString()} mi</span>
            <span>{filters.mileage[1].toLocaleString()} mi</span>
          </div>
        </div>

        <button 
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-sm sm:text-base"
          onClick={() => onFilterChange(filters)}
        >
          Apply Filters
        </button>
      </CardContent>
    </Card>
  );
}

function CarsList({ cars, loading }: { cars: Car[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="p-0">
              <div className="w-full h-40 sm:h-48 bg-gray-200 animate-pulse" />
            </CardHeader>
            <CardContent className="p-3 sm:p-4 space-y-2">
              <div className="h-5 sm:h-6 bg-gray-200 animate-pulse rounded" />
              <div className="h-3 sm:h-4 bg-gray-200 animate-pulse rounded w-2/3" />
              <div className="h-6 sm:h-8 bg-gray-200 animate-pulse rounded w-1/2" />
              <div className="grid grid-cols-2 gap-2">
                <div className="h-3 sm:h-4 bg-gray-200 animate-pulse rounded" />
                <div className="h-3 sm:h-4 bg-gray-200 animate-pulse rounded" />
                <div className="h-3 sm:h-4 bg-gray-200 animate-pulse rounded" />
                <div className="h-3 sm:h-4 bg-gray-200 animate-pulse rounded" />
              </div>
            </CardContent>
            <CardFooter className="p-3 sm:p-4 pt-0">
              <div className="w-full h-8 sm:h-10 bg-gray-200 animate-pulse rounded" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-4">
        <h3 className="text-lg sm:text-xl font-semibold mb-2">No cars found</h3>
        <p className="text-sm sm:text-base text-gray-600">Try adjusting your filters to see more results.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      {cars.map((car) => (
        <Link key={car.id} href={`/cars/${car.id}`}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="p-0">
              <div className="relative w-full h-40 sm:h-48">
                <Image
                  src={car.imageUrl}
                  alt={car.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <Badge 
                  variant={car.condition === "new" ? "default" : "secondary"}
                  className="absolute top-2 right-2 text-xs sm:text-sm"
                >
                  {car.condition}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-3 sm:p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-base sm:text-lg truncate">{car.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">{car.location}</p>
                </div>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-primary mb-2">
                ${car.price.toLocaleString()}
              </p>
              <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                <div className="truncate">Year: {car.year}</div>
                <div className="truncate">Mileage: {car.mileage.toLocaleString()} mi</div>
                <div className="truncate">Make: {car.make}</div>
                <div className="truncate">Model: {car.model}</div>
              </div>
            </CardContent>
            <CardFooter className="p-3 sm:p-4 pt-0">
              <div className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-center text-sm sm:text-base">
                View Details
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default function Cars() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    minPrice: "",
    maxPrice: "",
    year: "any",
    condition: "any",
    mileage: [0, 100000],
  });

  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch cars from API
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/cars/active');
        
        if (!response.ok) {
          throw new Error('Failed to fetch cars');
        }

        const data = await response.json();
        setCars(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch cars');
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, []);

  const filterCars = useCallback((cars: Car[], filters: FilterState) => {
    return cars.filter((car) => {
      // Search filter
      const searchTerm = filters.search.toLowerCase();
      if (searchTerm && !(
        car.title.toLowerCase().includes(searchTerm) ||
        car.make.toLowerCase().includes(searchTerm) ||
        car.model.toLowerCase().includes(searchTerm)
      )) {
        return false;
      }

      // Price filter
      if (filters.minPrice && car.price < Number(filters.minPrice)) {
        return false;
      }
      if (filters.maxPrice && car.price > Number(filters.maxPrice)) {
        return false;
      }

      // Year filter
      if (filters.year !== "any" && car.year !== Number(filters.year)) {
        return false;
      }

      // Condition filter
      if (filters.condition !== "any" && car.condition !== filters.condition) {
        return false;
      }

      // Mileage filter
      if (car.mileage < filters.mileage[0] || car.mileage > filters.mileage[1]) {
        return false;
      }

      return true;
    });
  }, []);

  const filteredCars = filterCars(cars, filters);

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-2 text-red-600">Error loading cars</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        <div className="lg:col-span-1">
          <CarsFilter filters={filters} onFilterChange={setFilters} />
        </div>
        <div className="lg:col-span-3">
          <CarsList cars={filteredCars} loading={loading} />
        </div>
      </div>
    </div>
  );
} 