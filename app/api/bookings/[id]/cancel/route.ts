import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { reason } = await request.json();

    if (!reason?.trim()) {
      return NextResponse.json(
        { error: "Cancellation reason is required" },
        { status: 400 }
      );
    }

    const existingBooking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: { user: true, pitch: { select: { ownerId: true } } },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (["CANCELLED", "COMPLETED"].includes(existingBooking.status)) {
      return NextResponse.json(
        { error: "This booking cannot be cancelled" },
        { status: 400 }
      );
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        status: "CANCELLATION_REQUESTED",
        notes: `Cancellation requested: ${reason.trim()}`,
      },
      include: { user: true, pitch: true },
    });

    // TODO: Notify owner (via email/notification system)

    return NextResponse.json({ success: true, booking: updatedBooking });
  } catch (error) {
    console.error("Error requesting cancellation:", error);
    return NextResponse.json(
      { error: "Failed to submit cancellation request" },
      { status: 500 }
    );
  }
}
