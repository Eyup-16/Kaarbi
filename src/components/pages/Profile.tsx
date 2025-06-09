"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useSession } from "@/lib/auth-client";
import { signOut } from "@/lib/auth-client";
import { 
  AlertCircle, 
  Edit2, 
  Save, 
  Trash2, 
  X, 
  Mail, 
  User, 
  Link2, 
  Unlink, 
  Phone, 
  Building2, 
  Globe, 
  MapPin, 
  FileText, 
  Upload,
  Shield,
  Activity,
  Settings,
  CheckCircle,
  Clock,
  LoaderCircle,
  Eye
} from "lucide-react";
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

interface ProfileStats {
  profileCompleteness: number;
  lastLogin: string;
  accountAge: number;
  connectedAccounts: number;
}

export default function ProfileEnhanced() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("overview");
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
  const [profileStats, setProfileStats] = useState<ProfileStats>({
    profileCompleteness: 0,
    lastLogin: "",
    accountAge: 0,
    connectedAccounts: 0
  });

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
      setPreviewImage(null);

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
            
            // Calculate profile stats
            const completeness = calculateProfileCompleteness({
              ...userData,
              phone: data.phone || "",
              company: data.company || "",
              bio: data.bio || "",
              location: data.location || "",
              website: data.website || ""
            });
            
            setProfileStats(prev => ({
              ...prev,
              profileCompleteness: completeness,
              lastLogin: new Date().toLocaleDateString(),
              accountAge: Math.floor((Date.now() - new Date(session.user.createdAt || Date.now()).getTime()) / (1000 * 60 * 60 * 24))
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
          setProfileStats(prev => ({
            ...prev,
            connectedAccounts: accounts.length
          }));
        }
      } catch (error) {
        console.error("Error fetching connected accounts:", error);
        toast.error("Failed to fetch connected accounts");
      }
    };

    fetchConnectedAccounts();
  }, []);

  const calculateProfileCompleteness = (data: UserData): number => {
    const fields = [data.name, data.email, data.phone, data.company, data.bio, data.location, data.website, data.image];
    const filledFields = fields.filter(field => field && field.trim() !== "").length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const handleEdit = () => {
    setPreviewImage(null);
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
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
        
        // Update profile completeness
        const completeness = calculateProfileCompleteness(updatedUser);
        setProfileStats(prev => ({
          ...prev,
          profileCompleteness: completeness
        }));
        
        toast.success("Profile updated successfully");
        setIsEditing(false);
        setPreviewImage(null);
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
    setPreviewImage(null);
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
        const accountsResponse = await fetch("/api/user/accounts");
        if (accountsResponse.ok) {
          const accounts = await accountsResponse.json();
          setConnectedAccounts(accounts);
          setProfileStats(prev => ({
            ...prev,
            connectedAccounts: accounts.length
          }));
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

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

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
        setPreviewImage(data.imageUrl);
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

  const getCompletenessColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600 bg-green-50";
    if (percentage >= 60) return "text-yellow-600 bg-yellow-50";
    return "text-red-600 bg-red-50";
  };

  const getCompletenessIcon = (percentage: number) => {
    if (percentage >= 80) return CheckCircle;
    if (percentage >= 60) return Clock;
    return AlertCircle;
  };

  if (isLoading && !userData.name) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoaderCircle className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Profile Management</h1>
          <p className="text-gray-500">Manage your account settings and preferences with admin-level controls</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="px-3 py-2 bg-blue-50 text-blue-700 border-blue-200">
            <User className="w-4 h-4 mr-2" />
            PROFILE
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Profile Complete</p>
              <p className={`text-3xl font-bold ${getCompletenessColor(profileStats.profileCompleteness).split(' ')[0]}`}>
                {profileStats.profileCompleteness}%
              </p>
            </div>
            {(() => {
              const Icon = getCompletenessIcon(profileStats.profileCompleteness);
              return <Icon className={`w-12 h-12 p-2 rounded-lg ${getCompletenessColor(profileStats.profileCompleteness)}`} />;
            })()}
          </div>
        </Card>
        
        <Card className="p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Connected Accounts</p>
              <p className="text-3xl font-bold text-gray-900">{profileStats.connectedAccounts}</p>
            </div>
            <Link2 className="w-12 h-12 text-purple-600 bg-purple-50 p-2 rounded-lg" />
          </div>
        </Card>
        
        <Card className="p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Account Age</p>
              <p className="text-3xl font-bold text-gray-900">{profileStats.accountAge}d</p>
            </div>
            <Activity className="w-12 h-12 text-indigo-600 bg-indigo-50 p-2 rounded-lg" />
          </div>
        </Card>
        
        <Card className="p-6 hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Last Login</p>
              <p className="text-lg font-bold text-gray-900">{profileStats.lastLogin}</p>
            </div>
            <Clock className="w-12 h-12 text-green-600 bg-green-50 p-2 rounded-lg" />
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
              <TabsTrigger value="account" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Account Info
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Privacy
              </TabsTrigger>
              <TabsTrigger value="danger" className="flex items-center gap-2">
                <Trash2 className="w-4 h-4" />
                Danger Zone
              </TabsTrigger>
            </TabsList>
            
            {activeTab === "account" && !isEditing && (
              <Button 
                variant="outline" 
                onClick={handleEdit} 
                className="flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </Button>
            )}
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <Card className="lg:col-span-2 p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                      {(previewImage || userData.image) ? (
                        <Image 
                          src={previewImage || userData.image} 
                          alt="Profile" 
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <User className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{userData.name}</h3>
                      <p className="text-gray-600">{userData.email}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {session?.user?.role || "USER"}
                        </Badge>
                        {session?.user?.emailVerified && (
                          <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Company</p>
                      <p className="font-medium">{userData.company || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Location</p>
                      <p className="font-medium">{userData.location || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Phone</p>
                      <p className="font-medium">{userData.phone || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Website</p>
                      <p className="font-medium">{userData.website || "Not provided"}</p>
                    </div>
                  </div>
                  
                  {userData.bio && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-gray-600 text-sm mb-2">Bio</p>
                        <p className="text-gray-900 text-sm">{userData.bio}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              
              {/* Quick Actions */}
              <Card className="p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("account")}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("security")}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Security Settings
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab("privacy")}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Privacy Controls
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Account Info Tab */}
          <TabsContent value="account" className="space-y-6">
            <Card className="p-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Image */}
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

                {/* Form Fields */}
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
                          className="mt-1 focus:ring-2 focus:ring-blue-400 border-gray-200"
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
                          className="mt-1 focus:ring-2 focus:ring-blue-400 border-gray-200"
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
                          className="mt-1 focus:ring-2 focus:ring-blue-400 border-gray-200"
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
                          className="mt-1 focus:ring-2 focus:ring-blue-400 border-gray-200"
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
                          className="mt-1 focus:ring-2 focus:ring-blue-400 border-gray-200"
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

                {/* Bio Field */}
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
                        className="mt-1 focus:ring-2 focus:ring-blue-400 border-gray-200"
                      />
                    </div>
                  ) : (
                    <div className="flex-1">
                      <Label className="text-sm font-medium text-gray-700">Bio</Label>
                      <p className="text-gray-900 mt-1 whitespace-pre-wrap">{userData.bio || "Not provided"}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
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
                      className="transition-all hover:scale-105 hover:shadow-md bg-blue-600 hover:bg-blue-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card className="p-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="w-5 h-5" />
                  Connected Accounts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {["google", "microsoft", "apple"].map((provider) => (
                  <div key={provider} className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-full">
                        <Link2 className="w-5 h-5 text-gray-700" />
                      </div>
                      <div>
                        <span className="capitalize font-medium text-gray-900">{provider}</span>
                        {isProviderConnected(provider) ? (
                          <p className="text-sm text-green-600">Connected</p>
                        ) : (
                          <p className="text-sm text-gray-500">Not connected</p>
                        )}
                      </div>
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Tab */}
          <TabsContent value="privacy" className="space-y-6">
            <Card className="p-6">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Privacy Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-900">Profile Visibility</h3>
                      <p className="text-sm text-gray-600">Control who can see your profile information</p>
                    </div>
                    <Badge variant="outline">Public</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg border border-gray-100">
                    <div>
                      <h3 className="font-medium text-gray-900">Email Notifications</h3>
                      <p className="text-sm text-gray-600">Receive notifications about account activity</p>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-200">Enabled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Danger Zone Tab */}
          <TabsContent value="danger" className="space-y-6">
            <Card className="p-6 border-red-100 bg-red-50">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <Trash2 className="w-5 h-5" />
                  Delete Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
