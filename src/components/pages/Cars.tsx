"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {Select,SelectContent,SelectItem,SelectTrigger,SelectValue,} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";
import Link from "next/link";
import { useState, useCallback } from "react";

interface Car {
  id: string;
  title: string;
  price: number;
  year: number;
  mileage: number;
  location: string;
  imageUrl: string;
  condition: "new" | "used";
  make: string;
  model: string;
}

interface FilterState {
  search: string;
  minPrice: string;
  maxPrice: string;
  year: string;
  condition: string;
  mileage: number[];
}

// Temporary mock data - replace with actual API call
const mockCars: Car[] = [
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
  },
  {
    id: "3",
    title: "2022 Honda Civic",
    price: 22000,
    year: 2022,
    mileage: 25000,
    location: "Chicago, IL",
    imageUrl: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=600&fit=crop",
    condition: "used",
    make: "Honda",
    model: "Civic",
  },
  {
    id: "4",
    title: "2023 Ford Mustang",
    price: 35000,
    year: 2023,
    mileage: 5000,
    location: "Miami, FL",
    imageUrl: "https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?w=800&h=600&fit=crop",
    condition: "used",
    make: "Ford",
    model: "Mustang",
  },
  {
    id: "5",
    title: "2024 BMW 3 Series",
    price: 48000,
    year: 2024,
    mileage: 0,
    location: "Seattle, WA",
    imageUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop",
    condition: "new",
    make: "BMW",
    model: "3 Series",
  },
  {
    id: "6",
    title: "2023 Mercedes-Benz C-Class",
    price: 42000,
    year: 2023,
    mileage: 10000,
    location: "Boston, MA",
    imageUrl: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop",
    condition: "used",
    make: "Mercedes-Benz",
    model: "C-Class",
  },
];

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
    <Card>
      <CardHeader>
        <CardTitle>Filter Cars</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            placeholder="Search by make, model, or keyword"
            className="w-full"
            value={filters.search}
            onChange={handleSearchChange}
          />
        </div>

        <div className="space-y-2">
          <Label>Price Range</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="Min"
              className="w-full"
              value={filters.minPrice}
              onChange={(e) => handlePriceChange('min', e.target.value)}
            />
            <span>-</span>
            <Input
              type="number"
              placeholder="Max"
              className="w-full"
              value={filters.maxPrice}
              onChange={(e) => handlePriceChange('max', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Year</Label>
          <Select value={filters.year} onValueChange={handleYearChange}>
            <SelectTrigger>
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
          <Label>Condition</Label>
          <Select value={filters.condition} onValueChange={handleConditionChange}>
            <SelectTrigger>
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
          <Label>Mileage</Label>
          <Slider
            value={filters.mileage}
            onValueChange={handleMileageChange}
            max={200000}
            step={1000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>{filters.mileage[0].toLocaleString()} mi</span>
            <span>{filters.mileage[1].toLocaleString()} mi</span>
          </div>
        </div>

        <button 
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
          onClick={() => onFilterChange(filters)}
        >
          Apply Filters
        </button>
      </CardContent>
    </Card>
  );
}

function CarsList({ cars }: { cars: Car[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car) => (
        <Card key={car.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <CardHeader className="p-0">
            <div className="relative w-full h-48">
              <Image
                src={car.imageUrl}
                alt={car.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <Badge 
                variant={car.condition === "new" ? "default" : "secondary"}
                className="absolute top-2 right-2"
              >
                {car.condition}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{car.title}</h3>
                <p className="text-sm text-gray-600">{car.location}</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-primary mb-2">
              ${car.price.toLocaleString()}
            </p>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div>Year: {car.year}</div>
              <div>Mileage: {car.mileage.toLocaleString()} mi</div>
              <div>Make: {car.make}</div>
              <div>Model: {car.model}</div>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <Link 
              href={`/cars/${car.id}`}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-center"
            >
              View Details
            </Link>
          </CardFooter>
        </Card>
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

  const filteredCars = filterCars(mockCars, filters);

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <CarsFilter filters={filters} onFilterChange={setFilters} />
        </div>
        <div className="lg:col-span-3">
          <CarsList cars={filteredCars} />
        </div>
      </div>
    </div>
  );
} 