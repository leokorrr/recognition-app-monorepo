import { NextRequest, NextResponse } from 'next/server'
import { ERR_GENERAL, generalActionError } from '../utils/errors/errorMessages'
import { createResult, getAllResults } from './results.service'
import vision from '@google-cloud/vision'
import { getAllSubstances } from '../substances/substance.service'

const client = new vision.ImageAnnotatorClient()

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
  console.log('HIT')
  // * Get body
  let file

  let buffer

  try {
    const formData = await req.formData()

    file = formData.get('file') as File
    if (!file) {
      return NextResponse.json({ message: 'No file found in request.' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    buffer = Buffer.from(arrayBuffer)
  } catch (error) {
    return NextResponse.json({ message: ERR_GENERAL }, { status: 500 })
  }

  let imageText = ''

  try {
    // 👁️ Send image buffer directly to Google Vision
    const [result] = await client.textDetection({ image: { content: buffer } })

    const detections = result.textAnnotations
    const fullText = detections?.[0]?.description || ''

    console.log('Vision detected text:', fullText)

    // Here you could parse `fullText` and compare it to substances DB
    // Example placeholder:
    // const matchedSubstances = matchToSubstances(fullText)

    // return a placeholder response for now
    imageText = fullText
  } catch (error) {
    console.error('Vision API error:', error)
    return NextResponse.json({ message: ERR_GENERAL }, { status: 500 })
  }

  // * Compare result to substances DB

  let detectedSubstances = []

  try {
    const { substances } = await getAllSubstances()

    detectedSubstances = substances.filter((substance) =>
      imageText.toLowerCase().includes(substance.title.toLowerCase())
    )
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: generalActionError('Fetching', 'Substances') },
      { status: 500 }
    )
  }

  const createResultData = {
    title: 'Result',
    ocrText: imageText,
    hasBlacklisted: detectedSubstances.length > 0,
    detectedSubstances
  }

  // * Compose data object

  // * Add data to Database
  try {
    const result = await createResult(createResultData)

    console.log({ data: result })
    // * Update Project Manager
    return NextResponse.json({ data: result })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: generalActionError('Creating', 'Result') },
      { status: 500 }
    )
  }
}
