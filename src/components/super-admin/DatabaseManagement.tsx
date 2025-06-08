"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface DatabaseStats {
  userStats: {
    total: number;
    verified: number;
    unverified: number;
    byRole: { [key: string]: number };
  };
  carStats: {
    total: number;
    pending: number;
    active: number;
    sold: number;
  };
  sessionStats: {
    total: number;
    active: number;
    expired: number;
  };
}

export default function DatabaseManagement() {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDatabaseStats();
  }, []);

  const fetchDatabaseStats = async () => {
    try {
      const response = await fetch("/api/super-admin/database");
      if (response.ok) {
        const data = await response.json();
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching database stats:", error);
      toast.error("Failed to fetch database statistics");
    } finally {
      setLoading(false);
    }
  };

  const cleanupExpiredSessions = async () => {
    try {
      const response = await fetch("/api/super-admin/database/cleanup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cleanup-sessions" })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`Cleaned up ${data.deletedCount} expired sessions`);
        fetchDatabaseStats(); // Refresh stats
      } else {
        toast.error("Failed to cleanup expired sessions");
      }
    } catch (error) {
      console.error("Error cleaning up sessions:", error);
      toast.error("Failed to cleanup expired sessions");
    }
  };

  if (loading) {
    return <div className="p-6">Loading database statistics...</div>;
  }

  if (!stats) {
    return <div className="p-6 text-red-600">Failed to load database statistics</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Database Management</h2>
        <Button onClick={fetchDatabaseStats} variant="outline" size="sm">
          Refresh Stats
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">User Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-2xl font-bold">{stats.userStats.total}</div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Verified:</span>
                <Badge variant="default">{stats.userStats.verified}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Unverified:</span>
                <Badge variant="outline">{stats.userStats.unverified}</Badge>
              </div>
              <div className="pt-2 border-t space-y-1">
                {Object.entries(stats.userStats.byRole).map(([role, count]) => (
                  <div key={role} className="flex justify-between text-xs">
                    <span>{role}:</span>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Car Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Car Listings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-2xl font-bold">{stats.carStats.total}</div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Pending:</span>
                <Badge variant="outline" className="text-yellow-600">{stats.carStats.pending}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Active:</span>
                <Badge variant="default">{stats.carStats.active}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Sold:</span>
                <Badge variant="secondary">{stats.carStats.sold}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Sessions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-2xl font-bold">{stats.sessionStats.total}</div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Active:</span>
                <Badge variant="default">{stats.sessionStats.active}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span>Expired:</span>
                <Badge variant="outline" className="text-red-600">{stats.sessionStats.expired}</Badge>
              </div>
            </div>
            <Button 
              onClick={cleanupExpiredSessions} 
              variant="outline" 
              size="sm" 
              className="w-full"
              disabled={stats.sessionStats.expired === 0}
            >
              Cleanup Expired Sessions
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Database Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Database Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="outline" className="w-full">
              Export User Data
            </Button>
            <Button variant="outline" className="w-full">
              Export Car Data
            </Button>
            <Button variant="outline" className="w-full">
              Generate Backup
            </Button>
            <Button variant="outline" className="w-full" disabled>
              Database Health Check
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
