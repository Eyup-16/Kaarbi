import { withAdminAccess } from "@/lib/super-admin";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, UserRole, UserStatus } from "@/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  return withAdminAccess(async () => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          statusReason: true,
          statusUpdatedAt: true,
          statusUpdatedBy: true,
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
  return withAdminAccess(async (currentUser) => {
    try {
      const { userId, role, status, statusReason } = await request.json();
      
      if (!userId) {
        return NextResponse.json(
          { error: "User ID is required" },
          { status: 400 }
        );
      }

      // Validate role if provided
      if (role) {
        const validRoles = ['USER', 'MODERATOR', 'ADMIN', 'SUPER_ADMIN'];
        if (!validRoles.includes(role)) {
          return NextResponse.json(
            { error: "Invalid role" },
            { status: 400 }
          );
        }
      }

      // Validate status if provided
      if (status) {
        const validStatuses = ['ACTIVE', 'BANNED', 'SUSPENDED', 'REMOVED'];
        if (!validStatuses.includes(status)) {
          return NextResponse.json(
            { error: "Invalid status" },
            { status: 400 }
          );
        }
      }

      // Check if user exists and has a protected role
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true, status: true }
      });

      if (!existingUser) {
        return NextResponse.json(
          { error: "User not found" },
          { status: 404 }
        );
      }

      // Prevent changes to protected roles
      // Only SUPER_ADMIN is fully protected, ADMIN can be modified by SUPER_ADMIN
      if (existingUser.role === 'SUPER_ADMIN') {
        return NextResponse.json(
          { error: "Cannot modify SUPER_ADMIN role" },
          { status: 403 }
        );
      }
      
      // Only SUPER_ADMIN can modify ADMIN roles
      if (existingUser.role === 'ADMIN' && currentUser.role !== 'SUPER_ADMIN') {
        return NextResponse.json(
          { error: "Only SUPER_ADMIN can modify ADMIN roles" },
          { status: 403 }
        );
      }

      // Prepare update data
      interface UpdateData {
        role?: UserRole;
        status?: UserStatus;
        statusReason?: string | null;
        statusUpdatedAt?: Date;
        statusUpdatedBy?: string;
      }
      const updateData: UpdateData = {};
      if (role) updateData.role = role as UserRole;
      if (status) {
        updateData.status = status as UserStatus;
        updateData.statusReason = statusReason || null;
        updateData.statusUpdatedAt = new Date();
        updateData.statusUpdatedBy = currentUser.id;
      }

      // If status is being changed to non-ACTIVE, terminate all sessions
      if (status && status !== 'ACTIVE') {
        await prisma.session.deleteMany({
          where: { userId: userId }
        });
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          status: true,
          statusReason: true,
          statusUpdatedAt: true,
          statusUpdatedBy: true
        }
      });

      return NextResponse.json({
        success: true,
        data: updatedUser
      });
    } catch (error) {
      console.error("Error updating user:", error);
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 500 }
      );
    }
  });
}
