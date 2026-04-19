"use client";

import React, { useEffect, useState } from "react";
import { getProductBySlug, getProductsByCategory } from "@/actions/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Truck, ShieldCheck, RotateCcw, Heart, Share2, Info, ShoppingCart, ArrowRight } from "lucide-react";

import { AddToCartButton } from "@/components/add-to-cart-button";
import { ProductCard } from "@/components/product-card";
import { SectionReveal } from "@/components/animations/section-reveal";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { slug } = React.use(params);
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const productData = await getProductBySlug(slug);
      
      if (!productData) {
        setIsLoading(false);
        return;
      }

      setProduct(productData);

      const relatedData = await getProductsByCategory(productData.category?.slug || "");
      const mappedRelated = relatedData
        .filter((p: any) => p.slug !== slug)
        .slice(0, 4)
        .map((prod: any) => ({
          id: prod.id,
          name: prod.name,
          slug: prod.slug,
          price: Number(prod.price),
          discountPrice: prod.discountPrice ? Number(prod.discountPrice) : undefined,
          image: prod.images?.[0] || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
          category: prod.category?.name || "Uncategorized",
          rating: prod.rating || 5,
          isNew: prod.isNew || false,
        }));

      setRelatedProducts(mappedRelated);
      setIsLoading(false);
    };

    fetchData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground font-medium animate-pulse">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return notFound();
  }

  const discountPercentage = product.discountPrice 
    ? Math.round(((Number(product.price) - Number(product.discountPrice)) / Number(product.price)) * 100) 
    : 0;

  const productForCart = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: Number(product.discountPrice || product.price),
    image: product.images?.[0] || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
    category: product.category?.name || "Uncategorized",
  };

  return (
    <div className="flex flex-col gap-20 pb-20">
      <div className="container mx-auto px-4 py-12 md:py-20 lg:py-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <nav className="text-sm text-muted-foreground mb-8 font-medium">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="mx-3 text-muted-foreground/30">/</span>
          <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <span className="mx-3 text-muted-foreground/30">/</span>
          <Link href={`/category/${product.category?.slug}`} className="hover:text-primary capitalize transition-colors italic font-bold">
            {product.category?.name || "Uncategorized"}
          </Link>
          <span className="mx-3 text-muted-foreground/30">/</span>
          <span className="font-black text-foreground line-clamp-1 inline-block align-bottom max-w-[200px] tracking-tight">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Product Images */}
          <div className="space-y-6">
            <div className="relative aspect-square overflow-hidden rounded-[3rem] bg-muted border border-border/50 shadow-2xl shadow-primary/5 group">
              <Image
                src={product.images?.[0] || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
                priority
              />
              {product.isNew && (
                <Badge className="absolute top-8 left-8 h-8 px-4 bg-primary text-[10px] font-black uppercase tracking-widest border-none shadow-lg">
                  New Arrival
                </Badge>
              )}
              {discountPercentage > 0 && (
                <Badge className="absolute top-8 right-8 h-8 px-4 bg-rose-600 text-[10px] font-black uppercase tracking-widest border-none shadow-lg">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-4 gap-4 px-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`relative aspect-square rounded-[1.5rem] bg-muted border-2 transition-all cursor-pointer hover:border-primary/50 ${i === 0 ? "border-primary shadow-lg shadow-primary/10" : "border-border/50 opacity-60 hover:opacity-100 shadow-sm"}`}>
                  <Image
                      src={product.images?.[0] || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853"}
                      alt={`${product.name} thumbnail ${i + 1}`}
                      fill
                      className="object-cover p-1.5 rounded-[1.5rem]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col space-y-10 lg:pt-4">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Link 
                  href={`/category/${product.category?.slug}`}
                  className="text-xs font-black uppercase tracking-[0.2em] text-primary hover:underline bg-primary/5 px-3 py-1.5 rounded-full"
                >
                  {product.category?.name}
                </Link>
                <div className="h-1 w-8 bg-border/50 rounded-full" />
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">{product.slug}</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.9] text-black">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1 bg-yellow-400/10 px-3 py-1.5 rounded-2xl border border-yellow-400/20">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-4 w-4 ${i < Math.floor(product.rating || 5) ? "fill-yellow-400 text-yellow-400" : "fill-muted text-muted"}`} 
                    />
                  ))}
                  <span className="text-sm font-black ml-2 text-yellow-600">{product.rating || 5.0}</span>
                </div>
                <div className="h-6 w-px bg-border" />
                <span className="text-sm font-bold text-muted-foreground border-b-2 border-dotted border-muted-foreground/30 cursor-pointer hover:text-primary transition-colors">
                  12 Verified Reviews
                </span>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-baseline gap-4">
                {product.discountPrice ? (
                  <>
                    <span className="text-5xl font-black text-black tracking-tighter">
                      ${Number(product.discountPrice).toFixed(2)}
                    </span>
                    <span className="text-2xl font-bold text-muted-foreground line-through decoration-rose-500/50 decoration-4">
                      ${Number(product.price).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span className="text-5xl font-black text-black tracking-tighter">
                    ${Number(product.price).toFixed(2)}
                  </span>
                )}
              </div>
              <p className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                In Stock & Ready to Ship
              </p>
            </div>

            <p className="text-lg leading-relaxed text-muted-foreground font-medium max-w-xl">
              <div className="prose prose-sm max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: product.description || "" }} />
            </p>

            <div className="pt-2">
              <AddToCartButton product={productForCart} />
            </div>

            {/* Trust Sections */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-10 border-y border-border/50 bg-primary/5 px-8 rounded-[2.5rem] shadow-inner inset-shadow-sm">
              <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-primary/10">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black uppercase tracking-tight">Free Delivery</span>
                    <span className="text-[10px] text-muted-foreground font-medium">On orders over $99</span>
                  </div>
              </div>
              <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-primary/10">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black uppercase tracking-tight">2 Year Warranty</span>
                    <span className="text-[10px] text-muted-foreground font-medium">Full protection</span>
                  </div>
              </div>
              <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-primary/10">
                    <RotateCcw className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black uppercase tracking-tight">30 Day Returns</span>
                    <span className="text-[10px] text-muted-foreground font-medium">Hassle-free policy</span>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <SectionReveal className="container mx-auto px-4 space-y-12">
          <div className="flex items-end justify-between border-b pb-8">
            <div className="space-y-2">
              <h2 className="text-4xl font-black tracking-tight tracking-tighter underline underline-offset-8 decoration-primary/20">You May Also Like</h2>
              <p className="text-muted-foreground font-medium">Curated recommendations from the {product.category?.name} collection.</p>
            </div>
            <Link href={`/category/${product.category?.slug}`} className="group flex items-center gap-2 font-black uppercase tracking-widest text-sm text-primary hover:translate-x-1 transition-all">
              View All
              <ArrowRight className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {relatedProducts.map((p: any) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>
        </SectionReveal>
      )}
    </div>
  );
}
