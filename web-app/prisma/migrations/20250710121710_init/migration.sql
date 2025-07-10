-- CreateTable
CREATE TABLE "Substance" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Substance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Result" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "ocrText" TEXT NOT NULL,
    "parsedIngredients" TEXT[],
    "hasBlacklisted" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResultDetectedSubstance" (
    "id" TEXT NOT NULL,
    "resultId" TEXT NOT NULL,
    "substanceId" TEXT NOT NULL,

    CONSTRAINT "ResultDetectedSubstance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ResultDetectedSubstance_resultId_substanceId_key" ON "ResultDetectedSubstance"("resultId", "substanceId");

-- AddForeignKey
ALTER TABLE "ResultDetectedSubstance" ADD CONSTRAINT "ResultDetectedSubstance_resultId_fkey" FOREIGN KEY ("resultId") REFERENCES "Result"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResultDetectedSubstance" ADD CONSTRAINT "ResultDetectedSubstance_substanceId_fkey" FOREIGN KEY ("substanceId") REFERENCES "Substance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
