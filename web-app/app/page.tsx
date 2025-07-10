'use client'

import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Typography
} from '@mui/material'
import ScienceIcon from '@mui/icons-material/Science'
import ListAltIcon from '@mui/icons-material/ListAlt'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Substances } from '@/components/Substances/Substances'
import { Results } from '@/components/Results/Results'
import { Sidebar } from '@/components/Sidebar/Sidebar'

const drawerWidth = 300
const navItems = [
  { icon: <ListAltIcon />, label: 'Results', path: '/' },
  { icon: <ScienceIcon />, label: 'Substances', path: '/substances' }
]

export default function AdminLayout() {
  const pathname = usePathname()

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />

      {/* Blank content area */}
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          backgroundColor: '#f7f7f7',
          padding: 4
        }}
      >
        <Results />
      </Box>
    </Box>
  )
}
