import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Create the pitch
    const pitch = await prisma.pitch.create({
      data: {
        name: data.name,
        description: data.description,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        type: data.type,
        surface: data.surface,
        size: data.size,
        dimensions: data.dimensions || null,
        capacity: parseInt(data.capacity),
        pricePerHour: parseFloat(data.pricePerHour),
        isActive: true,
        isVerified: true, // Auto-verify for demo
        ownerId: data.ownerId,
      },
    });

    // Add images if provided
    if (data.images && data.images.length > 0) {
      await prisma.pitchImage.createMany({
        data: data.images.map((url: string, index: number) => ({
          pitchId: pitch.id,
          url,
          alt: `${data.name} - Image ${index + 1}`,
          order: index + 1,
        })),
      });
    }

    // Add amenities if provided
    if (data.amenities && data.amenities.length > 0) {
      const amenityMap: { [key: string]: { name: string; icon: string } } = {
        parking: { name: "Free Parking", icon: "Car" },
        changing: { name: "Changing Rooms", icon: "ShirtIcon" },
        showers: { name: "Showers", icon: "Droplets" },
        floodlights: { name: "Floodlights", icon: "Clock" },
        wifi: { name: "WiFi", icon: "Wifi" },
        refreshments: { name: "Refreshments", icon: "Coffee" },
        equipment: { name: "Equipment Rental", icon: "Package" },
        photography: { name: "Photography Area", icon: "Camera" },
      };

      await prisma.pitchAmenity.createMany({
        data: data.amenities.map((amenityId: string) => ({
          pitchId: pitch.id,
          name: amenityMap[amenityId]?.name || amenityId,
          icon: amenityMap[amenityId]?.icon || "Package",
        })),
      });
    }

    // Add availability (default 8 AM to 10 PM for all days)
    const availabilityData = [];
    for (let day = 0; day < 7; day++) {
      availabilityData.push({
        pitchId: pitch.id,
        dayOfWeek: day,
        startTime: "08:00",
        endTime: "22:00",
        isActive: true,
      });
    }

    await prisma.pitchAvailability.createMany({
      data: availabilityData,
    });

    // Return the created pitch with all relations
    const createdPitch = await prisma.pitch.findUnique({
      where: { id: pitch.id },
      include: {
        images: true,
        amenities: true,
        availability: true,
        owner: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
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
      where: {
        isActive: true,
        isVerified: true,
      },
      include: {
        images: {
          orderBy: {
            order: "asc",
          },
        },
        amenities: true,
        reviews: {
          select: {
            rating: true,
          },
        },
        owner: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(pitches);
  } catch (error) {
    console.error("Error fetching pitches:", error);
    return NextResponse.json(
      { error: "Failed to fetch pitches" },
      { status: 500 }
    );
  }
}
