"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Star,
  Clock,
  Users,
  Wifi,
  Car,
  ShirtIcon,
  Coffee,
  Camera,
  Calendar,
  ChevronLeft,
  ChevronRight,
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
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import Link from "next/link";
import Navigation from "@/components/Navigation";

export default function PitchDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [pitch, setPitch] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  useEffect(() => {
    fetchPitchDetails();
  }, [params.id]);

  useEffect(() => {
    if (selectedDate && pitch) {
      fetchAvailableSlots();
    }
  }, [selectedDate, pitch]);

  const fetchPitchDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/pitches/${params.id}`);

      if (!response.ok) {
        throw new Error("Failed to fetch pitch details");
      }

      const pitchData = await response.json();
      setPitch(pitchData);
    } catch (error) {
      console.error("Error fetching pitch:", error);
      setError("Failed to load pitch details");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const dateStr = selectedDate?.toISOString().split("T")[0];
      const response = await fetch(
        `/api/pitches/${params.id}/availability?date=${dateStr}`
      );

      if (response.ok) {
        const data = await response.json();
        setTimeSlots(data.availableSlots || []);
        setBookedSlots(data.bookedSlots || []);
      } else {
        // Generate default slots if API fails
        const defaultSlots = [
          "8:00 AM",
          "9:00 AM",
          "10:00 AM",
          "11:00 AM",
          "12:00 PM",
          "1:00 PM",
          "2:00 PM",
          "3:00 PM",
          "4:00 PM",
          "5:00 PM",
          "6:00 PM",
          "7:00 PM",
          "8:00 PM",
          "9:00 PM",
          "10:00 PM",
        ];
        setTimeSlots(defaultSlots);
        setBookedSlots(["10:00 AM", "2:00 PM", "6:00 PM"]);
      }
    } catch (error) {
      console.error("Error fetching availability:", error);
      // Use fallback data
      const defaultSlots = [
        "8:00 AM",
        "9:00 AM",
        "10:00 AM",
        "11:00 AM",
        "12:00 PM",
        "1:00 PM",
        "2:00 PM",
        "3:00 PM",
        "4:00 PM",
        "5:00 PM",
        "6:00 PM",
        "7:00 PM",
        "8:00 PM",
        "9:00 PM",
        "10:00 PM",
      ];
      setTimeSlots(defaultSlots);
      setBookedSlots([]);
    }
  };

  const calculateAverageRating = (reviews: any[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Number((sum / reviews.length).toFixed(1));
  };

  const formatSurfaceType = (surface: string) => {
    return surface
      .replace(/_/g, " ")
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Map amenities from database structure
  const getDisplayAmenities = (pitch: any) => {
    const amenities = [];

    // Boolean amenities from Prisma schema
    if (pitch.hasParking) amenities.push({ name: "Free Parking", icon: Car });
    if (pitch.hasChangingRooms)
      amenities.push({ name: "Changing Rooms", icon: ShirtIcon });
    if (pitch.hasShowers) amenities.push({ name: "Showers", icon: ShirtIcon });
    if (pitch.hasFloodlights)
      amenities.push({ name: "Floodlights", icon: Clock });
    if (pitch.hasWifi) amenities.push({ name: "WiFi", icon: Wifi });
    if (pitch.hasRefreshments)
      amenities.push({ name: "Refreshments", icon: Coffee });
    if (pitch.hasEquipmentRental)
      amenities.push({ name: "Equipment Rental", icon: Camera });

    // Custom amenities from PitchAmenity table
    if (pitch.amenities) {
      pitch.amenities.forEach((amenity: any) => {
        amenities.push({ name: amenity.name, icon: Camera });
      });
    }

    return amenities;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading pitch details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !pitch) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {error || "Pitch not found"}
            </h2>
            <Link href="/pitches">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Back to Pitches
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const averageRating =
    pitch.averageRating || calculateAverageRating(pitch.reviews);
  const reviewCount = pitch._count?.reviews || pitch.reviews?.length || 0;
  const displayAmenities = getDisplayAmenities(pitch);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/pitches">
            <Button
              variant="ghost"
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Pitches
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div className="aspect-video relative">
                <img
                  src={
                    pitch.images?.[0]?.url ||
                    "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg"
                  }
                  alt={pitch.images?.[0]?.alt || pitch.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 right-4">
                  <Badge className="bg-black/70 text-white">
                    1 / {pitch.images?.length || 1}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Pitch Info */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                      {pitch.name}
                    </CardTitle>
                    <CardDescription className="flex items-center text-base">
                      <MapPin className="h-4 w-4 mr-2" />
                      {pitch.address}, {pitch.city}, {pitch.state}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">
                      ${Number(pitch.pricePerHour)}
                      <span className="text-lg font-normal text-gray-500">
                        /hour
                      </span>
                    </div>
                    <div className="flex items-center justify-end mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 font-semibold">
                        {averageRating}
                      </span>
                      <span className="text-gray-500 ml-1">
                        ({reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-gray-900">
                      {pitch.type}
                    </div>
                    <div className="text-sm text-gray-600">Environment</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-gray-900">
                      {pitch.size}
                    </div>
                    <div className="text-sm text-gray-600">Pitch Size</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-gray-900">
                      {formatSurfaceType(pitch.surface)}
                    </div>
                    <div className="text-sm text-gray-600">Surface</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-gray-900">
                      {pitch.capacity}
                    </div>
                    <div className="text-sm text-gray-600">Max Players</div>
                  </div>
                </div>

                {pitch.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Description</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {pitch.description}
                    </p>
                  </div>
                )}

                {displayAmenities.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {displayAmenities.map((amenity, index) => (
                        <div
                          key={index}
                          className="flex items-center p-3 bg-gray-50 rounded-lg"
                        >
                          <amenity.icon className="h-5 w-5 text-emerald-600 mr-3" />
                          <span className="text-sm font-medium">
                            {amenity.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-emerald-600" />
                  Book This Pitch
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Select Date
                  </label>
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>

                {selectedDate && (
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-3 block">
                      Available Time Slots
                    </label>
                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                      {timeSlots.map((time) => {
                        const isBooked = bookedSlots.includes(time);
                        const isSelected = selectedTime === time;

                        return (
                          <Button
                            key={time}
                            variant={isSelected ? "default" : "outline"}
                            size="sm"
                            disabled={isBooked}
                            onClick={() =>
                              setSelectedTime(isSelected ? "" : time)
                            }
                            className={`text-xs ${
                              isSelected
                                ? "bg-emerald-600 hover:bg-emerald-700"
                                : isBooked
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200"
                            }`}
                          >
                            {time}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {selectedDate && selectedTime && (
                  <div className="p-4 bg-emerald-50 rounded-lg">
                    <div className="text-sm text-emerald-800 mb-2">
                      <strong>Booking Summary</strong>
                    </div>
                    <div className="text-sm text-emerald-700">
                      {selectedDate.toLocaleDateString()} at {selectedTime}
                    </div>
                    <div className="text-lg font-bold text-emerald-800 mt-2">
                      Total: ${Number(pitch.pricePerHour)}
                    </div>
                  </div>
                )}

                <Link
                  href={`/book/${pitch.id}${
                    selectedDate && selectedTime
                      ? `?date=${selectedDate.toISOString()}&time=${selectedTime}`
                      : ""
                  }`}
                >
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700 py-3"
                    disabled={!selectedDate || !selectedTime}
                  >
                    {selectedDate && selectedTime
                      ? "Proceed to Payment"
                      : "Select Date & Time"}
                  </Button>
                </Link>

                <div className="text-xs text-gray-500 text-center">
                  Secure booking • Instant confirmation
                </div>
              </CardContent>
            </Card>

            {/* Owner Info */}
            {pitch.owner && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Facility Owner</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-semibold flex items-center">
                        {pitch.owner.firstName} {pitch.owner.lastName}
                        {pitch.owner.verified && (
                          <Badge className="ml-2 bg-emerald-100 text-emerald-800 text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {pitch.isVerified
                          ? "Verified facility"
                          : "Pending verification"}
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Contact Owner
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
