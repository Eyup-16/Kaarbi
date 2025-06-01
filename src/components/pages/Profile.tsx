"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSession } from "@/lib/auth-client";
import { signOut } from "@/lib/auth-client";
import { AlertCircle, Edit2, Save, Trash2, X, Mail, User, Link2, Unlink, Phone, Building2, Globe, MapPin, FileText, Upload } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Image from "next/image";

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
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleteEnabled, setIsDeleteEnabled] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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
      setPreviewImage(null); // Reset preview when session changes

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
    setPreviewImage(null); // Reset preview when entering edit mode
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // If there's a preview image, update the userData directly
      if (previewImage) {
        userData.image = previewImage;
      }

      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        
        // Update the local state with new data
        setUserData(prev => ({
          ...prev,
          ...updatedUser
        }));

        // Update session data in localStorage
        const currentSession = localStorage.getItem('auth_session');
        if (currentSession) {
          const sessionData = JSON.parse(currentSession);
          sessionData.user = {
            ...sessionData.user,
            ...updatedUser
          };
          localStorage.setItem('auth_session', JSON.stringify(sessionData));
        }
        
        toast.success("Profile updated successfully");
        setIsEditing(false);
        setPreviewImage(null); // Clear preview after successful save
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

  const handleCancel = () => {
    setPreviewImage(null); // Clear preview when canceling
    setIsEditing(false);
  };

  const handleDeleteConfirmation = (value: string) => {
    setDeleteConfirmation(value);
    setIsDeleteEnabled(value === "DELETE");
  };

  const handleDeleteAccount = async () => {
    if (!isDeleteEnabled) return;
    
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/user/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setPreviewImage(data.imageUrl); // Update preview instead of actual image
        toast.success('Profile image preview updated');
      } else {
        const error = await response.text();
        toast.error(error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-500">Manage your account settings and preferences</p>
        </div>
        {!isEditing && (
          <Button 
            variant="outline" 
            onClick={handleEdit} 
            className="transition-all hover:scale-105 hover:shadow-md border-gray-300"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Info
          </Button>
        )}
      </div>

      <Card className="p-8 mb-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-gray-100 rounded-lg">
            <User className="w-6 h-6 text-gray-700" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">Account Information</h2>
        </div>
        <div className="grid gap-6">
          <div className="flex justify-center mb-6">
            <div 
              className="relative group cursor-pointer"
              onClick={handleImageClick}
            >
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 hover:border-gray-300 transition-all duration-300">
                {(previewImage || userData.image) ? (
                  <Image 
                    src={previewImage || userData.image} 
                    alt="Profile" 
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              {isEditing && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Upload className="w-8 h-8 text-white" />
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
                disabled={isUploading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-100">
              <div className="p-2 bg-gray-100 rounded-full">
                <User className="w-5 h-5 text-gray-700" />
              </div>
              {isEditing ? (
                <div className="flex-1">
                  <Label htmlFor="name" className="text-sm font-medium text-gray-700">Name</Label>
                  <Input
                    id="name"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    disabled={isLoading}
                    className="mt-1 focus:ring-2 focus:ring-gray-400 border-gray-200"
                  />
                </div>
              ) : (
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">Name</Label>
                  <p className="text-gray-900 mt-1">{userData.name}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-100">
              <div className="p-2 bg-gray-100 rounded-full">
                <Mail className="w-5 h-5 text-gray-700" />
              </div>
              <div className="flex-1">
                <Label className="text-sm font-medium text-gray-700">Email</Label>
                <p className="text-gray-900 mt-1">{userData.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-100">
              <div className="p-2 bg-gray-100 rounded-full">
                <Phone className="w-5 h-5 text-gray-700" />
              </div>
              {isEditing ? (
                <div className="flex-1">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</Label>
                  <Input
                    id="phone"
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    disabled={isLoading}
                    className="mt-1 focus:ring-2 focus:ring-gray-400 border-gray-200"
                  />
                </div>
              ) : (
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">Phone</Label>
                  <p className="text-gray-900 mt-1">{userData.phone || "Not provided"}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-100">
              <div className="p-2 bg-gray-100 rounded-full">
                <Building2 className="w-5 h-5 text-gray-700" />
              </div>
              {isEditing ? (
                <div className="flex-1">
                  <Label htmlFor="company" className="text-sm font-medium text-gray-700">Company</Label>
                  <Input
                    id="company"
                    value={userData.company}
                    onChange={(e) => setUserData({ ...userData, company: e.target.value })}
                    disabled={isLoading}
                    className="mt-1 focus:ring-2 focus:ring-gray-400 border-gray-200"
                  />
                </div>
              ) : (
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">Company</Label>
                  <p className="text-gray-900 mt-1">{userData.company || "Not provided"}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-100">
              <div className="p-2 bg-gray-100 rounded-full">
                <MapPin className="w-5 h-5 text-gray-700" />
              </div>
              {isEditing ? (
                <div className="flex-1">
                  <Label htmlFor="location" className="text-sm font-medium text-gray-700">Location</Label>
                  <Input
                    id="location"
                    value={userData.location}
                    onChange={(e) => setUserData({ ...userData, location: e.target.value })}
                    disabled={isLoading}
                    className="mt-1 focus:ring-2 focus:ring-gray-400 border-gray-200"
                  />
                </div>
              ) : (
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">Location</Label>
                  <p className="text-gray-900 mt-1">{userData.location || "Not provided"}</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-100">
              <div className="p-2 bg-gray-100 rounded-full">
                <Globe className="w-5 h-5 text-gray-700" />
              </div>
              {isEditing ? (
                <div className="flex-1">
                  <Label htmlFor="website" className="text-sm font-medium text-gray-700">Website</Label>
                  <Input
                    id="website"
                    value={userData.website}
                    onChange={(e) => setUserData({ ...userData, website: e.target.value })}
                    disabled={isLoading}
                    className="mt-1 focus:ring-2 focus:ring-gray-400 border-gray-200"
                  />
                </div>
              ) : (
                <div className="flex-1">
                  <Label className="text-sm font-medium text-gray-700">Website</Label>
                  <p className="text-gray-900 mt-1">{userData.website || "Not provided"}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-100">
            <div className="p-2 bg-gray-100 rounded-full mt-2">
              <FileText className="w-5 h-5 text-gray-700" />
            </div>
            {isEditing ? (
              <div className="flex-1">
                <Label htmlFor="bio" className="text-sm font-medium text-gray-700">Bio</Label>
                <Textarea
                  id="bio"
                  value={userData.bio}
                  onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                  disabled={isLoading}
                  rows={4}
                  className="mt-1 focus:ring-2 focus:ring-gray-400 border-gray-200"
                />
              </div>
            ) : (
              <div className="flex-1">
                <Label className="text-sm font-medium text-gray-700">Bio</Label>
                <p className="text-gray-900 mt-1 whitespace-pre-wrap">{userData.bio || "Not provided"}</p>
              </div>
            )}
          </div>

          {isEditing && (
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="transition-all hover:scale-105 hover:shadow-md border-gray-300"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={isLoading}
                className="transition-all hover:scale-105 hover:shadow-md bg-gray-900 hover:bg-gray-800"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-8 mb-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Link2 className="w-6 h-6 text-gray-700" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900">Connected Accounts</h2>
        </div>
        <div className="space-y-4">
          {["google", "microsoft", "apple"].map((provider) => (
            <div key={provider} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-full">
                  <Link2 className="w-5 h-5 text-gray-700" />
                </div>
                <span className="capitalize font-medium text-gray-900">{provider}</span>
              </div>
              {isProviderConnected(provider) ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDisconnectProvider(provider)}
                  className="transition-all hover:scale-105 hover:shadow-md border-gray-300 hover:bg-gray-100"
                >
                  <Unlink className="w-4 h-4 mr-2" />
                  Disconnect
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleConnectProvider(provider)}
                  className="transition-all hover:scale-105 hover:shadow-md border-gray-300 hover:bg-gray-100"
                >
                  <Link2 className="w-4 h-4 mr-2" />
                  Connect
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-8 border-red-100 bg-red-50 shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-red-100 rounded-lg">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Delete Account</h2>
            <p className="text-gray-500 mt-1">Permanently remove your account and all associated data</p>
          </div>
        </div>

        <div className="space-y-6">
          <Alert variant="destructive" className="border-red-200 bg-red-50">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <AlertDescription className="text-red-700">
              <p className="font-medium mb-2">Warning: This action is irreversible</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>All your personal data will be permanently deleted</li>
                <li>Your account will be immediately deactivated</li>
                <li>You will lose access to all services and features</li>
                <li>This action cannot be undone</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="bg-white p-6 rounded-lg border border-red-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Before you proceed</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <p>Please ensure you have:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>Backed up any important data you want to keep</li>
                <li>Downloaded any necessary information</li>
                <li>Considered alternative options like deactivating your account</li>
              </ul>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                className="w-full bg-red-600 hover:bg-red-700 focus-visible:ring-red-500 transition-all hover:scale-105 hover:shadow-md"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[425px]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-gray-900 flex items-center gap-2">
                  <Trash2 className="w-5 h-5 text-red-600" />
                  Confirm Account Deletion
                </AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="text-gray-600 space-y-4">
                    <div className="text-sm">
                      This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <div className="text-red-700 font-medium mb-2">Please type &quot;DELETE&quot; to confirm:</div>
                      <Input 
                        id="delete-confirmation" 
                        value={deleteConfirmation}
                        onChange={(e) => handleDeleteConfirmation(e.target.value)}
                        placeholder="Type DELETE to confirm"
                        className="border-red-200 focus:ring-red-500"
                      />
                      {deleteConfirmation && !isDeleteEnabled && (
                        <p className="text-red-500 text-sm mt-2">
                          Please type exactly &quot;DELETE&quot; to confirm
                        </p>
                      )}
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-gray-300 hover:bg-gray-100 transition-all hover:scale-105">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteAccount}
                  disabled={!isDeleteEnabled}
                  className={`transition-all hover:scale-105 ${
                    isDeleteEnabled 
                      ? "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500" 
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Yes, delete my account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>
    </div>
  );
} 