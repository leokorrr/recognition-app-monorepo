import { fetcher } from '@/utils/fetcher'
import { Box, Typography } from '@mui/material'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import Button from '@mui/material/Button'

// utils/csvDownload.js

export const downloadResultsCSV = (data, filename = 'wyniki.csv') => {
  if (!data || data.length === 0) {
    console.warn('No data to download')
    return
  }

  // Transform the data to match your table structure
  const transformedData = data.map((row) => ({
    'Nazwa produktu': row.title || '',
    'Oryginalny text': row.ocrText || '',
    'Zakazane substancje':
      row.detectedSubstances?.map((ds) => ds.substance.title).join(', ') || '',
    Data: dayjs(row.createdAt).format('DD/MM/YYYY')
  }))

  // Convert to CSV
  const convertToCSV = (arr) => {
    if (!arr || arr.length === 0) return ''

    const headers = Object.keys(arr[0])
    const csvHeaders = headers.join(',')

    const csvRows = arr.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          // Handle values that contain commas, quotes, or newlines
          if (
            typeof value === 'string' &&
            (value.includes(',') || value.includes('"') || value.includes('\n'))
          ) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value || ''
        })
        .join(',')
    )

    return [csvHeaders, ...csvRows].join('\n')
  }

  const csvString = convertToCSV(transformedData)

  // Add BOM for proper UTF-8 encoding (helps with Polish characters)
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvString], { type: 'text/csv;charset=utf-8;' })

  // Create download link
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  // Trigger download
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  // Clean up
  URL.revokeObjectURL(url)
}

// Alternative version with more detailed data structure
export const downloadResultsCSVDetailed = (
  data,
  filename = 'substancje_results_detailed.csv'
) => {
  if (!data || data.length === 0) {
    console.warn('No data to download')
    return
  }

  // Flatten the data to include each detected substance as a separate row
  const flattenedData = []

  data.forEach((row) => {
    if (row.detectedSubstances && row.detectedSubstances.length > 0) {
      row.detectedSubstances.forEach((ds) => {
        flattenedData.push({
          ID: row.id,
          'Nazwa produktu': row.title || '',
          'Oryginalny text': row.ocrText || '',
          'Zakazana substancja': ds.substance.title || '',
          Data: dayjs(row.createdAt).format('DD/MM/YYYY'),
          'Pełna data': dayjs(row.createdAt).format('DD/MM/YYYY HH:mm:ss')
        })
      })
    } else {
      // Include rows with no detected substances
      flattenedData.push({
        ID: row.id,
        'Nazwa produktu': row.title || '',
        'Oryginalny text': row.ocrText || '',
        'Zakazana substancja': '',
        Data: dayjs(row.createdAt).format('DD/MM/YYYY'),
        'Pełna data': dayjs(row.createdAt).format('DD/MM/YYYY HH:mm:ss')
      })
    }
  })

  // Convert to CSV
  const convertToCSV = (arr) => {
    if (!arr || arr.length === 0) return ''

    const headers = Object.keys(arr[0])
    const csvHeaders = headers.join(',')

    const csvRows = arr.map((row) =>
      headers
        .map((header) => {
          const value = row[header]
          if (
            typeof value === 'string' &&
            (value.includes(',') || value.includes('"') || value.includes('\n'))
          ) {
            return `"${value.replace(/"/g, '""')}"`
          }
          return value || ''
        })
        .join(',')
    )

    return [csvHeaders, ...csvRows].join('\n')
  }

  const csvString = convertToCSV(flattenedData)

  // Add BOM for proper UTF-8 encoding
  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvString], { type: 'text/csv;charset=utf-8;' })

  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  URL.revokeObjectURL(url)
}

// Hook for use in your component
import { useState } from 'react'

export const useResultsCSVDownload = () => {
  const [isDownloading, setIsDownloading] = useState(false)

  const downloadCSV = async (data, filename, detailed = false) => {
    setIsDownloading(true)

    try {
      if (detailed) {
        downloadResultsCSVDetailed(data, filename)
      } else {
        downloadResultsCSV(data, filename)
      }
    } catch (error) {
      console.error('Error downloading CSV:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return { downloadCSV, isDownloading }
}

export const Results = () => {
  const { data } = useQuery({
    queryKey: ['results'],
    queryFn: () => fetcher(`api/results`),
    staleTime: 1000 * 60 * 5
  })

  const { downloadCSV, isDownloading } = useResultsCSVDownload()

  const handleDownload = () => {
    if (data?.data) {
      downloadCSV(data.data, 'substancje_results.csv')
    }
  }

  return (
    <Box sx={{ ml: '30px', color: 'black' }}>
      <Box
        sx={{
          mb: '40px',
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%'
        }}
      >
        <Typography
          variant='h5'
          fontWeight='bold'
          fontSize={32}
        >
          Substancje
        </Typography>
        <Button
          variant='contained'
          onClick={handleDownload}
          sx={{
            mb: '20px'
          }}
        >
          Pobierz CSV
        </Button>
      </Box>
      <TableContainer
        // sx={{ maxWidth: 650 }}
        component={Paper}
      >
        <Table
          // sx={{ maxWidth: 650 }}
          aria-label='simple table'
        >
          <TableHead>
            <TableRow>
              {/* <TableCell>Nazwa produktu</TableCell> */}
              <TableCell>Oryginalny text</TableCell>
              {/* <TableCell>Odczytane składniki</TableCell> */}
              <TableCell>Zakazane substancje</TableCell>
              <TableCell>Data</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data?.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                {/* <TableCell
                  component='th'
                  scope='row'
                >
                  {row.title}
                </TableCell> */}
                <TableCell
                  component='th'
                  scope='row'
                >
                  {row.ocrText}
                </TableCell>
                <TableCell
                  component='th'
                  scope='row'
                >
                  {row.detectedSubstances.map((ds) => ds.substance.title).join(', ')}
                </TableCell>
                <TableCell
                  component='th'
                  scope='row'
                >
                  {dayjs(row.createdAt).format('DD/MM/YYYY')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
