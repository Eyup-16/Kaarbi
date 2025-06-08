import { withSuperAdmin } from "@/lib/super-admin";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  return withSuperAdmin(async () => {
    try {
      const { action } = await request.json();

      if (action === "cleanup-sessions") {
        // Delete expired sessions
        const result = await prisma.session.deleteMany({
          where: {
            expiresAt: {
              lt: new Date()
            }
          }
        });

        return NextResponse.json({
          success: true,
          deletedCount: result.count,
          message: `Cleaned up ${result.count} expired sessions`
        });
      }

      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    } catch (error) {
      console.error("Error in database cleanup:", error);
      return NextResponse.json(
        { error: "Failed to perform cleanup operation" },
        { status: 500 }
      );
    }
  });
}
