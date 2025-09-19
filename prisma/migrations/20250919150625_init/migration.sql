-- AlterEnum
ALTER TYPE "public"."BookingStatus" ADD VALUE 'CANCELLATION_REQUESTED';

-- AlterTable
ALTER TABLE "public"."pitches" ALTER COLUMN "zipCode" DROP NOT NULL;
