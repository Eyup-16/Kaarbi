import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth'; // Adjust import path based on your better-auth setup
import prisma from '@/lib/prisma'; // Adjust import path based on your prisma setup
import Settings from '@/components/pages/Settings';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'Settings - Kaarbi',
  description: 'Manage your Kaarbi account settings and preferences',
};

// Types
interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  image?: string;
  createdAt: string;
}

interface ConnectedAccount {
  id: string;
  provider: string;
  email: string;
  connectedAt: string;
}

// Server Actions
async function updateUserProfile(userId: string, data: Partial<UserProfile>) {
  'use server';
  
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        location: data.location,
      },
    });
    
    return { success: true, user: updatedUser };
  } catch (error) {
    console.error('Failed to update user profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}

async function disconnectAccount(userId: string, accountId: string) {
  'use server';
  
  try {
    await prisma.account.deleteMany({
      where: {
        id: accountId,
        userId: userId,
      },
    });
    
    return { success: true };
  } catch (error) {
    console.error('Failed to disconnect account:', error);
    return { success: false, error: 'Failed to disconnect account' };
  }
}

async function deleteUserAccount(userId: string) {
  'use server';
  
  try {
    // Delete user's cars, messages, and other related data first
    await prisma.$transaction([
      // Delete user's car listings
      prisma.car.deleteMany({
        where: { userId: userId },
      }),
      // Delete user's favorites
      prisma.favorite.deleteMany({
        where: { userId: userId },
      }),
      // Delete user's accounts (OAuth connections)
      prisma.account.deleteMany({
        where: { userId: userId },
      }),
      // Delete user's sessions
      prisma.session.deleteMany({
        where: { userId: userId },
      }),
      // Finally, delete the user
      prisma.user.delete({
        where: { id: userId },
      }),
    ]);
    
    return { success: true };
  } catch (error) {
    console.error('Failed to delete user account:', error);
    return { success: false, error: 'Failed to delete account' };
  }
}

export default async function SettingsPage() {
  // Get the current session
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect('/login');
  }

  // Fetch user data and connected accounts
  const [user, connectedAccounts] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        location: true,
        image: true,
        createdAt: true,
      },
    }),
    prisma.account.findMany({
      where: { userId: session.user.id },
      select: {
        id: true,
        providerId: true,
        accountId: true,
        createdAt: true,
      },
    }),
  ]);

  if (!user) {
    redirect('/login');
  }

  // Transform data to match component props
  const userProfile: UserProfile = {
    id: user.id,
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || undefined,
    location: user.location || undefined,
    image: user.image || undefined,
    createdAt: user.createdAt.toISOString(),
  };

  const accounts: ConnectedAccount[] = connectedAccounts.map(account => ({
    id: account.id,
    provider: account.providerId,
    email: user.email || '',
    connectedAt: account.createdAt.toISOString(),
  }));

  // Create bound server actions
  const handleUpdateProfile = async (data: Partial<UserProfile>) => {
    'use server';
    const result = await updateUserProfile(session.user.id, data);
    if (!result.success) {
      throw new Error(result.error);
    }
  };

  const handleDisconnectAccount = async (accountId: string) => {
    'use server';
    const result = await disconnectAccount(session.user.id, accountId);
    if (!result.success) {
      throw new Error(result.error);
    }
  };

  const handleDeleteAccount = async () => {
    'use server';
    const result = await deleteUserAccount(session.user.id);
    if (!result.success) {
      throw new Error(result.error);
    }
    // Redirect to home page or sign out
    redirect('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Settings
        user={userProfile}
        connectedAccounts={accounts}
        onUpdateProfile={handleUpdateProfile}
        onDisconnectAccount={handleDisconnectAccount}
        onDeleteAccount={handleDeleteAccount}
      />
    </div>
  );
}