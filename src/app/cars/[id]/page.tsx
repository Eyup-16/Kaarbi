import { Metadata } from "next";
import CarDetails from "@/components/pages/CarDetails";

export const metadata: Metadata = {
  title: "Car Details | Kaarbi",
  description: "View detailed information about the car.",
};

interface PageProps {
  params: {
    id: string;
  };
}

export default function CarDetailsPage({ params }: PageProps) {
  return <CarDetails id={params.id} />;
}
