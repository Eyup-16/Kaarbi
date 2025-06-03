import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if user has admin permissions
    const hasPermission = await auth.api.userHasPermission({
      body: {
        userId: session.user.id,
        permissions: {
          car: ['approve']
        }
      }
    });

    if (!hasPermission) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Update the car status to ACTIVE
    const updatedCar = await prisma.car.update({
      where: { id: (await params).id },
      data: { status: 'ACTIVE' },
    });

    return NextResponse.json(updatedCar);
  } catch (error) {
    console.error('Error approving car:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 