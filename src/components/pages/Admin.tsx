'use client'
import { useState, useEffect } from 'react';
import { authClient, useSession } from '@/lib/auth-client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {useRouter} from 'next/navigation'
interface User {
  id: string;
  name: string;
  email: string;
  banned: boolean;
}

interface Car {
  id: string;
  title: string;
  status: 'PENDING' | 'ACTIVE' | 'SOLD';
}

interface Session {
  id: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
}

interface UserResponse {
  users: User[];
  total: number;
  limit?: number;
  offset?: number;
}

interface SessionResponse {
  sessions: Session[];
}

export function Admin() {
  const {data:session, isPending} = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<User[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  useEffect(()=>{
    if(!isPending && !session){
      router.push('/not-found')
    }
  })
  const fetchUsers = async () => {
    try {
      const response = await authClient.admin.listUsers({
        query: {
          limit: 10,
          offset: 0
        }
      });
      if ('users' in response) {
        const userResponse = response as unknown as UserResponse;
        setUsers(userResponse.users);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error('Failed to fetch users');
    }
  };

  const fetchCars = async () => {
    try {
      const response = await fetch('/api/admin/cars');
      const data = await response.json();
      setCars(data.cars);
    } catch (err) {
      console.error('Error fetching cars:', err);
      toast.error('Failed to fetch cars');
    }
  };

  const fetchSessions = async () => {
    try {
      const session = await authClient.getSession();
      const userId = session?.data?.user?.id;
      
      if (!userId) {
        toast.error('No active session found');
        return;
      }

      const response = await authClient.admin.listUserSessions({
        userId
      });
      
      if ('sessions' in response) {
        const sessionResponse = response as unknown as SessionResponse;
        setSessions(sessionResponse.sessions);
      }
    } catch (err) {
      console.error('Error fetching sessions:', err);
      toast.error('Failed to fetch sessions');
    }
  };

  const handleBanUser = async (userId: string) => {
    try {
      await authClient.admin.banUser({
        userId,
        banReason: 'Violation of terms of service'
      });
      toast.success('User banned successfully');
      fetchUsers();
    } catch (err) {
      console.error('Error banning user:', err);
      toast.error('Failed to ban user');
    }
  };

  const handleApproveCar = async (carId: string) => {
    try {
      await fetch(`/api/cars/${carId}/approve`, {
        method: 'PATCH'
      });
      toast.success('Car approved successfully');
      fetchCars();
    } catch (err) {
      console.error('Error approving car:', err);
      toast.error('Failed to approve car');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="cars">Cars</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={fetchUsers}>Refresh Users</Button>
              <div className="mt-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border-b">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={() => handleBanUser(user.id)}
                      disabled={user.banned}
                    >
                      {user.banned ? 'Banned' : 'Ban User'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cars">
          <Card>
            <CardHeader>
              <CardTitle>Car Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={fetchCars}>Refresh Cars</Button>
              <div className="mt-4">
                {cars.map((car) => (
                  <div key={car.id} className="flex items-center justify-between p-4 border-b">
                    <div>
                      <p className="font-medium">{car.title}</p>
                      <p className="text-sm text-gray-500">{car.status}</p>
                    </div>
                    {car.status === 'PENDING' && (
                      <Button onClick={() => handleApproveCar(car.id)}>
                        Approve
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={fetchSessions}>Refresh Sessions</Button>
              <div className="mt-4">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border-b">
                    <div>
                      <p className="font-medium">Session ID: {session.id}</p>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(session.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={() => authClient.admin.revokeUserSession({
                        sessionToken: session.token
                      })}
                    >
                      Revoke
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 