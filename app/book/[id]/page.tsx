"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  User,
  Mail,
  Phone,
  ArrowLeft,
  Check,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { useSearchParams } from "next/navigation";

export default function BookingPage({ params }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const [bookingStep, setBookingStep] = useState(1);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    teamName: "",
    notes: "",
    paymentMethod: "card",
  });

  const pitch = {
    id: parseInt(params.id),
    name: "Elite Sports Center",
    location: "Downtown District",
    address: "123 Main St, Downtown District",
    price: 75,
    type: "Indoor",
    size: "11v11",
  };

  const bookingDate = searchParams.get("date")
    ? new Date(searchParams.get("date")!)
    : new Date();
  const bookingTime = searchParams.get("time") || "2:00 PM";

  useEffect(() => {
    // Check authentication
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (!currentUser.id) {
      window.location.href = "/auth/login";
      return;
    }
    setUser(currentUser);
    // Pre-fill form with user data
    setFormData((prev) => ({
      ...prev,
      name: `${currentUser.firstName} ${currentUser.lastName}`,
      email: currentUser.email,
      phone: currentUser.phone || "",
    }));
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBookingSubmit = () => {
    // Create booking and store in localStorage for demo
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (currentUser.id) {
      const newBooking = {
        id: Date.now().toString(),
        userId: currentUser.id,
        pitchId: params.id,
        bookingDate: bookingDate.toISOString(),
        startTime: bookingTime,
        endTime: bookingTime, // You might want to calculate end time
        duration: 60,
        totalAmount: pitch.price,
        status: "CONFIRMED",
        teamName: formData.teamName,
        notes: formData.notes,
        pitch: {
          id: params.id,
          name: pitch.name,
          city: pitch.location,
          images: [
            {
              url: "https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg",
            },
          ],
        },
        createdAt: new Date().toISOString(),
      };

      // Store booking in localStorage
      const existingBookings = JSON.parse(
        localStorage.getItem(`bookings_${currentUser.id}`) || "[]"
      );
      existingBookings.push(newBooking);
      localStorage.setItem(
        `bookings_${currentUser.id}`,
        JSON.stringify(existingBookings)
      );
    }

    setBookingStep(3);
  };

  if (bookingStep === 3) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center border-0 shadow-xl">
            <CardContent className="pt-12 pb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Booking Confirmed!
              </h1>
              <p className="text-gray-600 mb-8">
                Your football pitch has been successfully booked. You'll receive
                a confirmation email shortly.
              </p>

              <div className="bg-gray-50 p-6 rounded-lg mb-8 text-left">
                <h3 className="font-semibold mb-4">Booking Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pitch:</span>
                    <span className="font-medium">{pitch.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {bookingDate.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{bookingTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-medium">${pitch.price}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Link href="/dashboard/user">
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    View Dashboard
                  </Button>
                </Link>
                <Link href="/pitches">
                  <Button variant="outline">Book Another Pitch</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/pitches/${params.id}`}>
            <Button
              variant="ghost"
              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Pitch Details
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Booking
          </h1>
          <p className="text-gray-600">Secure your pitch reservation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-emerald-600" />
                  Booking Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter your full name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="your@email.com"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="+855 (015) 123-4567"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="teamName">Team Name (Optional)</Label>
                    <Input
                      id="teamName"
                      value={formData.teamName}
                      onChange={(e) =>
                        handleInputChange("teamName", e.target.value)
                      }
                      placeholder="Enter team name"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Special Requests (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Any special requests or requirements..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Payment Method</Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) =>
                      handleInputChange("paymentMethod", value)
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="card">Credit/Debit Card</SelectItem>
                      <SelectItem value="qr_code">QR Code Payment</SelectItem>
                      <SelectItem value="cash">Cash on Arrival</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.paymentMethod === "card" && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input
                          id="expiry"
                          placeholder="MM/YY"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" className="mt-1" />
                      </div>
                    </div>
                  </div>
                )}

                {formData.paymentMethod === "qr_code" && (
                  <div className="space-y-4 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Scan QR Code to Pay
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Use your mobile banking app or digital wallet to scan
                        and pay
                      </p>

                      {/* QR Code Display */}
                      <div className="bg-white p-6 rounded-xl shadow-lg inline-block border-2 border-dashed border-blue-300">
                        <div className="w-48 h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-32 h-32 bg-black rounded-lg mb-3 mx-auto relative">
                              {/* QR Code Pattern Simulation */}
                              <div className="absolute inset-2 bg-white rounded-sm">
                                <div className="grid grid-cols-8 gap-0.5 h-full p-1">
                                  {Array.from({ length: 64 }).map((_, i) => (
                                    <div
                                      key={i}
                                      className={`${
                                        Math.random() > 0.5
                                          ? "bg-black"
                                          : "bg-white"
                                      } rounded-sm`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500">QR Code</p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-white rounded-lg border border-blue-200">
                        <p className="text-sm font-medium text-gray-900">
                          Amount: ${pitch.price}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Reference: BK-{Date.now().toString().slice(-6)}
                        </p>
                      </div>

                      <div className="mt-4 text-xs text-gray-500">
                        <p>• Scan with any QR-enabled payment app</p>
                        <p>• Payment will be processed instantly</p>
                        <p>• You'll receive confirmation once paid</p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the terms and conditions and cancellation policy
                  </Label>
                </div>

                <Button
                  onClick={handleBookingSubmit}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 py-3"
                  disabled={
                    !formData.name || !formData.email || !formData.phone
                  }
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Complete Booking - ${pitch.price}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video relative rounded-lg overflow-hidden">
                  <img
                    src="https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg"
                    alt={pitch.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-lg">{pitch.name}</h3>
                  <p className="text-gray-600 flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-1" />
                    {pitch.address}
                  </p>
                </div>

                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">
                      {bookingDate.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{bookingTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">1 hour</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pitch Type:</span>
                    <span className="font-medium">
                      {pitch.type} • {pitch.size}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-emerald-600">
                      ${pitch.price}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Free cancellation up to 24 hours before
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
