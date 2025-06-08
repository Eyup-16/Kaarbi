import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { withSuperAdmin } from '@/lib/super-admin';

export async function POST(request: Request) {
  return withSuperAdmin(async () => {
    try {
      const { email, password, name } = await request.json();

      // Create admin user - only super admin can create admin users
      await auth.api.createUser({
        body: {
          email,
          password,
          name,
          role: 'ADMIN',
          data: {
            // Any additional user data
          }
        }
      });

      return NextResponse.json({ message: 'Admin user created successfully' });
    } catch (error) {
      console.error('Error creating admin user:', error);
      return new NextResponse('Internal Server Error', { status: 500 });
    }
  });
} 