"use client";

import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { adminGetOrders, adminGetUsers } from "@/actions/admin";
import { getProducts } from "@/actions/products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, ShoppingCart, Users } from "lucide-react";
import { SectionReveal } from "@/components/animations/section-reveal";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ orders: 0, revenue: 0, users: 0, products: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.token) return;
      try {
        const [ordersRes, usersRes, productsRes] = await Promise.all([
          adminGetOrders(user.token),
          adminGetUsers(user.token),
          getProducts()
        ]);
        
        const totalRevenue = ordersRes
          .filter((order: any) => order.status?.toLowerCase() !== 'cancelled')
          .reduce((acc: number, order: any) => acc + Number(order.totalAmount || order.total || 0), 0);

        setStats({
          orders: ordersRes.length,
          revenue: totalRevenue,
          users: usersRes.length,
          products: productsRes.length
        });
      } catch (err) {
        console.error("Failed to load admin stats", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, [user]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground font-medium mt-1">
          Welcome back to the command center, {user?.name}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SectionReveal delay={0.1} direction="up">
          <Card className="rounded-[2rem] border-none shadow-xl shadow-blue-500/5 bg-blue-500/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-blue-600">Total Revenue</CardTitle>
              <ShoppingCart className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">${isLoading ? "..." : stats.revenue.toFixed(2)}</div>
            </CardContent>
          </Card>
        </SectionReveal>

        <SectionReveal delay={0.2} direction="up">
          <Card className="rounded-[2rem] border-none shadow-xl shadow-emerald-500/5 bg-emerald-500/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-emerald-600">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{isLoading ? "..." : stats.orders}</div>
            </CardContent>
          </Card>
        </SectionReveal>

        <SectionReveal delay={0.3} direction="up">
          <Card className="rounded-[2rem] border-none shadow-xl shadow-purple-500/5 bg-purple-500/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-purple-600">Total Users</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{isLoading ? "..." : stats.users}</div>
            </CardContent>
          </Card>
        </SectionReveal>

        <SectionReveal delay={0.4} direction="up">
          <Card className="rounded-[2rem] border-none shadow-xl shadow-rose-500/5 bg-rose-500/5">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-rose-600">Active Products</CardTitle>
              <Package className="h-4 w-4 text-rose-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{isLoading ? "..." : stats.products}</div>
            </CardContent>
          </Card>
        </SectionReveal>
      </div>
    </div>
  );
}
