import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const favorites = await prisma.favorite.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        car: true
      }
    });

    return NextResponse.json(favorites.map(fav => fav.car));
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { carId, ...carData } = body;

    if (!carId) {
      return new NextResponse("Car ID is required", { status: 400 });
    }

    console.log("Received car data:", { carId, carData });

    // Check if car exists
    let car = await prisma.car.findUnique({
      where: { id: carId }
    });

    // If car doesn't exist, create it with the provided data
    if (!car) {
      try {
        car = await prisma.car.create({
          data: {
            id: carId,
            title: carData.title || "Unknown Car",
            price: carData.price || 0,
            year: carData.year || new Date().getFullYear(),
            mileage: carData.mileage || 0,
            location: carData.location || "Unknown Location",
            imageUrl: carData.imageUrl || "",
            condition: carData.condition || "used",
            make: carData.make || "Unknown",
            model: carData.model || "Unknown"
          }
        });
        console.log("Created new car:", car);
      } catch (error) {
        console.error("Error creating car:", error);
        return new NextResponse(
          JSON.stringify({ error: "Failed to create car", details: error }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findFirst({
      where: {
        userId: session.user.id,
        carId: carId
      }
    });

    if (existingFavorite) {
      return new NextResponse("Car already in favorites", { status: 400 });
    }

    // Add to favorites
    try {
      const favorite = await prisma.favorite.create({
        data: {
          userId: session.user.id,
          carId: carId
        },
        include: {
          car: true
        }
      });
      console.log("Created favorite:", favorite);
      return NextResponse.json(favorite.car);
    } catch (error) {
      console.error("Error creating favorite:", error);
      return new NextResponse(
        JSON.stringify({ error: "Failed to create favorite", details: error }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error("Error in POST /api/favorites:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error", details: error }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
} 