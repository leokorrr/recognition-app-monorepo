import { prisma } from '@/db'

export const getAllResults = async () => {
  const results = await prisma.result.findMany()

  return { results }
}

export const createResult = async (data: any) => {
  const newResult = await prisma.result.create({
    data
  })

  return { newSubstance: newResult }
}
