"use client";

import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { getProducts } from "@/actions/products";
import { getCategories } from "@/actions/categories";
import { adminCreateProduct, adminUpdateProduct, adminDeleteProduct } from "@/actions/admin";
import { SectionReveal } from "@/components/animations/section-reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Edit, Image as ImageIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { RichTextEditor } from "@/components/rich-text-editor";

export default function AdminProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [formData, setFormData] = useState({ name: "", price: "", category: "", stock: "", description: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const [prods, cats] = await Promise.all([getProducts(), getCategories()]);
    setProducts(prods);
    setCategories(cats);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.token) return;
    
    if (!formData.category) {
      toast.error("Please select a valid category");
      return;
    }

    setIsSubmitting(true);
    
    let imageUrls: string[] = [];

    try {
      if (imageFile) {
        const uploadData = new FormData();
        uploadData.append("image", imageFile);
        
        const uploadRes = await fetch("http://localhost:5001/api/upload", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${user.token}`
          },
          body: uploadData
        });

        if (uploadRes.ok) {
          const path = await uploadRes.text();
          imageUrls.push(path);
        } else {
           throw new Error("Failed to upload image");
        }
      }

      const submissionData = {
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock || 0),
          category: Number(formData.category),
          ...(imageUrls.length > 0 && { images: imageUrls })
      };

      if (editingId) {
        await adminUpdateProduct(editingId, submissionData, user.token);
        toast.success("Product updated!");
      } else {
        await adminCreateProduct(submissionData, user.token);
        toast.success("Product created!");
      }

      resetForm();
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", price: "", category: "", stock: "", description: "" });
    setImageFile(null);
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleEditClick = (prod: any) => {
    setEditingId(prod.id);
    setFormData({
      name: prod.name,
      price: prod.price.toString(),
      category: prod.categoryId.toString(),
      stock: prod.stock.toString(),
      description: prod.description || ""
    });
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!user?.token || !confirm("Are you sure?")) return;
    try {
      await adminDeleteProduct(id, user.token);
      toast.success("Product deleted!");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete product");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Products Inventory</h1>
          <p className="text-muted-foreground mt-1">Upload products with images and rich descriptions.</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="rounded-full px-8 gap-2 font-bold h-12">
          <Plus className="h-4 w-4" /> {showAddForm ? "Cancel" : "Upload Product"}
        </Button>
      </div>

      {showAddForm && (
        <SectionReveal className="bg-white rounded-[2rem] p-8 shadow-sm border space-y-6">
          <h2 className="text-xl font-bold">{editingId ? "Edit Product Details" : "New Product Details"}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">Product Name</label>
              <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">Category</label>
              <select required className="flex h-12 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                <option value="">Select a category</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">Price ($)</label>
              <Input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">Stock Quantity</label>
              <Input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-muted-foreground">{editingId ? "Upload New Image (Optional)" : "Main Product Image"}</label>
              <div className="flex flex-col md:flex-row items-center gap-6 p-4 bg-muted/20 rounded-2xl border-2 border-dashed border-muted">
                 {editingId && products.find(p => p.id === editingId)?.images?.[0] && (
                   <div className="flex flex-col items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Current Image</span>
                      <div 
                        className="h-24 w-24 rounded-xl bg-cover bg-center border shadow-sm" 
                        style={{ backgroundImage: `url(${products.find(p => p.id === editingId).images[0]})` }} 
                      />
                   </div>
                 )}
                 <div className="flex-1 w-full">
                    <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer h-12 pt-2 px-3 rounded-xl w-full" />
                    <p className="text-[10px] text-muted-foreground mt-2 px-1">Recommended: JPG or PNG, max 2MB.</p>
                 </div>
              </div>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-muted-foreground">Full Description</label>
              <div className="bg-white rounded-xl overflow-hidden shadow-sm">
                <RichTextEditor 
                  value={formData.description} 
                  onChange={(val) => setFormData({...formData, description: val})} 
                />
              </div>
            </div>
            <Button type="submit" disabled={isSubmitting} className="md:col-span-2 h-12 rounded-xl font-bold mt-4">
              {isSubmitting ? "Saving..." : (editingId ? "Update Product" : "Save Product")}
            </Button>
            {editingId && (
                <Button type="button" variant="ghost" onClick={resetForm} className="md:col-span-2 h-12 rounded-xl font-bold">
                    Cancel Edit
                </Button>
            )}
          </form>
        </SectionReveal>
      )}

      <SectionReveal className="border bg-white rounded-[2rem] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-muted text-muted-foreground text-xs uppercase tracking-widest font-black">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Image?</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">No products found.</td></tr>
            ) : (
              products.map((prod) => (
                <tr key={prod.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-bold">{prod.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{prod.images && prod.images.length > 0 ? <ImageIcon className="h-4 w-4 text-emerald-500" /> : "-"}</td>
                  <td className="px-6 py-4 font-medium text-muted-foreground">{prod.Category?.name || "N/A"}</td>
                  <td className="px-6 py-4 font-medium">${Number(prod.price).toFixed(2)}</td>
                  <td className="px-6 py-4 font-medium">{prod.stock}</td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/5" onClick={() => handleEditClick(prod)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50" onClick={() => handleDelete(prod.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </SectionReveal>
    </div>
  );
}
