"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";

interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  price: number;
  discountPrice?: number;
  image: string;
  category: string;
  rating: number;
  isNew?: boolean;
}

export const ProductCard = ({
  id,
  name,
  slug,
  price,
  discountPrice,
  image,
  category,
  rating,
  isNew,
}: ProductCardProps) => {
  const cart = useCart();
  const discountPercentage = discountPrice 
    ? Math.round(((price - discountPrice) / price) * 100) 
    : 0;

  const processedImage = image || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop";

  return (
    <div className="group relative flex flex-col bg-white overflow-hidden rounded-xl border border-border/50 hover:shadow-2xl transition-all duration-500">
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={processedImage}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <Badge className="bg-blue-600 hover:bg-blue-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border-none">
              New
            </Badge>
          )}
          {discountPercentage > 0 && (
            <Badge className="bg-rose-600 hover:bg-rose-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border-none">
              -{discountPercentage}%
            </Badge>
          )}
        </div>

        {/* Action Buttons Overlay */}
        <div className="absolute inset-x-4 bottom-4 flex translate-y-20 group-hover:translate-y-0 transition-transform duration-500 opacity-0 group-hover:opacity-100 items-center justify-between gap-3">
          <Button size="icon" variant="secondary" className="rounded-full shadow-lg h-10 w-10">
            <Heart className="h-4 w-4" />
          </Button>
          <Button 
            className="flex-1 rounded-full shadow-lg h-10 gap-2 font-semibold"
            onClick={() => cart.addItem({ id, name, slug, price, image, category })}
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Info Container */}
      <div className="flex flex-col flex-1 p-4 bg-white">
        <Link href={`/category/${category.toLowerCase()}`} className="text-xs font-semibold uppercase text-muted-foreground hover:text-primary transition-colors mb-1">
          {category}
        </Link>
        <Link href={`/product/${slug}`} className="text-sm font-bold group-hover:text-primary transition-colors line-clamp-1 mb-2">
          {name}
        </Link>
        
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-3 w-3 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"}`} 
            />
          ))}
          <span className="text-[10px] font-medium text-muted-foreground ml-1">({rating})</span>
        </div>

        <div className="mt-auto flex items-center gap-2">
          {discountPrice ? (
            <>
              <span className="text-lg font-black text-black">
                ${discountPrice.toFixed(2)}
              </span>
              <span className="text-sm font-medium text-muted-foreground line-through decoration-rose-500/50">
                ${price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-lg font-black text-black">
              ${price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
