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

    const cars = await prisma.car.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(cars);
  } catch (error) {
    console.error("Error fetching cars:", error);
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
    const { 
      title, 
      price, 
      year, 
      mileage, 
      location, 
      imageUrl, 
      condition, 
      make, 
      model,
      // Additional specifications
      trim,
      color,
      engine,
      transmission,
      fuelType,
      drivetrain,
      horsepower,
      torque,
      mpgCity,
      mpgHighway,
      features,
      description
    } = body;

    const car = await prisma.car.create({
      data: {
        title,
        price,
        year,
        mileage,
        location,
        imageUrl,
        condition,
        make,
        model,
        // Additional specifications
        trim: trim || null,
        color: color || null,
        engine: engine || null,
        transmission: transmission || null,
        fuelType: fuelType || null,
        drivetrain: drivetrain || null,
        horsepower: horsepower || null,
        torque: torque || null,
        mpgCity: mpgCity ? parseInt(mpgCity) : null,
        mpgHighway: mpgHighway ? parseInt(mpgHighway) : null,
        features: features || [],
        description: description || null,
        userId: session.user.id
      }
    });

    return NextResponse.json(car);
  } catch (error) {
    console.error("Error creating car:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 