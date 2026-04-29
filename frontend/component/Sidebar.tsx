'use client';

import { useState, useEffect } from 'react';
import {
  Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Toolbar, Divider
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LayoutDashboard, Settings, LogOut } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

import { useSidebarStore } from '@/store/useSidebar';
import { useStore } from "@/store/useStore";

const menuItems = [
  { text: 'Dashboard', icon: LayoutDashboard, path: '/' },
];

function useIsMobile(breakpoint = 900) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < breakpoint);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [breakpoint]);

  return isMobile;
}

const Sidebar = () => {
  const theme = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const isMobile = useIsMobile();

  const isOpenRaw = useStore(useSidebarStore, (state) => state.isOpen);
  const isOpen = isOpenRaw ?? false; 
  const toggle = useSidebarStore((state) => state.toggle); 

  const drawerWidthOpen = 240;
  const drawerWidthClose = 65;
  const drawerWidth = isMobile ? drawerWidthOpen : (isOpen ? drawerWidthOpen : drawerWidthClose);

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={isMobile ? isOpen : true}
      onClose={toggle}
      ModalProps={{ keepMounted: true }}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        transition: 'width 0.3s ease',
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          overflowX: 'hidden',
          transition: 'width 0.3s ease',
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary
        },
      }}
    >
      <Toolbar />
      <List>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => {
                  router.push(item.path);
                  if (isMobile) toggle();
                }}
                selected={isActive}
                sx={{
                  '&:hover': { bgcolor: theme.palette.action.hover }
                }}
              >
                <ListItemIcon sx={{ color: isActive ? theme.palette.primary.main : theme.palette.text.secondary }}>
                  <Icon size={20} />
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ opacity: isMobile ? 1 : (isOpen ? 1 : 0) }} 
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      <Divider />
      
    </Drawer>
  );
};

export default Sidebar;