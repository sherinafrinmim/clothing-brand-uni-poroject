"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

import { createCheckoutSession } from "@/actions/checkout";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/auth-context";

export default function CartPage() {
  const cart = useCart();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fix hydration mismatch for persisted store
  const { user } = useAuth();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const onCheckout = async () => {
    if (!user || !user.token) {
      toast.error("Please login to proceed with checkout");
      router.push("/auth/login");
      return;
    }
    
    router.push("/checkout");
  };

  const subtotal = cart.items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + shipping;

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto space-y-6">
          <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Your cart is empty</h1>
          <p className="text-muted-foreground font-medium">
            Looks like you haven't added anything to your cart yet. Explore our latest collection and find something you love!
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

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <h1 className="text-4xl font-black tracking-tight mb-12">Shopping Bag</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Cart Items */}
        <div className="lg:col-span-8 space-y-8">
          <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b text-xs font-black uppercase tracking-widest text-muted-foreground">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          {cart.items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center pb-8 border-b"
            >
              <div className="col-span-1 md:col-span-6 flex gap-4 items-center">
                <div className="relative h-24 w-24 rounded-2xl overflow-hidden bg-muted flex-shrink-0 border">
                  <img
                    src={item.image?.startsWith('[') ? "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop" : (item.image || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop")}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-primary tracking-widest">
                    {item.category}
                  </span>
                  <Link
                    href={`/product/${item.slug}`}
                    className="block text-lg font-bold hover:underline line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <button
                    onClick={() => cart.removeItem(item.id)}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 pt-2"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Remove
                  </button>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 flex justify-center">
                <div className="flex items-center border rounded-full h-10 px-1 bg-muted/30">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full"
                    onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </Button>
                  <span className="px-4 text-sm font-bold">{item.quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-full"
                    onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 text-center">
                <span className="text-sm font-bold">${item.price.toFixed(2)}</span>
              </div>

              <div className="col-span-1 md:col-span-2 text-right">
                <span className="text-lg font-black">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-4">
            <Link
              href="/shop"
              className="text-sm font-bold flex items-center gap-2 hover:text-primary transition-colors"
            >
              <ArrowRight className="h-4 w-4 rotate-180" />
              Continue Shopping
            </Link>
            <button
               onClick={() => cart.clearCart()}
               className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 bg-muted/50 rounded-3xl p-8 space-y-6 sticky top-24 border border-border/50">
          <h2 className="text-2xl font-black tracking-tight">Order Summary</h2>
          
          <div className="space-y-4 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">Subtotal</span>
              <span className="text-sm font-bold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">Shipping estimate</span>
              <span className="text-sm font-bold">
                {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-muted-foreground">Tax estimate</span>
              <span className="text-sm font-bold">$0.00</span>
            </div>
            <div className="h-px bg-border my-2" />
            <div className="flex justify-between items-center">
              <span className="text-lg font-black">Order total</span>
              <span className="text-2xl font-black">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-4 space-y-4">
            <Button 
              size="lg" 
              onClick={onCheckout}
              disabled={isLoading}
              className="w-full h-14 rounded-full text-lg font-black gap-2 shadow-xl hover:shadow-primary/20 transition-all"
            >
              {isLoading ? "Processing..." : "Proceed to Checkout"}
              {!isLoading && <ArrowRight className="h-5 w-5" />}
            </Button>
            <p className="text-[10px] text-center text-muted-foreground font-medium px-4">
              Tax included. Shipping and discount codes calculated at checkout.
            </p>
          </div>

          <div className="pt-6 grid grid-cols-4 gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             {/* Payment Icons placeholder */}
             <div className="h-8 rounded bg-border" />
             <div className="h-8 rounded bg-border" />
             <div className="h-8 rounded bg-border" />
             <div className="h-8 rounded bg-border" />
          </div>
        </div>
      </div>
    </div>
  );
}
