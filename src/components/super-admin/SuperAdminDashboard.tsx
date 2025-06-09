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
      <div className="flex items-center justify-center min-h-[400px]">
        <LoaderCircle className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-4">
            <Shield className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">Super admin access required.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Super Admin Dashboard</h1>
          <p className="text-gray-500">Advanced system management and administrative controls</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="destructive" className="px-3 py-2 bg-red-50 text-red-700 border-red-200">
            <Crown className="w-4 h-4 mr-2" />
            SUPER ADMIN
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <Card className="p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
            </div>
            <Users className="w-12 h-12 text-blue-600 bg-blue-50 p-2 rounded-lg" />
          </div>
        </Card>
        
        <Card className="p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Admin Users</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.adminUsers || 0}</p>
            </div>
            <UserCheck className="w-12 h-12 text-green-600 bg-green-50 p-2 rounded-lg" />
          </div>
        </Card>
        
        <Card className="p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Moderators</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.moderatorUsers || 0}</p>
            </div>
            <Shield className="w-12 h-12 text-purple-600 bg-purple-50 p-2 rounded-lg" />
          </div>
        </Card>
        
        <Card className="p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cars</p>
              <p className="text-3xl font-bold text-gray-900">{stats?.totalCars || 0}</p>
            </div>
            <Car className="w-12 h-12 text-indigo-600 bg-indigo-50 p-2 rounded-lg" />
          </div>
        </Card>
        
        <Card className="p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Cars</p>
              <p className="text-3xl font-bold text-yellow-600">{stats?.pendingCars || 0}</p>
            </div>
            <Clock className="w-12 h-12 text-yellow-600 bg-yellow-50 p-2 rounded-lg" />
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="p-6 shadow-lg">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-6">
            <TabsList className="bg-gray-100">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Manage Users
              </TabsTrigger>
              <TabsTrigger value="sessions" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                All Sessions
              </TabsTrigger>
              <TabsTrigger value="database" className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Database
              </TabsTrigger>
            </TabsList>
            
            <Button 
              onClick={fetchStats} 
              variant="outline" 
              size="sm"
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          <TabsContent value="overview" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">System Overview</h3>
            </div>
            <Separator />
            
            <Card className="p-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("users")}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Manage Admin Users
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("sessions")}
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    View All Sessions
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("database")}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    Database Management
                  </Button>
                  <Button variant="outline" className="w-full justify-start" disabled>
                    <Settings className="w-4 h-4 mr-2" />
                    System Settings
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
