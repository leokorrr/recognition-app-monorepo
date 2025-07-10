import React, { useState } from 'react'
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  TextField,
  Typography
} from '@mui/material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetcher } from '@/utils/fetcher'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Delete from '@mui/icons-material/Delete'
import Add from '@mui/icons-material/Add'

export const Results = () => {
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['results'],
    queryFn: () => fetcher(`api/results`),
    staleTime: 1000 * 60 * 5
  })

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
              <TableCell>Nazwa produktu</TableCell>
              <TableCell>Oryginalny text</TableCell>
              <TableCell>Odczytane składniki</TableCell>
              <TableCell>Zakazane substancje?</TableCell>
              <TableCell>Data</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.data?.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell
                  component='th'
                  scope='row'
                >
                  {row.title}
                </TableCell>
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
                  parsedIngredients
                  {/* {row.parsedIngredients} */}
                </TableCell>
                <TableCell
                  component='th'
                  scope='row'
                >
                  {row.hasBlacklisted ? 'Tak' : 'Nie'}
                </TableCell>
                <TableCell
                  component='th'
                  scope='row'
                >
                  {row.createdAt}
                </TableCell>
                {/* <TableCell align='right'>
                  <Button
                    variant='contained'
                    disabled={isPending}
                    sx={{
                      backgroundColor: '#c51010'
                    }}
                    onClick={() => deleteSubstance(row.id)}
                  >
                    <Delete />
                  </Button>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
