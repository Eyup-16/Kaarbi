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

    const { status } = await request.json();
    if (!status || !['PENDING', 'ACTIVE', 'SOLD'].includes(status)) {
      return new NextResponse('Invalid status', { status: 400 });
    }

    // Check if the car belongs to the user
    const car = await prisma.car.findUnique({
      where: { id:(await params).id },
      select: { userId: true }
    });

    if (!car || car.userId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Update the car status
    const updatedCar = await prisma.car.update({
      where: { id: (await params).id },
      data: { status },
    });

    return NextResponse.json(updatedCar);
  } catch (error) {
    console.error('Error updating car status:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 