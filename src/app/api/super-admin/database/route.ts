import { withSuperAdmin } from "@/lib/super-admin";
import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  return withSuperAdmin(async () => {
    try {
      // Get detailed database statistics
      const userCount = await prisma.user.count();
      const verifiedUserCount = await prisma.user.count({ where: { emailVerified: true } });
      const unverifiedUserCount = userCount - verifiedUserCount;
      
      // Get user counts by role
      const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
      const superAdminCount = await prisma.user.count({ where: { role: "SUPER_ADMIN" } });
      const moderatorCount = await prisma.user.count({ where: { role: "MODERATOR" } });
      const regularUserCount = await prisma.user.count({ where: { role: "USER" } });
      
      // Get car statistics
      const carCount = await prisma.car.count();
      const pendingCarCount = await prisma.car.count({ where: { status: "PENDING" } });
      const activeCarCount = await prisma.car.count({ where: { status: "ACTIVE" } });
      const soldCarCount = await prisma.car.count({ where: { status: "SOLD" } });
      
      // Get session statistics
      const sessionCount = await prisma.session.count();
      const now = new Date();
      const activeSessionCount = await prisma.session.count({ 
        where: { expiresAt: { gt: now } } 
      });
      const expiredSessionCount = sessionCount - activeSessionCount;
      
      return NextResponse.json({
        success: true,
        data: {
          userStats: {
            total: userCount,
            verified: verifiedUserCount,
            unverified: unverifiedUserCount,
            byRole: {
              "SUPER_ADMIN": superAdminCount,
              "ADMIN": adminCount,
              "MODERATOR": moderatorCount,
              "USER": regularUserCount
            }
          },
          carStats: {
            total: carCount,
            pending: pendingCarCount,
            active: activeCarCount,
            sold: soldCarCount
          },
          sessionStats: {
            total: sessionCount,
            active: activeSessionCount,
            expired: expiredSessionCount
          }
        }
      });
    } catch (error) {
      console.error("Error fetching database stats:", error);
      return NextResponse.json(
        { error: "Failed to fetch database statistics" },
        { status: 500 }
      );
    }
  });
}
