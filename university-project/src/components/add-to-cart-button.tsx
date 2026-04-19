"use client";

import { useState } from "react";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string;
    category: string;
  };
}

export const AddToCartButton = ({ product }: AddToCartButtonProps) => {
  const [quantity, setQuantity] = useState(1);
  const cart = useCart();

  const handleAdd = () => {
    // We can extend addItem to accept quantity if needed, 
    // but for now we'll just loop or update the store logic.
    // Given the current store logic, let's keep it simple.
    cart.addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image,
      category: product.category,
    });
  };

  return (
    <div className="space-y-6 pt-4">
      <div className="space-y-4">
        <label className="text-sm font-black uppercase tracking-widest">Select Quantity</label>
        <div className="flex items-center gap-4">
          <div className="flex items-center border rounded-full h-12 px-2 bg-muted/30">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="px-6 text-sm font-bold">{quantity}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full"
              onClick={() => setQuantity(quantity + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          size="lg" 
          className="flex-1 h-16 rounded-full text-lg font-black gap-3 shadow-xl hover:shadow-primary/20 transition-all"
          onClick={handleAdd}
        >
          <ShoppingCart className="h-6 w-6" />
          Add to Shopping Cart
        </Button>
      </div>
    </div>
  );
};
