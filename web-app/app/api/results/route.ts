import { NextRequest, NextResponse } from 'next/server'
import { ERR_GENERAL, generalActionError } from '../utils/errors/errorMessages'
import { createResult, getAllResults } from './results.service'

export async function GET() {
  try {
    const { results } = await getAllResults()

    return NextResponse.json({
      data: results
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

  // * Get image

  // * Send image to google vision

  // * Parse response from google vision

  // * Compare result to substances DB

  // * Compose data object

  console.log(data)

  // * Add data to Database
  try {
    await createResult(data)

    // * Update Project Manager

    return NextResponse.json({ data })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: generalActionError('Creating', 'Result') },
      { status: 500 }
    )
  }
}
