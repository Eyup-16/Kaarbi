'use client'

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LoaderCircle, Car, Heart, Plus, Eye, Calendar} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
  const { data: session, isPending, error } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalCars: 0,
    favoriteCars: 0,
    recentViews: 0
  });

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      // Fetch user statistics
      const fetchStats = async () => {
        try {
          const response = await fetch('/api/dashboard/stats');
          if (response.ok) {
            const data = await response.json();
            setStats(data);
          }
        } catch (error) {
          console.error('Failed to fetch stats:', error);
        }
      };
      fetchStats();
    }
  }, [session]);

  if (isPending) {
    return (
      <section className="flex flex-col justify-center items-center h-60 sm:h-80 px-4">
      <LoaderCircle className="animate-spin h-6 w-6 sm:h-8 sm:w-8" />
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col justify-center items-center h-60 sm:h-80 px-4">
        <p className="text-sm sm:text-base text-center">Error: {error.message}</p>
      </section>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Welcome back, {session.user.name}!
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Here&apos;s what&apos;s happening with your cars and activity
        </p>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Cars</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCars}</div>
            <p className="text-xs text-muted-foreground">Cars you&apos;re selling</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.favoriteCars}</div>
            <p className="text-xs text-muted-foreground">Cars you&apos;ve saved</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentViews}</div>
            <p className="text-xs text-muted-foreground">Views this week</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Manage your cars and activity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/sell">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Sell a Car
              </Button>
            </Link>
            <Link href="/my-cars">
              <Button className="w-full justify-start" variant="outline">
                <Car className="h-4 w-4 mr-2" />
                View My Cars
              </Button>
            </Link>
            <Link href="/favorites">
              <Button className="w-full justify-start" variant="outline">
                <Heart className="h-4 w-4 mr-2" />
                View Favorites
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Account Info
            </CardTitle>
            <CardDescription>
              Your account details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Email:</span>
              <span className="text-sm font-medium">{session.user.email}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Role:</span>
              <span className="text-sm font-medium">{session.user.role || 'User'}</span>
            </div>
            <Link href="/profile">
              <Button className="w-full mt-4" variant="outline">
                Edit Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Browse Section */}
      <Card>
        <CardHeader>
          <CardTitle>Explore Cars</CardTitle>
          <CardDescription>
            Find your next car from our marketplace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/cars">
            <Button size="lg" className="w-full sm:w-auto">
              Browse All Cars
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

