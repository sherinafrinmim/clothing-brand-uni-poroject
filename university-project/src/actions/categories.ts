"use server";

export const getCategories = async () => {
  try {
    const res = await fetch("http://localhost:5001/api/categories", { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.map((c: any) => {
      let image = c.image;
      if (image && (image.startsWith('/uploads/') || image.startsWith('uploads/'))) {
        const path = image.startsWith('/') ? image : `/${image}`;
        image = `http://localhost:5001${path}`;
      }
      return {
        ...c,
        image: image || null
      };
    });
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
};
