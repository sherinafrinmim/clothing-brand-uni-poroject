"use client";

import { useAuth } from "@/context/auth-context";
import { useCart } from "@/hooks/use-cart";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense, useRef } from "react";
import { finalizeOrder } from "@/actions/checkout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, ShoppingBag, ArrowRight, Loader2, Home } from "lucide-react";
import Link from "next/link";

function SuccessContent() {
  const { user } = useAuth();
  const clearCart = useCart((state) => state.clearCart);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(8);
  const fulfillmentAttempted = useRef(false);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId || !user?.token || fulfillmentAttempted.current) {
      if (!sessionId || !user?.token) setStatus("error");
      return;
    }

    fulfillmentAttempted.current = true;

    const fulfill = async () => {
      const res = await finalizeOrder(sessionId, user.token);
      if (res.error) {
        setStatus("error");
      } else {
        setOrderId(res.orderId);
        setStatus("success");
        clearCart(); // Clear local cart upon success
      }
    };

    fulfill();
  }, [searchParams, user, clearCart]);

  useEffect(() => {
    if (status === "success" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (status === "success" && countdown === 0) {
      router.push("/");
    }
  }, [status, countdown, router]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <Loader2 className="h-16 w-16 text-primary animate-spin" />
        <h2 className="text-2xl font-black tracking-tight">Verifying payment...</h2>
        <p className="text-muted-foreground font-medium">Please don't close this page while we finalize your order.</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center max-w-md mx-auto">
        <div className="h-20 w-20 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 rotate-180" />
        </div>
        <h2 className="text-3xl font-black tracking-tight">Something went wrong</h2>
        <p className="text-muted-foreground font-medium">
          We couldn't verify your payment session. If you believe this is an error, please contact support with your Stripe session ID.
        </p>
        <Button asChild className="rounded-full px-8 h-12">
            <Link href="/cart">Back to Cart</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-20 px-4 animate-in fade-in zoom-in-95 duration-700">
      <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[3rem] overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-primary p-12 text-center text-white space-y-4">
             <div className="h-24 w-24 bg-white/20 rounded-full flex items-center justify-center mx-auto backdrop-blur-sm border border-white/20">
                <CheckCircle2 className="h-14 w-14 text-white" />
             </div>
             <h1 className="text-5xl font-black tracking-tighter">Order Success!</h1>
             <p className="text-primary-foreground/80 font-bold text-lg">Your items are on their way to you.</p>
          </div>
          
          <div className="p-12 space-y-10 text-center">
            <div className="space-y-2">
                <p className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Order ID</p>
                <p className="text-2xl font-mono font-black text-black">#{orderId || "000000"}</p>
            </div>

            <div className="bg-muted/30 p-8 rounded-[2rem] border border-border/50 space-y-4 text-left">
                <h3 className="font-black text-lg">What's next?</h3>
                <ul className="space-y-3">
                    <li className="flex gap-3 text-sm font-medium items-start">
                        <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                        <p>A confirmation email has been sent to your registered address.</p>
                    </li>
                    <li className="flex gap-3 text-sm font-medium items-start">
                        <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                        <p>Our team is currently preparing your package for shipment.</p>
                    </li>
                    <li className="flex gap-3 text-sm font-medium items-start">
                        <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                        <p>You can track the status of your order in your profile dashboard.</p>
                    </li>
                </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="rounded-full px-10 h-14 text-lg font-black shadow-lg shadow-primary/20 transition-all">
                    <Link href="/" className="gap-2">
                        Back to Home <Home className="h-5 w-5" />
                    </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-10 h-14 text-lg font-bold border-2">
                    <Link href="/orders" className="gap-2">
                        View Orders <ShoppingBag className="h-5 w-5" />
                    </Link>
                </Button>
            </div>
            
            <p className="text-sm font-bold text-muted-foreground animate-pulse">
                Redirecting to home page in <span className="text-primary">{countdown}</span> seconds...
            </p>
          </div>
        </CardContent>
      </Card>
      
      <p className="text-center mt-12 text-sm font-medium text-muted-foreground">
        Need help? <Link href="/support" className="text-primary font-black hover:underline">Contact our Support Team</Link>
      </p>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
        </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
