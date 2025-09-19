import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { action, ownerNote } = await request.json(); // action: "APPROVE" or "DENY"

    if (!["APPROVE", "DENY"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be APPROVE or DENY" },
        { status: 400 }
      );
    }

    const newStatus = action === "APPROVE" ? "CANCELLED" : "CONFIRMED";

    const updatedBooking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        status: newStatus,
        ...(action === "APPROVE" && { cancelledAt: new Date() }),
        ...(ownerNote && { notes: ownerNote }),
      },
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        pitch: {
          select: {
            name: true,
          },
        },
      },
    });

    // TODO: Send notification to user about decision

    return NextResponse.json(updatedBooking);
  } catch (error) {
    console.error("Error processing cancellation:", error);
    return NextResponse.json(
      { error: "Failed to process cancellation request" },
      { status: 500 }
    );
  }
}
