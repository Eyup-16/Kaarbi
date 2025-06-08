import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { message: 'Token is required' },
        { status: 400 }
      );
    }

    // Use better-auth's verifyEmail function
    const result = await auth.api.verifyEmail({
      query: { token }
    });

    if (!result || !result.status) {
      return NextResponse.json(
        { message: 'Verification failed' },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Email verified successfully' 
    });
  } catch (error) {
    console.error('Error verifying email:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 