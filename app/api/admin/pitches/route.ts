// app/api/pitches/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const pitches = await prisma.pitch.findMany({
      include: {
        owner: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
        bookings: {
          where: {
            status: "COMPLETED",
          },
          include: {
            payment: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const pitchesWithStats = pitches.map((pitch) => {
      const averageRating =
        pitch.reviews.length > 0
          ? pitch.reviews.reduce((sum, r) => sum + r.rating, 0) /
            pitch.reviews.length
          : 0;

      const totalRevenue = pitch.bookings.reduce((sum, b) => {
        return sum + (b.payment?.amount ? Number(b.payment.amount) : 0);
      }, 0);

      return {
        id: pitch.id,
        name: pitch.name,
        address: pitch.address,
        owner: pitch.owner,
        averageRating: Number(averageRating.toFixed(1)),
        totalRevenue,
        status: pitch.isVerified ? "verified" : "pending",
        bookingsCount: pitch._count.bookings,
        reviewsCount: pitch._count.reviews,
      };
    });

    return NextResponse.json(pitchesWithStats);
  } catch (error) {
    console.error("Error fetching pitches:", error);
    return NextResponse.json(
      { error: "Failed to fetch pitches" },
      { status: 500 }
    );
  }
}
