import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { headers } from 'next/headers';
import { CarStatus } from '@/generated/prisma';

export async function GET(request: Request) {
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
          car: ['list-all']
        }
      }
    });

    if (!hasPermission) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Build where clause
    const where = statusParam && Object.values(CarStatus).includes(statusParam as CarStatus)
      ? { status: statusParam as CarStatus }
      : {};

    // Get cars with pagination
    const [cars, total] = await Promise.all([
      prisma.car.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.car.count({ where })
    ]);

    return NextResponse.json({
      cars,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Error fetching cars:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 