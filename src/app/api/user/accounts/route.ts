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

    const accounts = await prisma.account.findMany({
      where: {
        userId: session.user.id
      },
      select: {
        id: true,
        providerId: true,
        accountId: true,
        scope: true,
        createdAt: true
      }
    });

    return NextResponse.json(accounts);
  } catch (error) {
    console.error("Error fetching user accounts:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 