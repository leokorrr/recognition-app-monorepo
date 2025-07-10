import { prisma } from '@/db'

export const getAllSubstances = async () => {
  const substances = await prisma.substance.findMany()

  return { substances }
}

export const addSubstance = async ({ title }: { title: string }) => {
  const newSubstance = await prisma.substance.create({
    data: { title }
  })

  return { newSubstance }
}

export const removeSubstance = async (id: string) => {
  return await prisma.substance.delete({
    where: { id: id }
  })
}
