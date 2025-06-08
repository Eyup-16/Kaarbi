import { withSuperAdmin } from "@/lib/super-admin";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  return withSuperAdmin(async () => {
    try {
      // Get system statistics
      const userCount = await prisma.user.count();
      const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
      const moderatorCount = await prisma.user.count({ where: { role: "MODERATOR" } });
      const carCount = await prisma.car.count();
      const pendingCarCount = await prisma.car.count({ where: { status: "PENDING" } });
      
      return NextResponse.json({
        success: true,
        data: {
          stats: {
            totalUsers: userCount,
            adminUsers: adminCount,
            moderatorUsers: moderatorCount,
            totalCars: carCount,
            pendingCars: pendingCarCount
          }
        }
      });
    } catch (error) {
      console.error("Error fetching super admin data:", error);
      return NextResponse.json(
        { error: "Failed to fetch admin data" },
        { status: 500 }
      );
    }
  });
}

export async function POST(request: NextRequest) {
  return withSuperAdmin(async () => {
    try {
      const { action, userId, role } = await request.json();
      
      if (action === "promote-to-admin" && userId && role) {
        const updatedUser = await prisma.user.update({
          where: { id: userId },
          data: { role: role }
        });
        
        return NextResponse.json({
          success: true,
          data: updatedUser
        });
      }
      
      return NextResponse.json(
        { error: "Invalid action" },
        { status: 400 }
      );
    } catch (error) {
      console.error("Error in super admin action:", error);
      return NextResponse.json(
        { error: "Failed to perform action" },
        { status: 500 }
      );
    }
  });
}
