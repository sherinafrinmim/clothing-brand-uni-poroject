"use client";

import React, { useEffect, useState } from "react";
import { getProductsByCategory } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { PriceFilter } from "@/components/price-filter";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = React.use(params);
  const searchParams = useSearchParams();
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [currentCategory, setCurrentCategory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        getProductsByCategory(
          slug, 
          minPrice ? Number(minPrice) : undefined, 
          maxPrice ? Number(maxPrice) : undefined
        ),
        getCategories()
      ]);

      const foundCategory = categoriesData.find((cat: any) => cat.slug === slug);
      
      const mappedProducts = productsData.map((prod: any) => ({
        id: prod.id,
        name: prod.name,
        slug: prod.slug,
        price: Number(prod.price),
        discountPrice: Number(prod.discountPrice) || undefined,
        image: prod.images?.[0] || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop",
        category: prod.category?.name || foundCategory?.name || "Uncategorized",
        rating: prod.rating || 5,
        isNew: prod.isNew || false,
      }));

      setProducts(mappedProducts);
      setCategories(categoriesData);
      setCurrentCategory(foundCategory);
      setIsLoading(false);
    };

    fetchData();
  }, [slug, minPrice, maxPrice]);

  if (isLoading && products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-muted-foreground font-medium animate-pulse">Loading collection...</p>
      </div>
    );
  }

  if (!currentCategory && products.length === 0 && !isLoading) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar */}
        <aside className="w-full md:w-64 space-y-8">
          <div>
            <h3 className="text-xl font-black mb-6 italic">Categories</h3>
            <div className="flex flex-col gap-3">
              <Link 
                href="/shop" 
                className="text-sm font-bold text-muted-foreground hover:text-primary transition-all flex items-center justify-between p-2 rounded-xl hover:bg-primary/5"
              >
                All Products
              </Link>
              {categories.map((cat: any) => (
                <Link 
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className={`text-sm font-black flex items-center justify-between transition-all p-2 rounded-xl ${
                    cat.slug === slug ? "text-primary bg-primary/5 shadow-sm" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  }`}
                >
                  {cat.name}
                  {cat.slug === slug && (
                    <Badge className="rounded-full h-5 px-2 bg-primary text-[10px] font-black border-none">
                      {products.length}
                    </Badge>
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t">
            <Suspense fallback={<Skeleton className="h-[300px] w-full rounded-3xl" />}>
              <PriceFilter />
            </Suspense>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-8">
          <div className="flex flex-col gap-4 pb-6 border-b">
            <nav className="text-sm text-muted-foreground font-medium">
               <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
               <span className="mx-2">/</span>
               <span className="font-black text-foreground capitalize tracking-tight italic bg-primary/5 px-2 py-0.5 rounded-lg">{slug.replace("-", " ")}</span>
            </nav>
            <div className="flex items-center justify-between">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight tracking-tighter capitalize underline decoration-primary/20 decoration-4 underline-offset-8">
                {currentCategory?.name || slug.replace("-", " ")}
              </h2>
              <div className="flex flex-col items-end gap-2">
                <span className="text-sm text-muted-foreground font-bold bg-muted/50 px-3 py-1 rounded-full uppercase tracking-widest">
                  {products.length} items found
                </span>
                {(minPrice || maxPrice) && (
                  <Link 
                    href={`/category/${slug}`}
                    className="text-[10px] font-black text-primary hover:underline bg-primary/10 px-2 py-1 rounded-lg transition-all hover:bg-primary/20"
                  >
                    Clear Price Filter ×
                  </Link>
                )}
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
               {[...Array(6)].map((_, i) => (
                 <Skeleton key={i} className="h-[400px] w-full rounded-[2rem]" />
               ))}
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 bg-muted/20 rounded-[3rem] border-2 border-dashed border-border/50">
              <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-black tracking-tight">No products found</p>
                <p className="text-muted-foreground font-medium">We couldn't find any items matching your criteria in this category.</p>
              </div>
              <Button variant="outline" className="rounded-full px-8 h-12 font-bold shadow-sm" asChild>
                <Link href={`/category/${slug}`}>
                  Reset Category Filters
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {products.map((product: any) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
