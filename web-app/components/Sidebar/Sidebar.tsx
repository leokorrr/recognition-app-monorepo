import React from 'react'

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

const drawerWidth = 300
const navItems = [
  { icon: <ListAltIcon />, label: 'Results', path: '/' },
  { icon: <ScienceIcon />, label: 'Substances', path: '/substances' }
]
export const Sidebar = () => {
  const pathname = usePathname()
  return (
    <Drawer
      variant='permanent'
      anchor='left'
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#1b0c3e',
          color: '#fff',
          borderRight: 'none'
        }
      }}
    >
      <Box sx={{ padding: 3 }}>
        <Typography
          variant='h6'
          fontWeight='bold'
        >
          Admin Panel
        </Typography>
      </Box>
      <List>
        {navItems.map(({ icon, label, path }) => (
          <Link
            key={label}
            href={path}
            passHref
          >
            <ListItem disablePadding>
              <ListItemButton
                selected={pathname === path}
                sx={{
                  paddingY: 1.5,
                  color: '#fff',
                  '&.Mui-selected': {
                    backgroundColor: '#1A2E6C'
                  }
                }}
              >
                <ListItemIcon sx={{ color: '#fff', minWidth: 40 }}>{icon}</ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </Drawer>
  )
}
