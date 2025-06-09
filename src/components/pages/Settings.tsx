"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { 
  User, 
  Settings as SettingsIcon, 
  Shield, 
  Trash2, 
  Link2, 
  Bell, 
  Eye, 
  Globe, 
  Palette,
  Save,
  Edit,
  MapPin,
  Phone,
  Mail,
  CheckCircle,
  ExternalLink,
  AlertTriangle
} from "lucide-react";
import { toast } from "sonner";

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  avatar?: string;
  createdAt: string;
}

interface ConnectedAccount {
  id: string;
  provider: string;
  email: string;
  connectedAt: string;
}

interface SettingsProps {
  user: UserProfile;
  connectedAccounts: ConnectedAccount[];
  onUpdateProfile: (data: Partial<UserProfile>) => Promise<void>;
  onDisconnectAccount: (providerId: string) => Promise<void>;
  onDeleteAccount: () => Promise<void>;
}

const Settings: React.FC<SettingsProps> = ({
  user,
  connectedAccounts,
  onUpdateProfile,
  onDisconnectAccount,
  onDeleteAccount
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    location: user.location || ''
  });

  // Settings states
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    newListings: true,
    priceAlerts: true,
    weeklyDigest: false
  });

  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showPhone: true,
    showLocation: true,
    showEmail: false,
    searchIndexing: true
  });

  const [preferences, setPreferences] = useState({
    language: 'en',
    currency: 'DZD',
    distanceUnit: 'km',
    theme: 'light',
    emailFrequency: 'immediate'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      await onUpdateProfile(formData);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    toast.success("Notification preferences updated");
  };

  const handlePrivacyChange = (key: string, value: string | boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
    toast.success("Privacy settings updated");
  };

  const handlePreferenceChange = (key: string, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
    toast.success("Preferences updated");
  };

  const getProviderInfo = (provider: string) => {
    const providers: { [key: string]: { name: string, icon: string, color: string } } = {
      google: { name: 'Google', icon: '🔍', color: 'bg-red-100 text-red-700' },
      facebook: { name: 'Facebook', icon: '📘', color: 'bg-blue-100 text-blue-700' },
      github: { name: 'GitHub', icon: '🔗', color: 'bg-gray-100 text-gray-700' },
      apple: { name: 'Apple', icon: '🍎', color: 'bg-black text-white' },
      twitter: { name: 'Twitter', icon: '🐦', color: 'bg-blue-100 text-blue-700' }
    };
    return providers[provider.toLowerCase()] || { name: provider, icon: '🔗', color: 'bg-gray-100 text-gray-700' };
  };

  const handleDisconnect = async (accountId: string) => {
    try {
      await onDisconnectAccount(accountId);
      toast.success("Account disconnected successfully");
    } catch (error) {
      toast.error("Failed to disconnect account");
      console.error('Failed to disconnect account:', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await onDeleteAccount();
      toast.success("Account deleted successfully");
    } catch (error) {
      toast.error("Failed to delete account");
      console.error('Failed to delete account:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences for Kaarbi</p>
        </div>

        <Tabs defaultValue="account" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 h-auto p-1">
            <TabsTrigger value="account" className="flex items-center gap-2 py-3">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger value="connected" className="flex items-center gap-2 py-3">
              <Link2 className="h-4 w-4" />
              <span className="hidden sm:inline">Connected</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2 py-3">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2 py-3">
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2 py-3">
              <SettingsIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Preferences</span>
            </TabsTrigger>
            <TabsTrigger value="danger" className="flex items-center gap-2 py-3">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>

          {/* Account Information */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Account Information
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      Update your personal information and contact details
                    </p>
                  </div>
                  <Button
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                    disabled={isLoading}
                    variant={isEditing ? "default" : "outline"}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Saving...
                      </>
                    ) : isEditing ? (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Avatar Section */}
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                    <p className="text-gray-600">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
                    <Badge variant="secondary" className="mt-2">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified Account
                    </Badge>
                  </div>
                </div>

                <Separator />

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="+213 XXX XXX XXX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="City, Wilaya"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-3 pt-4 border-t">
                    <Button onClick={handleSaveProfile} disabled={isLoading}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: user.name,
                          email: user.email,
                          phone: user.phone || '',
                          location: user.location || ''
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Connected Accounts */}
          <TabsContent value="connected">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="h-5 w-5" />
                  Connected Accounts
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Manage your social media and third-party account connections
                </p>
              </CardHeader>
              <CardContent>
                {connectedAccounts.length > 0 ? (
                  <div className="space-y-4">
                    {connectedAccounts.map((account) => {
                      const providerInfo = getProviderInfo(account.provider);
                      return (
                        <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${providerInfo.color}`}>
                              <span className="text-lg">{providerInfo.icon}</span>
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{providerInfo.name}</h3>
                              <p className="text-sm text-gray-600">{account.email}</p>
                              <p className="text-xs text-gray-500">
                                Connected on {new Date(account.connectedAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDisconnect(account.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Disconnect
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Link2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Connected Accounts</h3>
                    <p className="text-gray-600 mb-6">Connect your social accounts for easier sign-in and enhanced security</p>
                    <Button>
                      <Link2 className="h-4 w-4 mr-2" />
                      Connect Account
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Configure how and when you want to receive notifications
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email Notifications */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    {Object.entries(notifications).map(([key, value]) => {
                      const labels: { [key: string]: { title: string, description: string } } = {
                        emailNotifications: {
                          title: 'Email Notifications',
                          description: 'Receive notifications via email'
                        },
                        pushNotifications: {
                          title: 'Push Notifications',
                          description: 'Receive push notifications in your browser'
                        },
                        marketingEmails: {
                          title: 'Marketing Emails',
                          description: 'Receive promotional emails and updates about new features'
                        },
                        newListings: {
                          title: 'New Listings',
                          description: 'Get notified when new cars matching your interests are listed'
                        },
                        priceAlerts: {
                          title: 'Price Alerts',
                          description: 'Receive alerts when car prices change significantly'
                        },
                        weeklyDigest: {
                          title: 'Weekly Digest',
                          description: 'Get a weekly summary of marketplace activity'
                        }
                      };

                      return (
                        <div key={key} className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label className="text-sm font-medium">
                              {labels[key]?.title || key}
                            </Label>
                            <p className="text-sm text-gray-600">
                              {labels[key]?.description || ''}
                            </p>
                          </div>
                          <Switch
                            checked={value}
                            onCheckedChange={(checked) => handleNotificationChange(key, checked)}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Separator />

                {/* Email Frequency */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Email Frequency</h3>
                  <div className="space-y-2">
                    <Label>How often would you like to receive email notifications?</Label>
                    <Select value={preferences.emailFrequency} onValueChange={(value) => handlePreferenceChange('emailFrequency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="hourly">Hourly digest</SelectItem>
                        <SelectItem value="daily">Daily digest</SelectItem>
                        <SelectItem value="weekly">Weekly digest</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Privacy Settings
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Control how your information is shared and displayed
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Visibility */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Visibility</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Who can see your profile?</Label>
                      <Select value={privacy.profileVisibility} onValueChange={(value) => handlePrivacyChange('profileVisibility', value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public - Anyone can see your profile</SelectItem>
                          <SelectItem value="limited">Limited - Only registered users</SelectItem>
                          <SelectItem value="private">Private - Only you can see your profile</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Contact Information Visibility */}
                    <div className="space-y-4 pt-4">
                      <h4 className="font-medium text-gray-900">Contact Information Visibility</h4>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium">Show Phone Number</Label>
                          <p className="text-sm text-gray-600">Display your phone number on listings</p>
                        </div>
                        <Switch
                          checked={privacy.showPhone}
                          onCheckedChange={(checked) => handlePrivacyChange('showPhone', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium">Show Location</Label>
                          <p className="text-sm text-gray-600">Display your location on listings</p>
                        </div>
                        <Switch
                          checked={privacy.showLocation}
                          onCheckedChange={(checked) => handlePrivacyChange('showLocation', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium">Show Email Address</Label>
                          <p className="text-sm text-gray-600">Display your email on public profile</p>
                        </div>
                        <Switch
                          checked={privacy.showEmail}
                          onCheckedChange={(checked) => handlePrivacyChange('showEmail', checked)}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <Label className="text-sm font-medium">Search Engine Indexing</Label>
                          <p className="text-sm text-gray-600">Allow search engines to index your profile</p>
                        </div>
                        <Switch
                          checked={privacy.searchIndexing}
                          onCheckedChange={(checked) => handlePrivacyChange('searchIndexing', checked)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SettingsIcon className="h-5 w-5" />
                  App Preferences
                </CardTitle>
                <p className="text-sm text-gray-600">
                  Customize your app experience and regional settings
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Language */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Language
                    </Label>
                    <Select value={preferences.language} onValueChange={(value) => handlePreferenceChange('language', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ar">العربية (Arabic)</SelectItem>
                        <SelectItem value="fr">Français (French)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Currency */}
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select value={preferences.currency} onValueChange={(value) => handlePreferenceChange('currency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DZD">DZD (Algerian Dinar)</SelectItem>
                        <SelectItem value="USD">USD (US Dollar)</SelectItem>
                        <SelectItem value="EUR">EUR (Euro)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Distance Unit */}
                  <div className="space-y-2">
                    <Label>Distance Unit</Label>
                    <Select value={preferences.distanceUnit} onValueChange={(value) => handlePreferenceChange('distanceUnit', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="km">Kilometers</SelectItem>
                        <SelectItem value="mi">Miles</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Theme */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Theme
                    </Label>
                    <Select value={preferences.theme} onValueChange={(value) => handlePreferenceChange('theme', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security & Danger Zone */}
          <TabsContent value="danger">
            <div className="space-y-6">
              {/* Security Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                  <p className="text-sm text-gray-600">
                    Manage your account security and authentication
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-between">
                    Change Password
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    Two-Factor Authentication
                    <Badge variant="secondary">Not Enabled</Badge>
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    Active Sessions
                    <Badge variant="outline">2 devices</Badge>
                  </Button>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    Danger Zone
                  </CardTitle>
                  <p className="text-sm text-red-600">
                    Irreversible and destructive actions
                  </p>
                </CardHeader>
                <CardContent>
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-700">
                      <strong>Warning:</strong> Deleting your account will permanently remove all your data, 
                      including listings, messages, and favorites. This action cannot be undone.
                    </AlertDescription>
                  </Alert>

                  <div className="mt-4">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="w-full">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete My Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="flex items-center gap-2 text-red-700">
                            <AlertTriangle className="h-5 w-5" />
                            Delete Account Confirmation
                          </AlertDialogTitle>
                          <AlertDialogDescription className="space-y-2">
                            <p>
                              Are you absolutely sure you want to delete your account? This will permanently:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm">
                              <li>Remove all your car listings</li>
                              <li>Delete all your messages and conversations</li>
                              <li>Remove your favorites and saved searches</li>
                              <li>Delete your profile and account data</li>
                            </ul>
                            <p className="font-medium text-red-600">
                              This action cannot be undone and your data cannot be recovered.
                            </p>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Yes, Delete My Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
