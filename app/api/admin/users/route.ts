import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            bookings: true,
            pitches: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Calculate additional stats for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        // Calculate total spent for users
        let totalSpent = 0;
        if (user.role === "USER") {
          const bookings = await prisma.booking.findMany({
            where: {
              userId: user.id,
              status: "COMPLETED",
            },
            include: {
              payment: true,
            },
          });
          totalSpent = bookings.reduce((sum, booking) => {
            return (
              sum +
              (booking.payment?.amount ? Number(booking.payment.amount) : 0)
            );
          }, 0);
        }

        return {
          ...user,
          totalSpent,
          status: user.verified ? "active" : "pending",
        };
      })
    );

    return NextResponse.json(usersWithStats);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
