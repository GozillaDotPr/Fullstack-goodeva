'use client';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v14-appRouter';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { ReactNode, useMemo } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  const theme = useMemo(() => createTheme({
    palette: {
      mode: 'dark',
      text: {
        secondary: 'rgba(255, 255, 255, 0.7)',
      }
    },
  }), []);

  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}