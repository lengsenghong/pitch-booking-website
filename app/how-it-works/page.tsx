'use client';

import { Search, Calendar, CreditCard, Star, Users, Shield, Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Navigation from '@/components/Navigation';

export default function HowItWorksPage() {
  const playerSteps = [
    {
      icon: Search,
      title: 'Find Your Perfect Pitch',
      description: 'Browse hundreds of verified football pitches in your area. Filter by location, type, price, and amenities.',
      details: ['Search by location or pitch name', 'Filter by indoor/outdoor, size, and price', 'View detailed photos and amenities', 'Read reviews from other players']
    },
    {
      icon: Calendar,
      title: 'Book Instantly',
      description: 'Select your preferred date and time slot. Our real-time availability system ensures accurate booking.',
      details: ['View real-time availability', 'Select date and time slots', 'Choose duration (1-3 hours)', 'Add team details and special requests']
    },
    {
      icon: CreditCard,
      title: 'Secure Payment',
      description: 'Complete your booking with secure payment processing. Multiple payment options available.',
      details: ['Credit/debit card payments', 'PayPal integration', 'Cash on arrival option', 'Instant booking confirmation']
    },
    {
      icon: Star,
      title: 'Play & Review',
      description: 'Enjoy your game and share your experience. Help other players by leaving honest reviews.',
      details: ['Receive booking confirmation', 'Access pitch details and directions', 'Play your game', 'Rate and review the facility']
    }
  ];

  const ownerSteps = [
    {
      icon: Users,
      title: 'List Your Pitch',
      description: 'Create a detailed listing for your football facility with photos, amenities, and pricing.',
      details: ['Upload high-quality photos', 'Set competitive pricing', 'List all amenities and features', 'Define availability schedules']
    },
    {
      icon: Shield,
      title: 'Get Verified',
      description: 'Our team verifies your facility to ensure quality standards and build customer trust.',
      details: ['Facility inspection process', 'Quality assurance checks', 'Verified badge for listings', 'Enhanced visibility']
    },
    {
      icon: Clock,
      title: 'Manage Bookings',
      description: 'Use our dashboard to manage reservations, track revenue, and communicate with customers.',
      details: ['Real-time booking notifications', 'Revenue tracking and analytics', 'Customer communication tools', 'Flexible scheduling options']
    },
    {
      icon: MapPin,
      title: 'Grow Your Business',
      description: 'Reach more customers and maximize your facility utilization with our marketing tools.',
      details: ['Increased online visibility', 'Customer review system', 'Performance analytics', 'Marketing support']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How FieldPlay Works</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Whether you're looking to book a pitch or list your facility, FieldPlay makes it simple and secure
          </p>
        </div>

        {/* For Players Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">For Users</h2>
            <p className="text-lg text-gray-600">Book your perfect pitch in 4 simple steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {playerSteps.map((step, index) => (
              <Card key={index} className="relative border-0 shadow-lg hover:shadow-xl transition-shadow">
                <div className="absolute -top-4 left-6">
                  <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                </div>
                <CardHeader className="pt-8">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                    <step.icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mr-2"></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/pitches">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 px-8">
                Start Booking Now
              </Button>
            </Link>
          </div>
        </section>

        {/* For Owners Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">For Pitch Owners</h2>
            <p className="text-lg text-gray-600">Maximize your facility's potential in 4 steps</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {ownerSteps.map((step, index) => (
              <Card key={index} className="relative border-0 shadow-lg hover:shadow-xl transition-shadow">
                <div className="absolute -top-4 left-6">
                  <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                </div>
                <CardHeader className="pt-8">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <step.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/auth/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8">
                List Your Pitch
              </Button>
            </Link>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-white rounded-2xl p-12 shadow-lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose FieldPlay?</h2>
            <p className="text-lg text-gray-600">The trusted platform for football pitch booking</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Quality</h3>
              <p className="text-gray-600">All pitches are verified and quality-checked to ensure the best user experience.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Booking</h3>
              <p className="text-gray-600">Book your pitch in seconds with real-time availability and instant confirmation.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600">Safe and secure payment processing with multiple payment options available.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}