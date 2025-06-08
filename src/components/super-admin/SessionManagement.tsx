"use client";

import { useState, useEffect } from "react";
import { Card, CardContent} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Session {
  id: string;
  token: string;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
  ipAddress?: string;
  userAgent?: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export default function SessionManagement() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch("/api/super-admin/sessions");
      if (response.ok) {
        const data = await response.json();
        setSessions(data.data);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
      toast.error("Failed to fetch sessions");
    } finally {
      setLoading(false);
    }
  };

  const terminateSession = async (sessionId: string) => {
    try {
      const response = await fetch("/api/super-admin/sessions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId })
      });

      if (response.ok) {
        toast.success("Session terminated successfully");
        fetchSessions(); // Refresh the list
      } else {
        toast.error("Failed to terminate session");
      }
    } catch (error) {
      console.error("Error terminating session:", error);
      toast.error("Failed to terminate session");
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'destructive';
      case 'ADMIN': return 'default';
      case 'MODERATOR': return 'secondary';
      default: return 'outline';
    }
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  if (loading) {
    return <div className="p-6">Loading sessions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Active Sessions ({sessions.length})</h2>
        <Button onClick={fetchSessions} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        {sessions.map((session) => (
          <Card key={session.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{session.user.name}</span>
                    <Badge variant={getRoleBadgeVariant(session.user.role)}>
                      {session.user.role}
                    </Badge>
                    {isExpired(session.expiresAt) && (
                      <Badge variant="outline" className="text-red-600">
                        Expired
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{session.user.email}</p>
                  <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
                    <div>
                      <span className="font-medium">Created:</span> {new Date(session.createdAt).toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Expires:</span> {new Date(session.expiresAt).toLocaleString()}
                    </div>
                    {session.ipAddress && (
                      <div>
                        <span className="font-medium">IP:</span> {session.ipAddress}
                      </div>
                    )}
                    {session.userAgent && (
                      <div className="col-span-2">
                        <span className="font-medium">User Agent:</span> {session.userAgent.substring(0, 80)}...
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => terminateSession(session.id)}
                  >
                    Terminate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sessions.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            No active sessions found
          </CardContent>
        </Card>
      )}
    </div>
  );
}
