'use client'

import useSWR from 'swr';
import { TrendingUp, TrendingDown, ShoppingCart, Star, DollarSign, BarChart3, Eye, Brain, AlertCircle, CheckCircle2, Lock, LogOut } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/component/Card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/component/Dialog"
import { Button } from '@/component/Button';
import React, { useState, useEffect } from 'react';

// --- FETCHER DENGAN AUTH HEADER ---
const fetcherWithAuth = (url: string) => {
  const token = localStorage.getItem('x-token');
  return fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'accept': 'application/json'
    }
  }).then((res) => {
    if (res.status === 401) {
      localStorage.removeItem('x-token'); // Hapus token jika expired
      window.location.reload(); // Paksa login ulang
    }
    return res.json();
  });
};

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ harga: '', diskon: '', stok: '' });
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState<{ status: string, message: string } | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

  // 1. CEK TOKEN DI LOCALSTORAGE SAAT LOAD
  useEffect(() => {
    const token = localStorage.getItem('x-token');
    setIsLoggedIn(!!token);
  }, []);

  // 2. FETCH DATA SALES (Hanya jika login)
  const { data: response, isLoading } = useSWR(isLoggedIn ? `${baseUrl}/api/v1/sales` : null, fetcherWithAuth);
  const salesData = response?.data || [];

  // 3. LOGIN HANDLER
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const result = await res.json();

      if (result.success) {
        // SIMPAN KE LOCAL STORAGE
        localStorage.setItem('x-token', result.data.token);
        setIsLoggedIn(true);
      } else {
        setLoginError(result.message || 'Invalid email or password');
      }
    } catch (err) {
      setLoginError('Server connection failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // 4. LOGOUT HANDLER
  const handleLogout = () => {
    localStorage.removeItem('x-token');
    setIsLoggedIn(false);
  };

  // 5. PREDICTION HANDLER
  const handleSubmitPrediction = async (e: React.FormEvent) => {
    e.preventDefault();
    setPredictionResult(null);
    setIsPredicting(true);

    try {
      const token = localStorage.getItem('x-token');
      const res = await fetch(`${baseUrl}/api/v1/sales/prediksi`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jumlah_penjualan: Number(formData.stok),
          harga: Number(formData.harga),
          diskon: Number(formData.diskon)
        }),
      });

      const result = await res.json();
      if (result.success) {
        setPredictionResult({ status: result.data, message: result.message });
      }
    } catch (err) {
      console.error("Prediction Error:", err);
    } finally {
      setIsPredicting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0
    }).format(amount);
  };

  if (isLoggedIn === null) return null; // Loading state sebentar

  return (
    <div className="relative flex flex-col flex-1 w-full bg-zinc-50 font-sans dark:bg-black overflow-hidden">

      {!isLoggedIn && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md px-4">
          <Card className="w-full max-w-md border-primary/20 bg-zinc-900 shadow-2xl">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Lock className="h-10 w-10 text-primary animate-pulse" />
              </div>
              <CardTitle className="text-2xl font-black uppercase italic tracking-tighter text-white">Secure Access</CardTitle>
              <CardDescription className="text-zinc-500">Provide credentials to initialize engine.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <input
                  type="email" required placeholder="Email"
                  className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white outline-none focus:ring-2 focus:ring-primary"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                />
                <input
                  type="password" required placeholder="Password"
                  className="w-full p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white outline-none focus:ring-2 focus:ring-primary"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                />
                {loginError && <div className="text-rose-500 text-xs font-bold uppercase tracking-widest">{loginError}</div>}
                <Button disabled={isLoggingIn} className="w-full h-12 bg-primary text-black font-black uppercase tracking-widest">
                  {isLoggingIn ? "Authenticating..." : "Login to Dashboard"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      <main className={`min-h-screen w-full p-4 sm:p-6 lg:p-8 bg-background dark:bg-zinc-950 transition-all duration-500 ${!isLoggedIn ? 'blur-2xl opacity-0' : 'blur-0 opacity-100'}`}>
        <div className="mx-auto max-w-7xl space-y-6 lg:space-y-8">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-primary/10 pb-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-black tracking-tighter text-primary uppercase italic">Market Intelligence</h1>
              <div className="flex items-center gap-2 text-xs text-foreground/50 uppercase font-bold tracking-widest">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                System Active & Authenticated
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button onClick={() => setIsOpen(true)} className="hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                <Brain className="h-4 w-4 mr-2" /> Prediction
              </Button>
              <Button onClick={handleLogout} variant="outline" className="border-rose-500/50 text-rose-500 hover:bg-rose-500 hover:text-white h-10 px-4 transition-all">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Table Section */}
          <div className="grid gap-4 grid-cols-1">
            <Card className="border-primary/10 bg-card/30 backdrop-blur-md">
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="py-20 text-center text-xs font-black uppercase tracking-[0.3em] text-primary animate-pulse">Syncing Encrypted Sales Data...</div>
                ) : (
                  <div className="w-full overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-primary/5 text-[10px] font-black uppercase tracking-widest text-foreground/40 border-b border-primary/10">
                        <tr>
                          <th className="px-6 py-5 tracking-[0.2em]">Product ID</th>
                          <th className="px-6 py-5">Name</th>
                          <th className="px-6 py-5">Status</th>
                          <th className="px-6 py-5">Sold</th>
                          <th className="px-6 py-5">Price</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-primary/5">
                        {salesData.map((product: any) => (
                          <tr key={product.id} className="hover:bg-primary/[0.03] transition-colors">
                            <td className="px-6 py-4 font-mono text-xs text-primary">{product.product_id}</td>
                            <td className="px-6 py-4 font-bold">{product.product_name}</td>
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-tighter border ${product.status === 'Laris' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'}`}>
                                {product.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-bold">{product.jumlah_penjualan}</td>
                            <td className="px-6 py-4 font-black italic text-primary">{formatCurrency(product.harga)}</td>
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

      {/* DIALOG TETAP SAMA SEPERTI SEBELUMNYA */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] bg-zinc-950 border-primary/20 text-white shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black italic tracking-tighter flex items-center gap-2">
              <Brain className="text-primary h-6 w-6" /> ANALYZE ENGINE
            </DialogTitle>
            <DialogDescription className="text-zinc-500 uppercase text-[10px] tracking-[0.2em] font-bold">
              Simulation Environment v1.0.4
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitPrediction} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Target Price (IDR)</label>
              <input
                type="number"
                required
                className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-800 outline-none focus:border-primary transition-all font-bold text-primary"
                placeholder="0"
                value={formData.harga}
                onChange={(e) => setFormData({ ...formData, harga: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Discount %</label>
                <input
                  type="number"
                  max="100"
                  required
                  className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-800 outline-none focus:border-primary transition-all font-bold text-primary"
                  placeholder="0"
                  value={formData.diskon}
                  onChange={(e) => setFormData({ ...formData, diskon: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Base Volume</label>
                <input
                  type="number"
                  required
                  className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-800 outline-none focus:border-primary transition-all font-bold text-primary"
                  placeholder="0"
                  value={formData.stok}
                  onChange={(e) => setFormData({ ...formData, stok: e.target.value })}
                />
              </div>
            </div>
            <Button type="submit" disabled={isPredicting} className="w-full h-12 bg-primary text-black font-black uppercase tracking-widest hover:opacity-80 transition-all">
              {isPredicting ? "Computing Data..." : "Run AI Simulation"}
            </Button>
          </form>

          {/* Result Section */}
          {!isPredicting && predictionResult && (
            <div className={`p-5 rounded-xl border-2 animate-in fade-in zoom-in duration-500 ${predictionResult.status === 'Laris'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-500'
              }`}>
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {predictionResult.status === 'Laris' ? <CheckCircle2 className="h-7 w-7" /> : <AlertCircle className="h-7 w-7" />}
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-black uppercase tracking-widest opacity-70">AI Analysis Result</div>
                  <div className="text-xl font-black uppercase italic tracking-tighter leading-none">
                    {predictionResult.status === 'Laris' ? 'LARIS MANIS' : 'TIDAK LARIS'}
                  </div>
                  <p className="text-[11px] font-bold leading-relaxed opacity-90 mt-2 uppercase tracking-tight">
                    {predictionResult.status === 'Laris'
                      ? "The parameters show a positive trend. The product is predicted to have fast stock turnover in the market."
                      : "The parameters show a weak trend. It is recommended to review the pricing strategy or increase promotions."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {isPredicting && (
            <div className="h-28 flex items-center justify-center border-2 border-dashed border-zinc-800 rounded-xl">
              <div className="text-center space-y-2">
                <div className="flex gap-1 justify-center">
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Processing Probability</div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}