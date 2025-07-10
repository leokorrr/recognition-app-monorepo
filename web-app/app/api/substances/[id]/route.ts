import { NextRequest, NextResponse } from 'next/server'
import { removeSubstance } from '../substance.service'
import { generalActionError } from '../../utils/errors/errorMessages'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params
  try {
    await removeSubstance(id)

    return NextResponse.json({ data: true })
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: generalActionError('Removing', 'Substance') },
      { status: 500 }
    )
  }
}
