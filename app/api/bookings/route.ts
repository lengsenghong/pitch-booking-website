import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PaymentMethod, BookingStatus } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const {
      pitchId,
      bookingDate,
      startTime,
      totalAmount,
      teamName,
      notes,
      paymentMethod = "CARD",
      userId,
    } = await request.json();
    if (!userId)
      return NextResponse.json(
        { error: "User authentication required" },
        { status: 401 }
      );

    const bookingDateObj = new Date(bookingDate);

    const existingBooking = await prisma.booking.findFirst({
      where: {
        pitchId,
        bookingDate: bookingDateObj,
        startTime,
        status: { in: ["PENDING", "CONFIRMED"] },
      },
    });

    if (existingBooking)
      return NextResponse.json(
        { error: "Time slot no longer available" },
        { status: 409 }
      );

    const booking = await prisma.booking.create({
      data: {
        userId,
        pitchId,
        bookingDate: bookingDateObj,
        startTime,
        endTime: startTime,
        duration: 60,
        totalAmount: Number(totalAmount),
        teamName,
        notes,
        status: BookingStatus.CONFIRMED,
      },
      include: {
        pitch: { include: { images: { take: 1, orderBy: { order: "asc" } } } },
        payment: true,
      },
    });

    let dbMethod: PaymentMethod = PaymentMethod.CARD;
    if (paymentMethod.toUpperCase() === "PAYPAL")
      dbMethod = PaymentMethod.PAYPAL;
    else if (paymentMethod.toUpperCase() === "CASH")
      dbMethod = PaymentMethod.CASH;

    if (dbMethod !== PaymentMethod.CASH) {
      await prisma.payment.create({
        data: {
          bookingId: booking.id,
          amount: Number(totalAmount),
          method: dbMethod,
          status: "COMPLETED",
        },
      });
    }

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
