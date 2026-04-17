-- CreateEnum
CREATE TYPE "PhoneSegment" AS ENUM ('entry', 'budget', 'entry_mid', 'midrange', 'upper_mid', 'flagship', 'ultra_flagship');

-- CreateEnum
CREATE TYPE "EnrichmentStatus" AS ENUM ('pending', 'queued', 'processing', 'completed', 'fallback', 'failed');

-- CreateEnum
CREATE TYPE "SourceKind" AS ENUM ('gsmarena', 'kimovil', 'nanoreview');

-- CreateTable
CREATE TABLE "Phone" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "segment" "PhoneSegment" NOT NULL,
    "price" INTEGER NOT NULL,
    "performanceScore" DOUBLE PRECISION,
    "cameraScore" DOUBLE PRECISION,
    "batteryScore" DOUBLE PRECISION,
    "valueScore" DOUBLE PRECISION,
    "finalScore" DOUBLE PRECISION,
    "display" TEXT,
    "chipset" TEXT,
    "gpu" TEXT,
    "ram" INTEGER,
    "storage" INTEGER,
    "cameraMain" INTEGER,
    "cameraUltrawide" INTEGER,
    "battery" INTEGER,
    "charging" INTEGER,
    "os" TEXT,
    "releaseYear" INTEGER,
    "releaseDate" TIMESTAMP(3),
    "benchmarkScore" INTEGER,
    "aiSummary" TEXT,
    "enrichmentStatus" "EnrichmentStatus" NOT NULL DEFAULT 'pending',
    "enrichmentConfidence" DOUBLE PRECISION,
    "preferredSource" "SourceKind",
    "lastEnrichedAt" TIMESTAMP(3),
    "rawSeed" JSONB NOT NULL,
    "enrichmentPayload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Phone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "phoneId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComparisonSnapshot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "leftPhoneId" TEXT NOT NULL,
    "rightPhoneId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ComparisonSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "PhoneSource" (
    "id" TEXT NOT NULL,
    "phoneId" TEXT NOT NULL,
    "sourceKind" "SourceKind" NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "cacheKey" TEXT NOT NULL,
    "rawMarkdown" TEXT,
    "rawExtraction" JSONB,
    "fetchedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PhoneSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EnrichmentJob" (
    "id" TEXT NOT NULL,
    "phoneId" TEXT NOT NULL,
    "status" "EnrichmentStatus" NOT NULL DEFAULT 'queued',
    "provider" TEXT,
    "sourceKind" "SourceKind",
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "EnrichmentJob_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Phone_slug_key" ON "Phone"("slug");

-- CreateIndex
CREATE INDEX "Phone_segment_price_idx" ON "Phone"("segment", "price");

-- CreateIndex
CREATE INDEX "Phone_brand_model_idx" ON "Phone"("brand", "model");

-- CreateIndex
CREATE INDEX "Phone_finalScore_idx" ON "Phone"("finalScore" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Favorite_userId_createdAt_idx" ON "Favorite"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Favorite_phoneId_idx" ON "Favorite"("phoneId");

-- CreateIndex
CREATE UNIQUE INDEX "Favorite_userId_phoneId_key" ON "Favorite"("userId", "phoneId");

-- CreateIndex
CREATE INDEX "ComparisonSnapshot_userId_updatedAt_idx" ON "ComparisonSnapshot"("userId", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ComparisonSnapshot_userId_leftPhoneId_rightPhoneId_key" ON "ComparisonSnapshot"("userId", "leftPhoneId", "rightPhoneId");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "PhoneSource_cacheKey_key" ON "PhoneSource"("cacheKey");

-- CreateIndex
CREATE INDEX "PhoneSource_phoneId_sourceKind_idx" ON "PhoneSource"("phoneId", "sourceKind");

-- CreateIndex
CREATE INDEX "EnrichmentJob_status_createdAt_idx" ON "EnrichmentJob"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_phoneId_fkey" FOREIGN KEY ("phoneId") REFERENCES "Phone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComparisonSnapshot" ADD CONSTRAINT "ComparisonSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComparisonSnapshot" ADD CONSTRAINT "ComparisonSnapshot_leftPhoneId_fkey" FOREIGN KEY ("leftPhoneId") REFERENCES "Phone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComparisonSnapshot" ADD CONSTRAINT "ComparisonSnapshot_rightPhoneId_fkey" FOREIGN KEY ("rightPhoneId") REFERENCES "Phone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhoneSource" ADD CONSTRAINT "PhoneSource_phoneId_fkey" FOREIGN KEY ("phoneId") REFERENCES "Phone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnrichmentJob" ADD CONSTRAINT "EnrichmentJob_phoneId_fkey" FOREIGN KEY ("phoneId") REFERENCES "Phone"("id") ON DELETE CASCADE ON UPDATE CASCADE;
