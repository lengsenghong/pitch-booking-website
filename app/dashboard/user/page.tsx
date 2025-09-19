"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  Star,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import Link from "next/link";

interface Booking {
  id: string;
  status: string;
  bookingDate: string;
  totalAmount: number;
  startTime: string;
  endTime: string;
  pitch?: {
    name: string;
    city: string;
    images?: { url: string }[];
  };
}

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState({
    upcoming: 0,
    thisMonth: 0,
    totalSpent: 0,
    favoriteVenue: "N/A",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (!currentUser.id) {
      window.location.href = "/auth/login";
      return;
    }
    fetchBookings(currentUser.id);
  }, []);

  const fetchBookings = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}/bookings`);
      const data: Booking[] = res.ok ? await res.json() : [];
      processBookings(data);
    } catch (err) {
      console.error(err);
      processBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const processBookings = (data: Booking[]) => {
    const now = new Date();
    const upcoming = data.filter((b) => new Date(b.bookingDate) >= now);
    const past = data.filter((b) => new Date(b.bookingDate) < now);
    const thisMonth = data.filter((b) => {
      const date = new Date(b.bookingDate);
      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    });
    const totalSpent = data.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

    setUpcomingBookings(upcoming);
    setPastBookings(past);
    setStats({
      upcoming: upcoming.length,
      thisMonth: thisMonth.length,
      totalSpent,
      favoriteVenue: data.length > 0 ? data[0].pitch?.name || "N/A" : "N/A",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-emerald-600 to-gray-700 bg-clip-text text-transparent">
            My Dashboard
          </h1>
          <p className="text-xl text-gray-600">Track your bookings and stats</p>
          <Link href="/pitches">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 flex items-center justify-center mx-auto">
              <Calendar className="h-5 w-5 mr-2" /> New Booking
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition">
            <CardTitle className="text-sm text-gray-500">
              Total Upcoming
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-gray-900">
              {stats.upcoming}
            </CardDescription>
          </Card>
          <Card className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition">
            <CardTitle className="text-sm text-gray-500">This Month</CardTitle>
            <CardDescription className="text-2xl font-bold text-gray-900">
              {stats.thisMonth}
            </CardDescription>
          </Card>
          <Card className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition">
            <CardTitle className="text-sm text-gray-500">Total Spent</CardTitle>
            <CardDescription className="text-2xl font-bold text-gray-900">
              ${stats.totalSpent.toLocaleString()}
            </CardDescription>
          </Card>
          <Card className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition">
            <CardTitle className="text-sm text-gray-500">
              Favorite Venue
            </CardTitle>
            <CardDescription className="text-2xl font-bold text-gray-900">
              {stats.favoriteVenue}
            </CardDescription>
          </Card>
        </div>

        {/* Bookings Tabs */}
        <Card className="bg-white rounded-lg shadow p-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList className="grid grid-cols-2 bg-gray-100 rounded-lg p-1">
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingBookings.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past ({pastBookings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4 mt-4">
              {loading ? (
                <div className="text-center py-8 animate-pulse">
                  <div className="h-8 w-8 rounded-full bg-emerald-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading bookings...</p>
                </div>
              ) : upcomingBookings.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No upcoming bookings
                </p>
              ) : (
                upcomingBookings.map((b) => (
                  <Card
                    key={b.id}
                    className="flex justify-between items-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={
                          b.pitch?.images?.[0]?.url ||
                          "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg"
                        }
                        alt={b.pitch?.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-semibold">{b.pitch?.name}</p>
                        <p className="text-gray-500 text-sm flex items-center">
                          <MapPin className="h-4 w-4 mr-1" /> {b.pitch?.city}
                        </p>
                        <p className="text-gray-500 text-sm flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />{" "}
                          {new Date(b.bookingDate).toLocaleDateString()}
                          <Clock className="h-4 w-4 ml-4 mr-1" /> {b.startTime}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={`${getStatusColor(
                          b.status
                        )} px-3 py-1 rounded-full font-medium`}
                      >
                        {b.status}
                      </Badge>
                      <p className="text-lg font-bold mt-2">${b.totalAmount}</p>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4 mt-4">
              {pastBookings.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No past bookings
                </p>
              ) : (
                pastBookings.map((b) => (
                  <Card
                    key={b.id}
                    className="flex justify-between items-center p-4 bg-white rounded-lg shadow hover:shadow-lg transition"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={
                          b.pitch?.images?.[0]?.url ||
                          "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg"
                        }
                        alt={b.pitch?.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-semibold">{b.pitch?.name}</p>
                        <p className="text-gray-500 text-sm flex items-center">
                          <MapPin className="h-4 w-4 mr-1" /> {b.pitch?.city}
                        </p>
                        <p className="text-gray-500 text-sm flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />{" "}
                          {new Date(b.bookingDate).toLocaleDateString()}
                          <Clock className="h-4 w-4 ml-4 mr-1" /> {b.startTime}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={`${getStatusColor(
                          b.status
                        )} px-3 py-1 rounded-full font-medium`}
                      >
                        {b.status}
                      </Badge>
                      <p className="text-lg font-bold mt-2">${b.totalAmount}</p>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
