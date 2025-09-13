import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    const bookings = await prisma.booking.findMany({
      where: {
        userId: userId,
      },
      include: {
        pitch: {
          include: {
            images: {
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
        payment: true,
        review: true,
      },
      orderBy: {
        bookingDate: 'desc',
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}