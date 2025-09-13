"use client";

import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Camera,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    location: "",
    avatar: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (!currentUser.id) {
      window.location.href = "/auth/login";
      return;
    }
    setUser(currentUser);
    setProfileData({
      firstName: currentUser.firstName || "",
      lastName: currentUser.lastName || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
      bio: currentUser.bio || "",
      location: currentUser.location || "",
      avatar: currentUser.avatar || "",
    });
  }, []);

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      // In a real app, this would make an API call
      console.log("Updating profile:", profileData);

      // Update localStorage
      const updatedUser = { ...user, ...profileData };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setUser(updatedUser);

      setTimeout(() => {
        setLoading(false);
        alert("Profile updated successfully!");
      }, 1000);
    } catch (error) {
      console.error("Error updating profile:", error);
      setLoading(false);
      alert("Error updating profile. Please try again.");
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert("Password must be at least 6 characters long!");
      return;
    }

    setLoading(true);
    try {
      // In a real app, this would make an API call
      console.log("Changing password");

      setTimeout(() => {
        setLoading(false);
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        alert("Password changed successfully!");
      }, 1000);
    } catch (error) {
      console.error("Error changing password:", error);
      setLoading(false);
      alert("Error changing password. Please try again.");
    }
  };

  const handleAvatarUpload = () => {
    // In a real app, this would handle file upload
    const sampleAvatars = [
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    ];
    const randomAvatar =
      sampleAvatars[Math.floor(Math.random() * sampleAvatars.length)];
    setProfileData((prev) => ({ ...prev, avatar: randomAvatar }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-24 h-24">
                    <AvatarImage
                      src={profileData.avatar}
                      alt={`${profileData.firstName} ${profileData.lastName}`}
                    />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white">
                      {profileData.firstName[0]}
                      {profileData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                    onClick={handleAvatarUpload}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {profileData.firstName} {profileData.lastName}
                </h3>
                <p className="text-gray-600 mb-3">{profileData.email}</p>

                <Badge
                  className={`${
                    user.role === "ADMIN"
                      ? "bg-purple-100 text-purple-800"
                      : user.role === "OWNER"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {user.role}
                </Badge>

                <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                  <div className="flex items-center justify-center mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    Joined{" "}
                    {new Date(
                      user.createdAt || Date.now()
                    ).toLocaleDateString()}
                  </div>
                  {user.verified && (
                    <div className="flex items-center justify-center text-emerald-600">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                      Verified Account
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile Information</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2 text-emerald-600" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal information and profile details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profileData.firstName}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              firstName: e.target.value,
                            }))
                          }
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profileData.lastName}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              lastName: e.target.value,
                            }))
                          }
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="mt-1"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              phone: e.target.value,
                            }))
                          }
                          placeholder="+855 (015) 123-4567"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={(e) =>
                            setProfileData((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                          placeholder="City, State"
                          className="mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            bio: e.target.value,
                          }))
                        }
                        placeholder="Tell us about yourself..."
                        className="mt-1"
                        rows={4}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={handleProfileUpdate}
                        disabled={loading}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your password and security preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative mt-1">
                        <Input
                          id="currentPassword"
                          type={showPasswords.current ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={(e) =>
                            setPasswordData((prev) => ({
                              ...prev,
                              currentPassword: e.target.value,
                            }))
                          }
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords((prev) => ({
                              ...prev,
                              current: !prev.current,
                            }))
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.current ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative mt-1">
                        <Input
                          id="newPassword"
                          type={showPasswords.new ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={(e) =>
                            setPasswordData((prev) => ({
                              ...prev,
                              newPassword: e.target.value,
                            }))
                          }
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords((prev) => ({
                              ...prev,
                              new: !prev.new,
                            }))
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.new ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">
                        Confirm New Password
                      </Label>
                      <div className="relative mt-1">
                        <Input
                          id="confirmPassword"
                          type={showPasswords.confirm ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={(e) =>
                            setPasswordData((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }))
                          }
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowPasswords((prev) => ({
                              ...prev,
                              confirm: !prev.confirm,
                            }))
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords.confirm ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        onClick={handlePasswordChange}
                        disabled={
                          loading ||
                          !passwordData.currentPassword ||
                          !passwordData.newPassword ||
                          !passwordData.confirmPassword
                        }
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Changing...
                          </>
                        ) : (
                          "Change Password"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
