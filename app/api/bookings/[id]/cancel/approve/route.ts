import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BookingStatus, PaymentStatus } from "@prisma/client";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { action, ownerNote } = await request.json(); // action: "APPROVE" or "DENY"

    if (!["APPROVE", "DENY"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: { payment: true, user: true, pitch: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (booking.status !== "CANCELLATION_REQUESTED") {
      return NextResponse.json(
        { error: "Booking is not pending cancellation" },
        { status: 400 }
      );
    }

    const newStatus =
      action === "APPROVE" ? BookingStatus.CANCELLED : BookingStatus.CONFIRMED;

    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        status: newStatus,
        cancelledAt: action === "APPROVE" ? new Date() : undefined,
        cancelReason: action === "APPROVE" ? "Approved by owner" : undefined,
        notes: ownerNote
          ? `${booking.notes || ""}\nOwner note: ${ownerNote}`
          : booking.notes,
      },
      include: { user: true, payment: true, pitch: true },
    });

    // Refund payment if approved
    if (action === "APPROVE" && booking.payment) {
      await prisma.payment.update({
        where: { id: booking.payment.id },
        data: {
          status: PaymentStatus.REFUNDED,
          refundedAt: new Date(),
          refundAmount: booking.payment.amount,
        },
      });
    }

    // TODO: Send notification to user about approval/denial

    return NextResponse.json({ success: true, booking: updatedBooking });
  } catch (error) {
    console.error("Error processing cancellation approval:", error);
    return NextResponse.json(
      { error: "Failed to process cancellation" },
      { status: 500 }
    );
  }
}
