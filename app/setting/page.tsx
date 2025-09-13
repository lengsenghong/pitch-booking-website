"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Bell,
  Shield,
  Globe,
  Moon,
  Sun,
  Smartphone,
  Mail,
  MessageSquare,
  CreditCard,
  Download,
  Trash2,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Navigation from "@/components/Navigation";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    bookingReminders: true,
    promotionalEmails: false,

    // Privacy
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,

    // Preferences
    language: "en",
    timezone: "UTC",
    currency: "USD",
    theme: "light",

    // Booking
    autoConfirmBookings: false,
    defaultBookingDuration: "60",
    cancellationWindow: "24",
  });

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    if (!currentUser.id) {
      window.location.href = "/auth/login";
      return;
    }
    setUser(currentUser);

    // Load saved settings from localStorage
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      try {
        setSettings((prev) => ({ ...prev, ...JSON.parse(savedSettings) }));
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    }
  }, []);

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Save to localStorage (in real app, this would be an API call)
      localStorage.setItem("userSettings", JSON.stringify(settings));

      setTimeout(() => {
        setLoading(false);
        alert("Settings saved successfully!");
      }, 1000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setLoading(false);
      alert("Error saving settings. Please try again.");
    }
  };

  const handleExportData = () => {
    // In a real app, this would generate and download user data
    const userData = {
      profile: user,
      settings: settings,
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `fieldplay-data-${user.firstName}-${user.lastName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert("Your data has been exported successfully!");
  };

  const handleDeleteAccount = () => {
    // In a real app, this would make an API call to delete the account
    console.log("Deleting account for user:", user.id);
    localStorage.removeItem("currentUser");
    localStorage.removeItem("userSettings");
    window.location.href = "/";
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your account preferences and privacy settings
          </p>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-emerald-600" />
                  Notification Settings
                </CardTitle>
                <CardDescription>
                  Choose how you want to be notified about bookings and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="emailNotifications"
                      className="text-base font-medium"
                    >
                      Email Notifications
                    </Label>
                    <p className="text-sm text-gray-600">
                      Receive booking confirmations and updates via email
                    </p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) =>
                      handleSettingChange("emailNotifications", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="smsNotifications"
                      className="text-base font-medium"
                    >
                      SMS Notifications
                    </Label>
                    <p className="text-sm text-gray-600">
                      Get text messages for important updates
                    </p>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) =>
                      handleSettingChange("smsNotifications", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="pushNotifications"
                      className="text-base font-medium"
                    >
                      Push Notifications
                    </Label>
                    <p className="text-sm text-gray-600">
                      Receive push notifications on your device
                    </p>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) =>
                      handleSettingChange("pushNotifications", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="bookingReminders"
                      className="text-base font-medium"
                    >
                      Booking Reminders
                    </Label>
                    <p className="text-sm text-gray-600">
                      Get reminded about upcoming bookings
                    </p>
                  </div>
                  <Switch
                    id="bookingReminders"
                    checked={settings.bookingReminders}
                    onCheckedChange={(checked) =>
                      handleSettingChange("bookingReminders", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="promotionalEmails"
                      className="text-base font-medium"
                    >
                      Promotional Emails
                    </Label>
                    <p className="text-sm text-gray-600">
                      Receive offers and promotional content
                    </p>
                  </div>
                  <Switch
                    id="promotionalEmails"
                    checked={settings.promotionalEmails}
                    onCheckedChange={(checked) =>
                      handleSettingChange("promotionalEmails", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-emerald-600" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>
                  Control who can see your information and how it's used
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label
                    htmlFor="profileVisibility"
                    className="text-base font-medium"
                  >
                    Profile Visibility
                  </Label>
                  <p className="text-sm text-gray-600 mb-2">
                    Choose who can see your profile information
                  </p>
                  <Select
                    value={settings.profileVisibility}
                    onValueChange={(value) =>
                      handleSettingChange("profileVisibility", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">
                        Public - Anyone can see
                      </SelectItem>
                      <SelectItem value="users">
                        Users Only - Registered users can see
                      </SelectItem>
                      <SelectItem value="private">
                        Private - Only you can see
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="showEmail"
                      className="text-base font-medium"
                    >
                      Show Email Address
                    </Label>
                    <p className="text-sm text-gray-600">
                      Allow others to see your email address
                    </p>
                  </div>
                  <Switch
                    id="showEmail"
                    checked={settings.showEmail}
                    onCheckedChange={(checked) =>
                      handleSettingChange("showEmail", checked)
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <Label
                      htmlFor="showPhone"
                      className="text-base font-medium"
                    >
                      Show Phone Number
                    </Label>
                    <p className="text-sm text-gray-600">
                      Allow others to see your phone number
                    </p>
                  </div>
                  <Switch
                    id="showPhone"
                    checked={settings.showPhone}
                    onCheckedChange={(checked) =>
                      handleSettingChange("showPhone", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-emerald-600" />
                  Preferences
                </CardTitle>
                <CardDescription>
                  Customize your experience with language, timezone, and display
                  options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="language" className="text-base font-medium">
                      Language
                    </Label>
                    <Select
                      value={settings.language}
                      onValueChange={(value) =>
                        handleSettingChange("language", value)
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="de">Deutsch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="timezone" className="text-base font-medium">
                      Timezone
                    </Label>
                    <Select
                      value={settings.timezone}
                      onValueChange={(value) =>
                        handleSettingChange("timezone", value)
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">
                          Eastern Time
                        </SelectItem>
                        <SelectItem value="America/Chicago">
                          Central Time
                        </SelectItem>
                        <SelectItem value="America/Denver">
                          Mountain Time
                        </SelectItem>
                        <SelectItem value="America/Los_Angeles">
                          Pacific Time
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="currency" className="text-base font-medium">
                      Currency
                    </Label>
                    <Select
                      value={settings.currency}
                      onValueChange={(value) =>
                        handleSettingChange("currency", value)
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="CAD">
                          CAD - Canadian Dollar
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="theme" className="text-base font-medium">
                      Theme
                    </Label>
                    <Select
                      value={settings.theme}
                      onValueChange={(value) =>
                        handleSettingChange("theme", value)
                      }
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center">
                            <Sun className="h-4 w-4 mr-2" />
                            Light
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center">
                            <Moon className="h-4 w-4 mr-2" />
                            Dark
                          </div>
                        </SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {user.role === "OWNER" && (
                  <>
                    <Separator />
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        Booking Preferences
                      </h3>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label
                            htmlFor="autoConfirmBookings"
                            className="text-base font-medium"
                          >
                            Auto-confirm Bookings
                          </Label>
                          <p className="text-sm text-gray-600">
                            Automatically confirm all booking requests
                          </p>
                        </div>
                        <Switch
                          id="autoConfirmBookings"
                          checked={settings.autoConfirmBookings}
                          onCheckedChange={(checked) =>
                            handleSettingChange("autoConfirmBookings", checked)
                          }
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label
                            htmlFor="defaultBookingDuration"
                            className="text-base font-medium"
                          >
                            Default Booking Duration
                          </Label>
                          <Select
                            value={settings.defaultBookingDuration}
                            onValueChange={(value) =>
                              handleSettingChange(
                                "defaultBookingDuration",
                                value
                              )
                            }
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="60">1 hour</SelectItem>
                              <SelectItem value="90">1.5 hours</SelectItem>
                              <SelectItem value="120">2 hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label
                            htmlFor="cancellationWindow"
                            className="text-base font-medium"
                          >
                            Cancellation Window
                          </Label>
                          <Select
                            value={settings.cancellationWindow}
                            onValueChange={(value) =>
                              handleSettingChange("cancellationWindow", value)
                            }
                          >
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="12">12 hours</SelectItem>
                              <SelectItem value="24">24 hours</SelectItem>
                              <SelectItem value="48">48 hours</SelectItem>
                              <SelectItem value="72">72 hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Data & Privacy</CardTitle>
                  <CardDescription>
                    Manage your account data and privacy options
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <Download className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <h3 className="font-medium">Export Your Data</h3>
                        <p className="text-sm text-gray-600">
                          Download a copy of your account data
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" onClick={handleExportData}>
                      Export
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  <CardDescription>
                    Irreversible actions that will permanently affect your
                    account
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                    <div className="flex items-center">
                      <Trash2 className="h-5 w-5 text-red-600 mr-3" />
                      <div>
                        <h3 className="font-medium text-red-900">
                          Delete Account
                        </h3>
                        <p className="text-sm text-red-700">
                          Permanently delete your account and all data
                        </p>
                      </div>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">Delete Account</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your account and remove your data from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Yes, delete my account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <Button
            onClick={handleSaveSettings}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 px-8"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save All Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
