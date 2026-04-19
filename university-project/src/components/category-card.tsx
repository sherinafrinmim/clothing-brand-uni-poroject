import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

interface CategoryCardProps {
  name: string;
  slug: string;
  image: string;
  itemCount: number;
}

export const CategoryCard = ({ name, slug, image, itemCount }: CategoryCardProps) => {
  const safeImage = image || `https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070&auto=format&fit=crop`;
  
  return (
    <Link 
      href={`/category/${slug}`}
      className="group relative overflow-hidden rounded-2xl bg-muted aspect-[4/5] flex flex-col justify-end p-6 hover:shadow-xl transition-all duration-500"
    >
      <Image
        src={safeImage}
        alt={name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

      <div className="relative z-10 text-white">
        <p className="text-xs font-medium uppercase tracking-widest text-white/70 mb-1">
          {itemCount} Products
        </p>
        <h3 className="text-2xl font-bold tracking-tight mb-4">{name}</h3>
        <div className="flex items-center gap-2 text-sm font-semibold opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          Explore Collection
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    </Link>
  );
};
