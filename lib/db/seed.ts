import { PrismaClient, UserRole, PitchType, SurfaceType, BookingStatus } from '@prisma/client';
import { hashPassword } from '@/lib/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@fieldplay.com',
      password: hashPassword('admin123'),
      firstName: 'System',
      lastName: 'Administrator',
      phone: '+1234567888',
      role: UserRole.ADMIN,
      verified: true,
    },
  });

  const superAdmin = await prisma.user.create({
    data: {
      email: 'superadmin@fieldplay.com',
      password: hashPassword('super123'),
      firstName: 'Super',
      lastName: 'Admin',
      phone: '+1234567889',
      role: UserRole.ADMIN,
      verified: true,
    },
  });

  // Create pitch owners
  const owner1 = await prisma.user.create({
    data: {
      email: 'owner1@fieldplay.com',
      password: hashPassword('owner123'),
      firstName: 'John',
      lastName: 'Smith',
      phone: '+1234567890',
      role: UserRole.OWNER,
      verified: true,
    },
  });

  const owner2 = await prisma.user.create({
    data: {
      email: 'owner2@fieldplay.com',
      password: hashPassword('owner123'),
      firstName: 'Sarah',
      lastName: 'Johnson',
      phone: '+1234567891',
      role: UserRole.OWNER,
      verified: true,
    },
  });

  const owner3 = await prisma.user.create({
    data: {
      email: 'owner3@fieldplay.com',
      password: hashPassword('owner123'),
      firstName: 'Michael',
      lastName: 'Brown',
      phone: '+1234567892',
      role: UserRole.OWNER,
      verified: true,
    },
  });

  const owner4 = await prisma.user.create({
    data: {
      email: 'owner4@fieldplay.com',
      password: hashPassword('owner123'),
      firstName: 'Emma',
      lastName: 'Wilson',
      phone: '+1234567893',
      role: UserRole.OWNER,
      verified: true,
    },
  });

  // Create players
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@fieldplay.com',
      password: hashPassword('user123'),
      firstName: 'Mike',
      lastName: 'Wilson',
      phone: '+1234567894',
      role: UserRole.USER,
      verified: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@fieldplay.com',
      password: hashPassword('user123'),
      firstName: 'Emma',
      lastName: 'Davis',
      phone: '+1234567895',
      role: UserRole.USER,
      verified: true,
    },
  });

  // Create pitches
  const pitch1 = await prisma.pitch.create({
    data: {
      name: 'Elite Sports Center',
      description: 'Experience football at its finest in our state-of-the-art indoor facility. With premium artificial grass, professional lighting, and top-tier amenities.',
      address: '123 Main St',
      city: 'Downtown District',
      state: 'CA',
      zipCode: '12345',
      type: PitchType.INDOOR,
      surface: SurfaceType.ARTIFICIAL_GRASS,
      size: '11v11',
      dimensions: '100m x 60m',
      capacity: 22,
      pricePerHour: 75,
      hasFloodlights: true,
      hasParking: true,
      hasChangingRooms: true,
      hasShowers: true,
      hasWifi: true,
      isActive: true,
      isVerified: true,
      ownerId: owner1.id,
    },
  });

  const pitch2 = await prisma.pitch.create({
    data: {
      name: 'Green Valley Football Club',
      description: 'Beautiful outdoor facility with natural grass and excellent drainage system. Perfect for competitive matches and training.',
      address: '456 Park Ave',
      city: 'North Side',
      state: 'CA',
      zipCode: '12346',
      type: PitchType.OUTDOOR,
      surface: SurfaceType.NATURAL_GRASS,
      size: '7v7',
      dimensions: '70m x 50m',
      capacity: 14,
      pricePerHour: 50,
      hasFloodlights: true,
      hasParking: true,
      hasChangingRooms: true,
      hasRefreshments: true,
      isActive: true,
      isVerified: true,
      ownerId: owner1.id,
    },
  });

  const pitch3 = await prisma.pitch.create({
    data: {
      name: 'City Arena Complex',
      description: 'Modern indoor complex with synthetic turf and professional-grade facilities. Ideal for small-sided games.',
      address: '789 Central Park Rd',
      city: 'Central Park',
      state: 'CA',
      zipCode: '12347',
      type: PitchType.INDOOR,
      surface: SurfaceType.SYNTHETIC_TURF,
      size: '5v5',
      dimensions: '40m x 30m',
      capacity: 10,
      pricePerHour: 90,
      hasFloodlights: true,
      hasParking: true,
      hasChangingRooms: true,
      hasEquipmentRental: true,
      hasWifi: true,
      isActive: true,
      isVerified: true,
      ownerId: owner2.id,
    },
  });

  // Add pitch images
  await prisma.pitchImage.createMany({
    data: [
      {
        pitchId: pitch1.id,
        url: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg',
        alt: 'Elite Sports Center main view',
        order: 1,
      },
      {
        pitchId: pitch2.id,
        url: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg',
        alt: 'Green Valley Football Club field',
        order: 1,
      },
      {
        pitchId: pitch3.id,
        url: 'https://images.pexels.com/photos/1171084/pexels-photo-1171084.jpeg',
        alt: 'City Arena Complex interior',
        order: 1,
      },
    ],
  });

  // Add pitch amenities
  await prisma.pitchAmenity.createMany({
    data: [
      { pitchId: pitch1.id, name: 'Free Parking', icon: 'Car' },
      { pitchId: pitch1.id, name: 'Changing Rooms', icon: 'ShirtIcon' },
      { pitchId: pitch1.id, name: 'Floodlights', icon: 'Clock' },
      { pitchId: pitch1.id, name: 'WiFi', icon: 'Wifi' },
      { pitchId: pitch1.id, name: 'Showers', icon: 'Droplets' },
      
      { pitchId: pitch2.id, name: 'Free Parking', icon: 'Car' },
      { pitchId: pitch2.id, name: 'Changing Rooms', icon: 'ShirtIcon' },
      { pitchId: pitch2.id, name: 'Refreshments', icon: 'Coffee' },
      
      { pitchId: pitch3.id, name: 'Free Parking', icon: 'Car' },
      { pitchId: pitch3.id, name: 'Changing Rooms', icon: 'ShirtIcon' },
      { pitchId: pitch3.id, name: 'Equipment Rental', icon: 'Package' },
      { pitchId: pitch3.id, name: 'WiFi', icon: 'Wifi' },
    ],
  });

  // Add pitch availability (Monday to Sunday, 8 AM to 10 PM)
  const pitches = [pitch1, pitch2, pitch3];
  for (const pitch of pitches) {
    for (let day = 0; day < 7; day++) {
      await prisma.pitchAvailability.create({
        data: {
          pitchId: pitch.id,
          dayOfWeek: day,
          startTime: '08:00',
          endTime: '22:00',
          isActive: true,
        },
      });
    }
  }

  // Create sample bookings
  const booking1 = await prisma.booking.create({
    data: {
      userId: user1.id,
      pitchId: pitch1.id,
      bookingDate: new Date('2025-01-20'),
      startTime: '14:00',
      endTime: '15:00',
      duration: 60,
      totalAmount: 75,
      status: BookingStatus.CONFIRMED,
      teamName: 'Thunder FC',
    },
  });

  const booking2 = await prisma.booking.create({
    data: {
      userId: user2.id,
      pitchId: pitch2.id,
      bookingDate: new Date('2025-01-22'),
      startTime: '18:00',
      endTime: '20:00',
      duration: 120,
      totalAmount: 100,
      status: BookingStatus.PENDING,
      teamName: 'Lightning United',
    },
  });

  // Create sample payments
  await prisma.payment.create({
    data: {
      bookingId: booking1.id,
      amount: 75,
      method: 'CARD',
      status: 'COMPLETED',
      paidAt: new Date(),
    },
  });

  // Create sample reviews
  await prisma.review.create({
    data: {
      userId: user1.id,
      pitchId: pitch1.id,
      bookingId: booking1.id,
      rating: 5,
      comment: 'Excellent facility with great amenities. The artificial grass was in perfect condition!',
    },
  });

  // Create sample team
  const team1 = await prisma.team.create({
    data: {
      name: 'Thunder FC',
      description: 'Competitive football team looking for regular matches',
    },
  });

  // Add team members
  await prisma.teamMember.createMany({
    data: [
      {
        userId: user1.id,
        teamId: team1.id,
        role: 'CAPTAIN',
      },
      {
        userId: user2.id,
        teamId: team1.id,
        role: 'MEMBER',
      },
    ],
  });

  // Create admin settings
  await prisma.adminSettings.createMany({
    data: [
      {
        key: 'platform_commission',
        value: '10',
        description: 'Platform commission percentage',
      },
      {
        key: 'booking_cancellation_hours',
        value: '24',
        description: 'Hours before booking when cancellation is allowed',
      },
      {
        key: 'auto_approve_bookings',
        value: 'false',
        description: 'Automatically approve all bookings',
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
  console.log('📧 Test Account Credentials:');
  console.log('');
  console.log('🔴 ADMIN ACCOUNTS:');
  console.log(`   ${admin.email} / admin123`);
  console.log(`   ${superAdmin.email} / super123`);
  console.log('');
  console.log('🟡 OWNER ACCOUNTS:');
  console.log(`   ${owner1.email} / owner123`);
  console.log(`   ${owner2.email} / owner123`);
  console.log(`   ${owner3.email} / owner123`);
  console.log(`   ${owner4.email} / owner123`);
  console.log('');
  console.log('🟢 USER ACCOUNTS:');
  console.log(`   ${user1.email} / user123`);
  console.log(`   ${user2.email} / user123`);
  console.log('');
  console.log(`Created pitches: ${pitch1.name}, ${pitch2.name}, ${pitch3.name}`);
  console.log(`Created bookings: ${booking1.id}, ${booking2.id}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });