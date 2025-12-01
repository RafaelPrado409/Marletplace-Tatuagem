/*
  Warnings:

  - A unique constraint covering the columns `[name,city]` on the table `Studio` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "Studio_city_state_idx" ON "Studio"("city", "state");

-- CreateIndex
CREATE UNIQUE INDEX "Studio_name_city_key" ON "Studio"("name", "city");
