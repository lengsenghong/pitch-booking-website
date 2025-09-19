import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const AMENITY_MAP: Record<string, { name: string; icon: string }> = {
  parking: { name: "Free Parking", icon: "Car" },
  changing: { name: "Changing Rooms", icon: "ShirtIcon" },
  showers: { name: "Showers", icon: "Droplets" },
  floodlights: { name: "Floodlights", icon: "Clock" },
  wifi: { name: "WiFi", icon: "Wifi" },
  refreshments: { name: "Refreshments", icon: "Coffee" },
  equipment: { name: "Equipment Rental", icon: "Package" },
  photography: { name: "Photography Area", icon: "Camera" },
};

interface CreatePitchBody {
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  type: string;
  surface: string;
  size: string;
  dimensions?: string;
  capacity: string | number;
  pricePerHour: string | number;
  ownerId: string;
  images?: string[];
  amenities?: string[];
}

export async function POST(request: Request) {
  try {
    const data: CreatePitchBody = await request.json();
    const capacity = Number(data.capacity);
    const pricePerHour = Number(data.pricePerHour);

    if (isNaN(capacity) || isNaN(pricePerHour)) {
      return NextResponse.json(
        { error: "Invalid capacity or pricePerHour" },
        { status: 400 }
      );
    }

    const pitch = await prisma.pitch.create({
      data: {
        name: data.name,
        description: data.description || null,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode || "",
        type: data.type as any,
        surface: data.surface as any,
        size: data.size,
        dimensions: data.dimensions || null,
        capacity,
        pricePerHour,
        isActive: true,
        isVerified: true,
        ownerId: data.ownerId,
      },
    });

    if (data.images?.length) {
      await prisma.pitchImage.createMany({
        data: data.images.map((url, i) => ({
          pitchId: pitch.id,
          url,
          alt: `${data.name} - Image ${i + 1}`,
          order: i + 1,
        })),
      });
    }

    if (data.amenities?.length) {
      await prisma.pitchAmenity.createMany({
        data: data.amenities.map((id) => ({
          pitchId: pitch.id,
          name: AMENITY_MAP[id]?.name || id,
          icon: AMENITY_MAP[id]?.icon || "Package",
        })),
      });
    }

    // Default availability 08:00-22:00
    const availabilityData = Array.from({ length: 7 }, (_, day) => ({
      pitchId: pitch.id,
      dayOfWeek: day,
      startTime: "08:00",
      endTime: "22:00",
      isActive: true,
    }));
    await prisma.pitchAvailability.createMany({ data: availabilityData });

    const createdPitch = await prisma.pitch.findUnique({
      where: { id: pitch.id },
      include: {
        images: { orderBy: { order: "asc" } },
        amenities: true,
        availability: true,
        owner: { select: { firstName: true, lastName: true, email: true } },
      },
    });

    return NextResponse.json(createdPitch);
  } catch (error) {
    console.error("Error creating pitch:", error);
    return NextResponse.json(
      { error: "Failed to create pitch" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const pitches = await prisma.pitch.findMany({
      where: { isActive: true, isVerified: true },
      include: {
        images: { orderBy: { order: "asc" } },
        amenities: true,
        reviews: { select: { rating: true } },
        owner: { select: { firstName: true, lastName: true } },
        _count: { select: { reviews: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const result = pitches.map((p) => ({
      ...p,
      averageRating: p.reviews.length
        ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
        : 0,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching pitches:", error);
    return NextResponse.json(
      { error: "Failed to fetch pitches" },
      { status: 500 }
    );
  }
}
