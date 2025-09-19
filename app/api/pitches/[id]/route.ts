// app/api/pitches/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log("Fetching pitch with ID:", params.id);

    const pitch = await prisma.pitch.findUnique({
      where: { id: params.id },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
        amenities: true,
        reviews: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            verified: true,
          },
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (!pitch) {
      return NextResponse.json({ error: "Pitch not found" }, { status: 404 });
    }

    // Calculate average rating like in your existing code
    const averageRating =
      pitch.reviews.length > 0
        ? pitch.reviews.reduce((sum, r) => sum + r.rating, 0) /
          pitch.reviews.length
        : 0;

    const result = {
      ...pitch,
      averageRating,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching pitch:", error);
    return NextResponse.json(
      { error: "Failed to fetch pitch" },
      { status: 500 }
    );
  }
}
