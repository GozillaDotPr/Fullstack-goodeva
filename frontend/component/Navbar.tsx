// components/Navbar.tsx
'use client';
import { alpha, useTheme } from '@mui/material/styles';
import { AppBar, Toolbar, Typography, IconButton, Box, InputBase } from '@mui/material';
import {
  Menu,
  Search,
  User
} from 'lucide-react';

import { useSidebarStore } from '@/store/useSidebar';


export default function Navbar() {
  const theme = useTheme();
  const { toggle } = useSidebarStore();
  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: 'background.paper',
        color: 'text.primary',
        boxShadow: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={toggle}
          sx={{ mr: 2 }}
        >
          <Menu size={24} />
        </IconButton>
        <Typography variant="h6" noWrap component="div">
          Goodeva Dashboard
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <Box sx={{
          position: 'relative',
          borderRadius: 1,

          bgcolor: alpha(theme.palette.text.primary, 0.05),
          '&:hover': { bgcolor: alpha(theme.palette.text.primary, 0.1) },

          marginRight: 2,
          marginLeft: 0,
          width: '100%',
          maxWidth: '400px',
          display: 'flex',
          alignItems: 'center',
          px: 2
        }}>
          <Search size={18} style={{ opacity: 0.7 }} />
          <InputBase
            placeholder="Search..."
            sx={{ color: 'inherit', ml: 1, width: '100%', fontSize: '0.9rem' }}
          />
        </Box>
        <IconButton
          color="inherit"
          edge="start"
          sx={{ mr: 2 }}
        >
          <User size={24} />
        </IconButton>


      </Toolbar>
    </AppBar>
  );
}