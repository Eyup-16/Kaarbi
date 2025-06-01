import { Metadata } from "next";
import {FavoriteCars} from "@/components/pages/FavoriteCars";

export const metadata: Metadata = {
  title: "Favorite Cars | Kaarbi",
  description: "View and manage your favorite cars",
};

export default function FavoritesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Favorite Cars</h1>
          <p className="text-gray-600">
            View and manage your favorite car listings
          </p>
        </div>

        <FavoriteCars />
      </div>
    </div>
  );
} 