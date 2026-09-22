-- CreateEnum
CREATE TYPE "VehicleType" AS ENUM ('SEDAN', 'SUV', 'FAMILY_CAR', 'STATION_WAGON');

-- CreateEnum
CREATE TYPE "Gearbox" AS ENUM ('MANUAL', 'AUTOMATIC');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('ECONOMY', 'PREMIUM', 'LUXURY');

-- CreateTable
CREATE TABLE "Car" (
    "id" SERIAL NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "vehicleType" "VehicleType" NOT NULL,
    "category" "Category" NOT NULL,
    "pricePerDay" INTEGER NOT NULL,
    "seats" INTEGER NOT NULL,
    "bagCapacity" INTEGER NOT NULL,
    "suitcaseCapacity" INTEGER NOT NULL,
    "gearbox" "Gearbox" NOT NULL,
    "ageRequired" INTEGER NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);
