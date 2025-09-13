"use client";

import { useState } from "react";
import {
  MessageCircle,
  Phone,
  Mail,
  HelpCircle,
  Search,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Navigation from "@/components/Navigation";

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  });

  const faqs = [
    {
      category: "Booking",
      questions: [
        {
          question: "How do I book a football pitch?",
          answer:
            "Simply browse our available pitches, select your preferred date and time, and complete the booking with secure payment. You'll receive instant confirmation.",
        },
        {
          question: "Can I cancel or reschedule my booking?",
          answer:
            "Yes, you can cancel or reschedule your booking up to 24 hours before the scheduled time for a full refund. Changes made within 24 hours may incur fees.",
        },
        {
          question: "What payment methods do you accept?",
          answer:
            "We accept all major credit/debit cards, PayPal, and cash on arrival (where available). All online payments are processed securely.",
        },
      ],
    },
    {
      category: "Pitch Owners",
      questions: [
        {
          question: "How do I list my pitch on FieldPlay?",
          answer:
            "Register as a pitch owner, complete the verification process, and create your pitch listing with photos, amenities, and pricing. Our team will review and approve your listing.",
        },
        {
          question: "What commission does FieldPlay charge?",
          answer:
            "FieldPlay charges a 10% commission on successful bookings. This covers payment processing, customer support, and platform maintenance.",
        },
        {
          question: "How do I receive payments?",
          answer:
            "Payments are automatically transferred to your registered bank account within 2-3 business days after the booking is completed.",
        },
      ],
    },
    {
      category: "Account",
      questions: [
        {
          question: "How do I create an account?",
          answer:
            'Click "Sign Up" and choose whether you\'re a player or pitch owner. Fill in your details, verify your email, and start using FieldPlay immediately.',
        },
        {
          question: "I forgot my password. How do I reset it?",
          answer:
            'Click "Forgot Password" on the login page, enter your email address, and follow the instructions in the reset email we send you.',
        },
        {
          question: "How do I update my profile information?",
          answer:
            "Log in to your account, go to your profile settings, and update your information. Don't forget to save your changes.",
        },
      ],
    },
  ];

  const filteredFaqs = faqs
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  const handleContactSubmit = () => {
    // Handle contact form submission
    console.log("Contact form submitted:", contactForm);
    // Reset form
    setContactForm({
      name: "",
      email: "",
      subject: "",
      category: "",
      message: "",
    });
    alert("Thank you for your message! We'll get back to you within 24 hours.");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            How Can We Help?
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to common questions or get in touch with our support
            team
          </p>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
              <p className="text-gray-600 mb-4">
                Get instant help from our support team
              </p>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                Start Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Phone Support</h3>
              <p className="text-gray-600 mb-4">
                Call us Monday to Sunday, 9 AM - 6 PM
              </p>
              <Button
                variant="outline"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                +855 (015) 123-4567
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Support</h3>
              <p className="text-gray-600 mb-4">
                We'll respond within 24 hours
              </p>
              <Button
                variant="outline"
                className="border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                support@fieldplay.com
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* FAQ Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* FAQ Categories */}
            <div className="space-y-4">
              {filteredFaqs.map((category, categoryIndex) => (
                <Card key={categoryIndex} className="border-0 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center">
                      <HelpCircle className="h-5 w-5 mr-2 text-emerald-600" />
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {category.questions.map((faq, faqIndex) => (
                        <Collapsible key={faqIndex}>
                          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <span className="font-medium">{faq.question}</span>
                            <ChevronDown className="h-4 w-4" />
                          </CollapsibleTrigger>
                          <CollapsibleContent className="p-3 text-gray-600">
                            {faq.answer}
                          </CollapsibleContent>
                        </Collapsible>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl">Contact Us</CardTitle>
                <CardDescription>
                  Can't find what you're looking for? Send us a message and
                  we'll help you out.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      value={contactForm.name}
                      onChange={(e) =>
                        setContactForm((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Your full name"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) =>
                        setContactForm((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="fieldplay@gmail.com"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={contactForm.category}
                    onValueChange={(value) =>
                      setContactForm((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="booking">Booking Issues</SelectItem>
                      <SelectItem value="payment">Payment Problems</SelectItem>
                      <SelectItem value="account">Account Support</SelectItem>
                      <SelectItem value="technical">
                        Technical Issues
                      </SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={contactForm.subject}
                    onChange={(e) =>
                      setContactForm((prev) => ({
                        ...prev,
                        subject: e.target.value,
                      }))
                    }
                    placeholder="Brief description of your issue"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    value={contactForm.message}
                    onChange={(e) =>
                      setContactForm((prev) => ({
                        ...prev,
                        message: e.target.value,
                      }))
                    }
                    placeholder="Please provide as much detail as possible..."
                    className="mt-1"
                    rows={5}
                  />
                </div>

                <Button
                  onClick={handleContactSubmit}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 py-3"
                  disabled={
                    !contactForm.name ||
                    !contactForm.email ||
                    !contactForm.subject ||
                    !contactForm.message
                  }
                >
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
