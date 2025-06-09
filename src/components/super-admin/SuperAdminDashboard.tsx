"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import AdminUserManagement from "./AdminUserManagement";
import SessionManagement from "./SessionManagement";
import DatabaseManagement from "./DatabaseManagement";
import { 
  Shield, 
  Users, 
  Car, 
  Activity, 
  RefreshCw, 
  Database,
  Settings,
  Crown,
  UserCheck,
  Clock,
  LoaderCircle
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  adminUsers: number;
  moderatorUsers: number;
  totalCars: number;
  pendingCars: number;
}

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/super-admin");
      if (response.ok) {
        const data = await response.json();
        setStats(data.data.stats);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px] px-4">
        <LoaderCircle className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container max-w-4xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <Card className="p-6 sm:p-8 text-center">
          <div className="flex justify-center mb-3 sm:mb-4">
            <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-red-500" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">Super admin access required.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Super Admin Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-500">Advanced system management and administrative controls</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="destructive" className="px-2 sm:px-3 py-1 sm:py-2 bg-red-50 text-red-700 border-red-200 text-xs sm:text-sm">
            <Crown className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            SUPER ADMIN
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
            </div>
            <Users className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 bg-blue-50 p-2 rounded-lg flex-shrink-0" />
          </div>
        </Card>
        
        <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Admin Users</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats?.adminUsers || 0}</p>
            </div>
            <UserCheck className="w-10 h-10 sm:w-12 sm:h-12 text-green-600 bg-green-50 p-2 rounded-lg flex-shrink-0" />
          </div>
        </Card>
        
        <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Moderators</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats?.moderatorUsers || 0}</p>
            </div>
            <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600 bg-purple-50 p-2 rounded-lg flex-shrink-0" />
          </div>
        </Card>
        
        <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Cars</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">{stats?.totalCars || 0}</p>
            </div>
            <Car className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-600 bg-indigo-50 p-2 rounded-lg flex-shrink-0" />
          </div>
        </Card>
        
        <Card className="p-4 sm:p-6 hover:shadow-lg transition-all duration-300 sm:col-span-2 lg:col-span-3 xl:col-span-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Pending Cars</p>
              <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{stats?.pendingCars || 0}</p>
            </div>
            <Clock className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-600 bg-yellow-50 p-2 rounded-lg flex-shrink-0" />
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="p-4 sm:p-6 shadow-lg">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-4">
            <TabsList className="bg-gray-100 w-full sm:w-auto overflow-x-auto">
              <TabsTrigger value="overview" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm flex-1 sm:flex-initial whitespace-nowrap">
                <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Overview</span>
                <span className="sm:hidden">O</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm flex-1 sm:flex-initial whitespace-nowrap">
                <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Manage Users</span>
                <span className="sm:hidden">U</span>
              </TabsTrigger>
              <TabsTrigger value="sessions" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm flex-1 sm:flex-initial whitespace-nowrap">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">All Sessions</span>
                <span className="sm:hidden">S</span>
              </TabsTrigger>
              <TabsTrigger value="database" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm flex-1 sm:flex-initial whitespace-nowrap">
                <Database className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Database</span>
                <span className="sm:hidden">D</span>
              </TabsTrigger>
            </TabsList>
            
            <Button 
              onClick={fetchStats} 
              variant="outline" 
              size="sm"
              disabled={loading}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <RefreshCw className={`w-3 h-3 sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-xs sm:text-sm">Refresh</span>
            </Button>
          </div>

          <TabsContent value="overview" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">System Overview</h3>
            </div>
            <Separator />
            
            <Card className="p-4 sm:p-6">
              <CardHeader className="pb-3 sm:pb-4 px-0">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 px-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-sm sm:text-base h-10 sm:h-11"
                    onClick={() => setActiveTab("users")}
                  >
                    <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    <span className="truncate">Manage Admin Users</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-sm sm:text-base h-10 sm:h-11"
                    onClick={() => setActiveTab("sessions")}
                  >
                    <Activity className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    <span className="truncate">View All Sessions</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-sm sm:text-base h-10 sm:h-11"
                    onClick={() => setActiveTab("database")}
                  >
                    <Database className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    <span className="truncate">Database Management</span>
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-sm sm:text-base h-10 sm:h-11" disabled>
                    <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    <span className="truncate">System Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <AdminUserManagement />
          </TabsContent>

          <TabsContent value="sessions">
            <SessionManagement />
          </TabsContent>

          <TabsContent value="database">
            <DatabaseManagement />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
