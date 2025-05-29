"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSession } from "@/lib/auth-client";
import { signOut } from "@/lib/auth-client";
import { AlertCircle, Edit2, Save, Trash2, X, Mail, User, Link2, Unlink, Phone, Building2, Globe, MapPin, FileText } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface ConnectedAccount {
  id: string;
  providerId: string;
  accountId: string;
  scope: string | null;
  createdAt: Date;
}

interface UserData {
  name: string;
  email: string;
  image: string;
  phone: string;
  company: string;
  bio: string;
  location: string;
  website: string;
}

export default function Profile() {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    image: "",
    phone: "",
    company: "",
    bio: "",
    location: "",
    website: ""
  });
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);

  useEffect(() => {
    if (session?.user) {
      setUserData({
        name: session.user.name || "",
        email: session.user.email || "",
        image: session.user.image || "",
        phone: "",
        company: "",
        bio: "",
        location: "",
        website: ""
      });

      // Fetch additional user data
      const fetchUserData = async () => {
        try {
          const response = await fetch("/api/user/profile");
          if (response.ok) {
            const data = await response.json();
            setUserData(prev => ({
              ...prev,
              phone: data.phone || "",
              company: data.company || "",
              bio: data.bio || "",
              location: data.location || "",
              website: data.website || ""
            }));
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          toast.error("Failed to fetch user data");
        }
      };

      fetchUserData();
    }
  }, [session]);

  useEffect(() => {
    const fetchConnectedAccounts = async () => {
      try {
        const response = await fetch("/api/user/accounts");
        if (response.ok) {
          const accounts = await response.json();
          setConnectedAccounts(accounts);
        }
      } catch (error) {
        console.error("Error fetching connected accounts:", error);
        toast.error("Failed to fetch connected accounts");
      }
    };

    fetchConnectedAccounts();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
      } else {
        const error = await response.text();
        toast.error(error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch("/api/user/delete", {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Account deleted successfully");
        await signOut();
      } else {
        const error = await response.text();
        toast.error(error || "Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account");
    }
  };

  const handleConnectProvider = async (provider: string) => {
    try {
      const response = await fetch(`/api/auth/${provider}`, {
        method: "POST",
      });

      if (response.ok) {
        const { url } = await response.json();
        window.location.href = url;
      } else {
        const error = await response.text();
        toast.error(error || `Failed to connect ${provider}`);
      }
    } catch (error) {
      console.error(`Error connecting ${provider}:`, error);
      toast.error(`Failed to connect ${provider}`);
    }
  };

  const handleDisconnectProvider = async (provider: string) => {
    try {
      const response = await fetch(`/api/auth/${provider}/disconnect`, {
        method: "POST",
      });

      if (response.ok) {
        toast.success(`Disconnected from ${provider}`);
        // Refresh connected accounts
        const accountsResponse = await fetch("/api/user/accounts");
        if (accountsResponse.ok) {
          const accounts = await accountsResponse.json();
          setConnectedAccounts(accounts);
        }
      } else {
        const error = await response.text();
        toast.error(error || `Failed to disconnect from ${provider}`);
      }
    } catch (error) {
      console.error(`Error disconnecting from ${provider}:`, error);
      toast.error(`Failed to disconnect from ${provider}`);
    }
  };

  const isProviderConnected = (provider: string) => {
    return connectedAccounts.some(account => account.providerId === provider);
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>

      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <User className="w-5 h-5 text-gray-500" />
            {isEditing ? (
              <div className="flex-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={userData.name}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            ) : (
              <div className="flex-1">
                <Label>Name</Label>
                <p className="text-gray-700">{userData.name}</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Mail className="w-5 h-5 text-gray-500" />
            <div className="flex-1">
              <Label>Email</Label>
              <p className="text-gray-700">{userData.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Phone className="w-5 h-5 text-gray-500" />
            {isEditing ? (
              <div className="flex-1">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={userData.phone}
                  onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            ) : (
              <div className="flex-1">
                <Label>Phone</Label>
                <p className="text-gray-700">{userData.phone || "Not provided"}</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Building2 className="w-5 h-5 text-gray-500" />
            {isEditing ? (
              <div className="flex-1">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={userData.company}
                  onChange={(e) => setUserData({ ...userData, company: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            ) : (
              <div className="flex-1">
                <Label>Company</Label>
                <p className="text-gray-700">{userData.company || "Not provided"}</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <MapPin className="w-5 h-5 text-gray-500" />
            {isEditing ? (
              <div className="flex-1">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={userData.location}
                  onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            ) : (
              <div className="flex-1">
                <Label>Location</Label>
                <p className="text-gray-700">{userData.location || "Not provided"}</p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Globe className="w-5 h-5 text-gray-500" />
            {isEditing ? (
              <div className="flex-1">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={userData.website}
                  onChange={(e) => setUserData({ ...userData, website: e.target.value })}
                  disabled={isLoading}
                />
              </div>
            ) : (
              <div className="flex-1">
                <Label>Website</Label>
                <p className="text-gray-700">{userData.website || "Not provided"}</p>
              </div>
            )}
          </div>

          <div className="flex items-start gap-4">
            <FileText className="w-5 h-5 text-gray-500 mt-2" />
            {isEditing ? (
              <div className="flex-1">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={userData.bio}
                  onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                  disabled={isLoading}
                  rows={4}
                />
              </div>
            ) : (
              <div className="flex-1">
                <Label>Bio</Label>
                <p className="text-gray-700 whitespace-pre-wrap">{userData.bio || "Not provided"}</p>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={handleEdit}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Info
              </Button>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Connected Accounts</h2>
        <div className="space-y-4">
          {["google", "microsoft", "apple"].map((provider) => (
            <div key={provider} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link2 className="w-5 h-5 text-gray-500" />
                <span className="capitalize">{provider}</span>
              </div>
              {isProviderConnected(provider) ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDisconnectProvider(provider)}
                >
                  <Unlink className="w-4 h-4 mr-2" />
                  Disconnect
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleConnectProvider(provider)}
                >
                  <Link2 className="w-4 h-4 mr-2" />
                  Connect
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 border-red-200 bg-red-50">
        <h2 className="text-xl font-semibold mb-4 text-red-700">Delete Account</h2>
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>
            This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
          </AlertDescription>
        </Alert>
        <Button variant="destructive" onClick={handleDeleteAccount}>
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Account
        </Button>
      </Card>
    </div>
  );
} 