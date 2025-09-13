'use client';

import { Calendar, Shield, CreditCard, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/Navigation';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600">Last updated: January 2025</p>
        </div>

        <div className="space-y-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-emerald-600" />
                1. Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                By accessing and using FieldPlay ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
              <p>
                These Terms of Service ("Terms") govern your use of our website located at fieldplay.com (the "Service") operated by FieldPlay ("us", "we", or "our").
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                2. User Accounts
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h4>Account Registration</h4>
              <ul>
                <li>You must provide accurate and complete information when creating an account</li>
                <li>You are responsible for maintaining the security of your account credentials</li>
                <li>You must notify us immediately of any unauthorized use of your account</li>
                <li>One person or entity may not maintain more than one account</li>
              </ul>
              
              <h4>Account Types</h4>
              <ul>
                <li><strong>Players:</strong> Can browse and book football pitches</li>
                <li><strong>Pitch Owners:</strong> Can list and manage football facilities</li>
                <li><strong>Administrators:</strong> Platform management and oversight</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                3. Booking Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h4>Booking Process</h4>
              <ul>
                <li>All bookings are subject to availability and confirmation</li>
                <li>Booking confirmation will be sent via email</li>
                <li>You must arrive on time for your booking</li>
                <li>Late arrivals may result in reduced playing time</li>
              </ul>
              
              <h4>Cancellation Policy</h4>
              <ul>
                <li>Cancellations made 24+ hours before booking: Full refund</li>
                <li>Cancellations made 12-24 hours before: 50% refund</li>
                <li>Cancellations made less than 12 hours before: No refund</li>
                <li>Weather-related cancellations may be eligible for full refund</li>
              </ul>
              
              <h4>No-Show Policy</h4>
              <ul>
                <li>Failure to show up for a booking without cancellation will result in no refund</li>
                <li>Repeated no-shows may result in account suspension</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-green-600" />
                4. Payment Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h4>Payment Processing</h4>
              <ul>
                <li>All payments are processed securely through our payment partners</li>
                <li>We accept major credit cards, PayPal, and cash on arrival (where available)</li>
                <li>Prices are displayed in USD and include all applicable taxes</li>
                <li>Payment is required at the time of booking</li>
              </ul>
              
              <h4>Refunds</h4>
              <ul>
                <li>Refunds will be processed to the original payment method</li>
                <li>Refund processing may take 3-5 business days</li>
                <li>Refund eligibility is subject to our cancellation policy</li>
              </ul>
              
              <h4>Platform Commission</h4>
              <ul>
                <li>FieldPlay charges a 10% commission on successful bookings</li>
                <li>Commission covers payment processing, customer support, and platform maintenance</li>
                <li>Pitch owners receive 90% of the booking amount</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>5. Pitch Owner Responsibilities</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h4>Listing Requirements</h4>
              <ul>
                <li>Provide accurate and up-to-date information about your facility</li>
                <li>Upload high-quality, recent photos of your pitch</li>
                <li>Maintain accurate availability calendars</li>
                <li>Respond to booking requests within 24 hours</li>
              </ul>
              
              <h4>Facility Standards</h4>
              <ul>
                <li>Maintain your facility in good, safe playing condition</li>
                <li>Ensure all advertised amenities are available and functional</li>
                <li>Provide a clean and welcoming environment for players</li>
                <li>Comply with all local safety and health regulations</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>6. User Conduct</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h4>Prohibited Activities</h4>
              <ul>
                <li>Providing false or misleading information</li>
                <li>Using the platform for illegal activities</li>
                <li>Harassing or threatening other users</li>
                <li>Attempting to circumvent platform fees</li>
                <li>Creating fake reviews or ratings</li>
                <li>Violating any applicable laws or regulations</li>
              </ul>
              
              <h4>Consequences</h4>
              <p>
                Violation of these terms may result in account suspension or termination, 
                forfeiture of payments, and legal action where appropriate.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>7. Liability and Disclaimers</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h4>Platform Liability</h4>
              <ul>
                <li>FieldPlay acts as an intermediary between players and pitch owners</li>
                <li>We are not responsible for the condition or safety of listed facilities</li>
                <li>Users participate in activities at their own risk</li>
                <li>We recommend appropriate insurance coverage for all activities</li>
              </ul>
              
              <h4>Service Availability</h4>
              <ul>
                <li>We strive for 99.9% uptime but cannot guarantee uninterrupted service</li>
                <li>Scheduled maintenance will be announced in advance when possible</li>
                <li>We are not liable for losses due to service interruptions</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>8. Privacy and Data Protection</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, 
                to understand our practices regarding the collection and use of your personal information.
              </p>
              <ul>
                <li>We collect only necessary information to provide our services</li>
                <li>Your data is stored securely and never sold to third parties</li>
                <li>You can request data deletion at any time</li>
                <li>We comply with applicable data protection regulations</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>9. Modifications to Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                We reserve the right to modify these terms at any time. We will notify users of significant changes 
                via email or platform notifications. Continued use of the service after changes constitutes acceptance 
                of the new terms.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>10. Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <ul>
                <li>Email: legal@fieldplay.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Address: 123 Sports Avenue, City, State 12345</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}