import Link from "next/link";
import { XCircle, ArrowLeft, ShoppingBag } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CheckoutCancelPage() {
  return (
    <div className="container mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center">
      <div className="max-w-2xl space-y-8">
        <div className="h-32 w-32 bg-rose-50 rounded-full flex items-center justify-center mx-auto border border-rose-100">
          <XCircle className="h-16 w-16 text-rose-600" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl font-black tracking-tight tracking-tighter">Payment Cancelled</h1>
          <p className="text-xl text-muted-foreground font-medium">
            Your payment was not completed. Don't worry, your items are still in your cart and we're ready 
            to help you complete your purchase whenever you're ready.
          </p>
        </div>

        <div className="bg-muted/50 p-8 rounded-3xl border border-border/50 text-left space-y-4 max-w-md mx-auto">
          <p className="text-sm font-bold text-muted-foreground text-center">
            If you're having trouble with your payment, please try a different method or contact our support team.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link
            href="/shop"
            className={cn(
              buttonVariants({ size: "lg", variant: "outline" }),
              "rounded-full px-8 h-14 text-lg font-black gap-2"
            )}
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Shop
          </Link>
          <Link
            href="/cart"
            className={cn(
              buttonVariants({ size: "lg" }),
              "rounded-full px-8 h-14 text-lg font-black gap-2 shadow-xl"
            )}
          >
            Review My Cart
            <ShoppingBag className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
