"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Building,
  Calendar,
  DollarSign,
  TrendingUp,
  Shield,
  Settings,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Plus,
  UserCheck,
  UserX,
  AlertTriangle,
  Save,
  RefreshCw,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navigation from "@/components/Navigation";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [userFilter, setUserFilter] = useState("all");
  const [pitchFilter, setPitchFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [allPitches, setAllPitches] = useState<any[]>([]);
  const [platformStats, setPlatformStats] = useState({
    totalUsers: 0,
    totalPitches: 0,
    totalBookings: 0,
    totalRevenue: 0,
    monthlyGrowth: 0,
    activeUsers: 0,
    newUsersToday: 0,
    pendingVerifications: 0,
    reportedIssues: 0,
  });
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    platformCommission: 10,
    cancellationHours: 24,
    autoApproveBookings: false,
    autoVerifyPitches: false,
    maintenanceMode: false,
    allowRegistrations: true,
    emailNotifications: true,
    smsNotifications: false,
    maxBookingDays: 30,
    minBookingHours: 1,
    maxBookingHours: 8,
    platformName: "FieldPlay",
    supportEmail: "support@fieldplay.com",
    currency: "USD",
  });

  useEffect(() => {
    // Check authentication and role
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (!currentUser.id) {
      window.location.href = "/auth/login";
      return;
    }
    if (currentUser.role !== "ADMIN") {
      // Redirect to appropriate dashboard
      if (currentUser.role === "USER") {
        window.location.href = "/dashboard/user";
      } else if (currentUser.role === "OWNER") {
        window.location.href = "/dashboard/owner";
      }
      return;
    }
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      // Fetch all users
      const usersResponse = await fetch("/api/admin/users");
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setAllUsers(usersData);
      }

      // Fetch all pitches
      const pitchesResponse = await fetch("/api/admin/pitches");
      if (pitchesResponse.ok) {
        const pitchesData = await pitchesResponse.json();
        setAllPitches(pitchesData);
      }

      // Fetch platform stats
      const statsResponse = await fetch("/api/admin/stats");
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setPlatformStats(statsData);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = allUsers.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`;
    const matchesSearch =
      fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      userFilter === "all" ||
      user.role === userFilter ||
      user.status === userFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredPitches = allPitches.filter((pitch) => {
    const matchesSearch =
      pitch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${pitch.owner?.firstName} ${pitch.owner?.lastName}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesFilter =
      pitchFilter === "all" ||
      pitch.status === pitchFilter ||
      pitch.type.toLowerCase() === pitchFilter;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "verified":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "suspended":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "OWNER":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "USER":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleUserAction = (action: string, user: any) => {
    setSelectedUser(user);
    switch (action) {
      case "edit":
        setIsEditUserOpen(true);
        break;
      case "delete":
        setIsDeleteUserOpen(true);
        break;
      case "verify":
        console.log("Verifying user:", user.email);
        break;
      case "suspend":
        console.log("Suspending user:", user.email);
        break;
      case "activate":
        console.log("Activating user:", user.email);
        break;
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert("Settings saved successfully!");
    }, 1000);
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p className="text-slate-600 text-lg">
              Platform management and oversight
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="destructive" className="px-3 py-1">
              <Shield className="h-3 w-3 mr-1" />
              Admin Access
            </Badge>
            <Button variant="outline" size="sm" onClick={fetchAdminData}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5 h-12 bg-white shadow-sm">
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-md justify-center"
            >
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>

            <TabsTrigger
              value="users"
              className="flex items-center gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-md justify-center"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>

            <TabsTrigger
              value="pitches"
              className="flex items-center gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-md justify-center"
            >
              <Building className="h-4 w-4" />
              <span className="hidden sm:inline">Pitches</span>
            </TabsTrigger>

            <TabsTrigger
              value="bookings"
              className="flex items-center gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-md justify-center"
            >
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Bookings</span>
            </TabsTrigger>

            <TabsTrigger
              value="settings"
              className="flex items-center gap-2 data-[state=active]:bg-green-500 data-[state=active]:text-white rounded-md justify-center"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Enhanced Platform Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700">
                        Total Users
                      </p>
                      <p className="text-3xl font-bold text-blue-900">
                        {platformStats.totalUsers.toLocaleString()}
                      </p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-sm text-green-600 font-medium">
                          +{platformStats.monthlyGrowth}% this month
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-200 rounded-full">
                      <Users className="h-8 w-8 text-blue-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-emerald-700">
                        Total Pitches
                      </p>
                      <p className="text-3xl font-bold text-emerald-900">
                        {platformStats.totalPitches}
                      </p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-sm text-green-600 font-medium">
                          +8 this month
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-emerald-200 rounded-full">
                      <Building className="h-8 w-8 text-emerald-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700">
                        Total Bookings
                      </p>
                      <p className="text-3xl font-bold text-purple-900">
                        {platformStats.totalBookings.toLocaleString()}
                      </p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-sm text-green-600 font-medium">
                          +15% this month
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-purple-200 rounded-full">
                      <Calendar className="h-8 w-8 text-purple-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700">
                        Platform Revenue
                      </p>
                      <p className="text-3xl font-bold text-green-900">
                        ${platformStats.totalRevenue.toLocaleString()}
                      </p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-sm text-green-600 font-medium">
                          +22% this month
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-green-200 rounded-full">
                      <DollarSign className="h-8 w-8 text-green-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl">Quick Actions</CardTitle>
                  <CardDescription>Common administrative tasks</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-green-50 hover:border-green-200"
                    >
                      <UserCheck className="h-6 w-6 text-green-600" />
                      <span className="text-sm font-medium">Verify Users</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-blue-50 hover:border-blue-200"
                    >
                      <Building className="h-6 w-6 text-blue-600" />
                      <span className="text-sm font-medium">
                        Approve Pitches
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-purple-50 hover:border-purple-200"
                    >
                      <Settings className="h-6 w-6 text-purple-600" />
                      <span className="text-sm font-medium">
                        System Settings
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-24 flex flex-col items-center justify-center gap-2 hover:bg-emerald-50 hover:border-emerald-200"
                    >
                      <TrendingUp className="h-6 w-6 text-emerald-600" />
                      <span className="text-sm font-medium">View Reports</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    System Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-yellow-800">
                          {platformStats.pendingVerifications} pending
                          verifications
                        </p>
                        <p className="text-xs text-yellow-600">
                          Requires attention
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-yellow-100 text-yellow-800"
                      >
                        {platformStats.pendingVerifications}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-red-800">
                          {platformStats.reportedIssues} reported issues
                        </p>
                        <p className="text-xs text-red-600">Needs review</p>
                      </div>
                      <Badge variant="destructive">
                        {platformStats.reportedIssues}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          {platformStats.newUsersToday} new users today
                        </p>
                        <p className="text-xs text-green-600">
                          Growing steadily
                        </p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {platformStats.newUsersToday}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            {/* User Management Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  User Management
                </h2>
                <p className="text-gray-600">
                  Manage platform users and their permissions
                </p>
              </div>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New User
              </Button>
            </div>

            {/* Filters and Search */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search users by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={userFilter} onValueChange={setUserFilter}>
                    <SelectTrigger className="w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter users" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="USER">Users</SelectItem>
                      <SelectItem value="OWNER">Owners</SelectItem>
                      <SelectItem value="ADMIN">Admins</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Users Table */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Users ({filteredUsers.length})</CardTitle>
                <CardDescription>
                  Detailed user information and management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>Activity</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white">
                                  {user.firstName[0]}
                                  {user.lastName[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-gray-900">
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getRoleColor(user.role)}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={getStatusColor(
                                user.verified ? "active" : "pending"
                              )}
                            >
                              {user.verified ? "active" : "pending"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-gray-600">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="text-gray-900">
                                {user._count?.bookings || 0} bookings
                              </div>
                              <div className="text-gray-500">
                                ${user.totalSpent || 0} spent
                              </div>
                              {user.role === "OWNER" && (
                                <div className="text-emerald-600">
                                  {user._count?.pitches || 0} pitches
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleUserAction("edit", user)}
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Profile
                                </DropdownMenuItem>
                                {!user.verified && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleUserAction("verify", user)
                                    }
                                    className="text-green-600"
                                  >
                                    <UserCheck className="h-4 w-4 mr-2" />
                                    Verify User
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleUserAction("delete", user)
                                  }
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pitches" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Pitch Management</CardTitle>
                <CardDescription>
                  Oversee all pitches on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Pitch Management
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Comprehensive pitch management interface
                  </p>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-4 w-4 mr-2" />
                    View All Pitches
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Booking Management</CardTitle>
                <CardDescription>
                  Monitor and manage all platform bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Booking Management
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Comprehensive booking management interface
                  </p>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-4 w-4 mr-2" />
                    View All Bookings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            {/* Platform Settings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* General Settings */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Basic platform configuration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="platformName">Platform Name</Label>
                    <Input
                      id="platformName"
                      value={settings.platformName}
                      onChange={(e) =>
                        handleSettingChange("platformName", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supportEmail">Support Email</Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) =>
                        handleSettingChange("supportEmail", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency</Label>
                    <Select
                      value={settings.currency}
                      onValueChange={(value) =>
                        handleSettingChange("currency", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="CAD">
                          CAD - Canadian Dollar
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Business Settings */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Business Settings</CardTitle>
                  <CardDescription>
                    Revenue and booking configuration
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="platformCommission">
                      Platform Commission (%)
                    </Label>
                    <Input
                      id="platformCommission"
                      type="number"
                      min="0"
                      max="50"
                      value={settings.platformCommission}
                      onChange={(e) =>
                        handleSettingChange(
                          "platformCommission",
                          parseInt(e.target.value)
                        )
                      }
                    />
                    <p className="text-xs text-gray-500">
                      Commission charged on each booking
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cancellationHours">
                      Cancellation Window (hours)
                    </Label>
                    <Input
                      id="cancellationHours"
                      type="number"
                      min="1"
                      max="168"
                      value={settings.cancellationHours}
                      onChange={(e) =>
                        handleSettingChange(
                          "cancellationHours",
                          parseInt(e.target.value)
                        )
                      }
                    />
                    <p className="text-xs text-gray-500">
                      Hours before booking for free cancellation
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxBookingDays">
                      Max Booking Days Ahead
                    </Label>
                    <Input
                      id="maxBookingDays"
                      type="number"
                      min="1"
                      max="365"
                      value={settings.maxBookingDays}
                      onChange={(e) =>
                        handleSettingChange(
                          "maxBookingDays",
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* System Settings */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>
                    Platform behavior and automation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoApproveBookings">
                        Auto-approve Bookings
                      </Label>
                      <p className="text-xs text-gray-500">
                        Automatically approve all booking requests
                      </p>
                    </div>
                    <Switch
                      id="autoApproveBookings"
                      checked={settings.autoApproveBookings}
                      onCheckedChange={(checked) =>
                        handleSettingChange("autoApproveBookings", checked)
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoVerifyPitches">
                        Auto-verify Pitches
                      </Label>
                      <p className="text-xs text-gray-500">
                        Automatically verify new pitch listings
                      </p>
                    </div>
                    <Switch
                      id="autoVerifyPitches"
                      checked={settings.autoVerifyPitches}
                      onCheckedChange={(checked) =>
                        handleSettingChange("autoVerifyPitches", checked)
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="allowRegistrations">
                        Allow Registrations
                      </Label>
                      <p className="text-xs text-gray-500">
                        Allow new user registrations
                      </p>
                    </div>
                    <Switch
                      id="allowRegistrations"
                      checked={settings.allowRegistrations}
                      onCheckedChange={(checked) =>
                        handleSettingChange("allowRegistrations", checked)
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                      <p className="text-xs text-gray-500">
                        Put platform in maintenance mode
                      </p>
                    </div>
                    <Switch
                      id="maintenanceMode"
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) =>
                        handleSettingChange("maintenanceMode", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Configure platform notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="emailNotifications">
                        Email Notifications
                      </Label>
                      <p className="text-xs text-gray-500">
                        Send email notifications to users
                      </p>
                    </div>
                    <Switch
                      id="emailNotifications"
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) =>
                        handleSettingChange("emailNotifications", checked)
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="smsNotifications">
                        SMS Notifications
                      </Label>
                      <p className="text-xs text-gray-500">
                        Send SMS notifications to users
                      </p>
                    </div>
                    <Switch
                      id="smsNotifications"
                      checked={settings.smsNotifications}
                      onCheckedChange={(checked) =>
                        handleSettingChange("smsNotifications", checked)
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Save Settings */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Save Changes
                    </h3>
                    <p className="text-sm text-gray-600">
                      Apply all configuration changes to the platform
                    </p>
                  </div>
                  <Button
                    onClick={handleSaveSettings}
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Settings
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit User Dialog */}
        <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit User</DialogTitle>
              <DialogDescription>
                Modify user information and permissions
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="editName">Name</Label>
                  <Input
                    id="editName"
                    defaultValue={`${selectedUser.firstName} ${selectedUser.lastName}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editEmail">Email</Label>
                  <Input
                    id="editEmail"
                    type="email"
                    defaultValue={selectedUser.email}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editRole">Role</Label>
                  <Select defaultValue={selectedUser.role}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USER">User</SelectItem>
                      <SelectItem value="OWNER">Owner</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditUserOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete User Dialog */}
        <AlertDialog open={isDeleteUserOpen} onOpenChange={setIsDeleteUserOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete User</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this user? This action cannot be
                undone.
                {selectedUser && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedUser.email}
                    </p>
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                Delete User
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
