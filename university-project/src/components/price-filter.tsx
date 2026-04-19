"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function PriceFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  // Update internal state when URL changes (e.g. from back/forward navigation or "Reset" elsewhere)
  useEffect(() => {
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
  }, [searchParams]);

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");
    
    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");

    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilter = () => {
    setMinPrice("");
    setMaxPrice("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("minPrice");
    params.delete("maxPrice");
    router.push(`${pathname}?${params.toString()}`);
  };

  const quickRanges = [
    { label: "Under $50", min: "", max: "50" },
    { label: "$50 - $200", min: "50", max: "200" },
    { label: "$200 - $1000", min: "200", max: "1000" },
    { label: "Over $1000", min: "1000", max: "" },
  ];

  const applyQuickRange = (min: string, max: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (min) params.set("minPrice", min); else params.delete("minPrice");
    if (max) params.set("maxPrice", max); else params.delete("maxPrice");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <h3 className="text-xl font-black mb-4 italic tracking-tight">Price Range</h3>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="minPrice" className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1 opacity-70">Min ($)</Label>
          <Input 
            id="minPrice"
            type="number" 
            placeholder="0" 
            value={minPrice} 
            onChange={(e) => setMinPrice(e.target.value)}
            className="rounded-2xl border-2 border-muted hover:border-primary/30 transition-colors focus-visible:ring-primary h-12 font-bold bg-muted/20"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxPrice" className="text-[10px] uppercase font-black text-muted-foreground tracking-widest ml-1 opacity-70">Max ($)</Label>
          <Input 
            id="maxPrice"
            type="number" 
            placeholder="Any" 
            value={maxPrice} 
            onChange={(e) => setMaxPrice(e.target.value)}
            className="rounded-2xl border-2 border-muted hover:border-primary/30 transition-colors focus-visible:ring-primary h-12 font-bold bg-muted/20"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {quickRanges.map((range) => {
          const isActive = searchParams.get("minPrice") === range.min && searchParams.get("maxPrice") === range.max;
          return (
            <button
              key={range.label}
              onClick={() => applyQuickRange(range.min, range.max)}
              className={`text-sm text-left px-4 py-3 rounded-2xl transition-all font-black flex items-center justify-between group ${
                isActive 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]" 
                  : "hover:bg-primary/10 text-muted-foreground hover:text-primary border border-transparent hover:border-primary/20"
              }`}
            >
              {range.label}
              <span className={`h-1.5 w-1.5 rounded-full transition-all ${isActive ? "bg-primary-foreground animate-pulse" : "bg-primary/20 group-hover:bg-primary"}`} />
            </button>
          );
        })}
      </div>

      <div className="flex gap-2 pt-2">
        <Button onClick={handleApply} className="flex-1 rounded-2xl h-12 font-black shadow-xl shadow-primary/25 transition-all hover:scale-[1.02] active:scale-95">
          Apply Filter
        </Button>
        <Button variant="outline" onClick={clearFilter} className="rounded-2xl h-12 font-black hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 transition-all px-4">
          Reset
        </Button>
      </div>
    </div>
  );
}
