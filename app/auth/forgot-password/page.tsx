'use client';

import { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setLoading(false);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-xl">
            <CardContent className="pt-12 pb-8 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Mail className="h-8 w-8 text-emerald-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h1>
              <p className="text-gray-600 mb-8">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <Link href="/auth/login">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Back to Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">FP</span>
            </div>
            <span className="ml-3 text-2xl font-bold text-gray-900">FieldPlay</span>
          </Link>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Forgot Password?</CardTitle>
            <CardDescription>Enter your email to receive a reset link</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="pl-10"
                />
              </div>
            </div>

            <Button 
              onClick={handleSubmit}
              className="w-full bg-emerald-600 hover:bg-emerald-700 py-3"
              disabled={loading || !email}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            <div className="text-center">
              <Link href="/auth/login" className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-700">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}