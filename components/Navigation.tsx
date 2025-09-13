"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Bell,
  ChevronDown,
  Search,
  Home,
  Calendar,
  Building,
  HelpCircle,
  TrendingUp,
  Users,
  Plus,
  BarChart3,
  Wallet,
  Star,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get current user from localStorage
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      try {
        const userData = JSON.parse(currentUser);
        setUser({
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          role: userData.role?.toLowerCase() || "user",
          avatar: userData.avatar || null,
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }

    // Handle scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationItems = [
    { name: "Home", href: "/", icon: Home, color: "emerald" },
    { name: "Find Pitches", href: "/pitches", icon: Search, color: "blue" },
    {
      name: "How it Works",
      href: "/how-it-works",
      icon: HelpCircle,
      color: "orange",
    },
    { name: "Support", href: "/support", icon: Shield, color: "pink" },
  ];

  const ownerNavItems = [
    { name: "Home", href: "/", icon: Home, color: "emerald" },
    { name: "Browse Pitches", href: "/pitches", icon: Search, color: "blue" },
    {
      name: "Owner Dashboard",
      href: "/dashboard/owner",
      icon: Building,
      color: "emerald",
    },
    { name: "Add New Pitch", href: "/list-pitch", icon: Plus, color: "green" },
    { name: "Support", href: "/support", icon: Shield, color: "pink" },
  ];

  const adminNavItems = [
    { name: "Home", href: "/", icon: Home, color: "emerald" },
    {
      name: "Dashboard",
      href: "/dashboard/admin",
      icon: TrendingUp,
      color: "emerald",
    },
    { name: "Browse Pitches", href: "/pitches", icon: Search, color: "blue" },
    { name: "Support", href: "/support", icon: Shield, color: "pink" },
  ];

  const userNavItems = [
    { name: "Home", href: "/", icon: Home, color: "emerald" },
    { name: "Find Pitches", href: "/pitches", icon: Search, color: "blue" },
    {
      name: "My Dashboard",
      href: "/dashboard/user",
      icon: Calendar,
      color: "purple",
    },
    {
      name: "How it Works",
      href: "/how-it-works",
      icon: HelpCircle,
      color: "orange",
    },
    { name: "Support", href: "/support", icon: Shield, color: "pink" },
  ];

  // Safely determine navigation items based on user role
  let navItems = navigationItems;

  if (user && user.role) {
    if (user.role === "admin") {
      navItems = adminNavItems;
    } else if (user.role === "owner") {
      navItems = ownerNavItems;
    } else if (user.role === "user") {
      navItems = userNavItems;
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/";
  };

  return (
    <nav
      className={`top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50"
          : "bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative">
              <img
                src="/logo-fieldplay.png"
                alt="FieldPlay Logo"
                className="w-10 h-10 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                onError={(e) => {
                  // Fallback to text logo if image fails to load
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove(
                    "hidden"
                  );
                }}
              />
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 hidden">
                <span className="text-white font-bold text-lg">FP</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
            <div className="ml-3">
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                FieldPlay
              </span>
              <div className="text-xs text-emerald-600 font-medium -mt-1">
                Book • Play • Enjoy
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-center w-12 h-12 text-gray-700 hover:text-${item.color}-600 hover:bg-${item.color}-50 rounded-xl transition-all duration-300 group relative transform hover:scale-105 hover:shadow-lg`}
              >
                <item.icon className="h-5 w-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" />
                {/* Active indicator */}
                <div
                  className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-${item.color}-500 to-${item.color}-600 rounded-full group-hover:w-8 transition-all duration-300`}
                ></div>
                {/* Glow effect */}
                <div
                  className={`absolute inset-0 rounded-xl bg-${item.color}-100 opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                ></div>
              </Link>
            ))}
          </div>

          {/* Desktop User Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {!user && (
              <Link href="/auth/register">
                <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                  Sign Up
                </Button>
              </Link>
            )}

            {/* Quick Search */}
            <div className="relative hidden xl:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search pitches..."
                className="pl-10 pr-4 py-2.5 w-72 bg-gray-50/80 backdrop-blur-sm border-gray-200 focus:bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 rounded-xl transition-all duration-300 placeholder:text-gray-400"
              />
            </div>

            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="relative hover:bg-emerald-50 hover:text-emerald-600 transition-all duration-300 rounded-xl p-2.5 group"
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 text-xs bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 animate-pulse shadow-lg">
                0
              </Badge>
              <div className="absolute inset-0 rounded-xl bg-emerald-100 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </Button>

            {/* User Menu */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-3 hover:bg-emerald-50 transition-all duration-300 px-4 py-2.5 rounded-xl group transform hover:scale-105"
                  >
                    <div className="flex items-center space-x-3">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-9 h-9 rounded-full object-cover border-2 border-emerald-200 group-hover:border-emerald-300 transition-colors duration-300"
                        />
                      ) : (
                        <div className="w-9 h-9 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                          <User className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <div className="hidden xl:block text-left">
                        <div className="text-sm font-semibold text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-xs text-emerald-600 capitalize font-medium">
                          {user.role}
                        </div>
                      </div>
                      <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-emerald-500 transition-colors duration-300" />
                    </div>
                    <div className="absolute inset-0 rounded-xl bg-emerald-100 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-72 p-3 bg-white/95 backdrop-blur-lg border border-gray-200/50 shadow-xl rounded-2xl"
                >
                  <div className="px-3 py-2 border-b border-gray-100 mb-2">
                    <p className="text-sm font-semibold text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                    <Badge
                      variant="outline"
                      className="mt-2 text-xs capitalize bg-emerald-50 text-emerald-700 border-emerald-200"
                    >
                      {user.role}
                    </Badge>
                  </div>
                  <DropdownMenuItem className="flex items-center px-3 py-2.5 hover:bg-emerald-50 rounded-xl transition-colors duration-200">
                    <User className="h-4 w-4 mr-3 text-gray-500" />
                    <Link href="/profile" className="w-full">
                      Profile Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center px-3 py-2.5 hover:bg-emerald-50 rounded-xl transition-colors duration-200">
                    <Settings className="h-4 w-4 mr-3 text-gray-500" />
                    <Link href="/settings" className="w-full">
                      Account Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center px-3 py-2.5 hover:bg-emerald-50 rounded-xl transition-colors duration-200">
                    <Bell className="h-4 w-4 mr-3 text-gray-500" />
                    <span>Notifications</span>
                  </DropdownMenuItem>
                  {user.role === "owner" && (
                    <>
                      <DropdownMenuItem className="flex items-center px-3 py-2.5 hover:bg-blue-50 rounded-xl transition-colors duration-200">
                        <BarChart3 className="h-4 w-4 mr-3 text-blue-500" />
                        <span>Analytics</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center px-3 py-2.5 hover:bg-purple-50 rounded-xl transition-colors duration-200">
                        <Wallet className="h-4 w-4 mr-3 text-purple-500" />
                        <span>Earnings</span>
                      </DropdownMenuItem>
                    </>
                  )}
                  {user.role === "admin" && (
                    <>
                      <DropdownMenuItem className="flex items-center px-3 py-2.5 hover:bg-blue-50 rounded-xl transition-colors duration-200">
                        <Users className="h-4 w-4 mr-3 text-blue-500" />
                        <span>User Management</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="flex items-center px-3 py-2.5 hover:bg-purple-50 rounded-xl transition-colors duration-200">
                        <Building className="h-4 w-4 mr-3 text-purple-500" />
                        <span>Platform Settings</span>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator className="my-2" />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex items-center px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors duration-200"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            {/* Mobile notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 text-xs bg-red-500 hover:bg-red-500">
                3
              </Badge>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover:bg-emerald-50 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-lg">
            <div className="px-4 py-6 space-y-3">
              {/* Mobile Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search pitches..."
                  className="pl-10 pr-4 py-3 w-full bg-gray-50 border-gray-200 focus:bg-white focus:border-emerald-300"
                />
              </div>

              {/* Mobile Navigation Items */}
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3.5 text-gray-700 hover:text-${item.color}-600 hover:bg-${item.color}-50 rounded-xl transition-all duration-300 font-medium group transform hover:scale-105 hover:shadow-lg relative`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5 mr-3 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300" />
                  {item.name}
                  <div
                    className={`absolute inset-0 rounded-xl bg-${item.color}-100 opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                  ></div>
                </Link>
              ))}

              {!user && (
                <Link
                  href="/auth/register"
                  className="flex items-center px-4 py-3.5 text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 rounded-xl transition-all duration-300 font-semibold text-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 mb-4"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up Free
                </Link>
              )}

              {/* Mobile User Section */}
              {user && (
                <div className="border-t border-gray-100/50 pt-4 mt-4">
                  <div className="flex items-center px-4 py-4 bg-gradient-to-r from-emerald-50 via-blue-50 to-purple-50 rounded-xl mb-3 border border-emerald-100 shadow-lg">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-emerald-300 shadow-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <div className="ml-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                      <Badge
                        variant="outline"
                        className="mt-1 text-xs capitalize bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-700 border-emerald-200 shadow-sm"
                      >
                        {user.role}
                      </Badge>
                    </div>
                  </div>

                  <Link
                    href="/profile"
                    className="flex items-center px-4 py-3 text-gray-700 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-300 hover:shadow-md transform hover:scale-105"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-5 w-5 mr-3" />
                    Profile Settings
                  </Link>
                  <Link
                    href="/settings"
                    className="flex items-center px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300 hover:shadow-md transform hover:scale-105"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="h-5 w-5 mr-3" />
                    Account Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 hover:shadow-md transform hover:scale-105"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
