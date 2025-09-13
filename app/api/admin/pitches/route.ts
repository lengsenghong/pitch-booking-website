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
            email: true,
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

    // Calculate additional stats for each pitch
    const pitchesWithStats = pitches.map((pitch) => {
      // Calculate average rating
      const averageRating =
        pitch.reviews.length > 0
          ? pitch.reviews.reduce((sum, review) => sum + review.rating, 0) /
            pitch.reviews.length
          : 0;

      // Calculate total revenue
      const totalRevenue = pitch.bookings.reduce((sum, booking) => {
        return (
          sum + (booking.payment?.amount ? Number(booking.payment.amount) : 0)
        );
      }, 0);

      return {
        ...pitch,
        averageRating: Number(averageRating.toFixed(1)),
        totalRevenue,
        status: pitch.isVerified ? "verified" : "pending",
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
