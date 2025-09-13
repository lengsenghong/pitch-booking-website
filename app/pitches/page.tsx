"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Navigation from "@/components/Navigation";

interface Pitch {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  type: string;
  surface: string;
  size: string;
  pricePerHour: number;
  images: { url: string; alt?: string }[];
  amenities: { name: string; icon?: string }[];
  reviews: { rating: number }[];
  _count?: { reviews: number };
}

export default function PitchesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<string[]>([]);
  const [filteredPitches, setFilteredPitches] = useState<Pitch[]>([]);

  useEffect(() => {
    fetchPitches();
  }, []);

  useEffect(() => {
    filterPitches();
  }, [searchQuery, locationFilter, priceFilter, typeFilter, pitches]);

  const fetchPitches = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/pitches");
      if (!response.ok) throw new Error("Failed to fetch pitches");

      const data: Pitch[] = await response.json();
      setPitches(data);

      // Extract unique locations in a type-safe way
      const uniqueLocations = Array.from(
        new Set<string>(data.map((pitch) => pitch.city))
      );
      setLocations(uniqueLocations);
    } catch (error) {
      console.error("Error fetching pitches:", error);
      setPitches([]);
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  const filterPitches = () => {
    const filtered = pitches.filter((pitch) => {
      const matchesSearch =
        pitch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pitch.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pitch.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesLocation =
        locationFilter === "all" || pitch.city === locationFilter;

      const matchesType = typeFilter === "all" || pitch.type === typeFilter;

      const matchesPrice =
        priceFilter === "all" ||
        (priceFilter === "low" && pitch.pricePerHour <= 50) ||
        (priceFilter === "medium" &&
          pitch.pricePerHour > 50 &&
          pitch.pricePerHour <= 80) ||
        (priceFilter === "high" && pitch.pricePerHour > 80);

      return matchesSearch && matchesLocation && matchesType && matchesPrice;
    });

    setFilteredPitches(filtered);
  };

  const calculateAverageRating = (reviews: { rating: number }[]) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Number((sum / reviews.length).toFixed(1));
  };

  const formatPitchType = (type: string) =>
    type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();

  const formatSurface = (surface: string) =>
    surface
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading pitches...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Your Perfect Pitch
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse and book from hundreds of premium football facilities across
            the city
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-200/50 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search pitches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-3 rounded-xl border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <Select value={locationFilter} onValueChange={setLocationFilter}>
              <SelectTrigger className="py-3 rounded-xl border-gray-200">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="py-3 rounded-xl border-gray-200">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="INDOOR">Indoor</SelectItem>
                <SelectItem value="OUTDOOR">Outdoor</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceFilter} onValueChange={setPriceFilter}>
              <SelectTrigger className="py-3 rounded-xl border-gray-200">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="low">$0 - $50</SelectItem>
                <SelectItem value="medium">$51 - $80</SelectItem>
                <SelectItem value="high">$81+</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-gray-600">
            <span className="text-lg">
              <span className="font-bold text-emerald-600">
                {filteredPitches.length}
              </span>
              <span className="text-gray-700 ml-1">premium pitches found</span>
            </span>
          </div>
        </div>

        {/* Pitch Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPitches.map((pitch) => {
            const averageRating = calculateAverageRating(pitch.reviews);
            const reviewCount = pitch._count?.reviews || pitch.reviews.length;
            const mainImage =
              pitch.images?.[0]?.url ||
              "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg";

            return (
              <Card
                key={pitch.id}
                className="group hover:shadow-2xl transition-all duration-500 border-0 shadow-lg overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm"
              >
                <div className="relative">
                  <img
                    src={mainImage}
                    alt={pitch.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-all duration-500"
                  />
                  <Badge className="absolute top-4 right-4 bg-emerald-600 text-white">
                    {pitch.type}
                  </Badge>
                </div>
                <CardContent className="py-4">
                  <CardHeader className="p-0">
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {pitch.name}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      {pitch.address}, {pitch.city}, {pitch.state}
                    </CardDescription>
                  </CardHeader>

                  <div className="flex justify-between mt-4">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Star className="h-4 w-4 text-amber-400" />
                      <span>{averageRating}</span>
                      <span>({reviewCount} reviews)</span>
                    </div>
                    <div className="text-gray-600 font-semibold">
                      ${pitch.pricePerHour}/hr
                    </div>
                  </div>

                  <div className="flex flex-wrap mt-3 gap-2">
                    <Badge>{formatPitchType(pitch.type)}</Badge>
                    <Badge>{formatSurface(pitch.surface)}</Badge>
                    <Badge>{pitch.size}</Badge>
                  </div>

                  <Link href={`/pitches/${pitch.id}`}>
                    <Button className="mt-4 w-full">View Details</Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
