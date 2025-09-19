import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { action, ownerNote } = await request.json();

    if (!["APPROVE", "DENY"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be APPROVE or DENY" },
        { status: 400 }
      );
    }

    // Check if booking exists and is in cancellation requested status
    const existingBooking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        pitch: {
          select: {
            id: true,
            name: true,
            ownerId: true,
          },
        },
        payment: {
          select: {
            id: true,
            amount: true,
            status: true,
            method: true,
          },
        },
      },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (existingBooking.status !== "CANCELLATION_REQUESTED") {
      return NextResponse.json(
        { error: "This booking is not pending cancellation" },
        { status: 400 }
      );
    }

    const newStatus = action === "APPROVE" ? "CANCELLED" : "CONFIRMED";
    const currentNotes = existingBooking.notes || "";
    const ownerResponse = ownerNote ? `\nOwner response: ${ownerNote}` : "";

    // Start a transaction to handle multiple updates
    const result = await prisma.$transaction(async (tx) => {
      // Update booking status
      const updatedBooking = await tx.booking.update({
        where: { id: params.id },
        data: {
          status: newStatus,
          notes: currentNotes + ownerResponse,
          ...(action === "APPROVE" && {
            cancelledAt: new Date(),
            cancelReason: "Approved by owner",
          }),
          updatedAt: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          pitch: {
            select: {
              id: true,
              name: true,
            },
          },
          payment: {
            select: {
              id: true,
              amount: true,
              status: true,
            },
          },
        },
      });

      // If approved and there's a payment, process refund
      if (action === "APPROVE" && existingBooking.payment) {
        await tx.payment.update({
          where: { id: existingBooking.payment.id },
          data: {
            status: "REFUNDED",
            refundedAt: new Date(),
            refundAmount: existingBooking.payment.amount,
          },
        });
      }

      // Create notification for user
      const title =
        action === "APPROVE" ? "Cancellation Approved" : "Cancellation Denied";
      const message =
        action === "APPROVE"
          ? `Your cancellation request for ${
              existingBooking.pitch.name
            } has been approved.${
              ownerNote
                ? ` Owner note: ${ownerNote}`
                : " Refund will be processed within 3-5 business days."
            }`
          : `Your cancellation request for ${
              existingBooking.pitch.name
            } has been denied.${ownerNote ? ` Reason: ${ownerNote}` : ""}`;

      await tx.notification.create({
        data: {
          userId: existingBooking.user.id,
          title,
          message,
          type: "CANCELLATION_RESPONSE",
        },
      });

      return updatedBooking;
    });

    return NextResponse.json({
      success: true,
      message: `Cancellation request ${action.toLowerCase()}d successfully`,
      booking: result,
    });
  } catch (error) {
    console.error("Error processing cancellation:", error);
    return NextResponse.json(
      { error: "Failed to process cancellation request" },
      { status: 500 }
    );
  }
}
