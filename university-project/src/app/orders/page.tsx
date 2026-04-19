"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { getOrders } from "@/actions/orders";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Package, Truck, CheckCircle2, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function OrdersPage() {
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
    return null;
  }

  if (orders.length === 0 && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center mx-auto">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">No orders yet</h1>
          <p className="text-muted-foreground font-medium">
            Looks like you haven't placed any orders yet. Start shopping to see your orders here!
          </p>
          <Link 
            href="/shop" 
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-full px-8 h-14 text-lg font-bold"
            )}
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock className="h-4 w-4 text-amber-600" />;
      case "SHIPPED":
        return <Truck className="h-4 w-4 text-blue-600" />;
      case "DELIVERED":
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      default:
        return <Package className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "SHIPPED":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "DELIVERED":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-4">
          <h1 className="text-5xl font-black tracking-tight">My Orders</h1>
          <p className="text-muted-foreground font-medium">
            Check the status of your recent orders, manage returns, and discover similar products.
          </p>
        </div>
        <div className="flex items-center gap-4">
           <Button variant="outline" className="rounded-full font-bold">Past 3 months</Button>
           <Button variant="ghost" className="rounded-full font-bold">All time</Button>
        </div>
      </div>

      <div className="space-y-8">
        {isLoading ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground font-medium animate-pulse">Loading orders...</p>
          </div>
        ) : orders.map((order: any) => (
          <div 
            key={order.id}
            className="group bg-card border rounded-[32px] overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
          >
            {/* Order Header */}
            <div className="bg-muted/30 px-8 py-6 flex flex-wrap items-center justify-between gap-6 border-b">
              <div className="flex flex-wrap items-center gap-8 md:gap-12">
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order Date</p>
                    <p className="text-sm font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order Total</p>
                    <p className="text-sm font-bold text-black">${Number(order.total).toFixed(2)}</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Order Number</p>
                    <p className="text-sm font-bold">#{order.id}</p>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <Badge variant="outline" className={cn("rounded-full px-3 py-1 flex items-center gap-2 font-bold", getStatusColor(order.status))}>
                   {getStatusIcon(order.status)}
                   {order.status}
                 </Badge>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-8">
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 space-y-6">
                     {order.items.map((item: any) => (
                        <div key={item.id} className="flex gap-6 items-center last:border-none border-b pb-6 last:pb-0">
                           <div className="relative h-20 w-20 rounded-2xl overflow-hidden bg-muted flex-shrink-0 border">
                              <Image 
                                 src={item.product.images?.[0] || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853"}
                                 alt={item.product.name}
                                 fill
                                 className="object-cover"
                              />
                           </div>
                           <div className="flex-1 space-y-1">
                              <h3 className="font-bold text-lg leading-tight line-clamp-1">{item.product.name}</h3>
                              <p className="text-sm text-muted-foreground font-medium">Quantity: {item.quantity}</p>
                              <p className="text-sm font-black">${Number(item.price).toFixed(2)}</p>
                           </div>
                           <Button variant="outline" className="rounded-full text-xs font-bold shrink-0 hidden sm:flex">
                              Buy it again
                           </Button>
                        </div>
                     ))}
                  </div>

                  {/* Order Actions */}
                  <div className="lg:col-span-4 lg:border-l lg:pl-8 space-y-4">
                     <p className="text-sm font-black uppercase tracking-widest text-primary">Need Help?</p>
                     <nav className="space-y-2">
                        <Link href={`#`} className="flex items-center justify-between p-3 rounded-2xl hover:bg-muted transition-colors group/link text-sm font-bold">
                           View Order Details
                           <ChevronRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                        <Link href={`#`} className="flex items-center justify-between p-3 rounded-2xl hover:bg-muted transition-colors group/link text-sm font-bold">
                           Track Package
                           <ChevronRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                        <Link href={`#`} className="flex items-center justify-between p-3 rounded-2xl hover:bg-muted transition-colors group/link text-sm font-bold text-rose-600">
                           Request Return
                           <ChevronRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                     </nav>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
