# FieldPlay - Football Pitch Booking Platform

A modern, full-stack football pitch booking platform built with Next.js, Prisma, and PostgreSQL. This comprehensive platform allows players to find and book football pitches while enabling pitch owners to manage their facilities and bookings.

![FieldPlay Platform](https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg)

## 🚀 Features

### 🎯 Core Features
- **Multi-role Authentication**: Players, Pitch Owners, and Admins with role-based access (accesss role in prisma studio)
- **Advanced Pitch Search**: Filter by location, type, price, size, and amenities
- **Real-time Booking System**: Interactive calendar with availability checking
- **Payment Integration**: cash in arrival or qr code 
- **User Dashboards**: Separate interfaces for players, owners, and admins
- **Review System**: Rate and review pitches after bookings
- **Team Management**: Create and manage football teams



## 🛠️ Tech Stack

- **Frontend**: Next.js 13+, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: Custom authentication system (ready for NextAuth.js)
- **UI Components**: shadcn/ui with Radix UI primitives
- **Icons**: Lucide React
- **Styling**: Tailwind CSS with custom design system

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ 
- PostgreSQL database
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repository-url>
cd fieldplay

# Install dependencies
npm install
```

### 2. Database Setup

```bash
# Make sure your PostgreSQL database is running
# Update your .env file with your database URL

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with sample data
npm run db:seed
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/fieldplay_db"

# NextAuth.js (for future implementation)
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Payment Providers (for future implementation)
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
```

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Test Accounts

The seed script creates test accounts for all user roles:

### Admin Access
- **Register as owner or user then go to prisma and assign role admin**
### Pitch Owner Accounts
- **

### Player Accounts
- **register as user**

## 📱 How to Use the Platform

### For Players:

1. **Sign Up/Login**: Create an account or use test credentials
2. **Browse Pitches**: Use the search and filter system to find perfect pitches
3. **View Details**: Check pitch amenities, pricing, and availability
4. **Book a Pitch**: Select date/time and complete booking
5. **Manage Bookings**: View upcoming and past bookings in your dashboard
6. **Rate & Review**: Leave feedback after your game (not yet)

### For Pitch Owners:

1. **Owner Dashboard**: Access comprehensive management tools
2. **Manage Pitches**: Add/edit pitch details, photos, and amenities
3. **Set Availability**: Configure available time slots and pricing
4. **Handle Bookings**: Approve/decline booking requests
5. **Track Revenue**: Monitor earnings and booking analytics
6. **Customer Management**: Communicate with players

### For Admins:

1. **Platform Overview**: Monitor overall platform statistics
2. **User Management**: Oversee all users and their activities
3. **Pitch Verification**: Approve and verify new pitch listings
4. **System Settings**: Configure platform-wide settings
5. **Analytics**: Access comprehensive platform analytics

## 🗄️ Database Schema

The application uses a comprehensive PostgreSQL schema:

### Core Models:
- **Users**: Multi-role user management
- **Pitches**: Facility details with images and amenities
- **Bookings**: Reservation system with status tracking
- **Payments**: Transaction records (ready for payment integration)
- **Reviews**: User feedback and ratings (up comming)
- **Teams**: Group management for players (up comming)

### Key Relationships:
- Users can have multiple bookings and own multiple pitches
- Pitches have availability schedules and multiple images
- Bookings are linked to users, pitches, and payments
- Reviews are tied to specific bookings for authenticity

## 🎨 Design System

### Color Palette:
- **Primary**: Emerald Green (#10B981) - Football field inspired
- **Secondary**: Blue (#3B82F6) - Trust and reliability
- **Accent**: Orange (#F97316) - Energy and action
- **Neutral**: Gray scale for text and backgrounds

### Typography:
- **Font**: Inter - Clean, modern, and highly readable
- **Hierarchy**: Clear distinction between headings and body text
- **Spacing**: Consistent 8px grid system

### Components:
- **Cards**: Elevated design with hover effects
- **Buttons**: Multiple variants with loading states
- **Forms**: Clean inputs with proper validation
- **Navigation**: Role-based menu systems

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Create and run migrations
npm run db:seed      # Seed database with sample data
npm run db:studio    # Open Prisma Studio
npm run db:reset     # Reset database (caution!)
```

## 📁 Project Structure

```
fieldplay/
├── app/                    # Next.js 13+ app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # User dashboards
│   ├── pitches/           # Pitch browsing and details
│   ├── book/              # Booking flow
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── Navigation.tsx    # Main navigation
├── lib/                   # Utility functions and configurations
│   ├── db/               # Database utilities and seed
│   ├── utils/            # Helper functions
│   ├── auth.ts           # Authentication logic
│   ├── prisma.ts         # Prisma client
│   └── types.ts          # TypeScript types
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## 🚀 Deployment

### Database Setup:
1. Create a PostgreSQL database on your hosting provider
2. Update `DATABASE_URL` in your environment variables
3. Run migrations: `npm run db:push`
4. Seed the database: `npm run db:seed`

### Environment Variables:
Ensure all required environment variables are set in production:
- `DATABASE_URL`
- `NEXTAUTH_URL` (when implementing NextAuth.js)
- `NEXTAUTH_SECRET`
- Payment provider keys (when implementing payments)

## 🔮 Future Enhancements

### Phase 2 Features:
- [ ] Real payment integration (Stripe/PayPal)
- [ ] Email notifications and reminders
- [ ] Advanced team management
- [ ] Mobile app (React Native)
- [ ] Google Maps integration
- [ ] Advanced analytics and reporting

### Phase 3 Features:
- [ ] Multi-language support
- [ ] Advanced booking rules
- [ ] Loyalty program
- [ ] API for third-party integrations
- [ ] Advanced admin tools

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Database ORM by [Prisma](https://prisma.io/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**FieldPlay** - Making football pitch booking simple, modern, and efficient! ⚽
