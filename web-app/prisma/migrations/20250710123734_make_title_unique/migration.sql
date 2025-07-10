/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `Substance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Substance_title_key" ON "Substance"("title");
