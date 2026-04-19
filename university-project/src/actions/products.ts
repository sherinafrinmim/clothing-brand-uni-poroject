"use server";

const API_URL = "http://localhost:5001/api/products";

const parseProductImage = (product: any) => {
  if (!product) return product;
  let parsed = product.images;
  if (typeof parsed === 'string') {
    try { parsed = JSON.parse(parsed); } catch { parsed = []; }
  }
  if (Array.isArray(parsed)) {
    parsed = parsed.map((img: string) => {
      if (img && (img.startsWith('/uploads/') || img.startsWith('uploads/'))) {
        const path = img.startsWith('/') ? img : `/${img}`;
        return `http://localhost:5001${path}`;
      }
      return img;
    });
  } else {
    parsed = [];
  }
  return { ...product, images: parsed.length > 0 ? parsed : null };
};

const mapProducts = (products: any[]) => products.map(parseProductImage);

export const getFeaturedProducts = async () => {
  try {
    const res = await fetch(API_URL, { cache: 'no-store' });
    if (!res.ok) return [];
    let products = await res.json();
    return mapProducts(products.slice(0, 4));
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return [];
  }
};

export const getProducts = async (search?: string, minPrice?: number, maxPrice?: number) => {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (minPrice) params.append('minPrice', minPrice.toString());
    if (maxPrice) params.append('maxPrice', maxPrice.toString());

    const url = params.toString() ? `${API_URL}?${params.toString()}` : API_URL;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    return mapProducts(await res.json());
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return [];
  }
};

export const getProductsByCategory = async (slug: string, minPrice?: number, maxPrice?: number) => {
  try {
    const params = new URLSearchParams({ categoryUrl: slug });
    if (minPrice) params.append('minPrice', minPrice.toString());
    if (maxPrice) params.append('maxPrice', maxPrice.toString());

    const res = await fetch(`${API_URL}?${params.toString()}`, { cache: 'no-store' });
    if (!res.ok) return [];
    return mapProducts(await res.json());
  } catch (error) {
    console.error("Failed to fetch products by category:", error);
    return [];
  }
};

export const getProductBySlug = async (slug: string) => {
  try {
    const res = await fetch(`${API_URL}/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    const product = await res.json();
    return parseProductImage(product);
  } catch (error) {
    console.error("Failed to fetch product by slug:", error);
    return null;
  }
};
