'use client';

import { useState, useEffect } from 'react';
import { MapPin, Star, Clock, Users, Wifi, Car, ShirtIcon, Coffee, Camera, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function PitchDetailPage({ params }: { params: { id: string } }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Mock data for the specific pitch
  const pitch = {
    id: parseInt(params.id),
    name: 'Elite Sports Center',
    location: 'Downtown District',
    address: '123 Main St, Downtown District, City 12345',
    price: 75,
    rating: 4.9,
    reviews: 142,
    images: [
      'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg',
      'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg',
      'https://images.pexels.com/photos/1171084/pexels-photo-1171084.jpeg'
    ],
    type: 'Indoor',
    size: '11v11',
    surface: 'Premium Artificial Grass',
    dimensions: '100m x 60m',
    capacity: 22,
    amenities: [
      { name: 'Free Parking', icon: Car },
      { name: 'Changing Rooms', icon: ShirtIcon },
      { name: 'Floodlights', icon: Clock },
      { name: 'WiFi', icon: Wifi },
      { name: 'Refreshments', icon: Coffee },
      { name: 'Photography Area', icon: Camera }
    ],
    description: 'Experience football at its finest in our state-of-the-art indoor facility. With premium artificial grass, professional lighting, and top-tier amenities, Elite Sports Center provides the perfect environment for competitive matches and training sessions.',
    rules: [
      'No metal studs allowed',
      'Maximum 22 players per booking',
      'Bookings must be cancelled 24 hours in advance for full refund',
      'Facility opens 15 minutes before booking time'
    ],
    owner: {
      name: 'Sports Elite Ltd.',
      verified: true,
      rating: 4.8,
      response_time: '2 hours'
    }
  };

  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
    '4:00 PM', '5:00 PM', '6:00 PM', '7:00 PM',
    '8:00 PM', '9:00 PM', '10:00 PM'
  ];

  const bookedSlots = ['10:00 AM', '2:00 PM', '6:00 PM'];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/pitches">
            <Button variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
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
                  src={pitch.images[0]} 
                  alt={pitch.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 right-4">
                  <Badge className="bg-black/70 text-white">
                    1 / {pitch.images.length}
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
                      {pitch.address}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">
                      ${pitch.price}
                      <span className="text-lg font-normal text-gray-500">/hour</span>
                    </div>
                    <div className="flex items-center justify-end mt-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 font-semibold">{pitch.rating}</span>
                      <span className="text-gray-500 ml-1">({pitch.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-gray-900">{pitch.type}</div>
                    <div className="text-sm text-gray-600">Environment</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-gray-900">{pitch.size}</div>
                    <div className="text-sm text-gray-600">Pitch Size</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-gray-900">{pitch.surface}</div>
                    <div className="text-sm text-gray-600">Surface</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-gray-900">{pitch.capacity}</div>
                    <div className="text-sm text-gray-600">Max Players</div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{pitch.description}</p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {pitch.amenities.map((amenity) => (
                      <div key={amenity.name} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <amenity.icon className="h-5 w-5 text-emerald-600 mr-3" />
                        <span className="text-sm font-medium">{amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Rules & Guidelines</h3>
                  <ul className="space-y-2">
                    {pitch.rules.map((rule, index) => (
                      <li key={index} className="flex items-center text-gray-600">
                        <div className="w-2 h-2 bg-emerald-600 rounded-full mr-3"></div>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
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
                            onClick={() => setSelectedTime(isSelected ? '' : time)}
                            className={`text-xs ${
                              isSelected 
                                ? 'bg-emerald-600 hover:bg-emerald-700' 
                                : isBooked 
                                  ? 'opacity-50 cursor-not-allowed'
                                  : 'hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200'
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
                      Total: ${pitch.price}
                    </div>
                  </div>
                )}

                <Link href={`/book/${pitch.id}${selectedDate && selectedTime ? `?date=${selectedDate.toISOString()}&time=${selectedTime}` : ''}`}>
                  <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 py-3"
                    disabled={!selectedDate || !selectedTime}
                  >
                    {selectedDate && selectedTime ? 'Proceed to Payment' : 'Select Date & Time'}
                  </Button>
                </Link>

                <div className="text-xs text-gray-500 text-center">
                  Secure booking • Instant confirmation
                </div>
              </CardContent>
            </Card>

            {/* Owner Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Facility Owner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-semibold flex items-center">
                      {pitch.owner.name}
                      {pitch.owner.verified && (
                        <Badge className="ml-2 bg-emerald-100 text-emerald-800 text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      Responds within {pitch.owner.response_time}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 font-semibold">{pitch.owner.rating}</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Contact Owner
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}