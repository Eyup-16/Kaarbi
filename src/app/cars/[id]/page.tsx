import { Metadata } from "next";
import CarDetails from "@/components/pages/CarDetails";

export const metadata: Metadata = {
  title: "Car Details | Kaarbi",
  description: "View detailed information about the car.",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CarDetailsPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <CarDetails id={resolvedParams.id} />;
}
