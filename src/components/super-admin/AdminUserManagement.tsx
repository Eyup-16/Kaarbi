"use client";

import { useState, useEffect } from "react";
import { Card, CardContent} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {LoaderCircle, Shield, AlertTriangle, Ban, Trash2} from 'lucide-react'

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  statusReason?: string;
  statusUpdatedAt?: string;
  statusUpdatedBy?: string;
  emailVerified: boolean;
  createdAt: string;
  _count: {
    cars: number;
    sessions: number;
  };
}

export default function AdminUserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusDialog, setStatusDialog] = useState<{open: boolean, user: User | null, action: string}>({
    open: false,
    user: null,
    action: ''
  });
  const [statusReason, setStatusReason] = useState('');
  const { data: session } = useSession();
  const currentUserRole = session?.user?.role;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/super-admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch("/api/super-admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole })
      });

      if (response.ok) {
        toast.success("User role updated successfully");
        fetchUsers(); // Refresh the list
      } else {
        toast.error("Failed to update user role");
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      toast.error("Failed to update user role");
    }
  };

  const updateUserStatus = async (userId: string, status: string, reason?: string) => {
    try {
      const response = await fetch("/api/super-admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, status, statusReason: reason })
      });

      if (response.ok) {
        toast.success(`User ${status.toLowerCase()} successfully`);
        fetchUsers(); // Refresh the list
        setStatusDialog({ open: false, user: null, action: '' });
        setStatusReason('');
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to update user status");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Failed to update user status");
    }
  };

  const handleStatusAction = (user: User, action: string) => {
    setStatusDialog({ open: true, user, action });
    setStatusReason('');
  };

  const confirmStatusAction = () => {
    if (!statusDialog.user) return;
    
    let status = 'ACTIVE';
    switch (statusDialog.action) {
      case 'ban':
        status = 'BANNED';
        break;
      case 'suspend':
        status = 'SUSPENDED';
        break;
      case 'remove':
        status = 'REMOVED';
        break;
      case 'activate':
        status = 'ACTIVE';
        break;
    }

    updateUserStatus(statusDialog.user.id, status, statusReason);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'destructive';
      case 'ADMIN': return 'default';
      case 'MODERATOR': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'default';
      case 'BANNED': return 'destructive';
      case 'SUSPENDED': return 'secondary';
      case 'REMOVED': return 'outline';
      default: return 'outline';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoaderCircle className="w-8 h-8 animate-spin text-gray-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Admin User Management</h2>
        <Button onClick={fetchUsers} variant="outline" size="sm">
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{user.name}</span>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                    <Badge variant={getStatusBadgeVariant(user.status)}>
                      {user.status}
                    </Badge>
                    {!user.emailVerified && (
                      <Badge variant="outline" className="text-yellow-600">
                        Unverified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>{user._count.cars} cars</span>
                    <span>{user._count.sessions} sessions</span>
                    <span>Joined: {new Date(user.createdAt).toLocaleDateString()}</span>
                    {user.statusReason && (
                      <span>Reason: {user.statusReason}</span>
                    )}
                    {user.statusUpdatedAt && (
                      <span>Status updated: {new Date(user.statusUpdatedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {user.role === 'SUPER_ADMIN' || (user.role === 'ADMIN' && currentUserRole !== 'SUPER_ADMIN') ? (
                    <Badge variant="outline" className="px-3 py-1">
                      {user.role === 'SUPER_ADMIN' ? 'Protected Role' : 'Admin Role (SUPER_ADMIN only)'}
                    </Badge>
                  ) : (
                    <>
                      <Select
                        value={user.role}
                        onValueChange={(newRole) => updateUserRole(user.id, newRole)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USER">User</SelectItem>
                          <SelectItem value="MODERATOR">Moderator</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                          {currentUserRole === 'SUPER_ADMIN' && (
                            <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      
                      {(user.role !== 'SUPER_ADMIN' || currentUserRole === 'SUPER_ADMIN') && user.status === 'ACTIVE' ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusAction(user, 'ban')}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Ban className="w-4 h-4 mr-1" />
                            Ban
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusAction(user, 'suspend')}
                            className="text-yellow-600 hover:text-yellow-700"
                          >
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            Suspend
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusAction(user, 'remove')}
                            className="text-gray-600 hover:text-gray-700"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </>
                      ) : (user.role !== 'SUPER_ADMIN' || currentUserRole === 'SUPER_ADMIN') && user.status !== 'ACTIVE' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusAction(user, 'activate')}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Shield className="w-4 h-4 mr-1" />
                          Activate
                        </Button>
                      ) : null}
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={statusDialog.open} onOpenChange={(open) => setStatusDialog({ ...statusDialog, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {statusDialog.action === 'activate' ? 'Activate' : 
               statusDialog.action === 'ban' ? 'Ban' :
               statusDialog.action === 'suspend' ? 'Suspend' : 'Remove'} User
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>User: {statusDialog.user?.name} ({statusDialog.user?.email})</Label>
            </div>
            <div>
              <Label htmlFor="reason">Reason (optional)</Label>
              <Textarea
                id="reason"
                value={statusReason}
                onChange={(e) => setStatusReason(e.target.value)}
                placeholder="Enter reason for this action..."
                className="mt-1"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setStatusDialog({ open: false, user: null, action: '' })}
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmStatusAction}
                variant={statusDialog.action === 'ban' || statusDialog.action === 'remove' ? 'destructive' : 'default'}
              >
                Confirm {statusDialog.action === 'activate' ? 'Activation' : 
                         statusDialog.action === 'ban' ? 'Ban' :
                         statusDialog.action === 'suspend' ? 'Suspension' : 'Removal'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
