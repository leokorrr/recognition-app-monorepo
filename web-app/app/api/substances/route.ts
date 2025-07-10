import { NextRequest, NextResponse } from 'next/server'
import { ERR_GENERAL, generalActionError } from '../utils/errors/errorMessages'
import { addSubstance, getAllSubstances } from './substance.service'

export async function GET() {
  try {
    const { substances } = await getAllSubstances()

    return NextResponse.json({
      data: substances
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: generalActionError('Fetching', 'Substances') },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  // * Get body
  let data

  try {
    data = await req.json()
  } catch (error) {
    return NextResponse.json({ message: ERR_GENERAL }, { status: 500 })
  }

  console.log(data)

  // * Add data to Database
  try {
    await addSubstance(data)

    return NextResponse.json({ data })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: generalActionError('Adding', 'Substance') },
      { status: 500 }
    )
  }
}
