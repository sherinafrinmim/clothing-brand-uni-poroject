import { getProducts } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import { ProductCard } from "@/components/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionReveal } from "@/components/animations/section-reveal";
import { Search } from "lucide-react";
import Link from "next/link";
import { PriceFilter } from "@/components/price-filter";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ShopPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { search, minPrice, maxPrice } = await searchParams;
  const productsData = await getProducts(
    search, 
    minPrice ? Number(minPrice) : undefined,
    maxPrice ? Number(maxPrice) : undefined
  );
  const categoriesData = await getCategories();

  // Mapping data to UI props
  const products = productsData.map((prod: any) => ({
    id: prod.id,
    name: prod.name,
    slug: prod.slug,
    price: Number(prod.price),
    discountPrice: Number(prod.discountPrice) || undefined,
    image: prod.images?.[0] || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2071&auto=format&fit=crop",
    category: prod.category?.name || "Uncategorized",
    rating: prod.rating || 5,
    isNew: prod.isNew || false,
  }));

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-12">
        {/* Sidebar Filters */}
        <SectionReveal direction="right" className="w-full md:w-64 space-y-8">
          <div>
            <h3 className="text-xl font-bold mb-6">Categories</h3>
            <div className="flex flex-col gap-3">
              <Link 
                href="/shop" 
                className="text-sm font-semibold text-primary hover:underline flex items-center justify-between"
              >
                All Products
                <Badge variant="secondary" className="rounded-full">
                  {products.length}
                </Badge>
              </Link>
              {categoriesData.map((cat: any) => (
                <Link 
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors flex items-center justify-between"
                >
                  {cat.name}
                  <span className="text-[10px] text-muted-foreground/50">
                    ({cat.productCount || 0})
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <Suspense fallback={<Skeleton className="h-[300px] w-full rounded-2xl" />}>
            <PriceFilter />
          </Suspense>
        </SectionReveal>

        {/* Product Grid */}
        <SectionReveal delay={0.2} className="flex-1 space-y-8">
          <div className="flex flex-col gap-4 pb-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black tracking-tight">
                {search ? `Search: ${search}` : "Our Collection"}
              </h2>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  Showing <span className="font-bold text-foreground">{products.length}</span> products
                </span>
                <select className="bg-transparent text-sm font-bold border-none focus:ring-0 cursor-pointer">
                  <option>Sort by: Newest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Popularity</option>
                </select>
              </div>
            </div>
            {(search || minPrice || maxPrice) && (
              <Link 
                href="/shop" 
                className="text-xs font-bold text-primary hover:underline bg-primary/10 px-4 py-2 rounded-xl w-fit flex items-center gap-2 transition-all hover:bg-primary/20"
              >
                Clear All Filters ×
              </Link>
            )}
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product: any) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-muted/20 rounded-[2rem] border-2 border-dashed">
              <div className="p-6 bg-muted rounded-full">
                <Search className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">No products found</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">
                  We couldn't find any products matching your search "{search}".
                </p>
              </div>
              <Link href="/shop">
                <Button variant="outline" className="rounded-full px-8 font-bold">
                  Reset Search & Filters
                </Button>
              </Link>
            </div>
          )}
        </SectionReveal>
      </div>
    </div>
  );
}
