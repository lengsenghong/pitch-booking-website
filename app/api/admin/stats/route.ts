import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get total counts
    const totalUsers = await prisma.user.count();
    const totalPitches = await prisma.pitch.count();
    const totalBookings = await prisma.booking.count();

    // Get active users (users who have logged in recently or have bookings)
    const activeUsers = await prisma.user.count({
      where: {
        OR: [
          {
            bookings: {
              some: {
                createdAt: {
                  gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
                },
              },
            },
          },
          {
            updatedAt: {
              gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
            },
          },
        ],
      },
    });

    // Get new users today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsersToday = await prisma.user.count({
      where: {
        createdAt: {
          gte: today,
        },
      },
    });

    // Get pending verifications
    const pendingVerifications = await prisma.user.count({
      where: {
        verified: false,
      },
    });

    // Calculate total revenue
    const completedPayments = await prisma.payment.findMany({
      where: {
        status: "COMPLETED",
      },
    });
    const totalRevenue = completedPayments.reduce((sum, payment) => {
      return sum + Number(payment.amount);
    }, 0);

    // Calculate monthly growth (simplified - comparing this month to last month)
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const lastMonth = new Date(thisMonth);
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    const thisMonthBookings = await prisma.booking.count({
      where: {
        createdAt: {
          gte: thisMonth,
        },
      },
    });

    const lastMonthBookings = await prisma.booking.count({
      where: {
        createdAt: {
          gte: lastMonth,
          lt: thisMonth,
        },
      },
    });

    const monthlyGrowth =
      lastMonthBookings > 0
        ? ((thisMonthBookings - lastMonthBookings) / lastMonthBookings) * 100
        : 0;

    const stats = {
      totalUsers,
      totalPitches,
      totalBookings,
      totalRevenue,
      monthlyGrowth: Number(monthlyGrowth.toFixed(1)),
      activeUsers,
      newUsersToday,
      pendingVerifications,
      reportedIssues: 0, // This would need a separate issues/reports table
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
