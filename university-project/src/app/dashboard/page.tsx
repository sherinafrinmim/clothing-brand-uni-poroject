"use client";

import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getOrders } from "@/actions/orders";
import { SectionReveal } from "@/components/animations/section-reveal";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, User, Package, Settings, ArrowRight, CreditCard } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { user, isMounted } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isMounted && !user) {
      router.push("/");
    }
  }, [isMounted, user, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getOrders();
      setOrders(data);
      setIsLoading(false);
    };
    fetchOrders();
  }, []);

  if (!isMounted || !user) {
    return null; // Or a loading spinner
  }

  const recentOrders = orders.slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 space-y-12">
      <SectionReveal className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic">Welcome back, <span className="text-primary p-2 bg-primary/5 rounded-2xl">{user.name}</span></h1>
        <p className="text-muted-foreground text-lg font-medium">Here's an overview of your recent activity and account status.</p>
      </SectionReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <SectionReveal delay={0.1} direction="up">
          <Card className="border-none bg-primary/5 hover:bg-primary/10 transition-colors rounded-[2.5rem]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-primary">Total Orders</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{isLoading ? "..." : orders.length}</div>
              <p className="text-xs text-muted-foreground font-medium">Across all time</p>
            </CardContent>
          </Card>
        </SectionReveal>

        <SectionReveal delay={0.2} direction="up">
          <Card className="border-none bg-emerald-500/5 hover:bg-emerald-500/10 transition-colors rounded-[2.5rem]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-emerald-600">Rewards Points</CardTitle>
              <CreditCard className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">1,250</div>
              <p className="text-xs text-muted-foreground font-medium">Next reward at 1,500</p>
            </CardContent>
          </Card>
        </SectionReveal>

        <SectionReveal delay={0.3} direction="up">
          <Card className="border-none bg-purple-500/5 hover:bg-purple-500/10 transition-colors rounded-[2.5rem]">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-purple-600">Account Type</CardTitle>
              <User className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black">{user.role === "ADMIN" ? "Administrator" : "VIP Gold"}</div>
              <p className="text-xs text-muted-foreground font-medium">Free shipping enabled</p>
            </CardContent>
          </Card>
        </SectionReveal>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Orders List */}
        <SectionReveal delay={0.4} className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Recent Orders</h2>
            <Link href="/orders" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
              View All Orders <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          
          <div className="space-y-4">
            {isLoading ? (
               <div className="p-12 bg-muted/20 rounded-[2rem] text-center">
                 <p className="text-muted-foreground font-medium animate-pulse">Loading orders...</p>
               </div>
            ) : recentOrders.length > 0 ? recentOrders.map((order: any) => (
              <div key={order.id} className="flex items-center justify-between p-6 bg-muted/20 border border-border/50 rounded-[2rem] hover:bg-muted/30 transition-all hover:scale-[1.01] hover:shadow-xl hover:shadow-primary/5 group">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-white border border-border/50 flex items-center justify-center p-2 shadow-sm group-hover:rotate-6 transition-transform">
                    <ShoppingBag className="h-7 w-7 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-lg">Order #{order.id}</span>
                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <span className="text-xl font-black">${Number(order.total).toFixed(2)}</span>
                  <div className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                    order.status === "DELIVERED" ? "bg-emerald-500/10 text-emerald-600" : "bg-primary/10 text-primary"
                  )}>
                    {order.status}
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-12 bg-muted/20 rounded-[2rem] text-center border-2 border-dashed border-border/50">
                <p className="text-muted-foreground font-medium text-lg">No recent orders found.</p>
                <Link href="/shop" className="text-primary font-bold hover:underline mt-2 inline-block">Shop now</Link>
              </div>
            )}
          </div>
        </SectionReveal>

        {/* Quick Actions */}
        <SectionReveal delay={0.5} className="space-y-6">
          <h2 className="text-2xl font-bold tracking-tight">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4">
            <Link href="/profile" className={cn(buttonVariants({ variant: "outline" }), "group justify-start h-20 rounded-[2rem] border-border/50 bg-white hover:bg-primary hover:text-white hover:scale-[1.02] shadow-sm transition-all gap-4 text-md font-bold px-6")}>
              <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-white/20">
                <User className="h-5 w-5 text-primary group-hover:text-white" />
              </div>
              Manage Profile
            </Link>
            <Link href="/orders" className={cn(buttonVariants({ variant: "outline" }), "group justify-start h-20 rounded-[2rem] border-border/50 bg-white hover:bg-primary hover:text-white hover:scale-[1.02] shadow-sm transition-all gap-4 text-md font-bold px-6")}>
              <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-white/20">
                <Package className="h-5 w-5 text-primary group-hover:text-white" />
              </div>
              Order History
            </Link>
            <Link href="/shop" className={cn(buttonVariants({ variant: "outline" }), "group justify-start h-20 rounded-[2rem] border-border/50 bg-white hover:bg-primary hover:text-white hover:scale-[1.02] shadow-sm transition-all gap-4 text-md font-bold px-6")}>
              <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-white/20">
                <ShoppingBag className="h-5 w-5 text-primary group-hover:text-white" />
              </div>
              Continue Shopping
            </Link>
          </div>
        </SectionReveal>
      </div>
    </div>
  );
}
