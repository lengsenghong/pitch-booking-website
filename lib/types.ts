import { Prisma } from "@prisma/client";

// User types
export type UserWithBookings = Prisma.UserGetPayload<{
  include: {
    bookings: {
      include: {
        pitch: true;
        payment: true;
      };
    };
  };
}>;

export type UserWithPitches = Prisma.UserGetPayload<{
  include: {
    pitches: {
      include: {
        images: true;
        bookings: true;
        reviews: true;
      };
    };
  };
}>;

// Pitch types
export type PitchWithDetails = Prisma.PitchGetPayload<{
  include: {
    owner: true;
    images: true;
    amenities: true;
    availability: true;
    reviews: {
      include: {
        user: true;
      };
    };
    bookings: true;
  };
}>;

export type PitchWithImages = Prisma.PitchGetPayload<{
  include: {
    images: true;
    amenities: true;
    reviews: true;
  };
}>;

// Booking types
export type BookingWithDetails = Prisma.BookingGetPayload<{
  include: {
    user: true;
    pitch: {
      include: {
        images: true;
        owner: true;
      };
    };
    payment: true;
    review: true;
  };
}>;

// Review types
export type ReviewWithUser = Prisma.ReviewGetPayload<{
  include: {
    user: true;
    pitch: true;
  };
}>;

// Team types
export type TeamWithMembers = Prisma.TeamGetPayload<{
  include: {
    members: {
      include: {
        user: true;
      };
    };
  };
}>;

// Search and filter types
export interface PitchFilters {
  location?: string;
  type?: "INDOOR" | "OUTDOOR";
  priceMin?: number;
  priceMax?: number;
  size?: string;
  surface?: string;
  amenities?: string[];
  date?: Date;
  startTime?: string;
  endTime?: string;
}

export interface BookingFilters {
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  pitchId?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Dashboard stats types
export interface UserDashboardStats {
  upcomingBookings: number;
  totalBookings: number;
  totalSpent: number;
  favoriteVenue?: string;
}

export interface OwnerDashboardStats {
  totalRevenue: number;
  totalBookings: number;
  activePitches: number;
  averageRating: number;
  monthlyRevenue: number;
  monthlyBookings: number;
}

// Notification types
export interface NotificationData {
  title: string;
  message: string;
  type: "BOOKING" | "PAYMENT" | "REVIEW" | "SYSTEM";
  userId: string;
}

// Payment types
export interface PaymentIntent {
  amount: number;
  currency: string;
  bookingId: string;
  method: "CARD" | "QR" | "CASH";
}

// Availability types
export interface TimeSlot {
  time: string;
  available: boolean;
  price?: number;
}

export interface DayAvailability {
  date: Date;
  slots: TimeSlot[];
}
