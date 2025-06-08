import { withSuperAdmin } from "@/lib/super-admin";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  return withSuperAdmin(async () => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true,
          createdAt: true,
          _count: {
            select: {
              cars: true,
              sessions: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return NextResponse.json({
        success: true,
        data: users
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      return NextResponse.json(
        { error: "Failed to fetch users" },
        { status: 500 }
      );
    }
  });
}

export async function PATCH(request: NextRequest) {
  return withSuperAdmin(async () => {
    try {
      const { userId, role } = await request.json();
      
      if (!userId || !role) {
        return NextResponse.json(
          { error: "User ID and role are required" },
          { status: 400 }
        );
      }

      const validRoles = ['USER', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN'];
      if (!validRoles.includes(role)) {
        return NextResponse.json(
          { error: "Invalid role" },
          { status: 400 }
        );
      }

      // Check if user has a protected role
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true }
      });

      if (!existingUser) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      // Prevent changes to protected roles
      if (existingUser.role === 'SUPER_ADMIN' || existingUser.role === 'ADMIN') {
        return NextResponse.json(
          { error: "Cannot modify protected admin roles" },
          { status: 403 }
        );
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role: role },
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      });

      return NextResponse.json({
        success: true,
        data: updatedUser
      });
    } catch (error) {
      console.error("Error updating user role:", error);
      return NextResponse.json(
        { error: "Failed to update user role" },
        { status: 500 }
      );
    }
  });
}
