import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function DELETE() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Delete user and all related data (accounts, sessions) due to onDelete: Cascade
    await prisma.user.delete({
      where: {
        id: session.user.id
      }
    });

    return new NextResponse("Account deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting user account:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 