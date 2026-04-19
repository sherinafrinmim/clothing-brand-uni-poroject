import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingBag, ShieldCheck, Truck, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CategoryCard } from "@/components/category-card";
import { ProductCard } from "@/components/product-card";
import { getCategories } from "@/actions/categories";
import { getFeaturedProducts } from "@/actions/products";
import { SectionReveal } from "@/components/animations/section-reveal";

export default async function Home() {
  const categoriesData = await getCategories();
  const featuredProductsData = await getFeaturedProducts();

  const categories = categoriesData.map((cat: any) => ({
    name: cat.name,
    slug: cat.slug,
    image: cat.image || `https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070&auto=format&fit=crop`,
    itemCount: cat.productCount || 0,
  }));

  const featuredProducts = featuredProductsData.map((prod: any) => ({
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
    <div className="flex flex-col gap-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        <Image
          src="/hero-banner.jpg"
          alt="Hero Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40 flex items-center">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-xl text-white space-y-6 animate-in fade-in slide-in-from-left-10 duration-1000">
              <span className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xl font-bold rounded-full uppercase tracking-widest">
                New Arrival 2026
              </span>
              <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tighter">
                ELEVATE YOUR <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                  Shopping Experience
                </span>
              </h1>
              <p className="text-xl text-zinc-100/80 leading-relaxed font-medium">
                Experience the nexus of design with our curated collection of high-end clothing.
              </p>
              <div className="flex items-center gap-4 pt-4">
                <Button size="lg" className="rounded-full px-8 text-md font-bold h-14 group">
                  Shop Collection
                  <ShoppingBag className="ml-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-8 text-md font-bold h-14 bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 border-y border-border/50">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Free Shipping</h4>
              <p className="text-xs text-muted-foreground">On all orders over $99</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Secure Payment</h4>
              <p className="text-xs text-muted-foreground">100% secure system</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-600">
              <RotateCcw className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">30-Day Return</h4>
              <p className="text-xs text-muted-foreground">Money back guarantee</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Member Discount</h4>
              <p className="text-xs text-muted-foreground">Up to 20% off for VIP</p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category */}
      <SectionReveal className="container mx-auto px-4 space-y-8">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight">Shop by Category</h2>
            <p className="text-muted-foreground">Explore our diverse collections curated for you.</p>
          </div>
          <Link href="/categories" className="group flex items-center gap-1 font-bold text-primary">
            View All Categories
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category: any) => (
            <CategoryCard key={category.slug} {...category} />
          ))}
        </div>
      </SectionReveal>

      {/* Featured Products */}
      <SectionReveal delay={0.2} className="container mx-auto px-4 space-y-8">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <h2 className="text-3xl font-black tracking-tight">Trending Now</h2>
            <p className="text-muted-foreground">Our most popular products this week.</p>
          </div>
          <Link href="/shop" className="group flex items-center gap-1 font-bold text-primary">
            Visit the Store
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product: any) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </SectionReveal>

      {/* Special Offer / CTA */}
      <SectionReveal direction="down" className="container mx-auto px-4">
        <div className="relative h-[400px] w-full overflow-hidden rounded-3xl group">
          <Image
              src="/hero-banner-2.jpg"
            alt="Promotion Banner"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-center p-8">
            <div className="max-w-2xl space-y-6">
              <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                Unlock 20% Off Your First Purchase
              </h2>
              <p className="text-lg text-white/80 font-medium">
                Join our exclusive community of technology enthusiasts and get early access to limited editions and special promotions.
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button size="lg" className="rounded-full px-8 h-12 font-bold bg-white text-black hover:bg-zinc-200">
                  Join the Club
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8 h-12 font-bold bg-transparent text-white border-white hover:bg-white/10">
                  No Thanks
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SectionReveal>
    </div>
  );
}
