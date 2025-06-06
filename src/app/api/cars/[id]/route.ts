import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: PageProps) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const car = await prisma.car.findUnique({
      where: {
        id: id,
        status: 'ACTIVE' // Only return active cars for public viewing
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            image: true,
            createdAt: true
          }
        }
      }
    });

    if (!car) {
      return new NextResponse("Car not found", { status: 404 });
    }

    return NextResponse.json(car);
  } catch (error) {
    console.error("Error fetching car:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
