import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { checkSuperAdminCredentials } from '@/lib/super-admin';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { email, password, name, initKey } = await request.json();

    // Check if initialization key matches environment variable
    const expectedInitKey = process.env.SUPER_ADMIN_INIT_KEY;
    if (!expectedInitKey || initKey !== expectedInitKey) {
      return new NextResponse('Invalid initialization key', { status: 403 });
    }

    // Check if any super admin already exists
    const existingSuperAdmin = await prisma.user.findFirst({
      where: { role: 'SUPER_ADMIN' }
    });

    if (existingSuperAdmin) {
      return new NextResponse('Super admin already exists', { status: 409 });
    }

    // Validate credentials match environment variables
    if (!checkSuperAdminCredentials(email, password)) {
      return new NextResponse('Credentials do not match environment configuration', { status: 400 });
    }

    // Create the super admin user
    const superAdmin = await auth.api.createUser({
      body: {
        email,
        password,
        name,
        role: 'SUPER_ADMIN',
        emailVerified: true // Auto-verify super admin
      }
    });

    return NextResponse.json({ 
      message: 'Super admin created successfully',
      user: {
        id: superAdmin.user.id,
        email: superAdmin.user.email,
        name: superAdmin.user.name,
        role: superAdmin.user.role
      }
    });
  } catch (error) {
    console.error('Error creating super admin:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
