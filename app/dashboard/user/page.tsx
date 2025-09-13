"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Star,
  MoreHorizontal,
  Filter,
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
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import AnimatedGradientText from "@/components/magicui/animated-gradient-text";
import ShimmerButton from "@/components/magicui/shimmer-button";
import WordRotate from "@/components/magicui/word-rotate";
import Link from "next/link";
import Navigation from "@/components/Navigation";

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [pastBookings, setPastBookings] = useState<any[]>([]);
  const [stats, setStats] = useState({
    upcoming: 0,
    thisMonth: 0,
    totalSpent: 0,
    favoriteVenue: "N/A",
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check authentication and role
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (!currentUser.id) {
      window.location.href = "/auth/login";
      return;
    }
    if (currentUser.role !== "USER") {
      // Redirect to appropriate dashboard
      if (currentUser.role === "OWNER") {
        window.location.href = "/dashboard/owner";
      } else if (currentUser.role === "ADMIN") {
        window.location.href = "/dashboard/admin";
      }
      return;
    }
    setUser(currentUser);
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const currentUser = JSON.parse(
        localStorage.getItem("currentUser") || "{}"
      );
      if (!currentUser.id) {
        console.log("No user found in localStorage");
        setLoading(false);
        return;
      }

      // Try to fetch from API first, fallback to localStorage
      try {
        const response = await fetch(`/api/users/${currentUser.id}/bookings`);
        if (response.ok) {
          const data = await response.json();
          processBookingsData(data);
        } else {
          // Fallback to localStorage bookings
          loadBookingsFromLocalStorage(currentUser);
        }
      } catch (error) {
        console.log("API not available, using localStorage");
        loadBookingsFromLocalStorage(currentUser);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadBookingsFromLocalStorage = (currentUser: any) => {
    // Check for bookings in localStorage (for demo purposes)
    const storedBookings = localStorage.getItem(`bookings_${currentUser.id}`);
    if (storedBookings) {
      try {
        const bookings = JSON.parse(storedBookings);
        processBookingsData(bookings);
      } catch (error) {
        console.error("Error parsing stored bookings:", error);
        setStats({
          upcoming: 0,
          thisMonth: 0,
          totalSpent: 0,
          favoriteVenue: "N/A",
        });
      }
    } else {
      // No bookings found
      setStats({
        upcoming: 0,
        thisMonth: 0,
        totalSpent: 0,
        favoriteVenue: "N/A",
      });
    }
  };

  const processBookingsData = (data: any[]) => {
    const now = new Date();
    const upcoming = data.filter(
      (booking: any) => new Date(booking.bookingDate) >= now
    );
    const past = data.filter(
      (booking: any) => new Date(booking.bookingDate) < now
    );

    setUpcomingBookings(upcoming);
    setPastBookings(past);

    // Calculate stats
    const thisMonth = data.filter((booking: any) => {
      const bookingDate = new Date(booking.bookingDate);
      return (
        bookingDate.getMonth() === now.getMonth() &&
        bookingDate.getFullYear() === now.getFullYear()
      );
    });

    const totalSpent = data.reduce(
      (sum: number, booking: any) => sum + Number(booking.totalAmount),
      0
    );

    setStats({
      upcoming: upcoming.length,
      thisMonth: thisMonth.length,
      totalSpent,
      favoriteVenue: data.length > 0 ? data[0].pitch?.name || "N/A" : "N/A",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <AnimatedGradientText className="mb-6">
            <span className="text-emerald-600 font-semibold">
              🎉 Welcome to your dashboard
            </span>
          </AnimatedGradientText>

          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-emerald-600 to-gray-700 bg-clip-text text-transparent mb-4">
              My Dashboard
            </h1>
            <div className="text-2xl text-gray-600 mb-6">
              <WordRotate
                words={[
                  "Manage your bookings",
                  "Discover new pitches",
                  "Track your games",
                  "Join the community",
                ]}
                className="text-2xl font-medium text-emerald-600"
              />
            </div>
          </div>

          <Link href="/pitches">
            <ShimmerButton
              shimmerColor="#10b981"
              background="linear-gradient(45deg, #10b981, #059669)"
              className="text-white font-semibold px-8 py-4 text-lg"
            >
              <Calendar className="h-4 w-4 mr-2" />
              New Booking
            </ShimmerButton>
          </Link>
        </div>

        {/* Stats Cards */}
        <Carousel className="mb-12" opts={{ align: "start", loop: true }}>
          <CarouselContent className="-ml-2 md:-ml-4">
            <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/4">
              <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-emerald-50 to-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Upcoming
                      </p>
                      <p className="text-3xl font-bold text-emerald-600">
                        {stats.upcoming}
                      </p>
                    </div>
                    <div className="p-3 bg-emerald-100 rounded-full">
                      <Calendar className="h-6 w-6 text-emerald-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>

            <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/4">
              <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        This Month
                      </p>
                      <p className="text-3xl font-bold text-blue-600">
                        {stats.thisMonth}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>

            <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/4">
              <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-purple-50 to-pink-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Spent
                      </p>
                      <p className="text-3xl font-bold text-purple-600">
                        ${stats.totalSpent}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <CreditCard className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>

            <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/4">
              <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-yellow-50 to-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Favorite Venue
                      </p>
                      <p className="text-lg font-bold text-yellow-600">
                        {stats.favoriteVenue}
                      </p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <Star className="h-6 w-6 text-yellow-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>

        {/* Quick Actions Carousel */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Quick Actions
          </h2>
          <Carousel opts={{ align: "start", loop: true }}>
            <CarouselContent className="-ml-2 md:-ml-4">
              <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-green-600 text-white">
                  <CardContent className="p-6 text-center">
                    <Calendar className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Book a Pitch</h3>
                    <p className="text-emerald-100 mb-4">
                      Find and book your next game
                    </p>
                    <Link href="/pitches">
                      <ShimmerButton
                        shimmerColor="#ffffff"
                        background="rgba(255, 255, 255, 0.2)"
                        className="text-white border-white/30"
                      >
                        Browse Pitches
                      </ShimmerButton>
                    </Link>
                  </CardContent>
                </Card>
              </CarouselItem>

              <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                  <CardContent className="p-6 text-center">
                    <Clock className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">View Schedule</h3>
                    <p className="text-blue-100 mb-4">
                      Check your upcoming games
                    </p>
                    <ShimmerButton
                      shimmerColor="#ffffff"
                      background="rgba(255, 255, 255, 0.2)"
                      className="text-white border-white/30"
                    >
                      My Schedule
                    </ShimmerButton>
                  </CardContent>
                </Card>
              </CarouselItem>

              <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                  <CardContent className="p-6 text-center">
                    <Star className="h-12 w-12 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Rate & Review</h3>
                    <p className="text-purple-100 mb-4">
                      Share your experience
                    </p>
                    <ShimmerButton
                      shimmerColor="#ffffff"
                      background="rgba(255, 255, 255, 0.2)"
                      className="text-white border-white/30"
                    >
                      Leave Review
                    </ShimmerButton>
                  </CardContent>
                </Card>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>

        {/* Original Stats Cards - Hidden on mobile, shown as backup */}
        <div className="hidden lg:grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-emerald-50 to-green-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Upcoming</p>
                  <p className="text-3xl font-bold text-emerald-600">
                    {stats.upcoming}
                  </p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-full">
                  <Calendar className="h-6 w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    This Month
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {stats.thisMonth}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Spent
                  </p>
                  <p className="text-3xl font-bold text-purple-600">
                    ${stats.totalSpent}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <CreditCard className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-gradient-to-br from-yellow-50 to-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Favorite Venue
                  </p>
                  <p className="text-lg font-bold text-yellow-600">
                    {stats.favoriteVenue}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Star className="h-6 w-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bookings Tabs */}
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              My Bookings
            </CardTitle>
            <CardDescription className="text-lg text-gray-600">
              Track and manage your pitch reservations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-xl p-1">
                <TabsTrigger value="upcoming">
                  Upcoming ({upcomingBookings.length})
                </TabsTrigger>
                <TabsTrigger value="past">
                  Past ({pastBookings.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="mt-6">
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading bookings...</p>
                    </div>
                  ) : upcomingBookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No upcoming bookings
                      </h3>
                      <p className="text-gray-600">
                        Book a pitch to get started!
                      </p>
                    </div>
                  ) : (
                    upcomingBookings.map((booking: any) => (
                      <Card
                        key={booking.id}
                        className="border-l-4 border-l-emerald-500 hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur-sm"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <img
                                src={
                                  booking.pitch?.images?.[0]?.url ||
                                  "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg"
                                }
                                alt={booking.pitch?.name}
                                className="w-20 h-20 object-cover rounded-xl shadow-md"
                              />
                              <div>
                                <h3 className="font-bold text-xl text-gray-900">
                                  {booking.pitch?.name}
                                </h3>
                                <p className="text-gray-600 flex items-center text-sm">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {booking.pitch?.city}
                                </p>
                                <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
                                  <span className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {new Date(
                                      booking.bookingDate
                                    ).toLocaleDateString()}
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {booking.startTime}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <Badge
                                className={`${getStatusColor(
                                  booking.status
                                )} px-3 py-1 rounded-full font-medium`}
                              >
                                {booking.status}
                              </Badge>
                              <div className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mt-2">
                                ${Number(booking.totalAmount)}
                              </div>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="mt-2 hover:bg-emerald-50 rounded-xl"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    Reschedule
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-red-600">
                                    Cancel Booking
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="past" className="mt-6">
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Loading bookings...</p>
                    </div>
                  ) : pastBookings.length === 0 ? (
                    <div className="text-center py-8">
                      <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No past bookings
                      </h3>
                      <p className="text-gray-600">
                        Your booking history will appear here
                      </p>
                    </div>
                  ) : (
                    pastBookings.map((booking: any) => (
                      <Card
                        key={booking.id}
                        className="border-l-4 border-l-gray-300"
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <img
                                src={
                                  booking.pitch?.images?.[0]?.url ||
                                  "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg"
                                }
                                alt={booking.pitch?.name}
                                className="w-16 h-16 object-cover rounded-lg opacity-75"
                              />
                              <div>
                                <h3 className="font-semibold text-lg text-gray-900">
                                  {booking.pitch?.name}
                                </h3>
                                <p className="text-gray-600 flex items-center text-sm">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {booking.pitch?.city}
                                </p>
                                <div className="flex items-center mt-2 space-x-4 text-sm text-gray-600">
                                  <span className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {new Date(
                                      booking.bookingDate
                                    ).toLocaleDateString()}
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {booking.startTime}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right">
                              <Badge className={getStatusColor(booking.status)}>
                                {booking.status}
                              </Badge>
                              <div className="text-lg font-bold text-gray-900 mt-2">
                                ${Number(booking.totalAmount)}
                              </div>

                              <div className="mt-2">
                                {!booking.review ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                                  >
                                    <Star className="h-4 w-4 mr-1" />
                                    Rate
                                  </Button>
                                ) : (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                                    {booking.review?.rating}/5
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
