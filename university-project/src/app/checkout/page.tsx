"use client";

import { useAuth } from "@/context/auth-context";
import { useCart } from "@/hooks/use-cart";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, ArrowLeft, ArrowRight, Truck } from "lucide-react";
import Link from "next/link";
import { createOrder } from "@/actions/orders";
import { createCheckoutSession } from "@/actions/checkout";

export default function CheckoutPage() {
  const { user } = useAuth();
  const cart = useCart();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState("");

  useEffect(() => {
    setIsMounted(true);
    if (isMounted && (!user || cart.items.length === 0)) {
       router.push("/cart");
    }
  }, [isMounted, user, cart.items, router]);

  if (!isMounted || !user) return null;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      toast.error("Please provide a shipping address");
      return;
    }

    try {
      setIsLoading(true);
      
      // 1. Create Order in Backend
      const order = await createOrder({
        items: cart.items.map(item => ({ product: item.id, quantity: item.quantity })),
        shippingAddress: address
      }, user.token);

      // 2. Create Stripe Session
      const session = await createCheckoutSession(order.id, user.token);

      if (session.error) {
        toast.error(session.error);
        return;
      }

      if (session.url) {
        window.location.href = session.url;
      }
    } catch (error: any) {
      toast.error(error.message || "Checkout failed");
    } finally {
      setIsLoading(false);
    }
  };

  const subtotal = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-6xl">
      <div className="flex items-center gap-4 mb-10">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-4xl font-black tracking-tight">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7 space-y-8">
          <Card className="border-none shadow-2xl shadow-primary/5 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-primary/5 p-8 border-b border-primary/10">
              <CardTitle className="text-2xl font-black flex items-center gap-3">
                <Truck className="h-6 w-6 text-primary" />
                Shipping Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleCheckout} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-black uppercase tracking-widest text-muted-foreground">Detailed Shipping Address</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="E.g. 123 Street Name, Apartment 4B, New York, NY 10001"
                    className="flex w-full rounded-[1.5rem] border border-input bg-background px-4 py-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                  <p className="text-[10px] text-muted-foreground font-medium px-2 italic">
                    We currently only ship within the continental US.
                  </p>
                </div>
                
                <div className="pt-4">
                     <Button 
                        type="submit" 
                        size="lg" 
                        className="w-full h-14 rounded-full text-lg font-black gap-2 shadow-xl hover:shadow-primary/20 transition-all"
                        disabled={isLoading}
                     >
                        {isLoading ? "Preparing secure payment..." : "Pay with Stripe"}
                        {!isLoading && <ArrowRight className="h-5 w-5" />}
                     </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 flex items-center gap-4">
                <div className="h-10 w-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                    <Truck className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="text-sm font-black text-emerald-900">Priority Shipping</h4>
                    <p className="text-xs font-medium text-emerald-700">2-4 Business Days</p>
                </div>
             </div>
             <div className="p-6 bg-blue-50 rounded-[2rem] border border-blue-100 flex items-center gap-4">
                <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200">
                    <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="text-sm font-black text-blue-900">Secure Packaging</h4>
                    <p className="text-xs font-medium text-blue-700">Eco-friendly materials</p>
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-muted/50 rounded-[3rem] p-10 space-y-8 sticky top-24 border border-border/10">
          <h2 className="text-2xl font-black tracking-tight flex items-center justify-between">
            Summary
            <span className="text-xs font-bold text-muted-foreground uppercase">{cart.items.length} items</span>
          </h2>
          
          <div className="space-y-4 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
            {cart.items.map(item => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="h-16 w-16 rounded-xl overflow-hidden bg-white border border-border/50 flex-shrink-0">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">{item.name}</p>
                  <p className="text-xs font-medium text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <div className="ml-auto text-sm font-black">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>

          <div className="h-px bg-border/50" />

          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-muted-foreground">Subtotal</span>
              <span className="font-bold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-muted-foreground">Shipping</span>
              <span className="font-bold">{shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between items-center text-xl pt-4">
              <span className="font-black">Total</span>
              <span className="font-black text-primary">${total.toFixed(2)}</span>
            </div>
          </div>

          <p className="text-[10px] text-center text-muted-foreground font-medium bg-white/50 py-3 rounded-2xl border border-border/30">
            By completing your purchase you agree to our Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
}
