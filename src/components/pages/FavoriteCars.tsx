'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

export function FavoriteCars() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [favoriteCars, setFavoriteCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      router.push('/login');
      return;
    }
    fetchFavoriteCars();
  }, [session, router]);

  const fetchFavoriteCars = async () => {
    try {
      const response = await fetch('/api/favorites');
      if (!response.ok) throw new Error('Failed to fetch favorites');
      const data = await response.json();
      setFavoriteCars(data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Failed to load favorite cars');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFavorite = async (carId: string) => {
    try {
      const response = await fetch(`/api/favorites/${carId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to remove favorite');

      setFavoriteCars(prev => prev.filter(car => car.id !== carId));
      toast.success("Car removed from favorites");
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove car from favorites');
    }
  };

  if (isPending || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect to login
  }

  if (favoriteCars.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No favorite cars yet</h3>
        <p className="text-gray-600 mb-6">Start adding cars to your favorites to see them here</p>
        <Button asChild>
          <Link href="/cars">Browse Cars</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {favoriteCars.map((car) => (
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
          <CardFooter className="p-4 pt-0 flex gap-2">
            <Link 
              href={`/cars/${car.id}`}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md text-center"
            >
              View Details
            </Link>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleRemoveFavorite(car.id)}
              className="hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
} 