import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: { carId: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { carId } = params;
    if (!carId) {
      return new NextResponse("Car ID is required", { status: 400 });
    }

    // Check if favorite exists
    const favorite = await prisma.favorite.findFirst({
      where: {
        userId: session.user.id,
        carId: carId
      }
    });

    if (!favorite) {
      return new NextResponse("Favorite not found", { status: 404 });
    }

    // Remove from favorites
    await prisma.favorite.delete({
      where: {
        id: favorite.id
      }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error removing from favorites:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 