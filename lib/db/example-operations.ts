// Example database operations using Prisma
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/lib/auth';

const prisma = new PrismaClient();

// Example: Create a new user
export async function createUser(userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'USER' | 'OWNER' | 'ADMIN';
  phone?: string;
}) {
  try {
    const user = await prisma.user.create({
      data: {
        email: userData.email.toLowerCase(),
        password: hashPassword(userData.password),
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || 'USER',
        phone: userData.phone,
        verified: true,
      },
    });
    
    console.log('✅ User created:', user.email);
    return user;
  } catch (error) {
    console.error('❌ Error creating user:', error);
    throw error;
  }
}

// Example: Create a new pitch
export async function createPitch(pitchData: {
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  type: 'INDOOR' | 'OUTDOOR';
  surface: 'NATURAL_GRASS' | 'ARTIFICIAL_GRASS' | 'SYNTHETIC_TURF' | 'CONCRETE';
  size: string;
  capacity: number;
  pricePerHour: number;
  ownerId: string;
}) {
  try {
    const pitch = await prisma.pitch.create({
      data: {
        ...pitchData,
        isActive: true,
        isVerified: true,
      },
    });
    
    console.log('✅ Pitch created:', pitch.name);
    return pitch;
  } catch (error) {
    console.error('❌ Error creating pitch:', error);
    throw error;
  }
}

// Example: Create a booking
export async function createBooking(bookingData: {
  userId: string;
  pitchId: string;
  bookingDate: Date;
  startTime: string;
  endTime: string;
  duration: number;
  totalAmount: number;
  teamName?: string;
  notes?: string;
}) {
  try {
    const booking = await prisma.booking.create({
      data: {
        ...bookingData,
        status: 'PENDING',
      },
    });
    
    console.log('✅ Booking created:', booking.id);
    return booking;
  } catch (error) {
    console.error('❌ Error creating booking:', error);
    throw error;
  }
}

// Example: Get all users with their bookings
export async function getUsersWithBookings() {
  try {
    const users = await prisma.user.findMany({
      include: {
        bookings: {
          include: {
            pitch: {
              select: {
                name: true,
                city: true,
              },
            },
          },
        },
      },
    });
    
    console.log(`✅ Found ${users.length} users`);
    return users;
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    throw error;
  }
}

// Example: Get all pitches with their details
export async function getPitchesWithDetails() {
  try {
    const pitches = await prisma.pitch.findMany({
      where: {
        isActive: true,
        isVerified: true,
      },
      include: {
        owner: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        images: true,
        amenities: true,
        reviews: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        bookings: {
          where: {
            status: 'CONFIRMED',
          },
        },
        _count: {
          select: {
            bookings: true,
            reviews: true,
          },
        },
      },
    });
    
    console.log(`✅ Found ${pitches.length} pitches`);
    return pitches;
  } catch (error) {
    console.error('❌ Error fetching pitches:', error);
    throw error;
  }
}

// Example: Update user information
export async function updateUser(userId: string, updateData: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
}) {
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });
    
    console.log('✅ User updated:', user.email);
    return user;
  } catch (error) {
    console.error('❌ Error updating user:', error);
    throw error;
  }
}

// Example: Delete a booking
export async function deleteBooking(bookingId: string) {
  try {
    await prisma.booking.delete({
      where: { id: bookingId },
    });
    
    console.log('✅ Booking deleted:', bookingId);
  } catch (error) {
    console.error('❌ Error deleting booking:', error);
    throw error;
  }
}

// Example usage function
export async function runExamples() {
  try {
    console.log('🚀 Running Prisma examples...');
    
    // Create a new user
    const newUser = await createUser({
      email: 'example@test.com',
      password: 'password123',
      firstName: 'Example',
      lastName: 'User',
      role: 'OWNER',
      phone: '+1234567890',
    });
    
    // Create a pitch for this user
    const newPitch = await createPitch({
      name: 'Example Sports Complex',
      description: 'A great place to play football',
      address: '123 Example St',
      city: 'Example City',
      state: 'CA',
      zipCode: '12345',
      type: 'OUTDOOR',
      surface: 'NATURAL_GRASS',
      size: '11v11',
      capacity: 22,
      pricePerHour: 60,
      ownerId: newUser.id,
    });
    
    // Get all users with bookings
    const users = await getUsersWithBookings();
    console.log(`Found ${users.length} users in database`);
    
    // Get all pitches
    const pitches = await getPitchesWithDetails();
    console.log(`Found ${pitches.length} pitches in database`);
    
    console.log('✅ Examples completed successfully!');
    
  } catch (error) {
    console.error('❌ Error running examples:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Uncomment to run examples
// runExamples();