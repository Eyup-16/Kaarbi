import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const session = await auth.api.getSession({headers: await headers()})
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.user.id

    // Get user's car count
    const totalCars = await prisma.car.count({
      where: { userId }
    })

    // Get user's favorite cars count
    const favoriteCars = await prisma.favorite.count({
      where: { userId }
    })

    // For now, return a placeholder for recent views
    // You can implement view tracking later
    const recentViews = Math.floor(Math.random() * 50) // Placeholder

    return NextResponse.json({
      totalCars,
      favoriteCars,
      recentViews
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    )
  }
}
