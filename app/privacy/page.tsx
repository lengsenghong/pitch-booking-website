'use client';

import { Shield, Eye, Lock, Database, Users, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navigation from '@/components/Navigation';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600">Last updated: January 2025</p>
        </div>

        <div className="space-y-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2 text-emerald-600" />
                1. Introduction
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                At FieldPlay, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
              </p>
              <p>
                By using FieldPlay, you consent to the data practices described in this policy. If you do not agree with our policies and practices, 
                please do not use our services.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2 text-blue-600" />
                2. Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h4>Personal Information</h4>
              <p>We collect information that you provide directly to us, including:</p>
              <ul>
                <li>Name, email address, and phone number</li>
                <li>Account credentials (username and password)</li>
                <li>Payment information (processed securely by our payment partners)</li>
                <li>Profile information and preferences</li>
                <li>Communication history with our support team</li>
              </ul>
              
              <h4>Booking Information</h4>
              <ul>
                <li>Booking details (dates, times, pitch selections)</li>
                <li>Team information and special requests</li>
                <li>Reviews and ratings you provide</li>
                <li>Communication with pitch owners</li>
              </ul>
              
              <h4>Technical Information</h4>
              <ul>
                <li>IP address and device information</li>
                <li>Browser type and version</li>
                <li>Usage patterns and preferences</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Eye className="h-5 w-5 mr-2 text-purple-600" />
                3. How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h4>Service Provision</h4>
              <ul>
                <li>Process and manage your bookings</li>
                <li>Facilitate communication between players and pitch owners</li>
                <li>Process payments and send confirmations</li>
                <li>Provide customer support</li>
              </ul>
              
              <h4>Platform Improvement</h4>
              <ul>
                <li>Analyze usage patterns to improve our services</li>
                <li>Develop new features and functionality</li>
                <li>Ensure platform security and prevent fraud</li>
                <li>Conduct research and analytics</li>
              </ul>
              
              <h4>Communication</h4>
              <ul>
                <li>Send booking confirmations and updates</li>
                <li>Notify you of important account changes</li>
                <li>Share relevant promotional offers (with your consent)</li>
                <li>Respond to your inquiries and support requests</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-green-600" />
                4. Information Sharing
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h4>With Pitch Owners</h4>
              <p>We share necessary booking information with pitch owners, including:</p>
              <ul>
                <li>Your name and contact information</li>
                <li>Booking details and special requests</li>
                <li>Team information (if provided)</li>
              </ul>
              
              <h4>With Service Providers</h4>
              <p>We work with trusted third-party service providers who assist us in:</p>
              <ul>
                <li>Payment processing (Stripe, PayPal)</li>
                <li>Email communications</li>
                <li>Analytics and performance monitoring</li>
                <li>Customer support tools</li>
              </ul>
              
              <h4>Legal Requirements</h4>
              <p>We may disclose your information when required by law or to:</p>
              <ul>
                <li>Comply with legal processes or government requests</li>
                <li>Protect our rights and property</li>
                <li>Ensure user safety and platform security</li>
                <li>Investigate potential violations of our terms</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2 text-red-600" />
                5. Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h4>Security Measures</h4>
              <p>We implement industry-standard security measures to protect your information:</p>
              <ul>
                <li>SSL encryption for all data transmission</li>
                <li>Secure database storage with access controls</li>
                <li>Regular security audits and updates</li>
                <li>Employee training on data protection</li>
              </ul>
              
              <h4>Payment Security</h4>
              <ul>
                <li>We do not store credit card information on our servers</li>
                <li>All payments are processed by PCI-compliant payment processors</li>
                <li>Tokenization is used for recurring payments</li>
              </ul>
              
              <h4>Account Security</h4>
              <ul>
                <li>Strong password requirements</li>
                <li>Account lockout after failed login attempts</li>
                <li>Email notifications for account changes</li>
                <li>Optional two-factor authentication</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>6. Your Rights and Choices</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h4>Access and Control</h4>
              <p>You have the right to:</p>
              <ul>
                <li>Access and review your personal information</li>
                <li>Update or correct inaccurate information</li>
                <li>Delete your account and associated data</li>
                <li>Export your data in a portable format</li>
              </ul>
              
              <h4>Communication Preferences</h4>
              <ul>
                <li>Opt out of promotional emails</li>
                <li>Choose notification preferences</li>
                <li>Control marketing communications</li>
              </ul>
              
              <h4>Cookie Management</h4>
              <ul>
                <li>Manage cookie preferences in your browser</li>
                <li>Opt out of analytics tracking</li>
                <li>Control advertising cookies</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>7. Data Retention</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>We retain your information for as long as necessary to:</p>
              <ul>
                <li>Provide our services to you</li>
                <li>Comply with legal obligations</li>
                <li>Resolve disputes and enforce agreements</li>
                <li>Improve our services</li>
              </ul>
              
              <h4>Retention Periods</h4>
              <ul>
                <li>Account information: Until account deletion</li>
                <li>Booking history: 7 years for tax and legal purposes</li>
                <li>Payment records: As required by financial regulations</li>
                <li>Support communications: 3 years</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>8. Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                FieldPlay is not intended for children under 13 years of age. We do not knowingly collect personal information 
                from children under 13. If we become aware that we have collected personal information from a child under 13, 
                we will take steps to delete such information.
              </p>
              <p>
                For users between 13-18 years old, parental consent may be required for certain activities.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>9. International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Your information may be transferred to and processed in countries other than your own. We ensure that such transfers 
                comply with applicable data protection laws and implement appropriate safeguards to protect your information.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>10. Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new 
                Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy Policy 
                periodically for any changes.
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-emerald-600" />
                11. Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <ul>
                <li>Email: privacy@fieldplay.com</li>
                <li>Phone: +1 (555) 123-4567</li>
                <li>Address: 123 Sports Avenue, City, State 12345</li>
              </ul>
              
              <p>
                For data protection inquiries in the EU, you may also contact our Data Protection Officer at dpo@fieldplay.com.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}