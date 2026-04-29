'use client'

import useSWR from 'swr';
import { TrendingUp, TrendingDown, ShoppingCart, Star, DollarSign, BarChart3, Eye } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/component/Card'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/component/Dialog"
import { Button } from '@/component/Button';
import React, { useState } from 'react';
import CountUp from 'react-countup';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const COLORS = ['#a78bfa', '#3b82f6', '#10b981', '#f59e0b', '#ef4444']

const iconMap: Record<string, React.ElementType> = {
  DollarSign: DollarSign,
  ShoppingCart: ShoppingCart,
  BarChart3: BarChart3,
  Star: Star,
};



export default function Home() {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const { data: response, isLoading, error } = useSWR(`${baseUrl}/api/v1/sales`, fetcher);

  const salesData = response?.data || [];

  const handleOpen = (productId: string) => {
    setSelectedProductId(productId);
    console.log("Viewing product:", productId);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="flex flex-col flex-1 w-full bg-zinc-50 font-sans dark:bg-black">
      <main className="min-h-screen w-full p-4 sm:p-6 lg:p-8 bg-background dark:bg-gradient-to-br dark:from-background dark:via-background dark:to-primary/5">
        <div className="mx-auto max-w-7xl space-y-6 lg:space-y-8">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Overview Dashboard</h1>
            <p className="text-sm sm:text-base text-foreground/60">Welcome back! Here&apos;s your Mini AI Sales Prediction System.</p>
            <p className="text-sm sm:text-base text-foreground/60">
              Please note that all data shown here is dummy data and may not be entirely consistent.
            </p>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-1">
            <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Sales Data</CardTitle>
                <CardDescription>Sales data from the database</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center py-8 text-primary animate-pulse">Memuat Data...</div>
                ) : error ? (
                  <div className="flex justify-center py-8 text-red-500">Gagal memuat data dari {baseUrl}</div>
                ) : (
                  <div className="w-full overflow-x-auto pb-2 custom-scrollbar">
                    <table className="w-full text-sm text-left min-w-[600px]">
                      <thead className="bg-primary/5 text-foreground/80 font-medium border-b border-primary/10">
                        <tr>
                          <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">ID</th>
                          <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">Product Name</th>
                          <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">Status</th>
                          <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">Qty Sold</th>
                          <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">Discount</th>
                          <th scope="col" className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-primary/10 text-foreground/80">
                        {salesData.map((product: any) => (
                          <tr key={product.id} className="hover:bg-primary/5 transition-colors">
                            <td className="px-4 py-3 sm:px-6 sm:py-4 font-medium text-foreground whitespace-nowrap">{product.product_id}</td>
                            <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">{product.product_name}</td>
                            <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded-full text-xs ${product.status === 'Laris' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                                {product.status}
                              </span>
                            </td>
                            <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">{product.jumlah_penjualan}</td>
                            <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">{product.diskon}%</td>
                            <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">{formatCurrency(product.harga)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}