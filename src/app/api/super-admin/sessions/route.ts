import { withSuperAdmin } from "@/lib/super-admin";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  return withSuperAdmin(async () => {
    try {
      const sessions = await prisma.session.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 50 // Limit to recent 50 sessions
      });

      return NextResponse.json({
        success: true,
        data: sessions
      });
    } catch (error) {
      console.error("Error fetching sessions:", error);
      return NextResponse.json(
        { error: "Failed to fetch sessions" },
        { status: 500 }
      );
    }
  });
}

export async function DELETE(request: NextRequest) {
  return withSuperAdmin(async () => {
    try {
      const { sessionId } = await request.json();
      
      if (!sessionId) {
        return NextResponse.json(
          { error: "Session ID is required" },
          { status: 400 }
        );
      }

      await prisma.session.delete({
        where: { id: sessionId }
      });

      return NextResponse.json({
        success: true,
        message: "Session terminated successfully"
      });
    } catch (error) {
      console.error("Error terminating session:", error);
      return NextResponse.json(
        { error: "Failed to terminate session" },
        { status: 500 }
      );
    }
  });
}
