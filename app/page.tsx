"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  MapPin,
  Clock,
  Star,
  Users,
  Shield,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type FeaturedPitch = {
  id: string | number;
  name: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  type: "Indoor" | "Outdoor";
  size?: string;
};

type CurrentUser = {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
};

export default function Home() {
  const [featuredPitches, setFeaturedPitches] = useState<FeaturedPitch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [user, setUser] = useState<CurrentUser | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Hero images (ensure domains are allowed in next.config.js images.domains if using <Image />)
  const heroImages = [
    {
      url: "https://en.cscec.com/Auxiliary_column/The40th/zlhw/202206/P020220715559461233618.png",
      title: "Premium Indoor Facilities",
      description: "State-of-the-art indoor pitches with professional lighting",
    },
    {
      url: "https://pbs.twimg.com/media/FLKehzhVcAIHL8X.jpg",
      title: "Natural Grass Fields",
      description: "Beautiful outdoor pitches with pristine natural grass",
    },
    {
      url: "https://upload.wikimedia.org/wikipedia/commons/0/00/Svay_Rieng_Stadium.jpg",
      title: "Championship Quality",
      description: "Professional-grade pitches for competitive play",
    },
    {
      url: "https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg",
      title: "Stadium Experience",
      description: "Feel like a pro on our stadium-quality fields",
    },
  ] as const;

  // Load user (client-only) + pitches
  useEffect(() => {
    // user
    try {
      const raw = localStorage.getItem("currentUser");
      if (raw) setUser(JSON.parse(raw));
    } catch {
      // ignore
    }

    // pitches
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/pitches", {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Failed to load pitches (${res.status})`);
        const data = await res.json();

        const transformed: FeaturedPitch[] = (Array.isArray(data) ? data : [])
          .slice(0, 3)
          .map((p: any): FeaturedPitch => {
            const reviews = Array.isArray(p.reviews) ? p.reviews : [];
            const avg =
              reviews.length > 0
                ? reviews.reduce(
                    (s: number, r: any) => s + Number(r?.rating ?? 0),
                    0
                  ) / reviews.length
                : 0;
            return {
              id: p.id,
              name: p.name ?? "Unnamed pitch",
              location: p.city ?? p.address ?? "Unknown",
              price: Number(p.pricePerHour ?? 0),
              rating: Number(avg.toFixed(1)),
              image:
                p.images?.[0]?.url ??
                "https://upload.wikimedia.org/wikipedia/commons/0/00/Svay_Rieng_Stadium.jpg",
              type: p.type === "INDOOR" ? "Indoor" : "Outdoor",
              size: p.size ?? undefined,
            };
          });

        setFeaturedPitches(transformed);
      } catch (e: any) {
        if (e?.name !== "AbortError")
          setError(e?.message || "Could not load pitches");
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, []);

  const greeting = useMemo(() => {
    if (!user?.firstName) return "🚀 Now serving 500+ premium pitches";
    return `👋 Welcome back, ${user.firstName}! Ready to book your next game?`;
  }, [user?.firstName]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-20 pb-24 sm:pt-32 sm:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-blue-50" />
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply blur-xl opacity-30 animate-pulse" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply blur-xl opacity-30 animate-pulse delay-1000" />
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply blur-xl opacity-30 animate-pulse delay-2000" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="relative z-10">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                {greeting}
              </span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-emerald-600 to-gray-700 bg-clip-text text-transparent mb-6 leading-tight">
              Find Your Perfect Football Pitch
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Book premium football facilities instantly. From indoor arenas to
              championship fields, discover the perfect pitch for your next
              game.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/pitches" prefetch>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 px-8 py-4 text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  🏟️ Find Pitches Now
                </Button>
              </Link>
              <Link href="/how-it-works" prefetch>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm"
                >
                  📖 How It Works
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { label: "Premium Pitches", value: "500+" },
                { label: "Happy Players", value: "10K+" },
                { label: "Available", value: "24/7" },
              ].map((s) => (
                <div key={s.label} className="text-center group">
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
                    <div className="text-4xl font-bold text-emerald-600 mb-2 group-hover:scale-110 transition-transform">
                      {s.value}
                    </div>
                    <div className="text-gray-600 font-medium">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right – Carousel */}
          <div className="relative z-10">
            <Carousel
              className="w-full max-w-lg mx-auto"
              opts={{ align: "start", loop: true }}
            >
              <CarouselContent>
                {heroImages.map((image, i) => (
                  <CarouselItem key={i}>
                    <div className="relative group">
                      <div className="aspect-[4/3] relative overflow-hidden rounded-3xl shadow-2xl">
                        <Image
                          src={image.url}
                          alt={image.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 600px"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          priority={i === 0}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6 text-white">
                          <h3 className="text-xl font-bold mb-2">
                            {image.title}
                          </h3>
                          <p className="text-sm opacity-90">
                            {image.description}
                          </p>
                        </div>
                        <div className="absolute top-4 right-4">
                          <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
                            {i + 1} / {heroImages.length}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4 bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg border-0" />
              <CarouselNext className="right-4 bg-white/80 backdrop-blur-sm hover:bg-white shadow-lg border-0" />
            </Carousel>

            {/* Floating stats */}
            <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">4.9★</div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
              </div>
            </div>

            <div className="absolute -top-6 -right-6 bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-white/20">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">2.5K+</div>
                  <div className="text-sm text-gray-600">This Month</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pitches */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Pitches
            </h2>
            <p className="text-lg text-gray-600">
              Discover the most popular venues in your area
            </p>
          </div>

          {error && (
            <div className="max-w-2xl mx-auto mb-8 p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-center">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg" />
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 bg-gray-200 rounded mb-4" />
                    <div className="h-10 bg-gray-200 rounded" />
                  </CardContent>
                </Card>
              ))
            ) : featuredPitches.length === 0 ? (
              <div className="col-span-full text-center text-gray-600">
                No featured pitches yet.{" "}
                <Link className="text-emerald-700 underline" href="/pitches">
                  Browse all pitches
                </Link>
                .
              </div>
            ) : (
              featuredPitches.map((pitch) => (
                <Card
                  key={pitch.id}
                  className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden"
                >
                  <div className="relative h-48">
                    <Image
                      src={pitch.image}
                      alt={pitch.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 400px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-semibold text-emerald-600">
                        {pitch.type}
                      </div>
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg group-hover:text-emerald-600 transition-colors">
                          {pitch.name}
                        </CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {pitch.location}
                        </CardDescription>
                      </div>
                      <div className="flex items-center text-yellow-400">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="ml-1 text-sm font-semibold text-gray-700">
                          {pitch.rating}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex justify-between items-center">
                      <div className="text-2xl font-bold text-gray-900">
                        ${pitch.price}
                        <span className="text-sm font-normal text-gray-500">
                          /hour
                        </span>
                      </div>
                      {pitch.size && (
                        <div className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {pitch.size}
                        </div>
                      )}
                    </div>
                    <Link href={`/pitches/${pitch.id}`} prefetch>
                      <Button className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 group">
                        Book Now
                        <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <div className="text-center mt-12">
            <Link href="/pitches" prefetch>
              <Button
                variant="outline"
                size="lg"
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                View All Pitches
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose FieldPlay?</h2>
            <p className="text-lg opacity-90">
              The ultimate platform for football pitch booking
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                Icon: Clock,
                title: "Instant Booking",
                text: "Book your pitch in seconds with real-time availability",
              },
              {
                Icon: Shield,
                title: "Secure Payments",
                text: "Safe and secure payment processing with multiple options",
              },
              {
                Icon: Users,
                title: "Team Booking",
                text: "Organize and book as a team with group management",
              },
              {
                Icon: Star,
                title: "Premium Quality",
                text: "Only verified, high-quality pitches and facilities",
              },
            ].map(({ Icon, title, text }) => (
              <div key={title} className="text-center group">
                <div className="bg-white/10 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-colors">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="opacity-90">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Play?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of players already using FieldPlay to book their
              perfect pitch
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register" prefetch>
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 px-8 py-3"
                >
                  Start Booking Now
                </Button>
              </Link>
              <Link href="/pitches" prefetch>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 px-8 py-3"
                >
                  Browse Pitches
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">FP</span>
                </div>
                <span className="ml-2 text-xl font-bold">FieldPlay</span>
              </div>
              <p className="text-gray-400">
                The premier platform for football pitch booking and management.
              </p>
            </div>

            <FooterCol
              title="For Players"
              links={["Find Pitches", "Book Games", "Join Teams"]}
            />
            <FooterCol
              title="For Owners"
              links={["List Your Pitch", "Manage Bookings", "Analytics"]}
            />
            <FooterCol
              title="Support"
              links={["Help Center", "Contact Us", "Terms of Service"]}
            />
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} FieldPlay. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <ul className="space-y-2 text-gray-400">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="hover:text-white transition-colors">
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
