'use client'
import { useState, useEffect, useCallback } from 'react';
import { authClient, useSession } from '@/lib/auth-client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import SuperAdminDashboard from '@/components/super-admin/SuperAdminDashboard';
import { 
  Shield, 
  Users, 
  Car, 
  Activity, 
  RefreshCw, 
  CheckCircle, 
  XCircle,
  Clock,
  ChevronRight,
  LoaderCircle,
  Lock
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
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
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState<User[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ userCount: 0, carCount: 0, sessionCount: 0 });

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
        setStats(prev => ({ ...prev, userCount: userResponse.total || userResponse.users.length }));
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error('Failed to fetch users');
    }
  };

  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([fetchUsers(), fetchCars(), fetchSessions()]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check authentication and authorization
  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
      return;
    }
    
    if (session && !['ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes(session.user.role || '')) {
      router.push('/dashboard');
      return;
    }
    
    if (session && ['ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes(session.user.role || '')) {
      fetchInitialData();
    }
  }, [session, isPending, router, fetchInitialData]);

  // Check if user is super admin
  const isSuperAdmin = session?.user?.role === 'SUPER_ADMIN';

  // If super admin, show super admin dashboard
  if (isSuperAdmin) {
    return <SuperAdminDashboard />;
  }

  const fetchCars = async () => {
    try {
      const response = await fetch('/api/admin/cars');
      if (!response.ok) throw new Error('Failed to fetch cars');
      const data = await response.json();
      setCars(data.cars);
      setStats(prev => ({ ...prev, carCount: data.total || data.cars.length }));
    } catch (err) {
      console.error('Error fetching cars:', err);
      toast.error('Failed to fetch cars');
    }
  };

  const fetchSessions = async () => {
    try {
      const sessionData = await authClient.getSession();
      const userId = sessionData?.data?.user?.id;
      
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
        setStats(prev => ({ ...prev, sessionCount: sessionResponse.sessions.length }));
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
      const response = await fetch(`/api/cars/${carId}/approve`, {
        method: 'PATCH'
      });
      if (!response.ok) throw new Error('Failed to approve car');
      toast.success('Car approved successfully');
      fetchCars();
    } catch (err) {
      console.error('Error approving car:', err);
      toast.error('Failed to approve car');
    }
  };

  const handleRevokeSession = async (sessionToken: string) => {
    try {
      await authClient.admin.revokeUserSession({
        sessionToken
      });
      toast.success('Session revoked successfully');
      fetchSessions();
    } catch (err) {
      console.error('Error revoking session:', err);
      toast.error('Failed to revoke session');
    }
  };

  // Loading state
  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px] px-4">
        <LoaderCircle className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Unauthorized access
  if (!session || !['ADMIN', 'SUPER_ADMIN', 'MODERATOR'].includes(session.user.role || '')) {
    return (
      <div className="container max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <Card className="p-6 sm:p-8 text-center">
          <div className="flex justify-center mb-3 sm:mb-4">
            <Lock className="w-10 h-10 sm:w-12 sm:h-12 text-red-500" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Access Restricted</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">You don&apos;t have permission to access the admin dashboard.</p>
          <Button onClick={() => router.push('/')} variant="outline" className="text-sm sm:text-base">
            Return to Home
          </Button>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'ACTIVE':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'SOLD':
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200"><XCircle className="w-3 h-3 mr-1" />Sold</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-500">Manage users, car listings, and system activities</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-2 sm:px-3 py-1 sm:py-2 bg-blue-50 text-blue-700 border-blue-200 text-xs sm:text-sm">
            <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            {session?.user?.role || 'ADMIN'}
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.userCount}</p>
            </div>
            <Users className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 bg-blue-50 p-2 rounded-lg flex-shrink-0" />
          </div>
        </Card>
        
        <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Car Listings</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.carCount}</p>
            </div>
            <Car className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 bg-green-50 p-2 rounded-lg flex-shrink-0" />
          </div>
        </Card>
        
        <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Active Sessions</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats.sessionCount}</p>
            </div>
            <Activity className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600 bg-purple-50 p-2 rounded-lg flex-shrink-0" />
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="p-4 sm:p-6 shadow-lg">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
            <TabsList className="bg-gray-100 w-full sm:w-auto">
              <TabsTrigger value="users" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm flex-1 sm:flex-initial">
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Users</span>
                <span className="sm:hidden">U</span>
              </TabsTrigger>
              <TabsTrigger value="cars" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm flex-1 sm:flex-initial">
                <Car className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Cars</span>
                <span className="sm:hidden">C</span>
              </TabsTrigger>
              <TabsTrigger value="sessions" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm flex-1 sm:flex-initial">
                <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Sessions</span>
                <span className="sm:hidden">S</span>
              </TabsTrigger>
            </TabsList>
            
            <Button 
              onClick={() => {
                setLoading(true);
                Promise.all([fetchUsers(), fetchCars(), fetchSessions()])
                  .catch(error => console.error('Error fetching data:', error))
                  .finally(() => setLoading(false));
              }} 
              variant="outline" 
              size="sm"
              disabled={loading}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-xs sm:text-sm">Refresh</span>
            </Button>
          </div>

          <TabsContent value="users" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">User Management</h3>
              <Button onClick={fetchUsers} variant="outline" size="sm" className="w-full sm:w-auto">
                <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                <span className="text-xs sm:text-sm">Refresh Users</span>
              </Button>
            </div>
            <Separator />
            
            {users.length === 0 ? (
              <div className="text-center py-8 sm:py-12 px-4">
                <Users className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">No users found</h3>
                <p className="text-sm sm:text-base text-gray-500">No users to display at the moment.</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {users.map((user) => (
                  <Card key={user.id} className="p-3 sm:p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm sm:text-base text-gray-900 truncate">{user.name}</p>
                          <p className="text-xs sm:text-sm text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                        {user.banned && (
                          <Badge variant="destructive" className="text-xs">Banned</Badge>
                        )}
                        <Button
                          variant={user.banned ? "outline" : "destructive"}
                          size="sm"
                          onClick={() => handleBanUser(user.id)}
                          disabled={user.banned}
                          className="text-xs sm:text-sm flex-1 sm:flex-initial"
                        >
                          {user.banned ? 'Already Banned' : 'Ban User'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="cars" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Car Listings Management</h3>
              <Button onClick={fetchCars} variant="outline" size="sm" className="w-full sm:w-auto">
                <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                <span className="text-xs sm:text-sm">Refresh Cars</span>
              </Button>
            </div>
            <Separator />
            
            {cars.length === 0 ? (
              <div className="text-center py-8 sm:py-12 px-4">
                <Car className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">No car listings found</h3>
                <p className="text-sm sm:text-base text-gray-500">No car listings to review at the moment.</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {cars.map((car) => (
                  <Card key={car.id} className="p-3 sm:p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Car className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm sm:text-base text-gray-900 truncate">{car.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusBadge(car.status)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                        {car.status === 'PENDING' && (
                          <Button 
                            onClick={() => handleApproveCar(car.id)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm flex-1 sm:flex-initial"
                          >
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Approve</span>
                            <span className="sm:hidden">✓</span>
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="sessions" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Active Sessions</h3>
              <Button onClick={fetchSessions} variant="outline" size="sm" className="w-full sm:w-auto">
                <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                <span className="text-xs sm:text-sm">Refresh Sessions</span>
              </Button>
            </div>
            <Separator />
            
            {sessions.length === 0 ? (
              <div className="text-center py-8 sm:py-12 px-4">
                <Activity className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">No active sessions</h3>
                <p className="text-sm sm:text-base text-gray-500">No active sessions to display.</p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {sessions.map((sessionItem) => (
                  <Card key={sessionItem.id} className="p-3 sm:p-4 hover:shadow-md transition-all duration-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm sm:text-base text-gray-900 truncate">Session ID: {sessionItem.id.slice(0, 8)}...</p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-500 mt-1">
                            <span>Created: {new Date(sessionItem.createdAt).toLocaleDateString()}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>Expires: {new Date(sessionItem.expiresAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRevokeSession(sessionItem.token)}
                        className="text-xs sm:text-sm w-full sm:w-auto"
                      >
                        <XCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        Revoke
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
} 