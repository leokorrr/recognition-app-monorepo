import { prisma } from '@/db'

export const getAllResults = async () => {
  const results = await prisma.result.findMany({
    include: {
      detectedSubstances: {
        include: {
          substance: true // 👈 this pulls the full Substance object
        }
      }
    },
    orderBy: { createdAt: 'desc' } // sort by createdAt in descending order
  })

  return { results }
}

export const createResult = async (data: any) => {
  const { title, ocrText, hasBlacklisted, detectedSubstances } = data

  const newResult = await prisma.result.create({
    data: {
      title,
      ocrText,
      hasBlacklisted
    }
  })

  await prisma.resultDetectedSubstance.createMany({
    data: detectedSubstances.map((substance) => ({
      resultId: newResult.id,
      substanceId: substance.id
    })),
    skipDuplicates: true
  })

  return { newSubstance: newResult }
}
