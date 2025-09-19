import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ownerId = params.id;

    const pitches = await prisma.pitch.findMany({
      where: {
        ownerId: ownerId,
      },
      include: {
        images: {
          orderBy: {
            order: "asc",
          },
        },
        bookings: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            payment: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        amenities: true,
        _count: {
          select: {
            bookings: true,
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
    console.error("Error fetching owner pitches:", error);
    return NextResponse.json(
      { error: "Failed to fetch pitches" },
      { status: 500 }
    );
  }
}
