-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CLIENT', 'ARTIST', 'ADMIN');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELED', 'COMPLETED');

-- CreateTable
CREATE TABLE "Artist" (
    "id" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "bio" TEXT,
    "instagram" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Style" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Style_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArtistStyle" (
    "artistId" TEXT NOT NULL,
    "styleId" TEXT NOT NULL,

    CONSTRAINT "ArtistStyle_pkey" PRIMARY KEY ("artistId","styleId")
);

-- CreateIndex
CREATE INDEX "Artist_studioId_idx" ON "Artist"("studioId");

-- CreateIndex
CREATE UNIQUE INDEX "Style_name_key" ON "Style"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Style_slug_key" ON "Style"("slug");

-- AddForeignKey
ALTER TABLE "Artist" ADD CONSTRAINT "Artist_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "Studio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistStyle" ADD CONSTRAINT "ArtistStyle_artistId_fkey" FOREIGN KEY ("artistId") REFERENCES "Artist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArtistStyle" ADD CONSTRAINT "ArtistStyle_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "Style"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
