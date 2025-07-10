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

export const Substances = () => {
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['substances'],
    queryFn: () => fetcher(`api/substances`),
    staleTime: 1000 * 60 * 5
  })

  const { mutate: deleteSubstance, isPending } = useMutation({
    mutationFn: (id) => fetcher(`api/substances/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries(['substances'])
    }
  })

  const { mutate: addSubstance, isPending: isAddingSubstancePending } = useMutation({
    mutationFn: (formData: { value: string }) =>
      fetcher(`api/substances/`, {
        method: 'POST',
        body: JSON.stringify({ title: formData.value })
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['substances'])
    }
  })

  const [value, setValue] = useState('')

  const handleAdd = () => {
    if (!value.trim()) return
    addSubstance({ value })
    setValue('')
  }

  console.log(data)

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
      <Box sx={{ maxWidth: 650, mb: '32px' }}>
        <Box
          display='flex'
          gap={2}
          alignItems='center'
        >
          <TextField
            label='Add item'
            variant='outlined'
            size='small'
            sx={{
              backgroundColor: 'white'
            }}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            fullWidth
            disabled={isAddingSubstancePending}
          />
          <Button
            variant='contained'
            onClick={handleAdd}
            sx={{ whiteSpace: 'nowrap' }}
            disabled={isAddingSubstancePending}
          >
            Dodaj
          </Button>
        </Box>
      </Box>
      <TableContainer
        sx={{ maxWidth: 650 }}
        component={Paper}
      >
        <Table
          sx={{ maxWidth: 650 }}
          aria-label='simple table'
        >
          <TableHead>
            <TableRow>
              <TableCell>Nazwa substancji</TableCell>
              <TableCell></TableCell>
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
                <TableCell align='right'>
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
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}
