import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/component/Providers";
import { Box, Toolbar } from "@mui/material"; // Tambahkan Toolbar

import Sidebar from "@/component/Sidebar";
import Navbar from "@/component/Navbar";

export const metadata: Metadata = {
  title: "Goodeva Dashboard",
  description: "Dashboard for managing your Goodeva application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>
        <Providers>
          <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Navbar />
            <Sidebar />
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                width: { sm: `calc(100% - 200px)` }
              }}
            >
              <Toolbar />
              {children}
            </Box>
          </Box>
        </Providers>
      </body>
    </html>
  );
}