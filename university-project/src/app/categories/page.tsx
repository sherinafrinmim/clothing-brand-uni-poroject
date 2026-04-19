import { getCategories } from "@/actions/categories";
import { CategoryCard } from "@/components/category-card";
import { SectionReveal } from "@/components/animations/section-reveal";

export default async function CategoriesPage() {
  const categoriesData = await getCategories();

  const categories = categoriesData.map((cat: any) => ({
    name: cat.name,
    slug: cat.slug,
    image: cat.image || `https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070&auto=format&fit=crop`,
    itemCount: cat.productCount || 0,
  }));

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 lg:py-24 space-y-12">
      <SectionReveal className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-black tracking-tight tracking-tighter">Collections</h1>
        <p className="text-xl text-muted-foreground font-medium">
          our curated categories have everything you need.
        </p>
      </SectionReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category: any, index: number) => (
          <SectionReveal
            key={category.slug}
            delay={index * 0.1}
            direction={index % 2 === 0 ? "left" : "right"}
          >
            <CategoryCard {...category} />
          </SectionReveal>
        ))}
      </div>
    </div>
  );
}
