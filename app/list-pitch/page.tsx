"use client";

import { useState, useEffect } from "react";
import { Upload, MapPin, DollarSign, Camera, Plus, X } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";

export default function ListPitchPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Info
    name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",

    // Pitch Details
    type: "",
    surface: "",
    size: "",
    dimensions: "",
    capacity: "",
    pricePerHour: "",

    // Amenities
    amenities: [] as string[],

    // Images
    images: [] as string[],

    // Availability
    availability: {
      monday: { enabled: true, start: "08:00", end: "22:00" },
      tuesday: { enabled: true, start: "08:00", end: "22:00" },
      wednesday: { enabled: true, start: "08:00", end: "22:00" },
      thursday: { enabled: true, start: "08:00", end: "22:00" },
      friday: { enabled: true, start: "08:00", end: "22:00" },
      saturday: { enabled: true, start: "08:00", end: "22:00" },
      sunday: { enabled: true, start: "08:00", end: "22:00" },
    },
  });

  useEffect(() => {
    // Check authentication and role
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (!currentUser.id) {
      window.location.href = "/auth/login";
      return;
    }
    if (currentUser.role !== "OWNER") {
      window.location.href = "/";
      return;
    }
    setUser(currentUser);
  }, []);

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

  const handleAmenityToggle = (amenityId: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((id) => id !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const handleSubmit = () => {
    const submitPitch = async () => {
      try {
        setLoading(true);
        const currentUser = JSON.parse(
          localStorage.getItem("currentUser") || "{}"
        );

        const pitchData = {
          ...formData,
          capacity: parseInt(formData.capacity),
          pricePerHour: parseFloat(formData.pricePerHour),
          ownerId: currentUser.id,
          images: formData.images,
          amenities: formData.amenities,
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

        alert(
          "Your pitch has been added successfully! It's now live and available for booking."
        );
        window.location.href = "/dashboard/owner";
      } catch (error) {
        console.error("Error creating pitch:", error);
        alert("Error creating pitch. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    submitPitch();
  };

  const steps = [
    {
      number: 1,
      title: "Basic Information",
      description: "Tell us about your pitch",
    },
    {
      number: 2,
      title: "Details & Pricing",
      description: "Pitch specifications and rates",
    },
    {
      number: 3,
      title: "Photos & Amenities",
      description: "Showcase your facility",
    },
    {
      number: 4,
      title: "Availability",
      description: "Set your operating hours",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            List Your Pitch
          </h1>
          <p className="text-xl text-gray-600">
            Join FieldPlay and start earning from your football facility
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.number
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "border-gray-300 text-gray-500"
                  }`}
                >
                  {step.number}
                </div>
                <div className="ml-3 hidden sm:block">
                  <div
                    className={`text-sm font-medium ${
                      currentStep >= step.number
                        ? "text-emerald-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {step.description}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`hidden sm:block w-16 h-0.5 ml-6 ${
                      currentStep > step.number
                        ? "bg-emerald-600"
                        : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="border-0 shadow-xl">
          {currentStep === 1 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-emerald-600" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Tell us about your football pitch
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="name">Pitch Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g., Elite Sports Center"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe your pitch, its features, and what makes it special..."
                    className="mt-1"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      placeholder="123 Main Street"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      placeholder="Your City"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          state: e.target.value,
                        }))
                      }
                      placeholder="CA"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          zipCode: e.target.value,
                        }))
                      }
                      placeholder="12345"
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {currentStep === 2 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2 text-emerald-600" />
                  Details & Pricing
                </CardTitle>
                <CardDescription>
                  Specify your pitch details and pricing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Pitch Type *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="INDOOR">Indoor</SelectItem>
                        <SelectItem value="OUTDOOR">Outdoor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="surface">Surface Type *</Label>
                    <Select
                      value={formData.surface}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, surface: value }))
                      }
                    >
                      <SelectTrigger className="mt-1">
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="size">Pitch Size *</Label>
                    <Select
                      value={formData.size}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, size: value }))
                      }
                    >
                      <SelectTrigger className="mt-1">
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
                  <div>
                    <Label htmlFor="dimensions">Dimensions</Label>
                    <Input
                      id="dimensions"
                      value={formData.dimensions}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          dimensions: e.target.value,
                        }))
                      }
                      placeholder="e.g., 100m x 60m"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="capacity">Max Players *</Label>
                    <Input
                      id="capacity"
                      type="number"
                      value={formData.capacity}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          capacity: e.target.value,
                        }))
                      }
                      placeholder="22"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="pricePerHour">Price per Hour (USD) *</Label>
                  <Input
                    id="pricePerHour"
                    type="number"
                    value={formData.pricePerHour}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        pricePerHour: e.target.value,
                      }))
                    }
                    placeholder="75"
                    className="mt-1"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    FieldPlay charges a 10% commission on successful bookings
                  </p>
                </div>
              </CardContent>
            </>
          )}

          {currentStep === 3 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="h-5 w-5 mr-2 text-emerald-600" />
                  Photos & Amenities
                </CardTitle>
                <CardDescription>
                  Showcase your facility with photos and list amenities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Pitch Photos *</Label>
                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">
                      Upload high-quality photos of your pitch
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Recommended: 5-10 photos, minimum 1200x800px
                    </p>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Photos
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Amenities & Features</Label>
                  <p className="text-sm text-gray-500 mb-4">
                    Select all amenities available at your facility
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {amenityOptions.map((amenity) => (
                      <div
                        key={amenity.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          formData.amenities.includes(amenity.id)
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleAmenityToggle(amenity.id)}
                      >
                        <div className="flex items-center">
                          <Checkbox
                            checked={formData.amenities.includes(amenity.id)}
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

                <div>
                  <Label>Selected Amenities</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.amenities.map((amenityId) => {
                      const amenity = amenityOptions.find(
                        (a) => a.id === amenityId
                      );
                      return (
                        <Badge
                          key={amenityId}
                          variant="secondary"
                          className="flex items-center"
                        >
                          {amenity?.name}
                          <X
                            className="h-3 w-3 ml-1 cursor-pointer"
                            onClick={() => handleAmenityToggle(amenityId)}
                          />
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </>
          )}

          {currentStep === 4 && (
            <>
              <CardHeader>
                <CardTitle>Availability Schedule</CardTitle>
                <CardDescription>
                  Set your operating hours for each day of the week
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(formData.availability).map(
                  ([day, schedule]) => (
                    <div
                      key={day}
                      className="flex items-center space-x-4 p-4 border rounded-lg"
                    >
                      <div className="w-24">
                        <Checkbox
                          checked={schedule.enabled}
                          onChange={(checked) =>
                            setFormData((prev) => ({
                              ...prev,
                              availability: {
                                ...prev.availability,
                                [day]: { ...schedule, enabled: checked },
                              },
                            }))
                          }
                        />
                        <span className="ml-2 font-medium capitalize">
                          {day}
                        </span>
                      </div>

                      {schedule.enabled && (
                        <>
                          <div>
                            <Label className="text-xs">Open</Label>
                            <Input
                              type="time"
                              value={schedule.start}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  availability: {
                                    ...prev.availability,
                                    [day]: {
                                      ...schedule,
                                      start: e.target.value,
                                    },
                                  },
                                }))
                              }
                              className="w-24"
                            />
                          </div>

                          <div>
                            <Label className="text-xs">Close</Label>
                            <Input
                              type="time"
                              value={schedule.end}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  availability: {
                                    ...prev.availability,
                                    [day]: { ...schedule, end: e.target.value },
                                  },
                                }))
                              }
                              className="w-24"
                            />
                          </div>
                        </>
                      )}

                      {!schedule.enabled && (
                        <span className="text-gray-500 italic">Closed</span>
                      )}
                    </div>
                  )
                )}
              </CardContent>
            </>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between p-6 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            {currentStep < 4 ? (
              <Button
                onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={loading}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={
                  loading ||
                  !formData.name ||
                  !formData.type ||
                  !formData.pricePerHour
                }
              >
                {loading ? "Creating Pitch..." : "Create Pitch"}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
