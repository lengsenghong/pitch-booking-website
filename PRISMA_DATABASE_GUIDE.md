# Complete Guide to Adding Data with Prisma

## 🚀 Quick Start - Running the Seed

The easiest way to add data is using our pre-built seed file:

```bash
# Run the seed to add all test data
npm run db:seed

# Or manually
npx tsx lib/db/seed.ts
```

## 📊 Database Operations Guide

### 1. **Using Prisma Studio (Visual Interface)**

```bash
# Open Prisma Studio - Visual database browser
npm run db:studio
```

This opens a web interface where you can:
- View all tables and data
- Add, edit, delete records visually
- No coding required!

### 2. **Using Prisma Client in Code**

#### **Create a User**
```typescript
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/auth';

// Create a new user
const newUser = await prisma.user.create({
  data: {
    email: 'newuser@example.com',
    password: hashPassword('password123'),
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
    role: 'PLAYER', // or 'OWNER', 'ADMIN'
    verified: true,
  },
});
```

#### **Create a Pitch**
```typescript
// Create a new pitch
const newPitch = await prisma.pitch.create({
  data: {
    name: 'My Football Pitch',
    description: 'Great pitch for football',
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    type: 'OUTDOOR', // or 'INDOOR'
    surface: 'NATURAL_GRASS', // or 'ARTIFICIAL_GRASS', 'SYNTHETIC_TURF', 'CONCRETE'
    size: '11v11',
    capacity: 22,
    pricePerHour: 50,
    hasFloodlights: true,
    hasParking: true,
    isActive: true,
    isVerified: true,
    ownerId: 'user-id-here', // Must be an existing user with OWNER role
  },
});
```

#### **Create a Booking**
```typescript
// Create a booking
const booking = await prisma.booking.create({
  data: {
    userId: 'player-user-id',
    pitchId: 'pitch-id',
    bookingDate: new Date('2025-02-01'),
    startTime: '14:00',
    endTime: '15:00',
    duration: 60,
    totalAmount: 50,
    status: 'CONFIRMED',
    teamName: 'My Team',
  },
});
```

### 3. **Database Commands**

```bash
# Generate Prisma client after schema changes
npm run db:generate

# Push schema changes to database
npm run db:push

# Create and run migrations
npm run db:migrate

# Reset database (WARNING: Deletes all data)
npm run db:reset

# Open Prisma Studio
npm run db:studio
```

## 🛠️ Creating Custom Seed Scripts

### Create a new seed file:

```typescript
// lib/db/custom-seed.ts
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/lib/auth';

const prisma = new PrismaClient();

async function customSeed() {
  console.log('🌱 Adding custom data...');

  // Add your custom users
  const customUser = await prisma.user.create({
    data: {
      email: 'custom@example.com',
      password: hashPassword('mypassword'),
      firstName: 'Custom',
      lastName: 'User',
      role: 'OWNER',
      verified: true,
    },
  });

  // Add custom pitch
  const customPitch = await prisma.pitch.create({
    data: {
      name: 'Custom Sports Complex',
      description: 'My custom pitch description',
      address: '456 Custom St',
      city: 'Custom City',
      state: 'CA',
      zipCode: '90210',
      type: 'INDOOR',
      surface: 'ARTIFICIAL_GRASS',
      size: '7v7',
      capacity: 14,
      pricePerHour: 75,
      isActive: true,
      isVerified: true,
      ownerId: customUser.id,
    },
  });

  console.log('✅ Custom data added!');
}

customSeed()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### Run your custom seed:
```bash
npx tsx lib/db/custom-seed.ts
```

## 📋 Available Data Models

### **User Roles**
- `PLAYER` - Can book pitches
- `OWNER` - Can list and manage pitches  
- `ADMIN` - Platform administration

### **Pitch Types**
- `INDOOR` - Indoor facilities
- `OUTDOOR` - Outdoor facilities

### **Surface Types**
- `NATURAL_GRASS`
- `ARTIFICIAL_GRASS` 
- `SYNTHETIC_TURF`
- `CONCRETE`

### **Booking Status**
- `PENDING` - Awaiting confirmation
- `CONFIRMED` - Confirmed booking
- `COMPLETED` - Game finished
- `CANCELLED` - Cancelled booking
- `REJECTED` - Rejected by owner

## 🔍 Querying Data

### **Find Users**
```typescript
// Find all users
const users = await prisma.user.findMany();

// Find user by email
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' }
});

// Find users with bookings
const usersWithBookings = await prisma.user.findMany({
  include: {
    bookings: {
      include: {
        pitch: true
      }
    }
  }
});
```

### **Find Pitches**
```typescript
// Find all active pitches
const pitches = await prisma.pitch.findMany({
  where: {
    isActive: true,
    isVerified: true
  },
  include: {
    images: true,
    amenities: true,
    reviews: true
  }
});

// Find pitches by city
const cityPitches = await prisma.pitch.findMany({
  where: {
    city: 'New York'
  }
});
```

## 🚨 Important Notes

1. **Always hash passwords** when creating users:
   ```typescript
   password: hashPassword('plaintext-password')
   ```

2. **Use existing IDs** for relationships:
   ```typescript
   ownerId: 'existing-user-id' // Must exist in database
   ```

3. **Check required fields** in the schema before creating records

4. **Use transactions** for complex operations:
   ```typescript
   await prisma.$transaction([
     prisma.user.create({ data: userData }),
     prisma.pitch.create({ data: pitchData })
   ]);
   ```

## 🎯 Quick Test Accounts

After running `npm run db:seed`, you can use these accounts:

**Admin:** `admin@fieldplay.com` / `admin123`
**Owner:** `owner1@fieldplay.com` / `owner123`  
**Player:** `player1@fieldplay.com` / `player123`

## 🔧 Troubleshooting

- **Schema errors**: Run `npm run db:generate` after schema changes
- **Connection issues**: Check your `.env` DATABASE_URL
- **Data conflicts**: Use `npm run db:reset` to start fresh
- **Missing relations**: Ensure referenced IDs exist before creating records

Happy coding! 🚀