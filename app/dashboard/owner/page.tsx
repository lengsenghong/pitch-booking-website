"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  Eye,
  Edit,
  MoreHorizontal,
  Star,
  Building,
  Upload,
  X,
  Save,
  MapPin,
  Clock,
  Wifi,
  Car,
  ShirtIcon,
  Coffee,
  Package,
  Camera,
  Droplets,
  Settings,
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navigation from "@/components/Navigation";

interface Pitch {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  type: "INDOOR" | "OUTDOOR";
  surface: string;
  size: string;
  dimensions: string;
  capacity: number;
  pricePerHour: number;
  isActive: boolean;
  isVerified: boolean;
  images: { url: string; alt?: string }[];
  bookings: any[];
  reviews: any[];
  amenities: { name: string; icon?: string }[];
}

interface NewPitch {
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  type: "INDOOR" | "OUTDOOR" | "";
  surface: string;
  size: string;
  dimensions: string;
  capacity: string;
  pricePerHour: string;
  amenities: string[];
  images: string[];
}

export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [myPitches, setMyPitches] = useState<Pitch[]>([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    activePitches: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isAddPitchOpen, setIsAddPitchOpen] = useState(false);
  const [isEditPitchOpen, setIsEditPitchOpen] = useState(false);
  const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(null);
  const [newPitch, setNewPitch] = useState<NewPitch>({
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    type: "",
    surface: "",
    size: "",
    dimensions: "",
    capacity: "",
    pricePerHour: "",
    amenities: [],
    images: [],
  });
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const amenityOptions = [
    { id: "parking", name: "Free Parking", icon: "Car" },
    { id: "changing", name: "Changing Rooms", icon: "ShirtIcon" },
    { id: "showers", name: "Showers", icon: "Droplets" },
    { id: "floodlights", name: "Floodlights", icon: "Clock" },
    { id: "wifi", name: "WiFi", icon: "Wifi" },
    { id: "refreshments", name: "Refreshments", icon: "Coffee" },
    { id: "equipment", name: "Equipment Rental", icon: "Package" },
    { id: "photography", name: "Photography Area", icon: "Camera" },
  ];

  useEffect(() => {
    // Check authentication and role
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (!currentUser.id) {
      window.location.href = "/auth/login";
      return;
    }
    if (currentUser.role !== "OWNER") {
      // Redirect to appropriate dashboard
      if (currentUser.role === "USER") {
        window.location.href = "/dashboard/user";
      } else if (currentUser.role === "ADMIN") {
        window.location.href = "/dashboard/admin";
      }
      return;
    }
    fetchOwnerData();
  }, []);

  const fetchOwnerData = async () => {
    try {
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}"
      );
      if (!currentUser.id) {
        console.log("No owner found in localStorage");
        setLoading(false);
        return;
      }

      console.log("Fetching data for owner:", currentUser);
      // Fetch owner's pitches
      const pitchesResponse = await fetch(
        `/api/owners/${currentUser.id}/pitches`
      );
      if (pitchesResponse.ok) {
        const pitchesData = await pitchesResponse.json();
        setMyPitches(pitchesData);

        // Calculate stats
        const totalRevenue = pitchesData.reduce(
          (sum: number, pitch: any) =>
            sum +
            pitch.bookings.reduce(
              (bookingSum: number, booking: any) =>
                bookingSum + Number(booking.totalAmount),
              0
            ),
          0
        );

        const totalBookings = pitchesData.reduce(
          (sum: number, pitch: any) => sum + pitch.bookings.length,
          0
        );

        const activePitches = pitchesData.filter(
          (pitch: any) => pitch.isActive
        ).length;

        const allReviews = pitchesData.flatMap((pitch: any) => pitch.reviews);
        const averageRating =
          allReviews.length > 0
            ? allReviews.reduce(
                (sum: number, review: any) => sum + review.rating,
                0
              ) / allReviews.length
            : 0;

        setStats({
          totalRevenue,
          totalBookings,
          activePitches,
          averageRating: Number(averageRating.toFixed(1)),
        });

        // Get recent bookings
        const allBookings = pitchesData
          .flatMap((pitch: any) =>
            pitch.bookings.map((booking: any) => ({
              ...booking,
              pitchName: pitch.name,
            }))
          )
          .sort(
            (a: any, b: any) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        setRecentBookings(allBookings.slice(0, 10));
      }
    } catch (error) {
      console.error("Error fetching owner data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPitch = async () => {
    try {
      setLoading(true);
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}"
      );

      const pitchData = {
        ...newPitch,
        capacity: parseInt(newPitch.capacity),
        pricePerHour: parseFloat(newPitch.pricePerHour),
        ownerId: currentUser.id,
        images: uploadedImages,
        amenities: newPitch.amenities,
      };

      const response = await fetch("/api/pitches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pitchData),
      });

      if (!response.ok) {
        throw new Error("Failed to create pitch");
      }

      const createdPitch = await response.json();
      console.log("Pitch created successfully:", createdPitch);

      // Reset form and refresh data
      setIsAddPitchOpen(false);
      setNewPitch({
        name: "",
        description: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        type: "",
        surface: "",
        size: "",
        dimensions: "",
        capacity: "",
        pricePerHour: "",
        amenities: [],
        images: [],
      });
      setUploadedImages([]);
      fetchOwnerData(); // Refresh data
      alert(
        "Pitch added successfully! Your pitch is now live and available for booking."
      );
    } catch (error) {
      console.error("Error adding pitch:", error);
      alert("Error adding pitch. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditPitch = (pitch: Pitch) => {
    setSelectedPitch(pitch);
    setIsEditPitchOpen(true);
  };

  const handleUpdatePitch = async () => {
    if (!selectedPitch) return;

    try {
      setLoading(true);
      // In a real app, this would make an API call
      console.log("Updating pitch:", selectedPitch);

      setTimeout(() => {
        setIsEditPitchOpen(false);
        setSelectedPitch(null);
        fetchOwnerData(); // Refresh data
        alert("Pitch updated successfully!");
      }, 1000);
    } catch (error) {
      console.error("Error updating pitch:", error);
      alert("Error updating pitch. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePitchStatus = async (
    pitchId: string,
    isActive: boolean
  ) => {
    try {
      // In a real app, this would make an API call
      console.log(
        `${isActive ? "Activating" : "Deactivating"} pitch:`,
        pitchId
      );

      // Update local state
      setMyPitches((prev) =>
        prev.map((pitch) =>
          pitch.id === pitchId ? { ...pitch, isActive } : pitch
        )
      );

      alert(`Pitch ${isActive ? "activated" : "deactivated"} successfully!`);
    } catch (error) {
      console.error("Error toggling pitch status:", error);
      alert("Error updating pitch status. Please try again.");
    }
  };

  const handleAmenityToggle = (amenityId: string) => {
    setNewPitch((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((id) => id !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    // Convert files to base64 or use sample images for demo
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImages((prev) => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (indexToRemove: number) => {
    setUploadedImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
  };

  const addSampleImages = () => {
    // Add sample images for demo purposes
    const sampleImages = [
      "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg",
      "https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg",
      "https://images.pexels.com/photos/1171084/pexels-photo-1171084.jpeg",
      "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg",
    ];
    setUploadedImages((prev) => [...prev, ...sampleImages.slice(0, 3)]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-blue-100 text-blue-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
              Owner Dashboard
            </h1>
            <p className="text-slate-600 text-lg">
              Manage your pitches and bookings
            </p>
          </div>
          <Button
            onClick={() => setIsAddPitchOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 shadow-lg"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Pitch
          </Button>
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
            {/* Revenue Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700">
                        Total Revenue
                      </p>
                      <p className="text-3xl font-bold text-green-900">
                        ${stats.totalRevenue}
                      </p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-sm text-green-600 font-medium">
                          +12% from last month
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-green-200 rounded-full">
                      <DollarSign className="h-8 w-8 text-green-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700">
                        Bookings
                      </p>
                      <p className="text-3xl font-bold text-blue-900">
                        {stats.totalBookings}
                      </p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-sm text-green-600 font-medium">
                          +8% from last month
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-200 rounded-full">
                      <Calendar className="h-8 w-8 text-blue-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700">
                        Active Pitches
                      </p>
                      <p className="text-3xl font-bold text-purple-900">
                        {stats.activePitches}
                      </p>
                      <p className="text-sm text-purple-600 mt-2">
                        All operational
                      </p>
                    </div>
                    <div className="p-3 bg-purple-200 rounded-full">
                      <Building className="h-8 w-8 text-purple-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-700">
                        Avg Rating
                      </p>
                      <p className="text-3xl font-bold text-yellow-900">
                        {stats.averageRating}
                      </p>
                      <p className="text-sm text-yellow-600 mt-2">
                        Excellent rating
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-200 rounded-full">
                      <Star className="h-8 w-8 text-yellow-700" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Recent Bookings</CardTitle>
                <CardDescription>
                  Latest reservations for your pitches
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">
                          Loading bookings...
                        </p>
                      </div>
                    ) : recentBookings.length === 0 ? (
                      <div className="text-center py-12">
                        <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          No bookings yet
                        </h3>
                        <p className="text-gray-600">
                          Bookings will appear here once customers start booking
                          your pitches
                        </p>
                      </div>
                    ) : (
                      recentBookings.slice(0, 5).map((booking: any) => (
                        <div
                          key={booking.id}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border"
                        >
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white">
                                {booking.user?.firstName?.[0]}
                                {booking.user?.lastName?.[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">
                                {booking.user?.firstName}{" "}
                                {booking.user?.lastName}
                              </p>
                              <p className="text-sm text-gray-600">
                                {booking.pitchName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(
                                  booking.bookingDate
                                ).toLocaleDateString()}{" "}
                                • {booking.startTime}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                            <div className="text-lg font-semibold text-gray-900 mt-1">
                              ${Number(booking.totalAmount)}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pitches" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {loading ? (
                Array.from({ length: 2 }).map((_, index) => (
                  <Card
                    key={index}
                    className="animate-pulse border-0 shadow-lg"
                  >
                    <div className="aspect-video bg-gray-200 rounded-t-lg"></div>
                    <CardHeader>
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-20 bg-gray-200 rounded mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))
              ) : myPitches.length === 0 ? (
                <div className="col-span-2 text-center py-16">
                  <Building className="h-20 w-20 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    No pitches yet
                  </h3>
                  <p className="text-gray-600 mb-8 text-lg">
                    Add your first pitch to start receiving bookings
                  </p>
                  <Button
                    onClick={() => setIsAddPitchOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 px-8 py-3"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Your First Pitch
                  </Button>
                </div>
              ) : (
                myPitches.map((pitch: any) => (
                  <Card
                    key={pitch.id}
                    className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
                  >
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <img
                        src={
                          pitch.images?.[0]?.url ||
                          "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg"
                        }
                        alt={pitch.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge
                          className={
                            pitch.isActive
                              ? "bg-emerald-600 hover:bg-emerald-600"
                              : "bg-gray-600 hover:bg-gray-600"
                          }
                        >
                          {pitch.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="absolute top-4 right-4">
                        <Badge
                          className={
                            pitch.isVerified
                              ? "bg-blue-600 hover:bg-blue-600"
                              : "bg-yellow-600 hover:bg-yellow-600"
                          }
                        >
                          {pitch.isVerified ? "Verified" : "Pending"}
                        </Badge>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl">
                            {pitch.name}
                          </CardTitle>
                          <CardDescription className="text-base">
                            {pitch.type === "INDOOR" ? "Indoor" : "Outdoor"} •{" "}
                            {pitch.size}
                          </CardDescription>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditPitch(pitch)}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Public Page
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Calendar className="h-4 w-4 mr-2" />
                              Manage Availability
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleTogglePitchStatus(
                                  pitch.id,
                                  !pitch.isActive
                                )
                              }
                              className={
                                pitch.isActive
                                  ? "text-red-600"
                                  : "text-green-600"
                              }
                            >
                              {pitch.isActive ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="text-center p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
                          <div className="text-2xl font-bold text-gray-900">
                            {pitch.bookings?.length || 0}
                          </div>
                          <div className="text-sm text-gray-600">Bookings</div>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg">
                          <div className="text-2xl font-bold text-emerald-700">
                            $
                            {pitch.bookings?.reduce(
                              (sum: number, booking: any) =>
                                sum + Number(booking.totalAmount),
                              0
                            ) || 0}
                          </div>
                          <div className="text-sm text-emerald-600">
                            Revenue
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Star className="h-5 w-5 text-yellow-400 fill-current" />
                          <span className="ml-2 font-semibold text-lg">
                            {pitch.reviews?.length > 0
                              ? (
                                  pitch.reviews.reduce(
                                    (sum: number, review: any) =>
                                      sum + review.rating,
                                    0
                                  ) / pitch.reviews.length
                                ).toFixed(1)
                              : "0.0"}
                          </span>
                          <span className="text-gray-500 ml-1">
                            ({pitch.reviews?.length || 0})
                          </span>
                        </div>
                        <div className="text-xl font-bold text-gray-900">
                          ${Number(pitch.pricePerHour)}/hr
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">All Bookings</CardTitle>
                <CardDescription>Manage customer reservations</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Pitch</TableHead>
                        <TableHead>Date & Time</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">
                              Loading bookings...
                            </p>
                          </TableCell>
                        </TableRow>
                      ) : recentBookings.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-12">
                            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                              No bookings yet
                            </h3>
                            <p className="text-gray-600">
                              Customer bookings will appear here
                            </p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        recentBookings.map((booking: any) => (
                          <TableRow
                            key={booking.id}
                            className="hover:bg-gray-50"
                          >
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <Avatar>
                                  <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-emerald-600 text-white">
                                    {booking.user?.firstName?.[0]}
                                    {booking.user?.lastName?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className="font-medium">
                                    {booking.user?.firstName}{" "}
                                    {booking.user?.lastName}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {booking.user?.email}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              {booking.pitchName}
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {new Date(
                                    booking.bookingDate
                                  ).toLocaleDateString()}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {booking.startTime} - {booking.endTime}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="font-semibold text-lg">
                              ${Number(booking.totalAmount)}
                            </TableCell>
                            <TableCell>
                              <Badge className={getStatusColor(booking.status)}>
                                {booking.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View Details
                                  </DropdownMenuItem>
                                  {booking.status === "PENDING" && (
                                    <>
                                      <DropdownMenuItem className="text-green-600">
                                        <Users className="h-4 w-4 mr-2" />
                                        Approve
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="text-red-600">
                                        <X className="h-4 w-4 mr-2" />
                                        Decline
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  <DropdownMenuItem>
                                    <MapPin className="h-4 w-4 mr-2" />
                                    Contact Customer
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100">
                <CardHeader>
                  <CardTitle className="text-lg text-emerald-800">
                    Revenue Trend
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-emerald-700 mb-2">
                    ${stats.totalRevenue}
                  </div>
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +12% vs last month
                  </div>
                  <Progress value={75} className="mt-4" />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                <CardHeader>
                  <CardTitle className="text-lg text-blue-800">
                    Booking Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-blue-700 mb-2">
                    {stats.totalBookings > 0 ? "78%" : "0%"}
                  </div>
                  <div className="text-sm text-blue-600">Average occupancy</div>
                  <Progress value={78} className="mt-4" />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
                <CardHeader>
                  <CardTitle className="text-lg text-yellow-800">
                    Customer Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-yellow-700 mb-2">
                    {stats.averageRating}
                  </div>
                  <div className="text-sm text-yellow-600">
                    Based on{" "}
                    {myPitches.reduce(
                      (sum: number, pitch: any) =>
                        sum + (pitch.reviews?.length || 0),
                      0
                    )}{" "}
                    reviews
                  </div>
                  <Progress value={stats.averageRating * 20} className="mt-4" />
                </CardContent>
              </Card>
            </div>

            {/* Performance by Pitch */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">Pitch Performance</CardTitle>
                <CardDescription>
                  Revenue and booking data by facility
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                        <p className="mt-2 text-gray-600">
                          Loading performance data...
                        </p>
                      </div>
                    ) : myPitches.length === 0 ? (
                      <div className="text-center py-12">
                        <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          No pitch data
                        </h3>
                        <p className="text-gray-600">
                          Add pitches to see performance analytics
                        </p>
                      </div>
                    ) : (
                      myPitches.map((pitch: any) => (
                        <div
                          key={pitch.id}
                          className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border"
                        >
                          <div className="flex items-center space-x-4">
                            <img
                              src={
                                pitch.images?.[0]?.url ||
                                "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg"
                              }
                              alt={pitch.name}
                              className="w-16 h-16 object-cover rounded-lg shadow-md"
                            />
                            <div>
                              <h3 className="font-semibold text-lg text-gray-900">
                                {pitch.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {pitch.type === "INDOOR" ? "Indoor" : "Outdoor"}{" "}
                                • {pitch.size}
                              </p>
                              <div className="flex items-center mt-1">
                                <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                                <span className="text-sm text-gray-600">
                                  {pitch.reviews?.length > 0
                                    ? (
                                        pitch.reviews.reduce(
                                          (sum: number, review: any) =>
                                            sum + review.rating,
                                          0
                                        ) / pitch.reviews.length
                                      ).toFixed(1)
                                    : "0.0"}{" "}
                                  ({pitch.reviews?.length || 0} reviews)
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-2xl font-bold text-emerald-600">
                              $
                              {pitch.bookings?.reduce(
                                (sum: number, booking: any) =>
                                  sum + Number(booking.totalAmount),
                                0
                              ) || 0}
                            </div>
                            <div className="text-sm text-gray-600">
                              {pitch.bookings?.length || 0} bookings
                            </div>
                            <Progress
                              value={Math.min(
                                (pitch.bookings?.length || 0) * 10,
                                100
                              )}
                              className="mt-2 w-24"
                            />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Pitch Dialog */}
        <Dialog open={isAddPitchOpen} onOpenChange={setIsAddPitchOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Add New Pitch</DialogTitle>
              <DialogDescription className="text-base">
                Create a new pitch listing for your facility
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="max-h-[70vh] pr-4">
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Pitch Name *</Label>
                    <Input
                      id="name"
                      value={newPitch.name}
                      onChange={(e) =>
                        setNewPitch((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="e.g., Elite Sports Center"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Pitch Type *</Label>
                    <Select
                      value={newPitch.type}
                      onValueChange={(value: "INDOOR" | "OUTDOOR") =>
                        setNewPitch((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INDOOR">Indoor</SelectItem>
                        <SelectItem value="OUTDOOR">Outdoor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={newPitch.description}
                    onChange={(e) =>
                      setNewPitch((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe your pitch, its features, and what makes it special..."
                    rows={3}
                  />
                </div>

                {/* Address */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      value={newPitch.address}
                      onChange={(e) =>
                        setNewPitch((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      placeholder="123 Main Street"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={newPitch.city}
                      onChange={(e) =>
                        setNewPitch((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      placeholder="Your City"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={newPitch.state}
                      onChange={(e) =>
                        setNewPitch((prev) => ({
                          ...prev,
                          state: e.target.value,
                        }))
                      }
                      placeholder="CA"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={newPitch.zipCode}
                      onChange={(e) =>
                        setNewPitch((prev) => ({
                          ...prev,
                          zipCode: e.target.value,
                        }))
                      }
                      placeholder="12345"
                    />
                  </div>
                </div>

                {/* Pitch Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="surface">Surface Type *</Label>
                    <Select
                      value={newPitch.surface}
                      onValueChange={(value) =>
                        setNewPitch((prev) => ({ ...prev, surface: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select surface" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NATURAL_GRASS">
                          Natural Grass
                        </SelectItem>
                        <SelectItem value="ARTIFICIAL_GRASS">
                          Artificial Grass
                        </SelectItem>
                        <SelectItem value="SYNTHETIC_TURF">
                          Synthetic Turf
                        </SelectItem>
                        <SelectItem value="CONCRETE">Concrete</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="size">Pitch Size *</Label>
                    <Select
                      value={newPitch.size}
                      onValueChange={(value) =>
                        setNewPitch((prev) => ({ ...prev, size: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5v5">5v5</SelectItem>
                        <SelectItem value="7v7">7v7</SelectItem>
                        <SelectItem value="9v9">9v9</SelectItem>
                        <SelectItem value="11v11">11v11</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Max Players *</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={newPitch.capacity}
                      onChange={(e) =>
                        setNewPitch((prev) => ({
                          ...prev,
                          capacity: e.target.value,
                        }))
                      }
                      placeholder="22"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dimensions">Dimensions</Label>
                    <Input
                      id="dimensions"
                      value={newPitch.dimensions}
                      onChange={(e) =>
                        setNewPitch((prev) => ({
                          ...prev,
                          dimensions: e.target.value,
                        }))
                      }
                      placeholder="e.g., 100m x 60m"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pricePerHour">Price per Hour (USD) *</Label>
                    <Input
                      id="pricePerHour"
                      type="number"
                      value={newPitch.pricePerHour}
                      onChange={(e) =>
                        setNewPitch((prev) => ({
                          ...prev,
                          pricePerHour: e.target.value,
                        }))
                      }
                      placeholder="75"
                    />
                  </div>
                </div>

                {/* Amenities */}
                <div className="space-y-4">
                  <Label>Amenities & Features</Label>
                  <p className="text-sm text-gray-500">
                    Select all amenities available at your facility
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {amenityOptions.map((amenity) => (
                      <div
                        key={amenity.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          newPitch.amenities.includes(amenity.id)
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleAmenityToggle(amenity.id)}
                      >
                        <div className="flex items-center">
                          <Checkbox
                            checked={newPitch.amenities.includes(amenity.id)}
                            onChange={() => handleAmenityToggle(amenity.id)}
                            className="mr-2"
                          />
                          <span className="text-sm font-medium">
                            {amenity.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Photo Upload */}
                <div className="space-y-4">
                  <Label>Pitch Photos</Label>
                  <div className="space-y-4">
                    {/* Image Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">
                        Upload high-quality photos of your pitch
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        Recommended: 5-10 photos, minimum 1200x800px
                      </p>
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="outline"
                          onClick={() =>
                            document.getElementById("image-upload")?.click()
                          }
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Upload Photos
                        </Button>
                        <Button variant="outline" onClick={addSampleImages}>
                          <Camera className="h-4 w-4 mr-2" />
                          Add Sample Images
                        </Button>
                      </div>
                      <input
                        id="image-upload"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>

                    {/* Image Preview Grid */}
                    {uploadedImages.length > 0 && (
                      <div>
                        <Label className="text-sm font-medium">
                          Uploaded Images ({uploadedImages.length})
                        </Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                          {uploadedImages.map((imageUrl, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={imageUrl}
                                alt={`Pitch image ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-gray-200 shadow-md hover:shadow-lg transition-shadow"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-lg"
                              >
                                <X className="h-3 w-3" />
                              </button>
                              {index === 0 && (
                                <div className="absolute bottom-2 left-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full shadow-md">
                                  Main
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          First image will be used as the main display image
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>

            <Separator />

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsAddPitchOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddPitch}
                disabled={
                  loading ||
                  !newPitch.name ||
                  !newPitch.type ||
                  !newPitch.pricePerHour ||
                  uploadedImages.length === 0
                }
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                {loading ? "Adding..." : "Add Pitch"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Pitch Dialog */}
        <Dialog open={isEditPitchOpen} onOpenChange={setIsEditPitchOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl">Edit Pitch</DialogTitle>
              <DialogDescription>
                Update your pitch information
              </DialogDescription>
            </DialogHeader>
            {selectedPitch && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="editName">Pitch Name</Label>
                  <Input
                    id="editName"
                    value={selectedPitch.name}
                    onChange={(e) =>
                      setSelectedPitch((prev) =>
                        prev ? { ...prev, name: e.target.value } : null
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editDescription">Description</Label>
                  <Textarea
                    id="editDescription"
                    value={selectedPitch.description}
                    onChange={(e) =>
                      setSelectedPitch((prev) =>
                        prev ? { ...prev, description: e.target.value } : null
                      )
                    }
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editPrice">Price per Hour</Label>
                  <Input
                    id="editPrice"
                    type="number"
                    value={selectedPitch.pricePerHour}
                    onChange={(e) =>
                      setSelectedPitch((prev) =>
                        prev
                          ? {
                              ...prev,
                              pricePerHour: parseFloat(e.target.value),
                            }
                          : null
                      )
                    }
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={selectedPitch.isActive}
                    onCheckedChange={(checked) =>
                      setSelectedPitch((prev) =>
                        prev ? { ...prev, isActive: checked } : null
                      )
                    }
                  />
                  <Label>Active (visible to customers)</Label>
                </div>

                <Separator />

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditPitchOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdatePitch}
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {loading ? "Updating..." : "Update Pitch"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
