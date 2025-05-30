import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { name, phone, company, bio, location, website } = body;

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id
      },
      data: {
        name,
        phone: phone || null,
        company: company || null,
        bio: bio || null,
        location: location || null,
        website: website || null
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phone: true,
        company: true,
        bio: true,
        location: true,
        website: true
      }
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to update user profile" }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  } finally {
    await prisma.$disconnect();
  }
} 