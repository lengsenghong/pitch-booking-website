// app/api/users/[id]/bookings/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        userId: params.id, // Make sure userId matches booking
      },
      include: {
        pitch: {
          include: {
            images: true, // Get pitch images
            owner: true, // optional, if you want owner info
          },
        },
        payment: true, // optional
      },
      orderBy: { bookingDate: "desc" },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}
