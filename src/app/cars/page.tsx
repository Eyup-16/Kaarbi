import { Metadata } from "next";
import Cars from "@/components/pages/Cars";

export const metadata: Metadata = {
  title: "Cars | Kaarbi",
  description: "Browse our extensive collection of cars",
};

export default function CarsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Find Your Perfect Car</h1>
          <p className="text-gray-600">
            Browse through our extensive collection of quality cars
          </p>
        </div>

        <Cars />
      </div>
    </div>
  );
}
