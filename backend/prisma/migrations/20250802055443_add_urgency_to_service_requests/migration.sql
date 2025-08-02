-- CreateEnum
CREATE TYPE "UrgencyLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- AlterTable
ALTER TABLE "ServiceRequest" ADD COLUMN     "urgency" "UrgencyLevel" NOT NULL DEFAULT 'MEDIUM';
