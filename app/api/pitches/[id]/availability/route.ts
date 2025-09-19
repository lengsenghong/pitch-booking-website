import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const dateStr = searchParams.get("date");
    if (!dateStr)
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      );

    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();

    const availability = await prisma.pitchAvailability.findMany({
      where: { pitchId: params.id, dayOfWeek, isActive: true },
    });

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const bookings = await prisma.booking.findMany({
      where: {
        pitchId: params.id,
        bookingDate: { gte: startOfDay, lte: endOfDay },
        status: { in: ["PENDING", "CONFIRMED"] },
      },
      select: { startTime: true, endTime: true },
    });

    const availableSlots: string[] = [];
    const bookedSlots: string[] = [];

    if (availability.length) {
      availability.forEach((slot) => {
        const startHour = parseInt(slot.startTime.split(":")[0]);
        const endHour = parseInt(slot.endTime.split(":")[0]);
        for (let h = startHour; h < endHour; h++)
          availableSlots.push(formatTimeSlot(h));
      });
    } else {
      for (let h = 8; h <= 22; h++) availableSlots.push(formatTimeSlot(h));
    }

    bookings.forEach((b) =>
      bookedSlots.push(formatTimeSlot(parseInt(b.startTime.split(":")[0])))
    );

    return NextResponse.json({
      availableSlots: availableSlots.filter((s) => !bookedSlots.includes(s)),
      bookedSlots,
    });
  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      { error: "Failed to fetch availability" },
      { status: 500 }
    );
  }
}

function formatTimeSlot(hour: number) {
  if (hour === 0) return "12:00 AM";
  if (hour < 12) return `${hour}:00 AM`;
  if (hour === 12) return "12:00 PM";
  return `${hour - 12}:00 PM`;
}
