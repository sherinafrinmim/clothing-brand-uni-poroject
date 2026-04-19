"use client";

import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { getCategories } from "@/actions/categories";
import { adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from "@/actions/admin";
import { SectionReveal } from "@/components/animations/section-reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Edit, X, Image as ImageIcon } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminCategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCatName, setNewCatName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    const data = await getCategories();
    setCategories(data);
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName || !user?.token) return;
    setIsSubmitting(true);
    
    let imageUrl = null;

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
          imageUrl = await uploadRes.text();
        } else {
           throw new Error("Failed to upload image");
        }
      }

      if (editingId) {
        await adminUpdateCategory(editingId, { name: newCatName, ...(imageUrl && { image: imageUrl }) }, user.token);
        toast.success("Category updated!");
      } else {
        await adminCreateCategory({ name: newCatName, image: imageUrl }, user.token);
        toast.success("Category created!");
      }
      
      resetForm();
      fetchCategories();
    } catch (err: any) {
      toast.error(err.message || "Failed to save category");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setNewCatName("");
    setImageFile(null);
    setEditingId(null);
  };

  const handleEditClick = (cat: any) => {
    setEditingId(cat.id);
    setNewCatName(cat.name);
  };

  const handleDelete = async (id: number) => {
    if (!user?.token || !confirm("Are you sure?")) return;
    try {
      await adminDeleteCategory(id, user.token);
      toast.success("Category deleted!");
      fetchCategories();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete category");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Categories</h1>
        <p className="text-muted-foreground mt-1">Manage your product categories with cover images.</p>
      </div>

      <SectionReveal className="bg-white rounded-[2rem] p-6 shadow-sm border space-y-6">
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 space-y-2">
            <Input 
              placeholder={editingId ? "Update Category Name" : "New Category Name (e.g. Electronics)"} 
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="h-12 rounded-xl"
              required
            />
          </div>
          <div className="flex items-center gap-4 p-2 bg-muted/20 rounded-xl border border-muted">
             {editingId && categories.find(c => c.id === editingId)?.image && (
                <div 
                  className="h-10 w-10 rounded-lg bg-cover bg-center border shadow-sm" 
                  style={{ backgroundImage: `url(${categories.find(c => c.id === editingId).image})` }} 
                />
             )}
             <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer h-10 pt-1.5 px-2 rounded-lg max-w-[200px]" />
          </div>
          <Button type="submit" disabled={isSubmitting} className="h-12 rounded-xl px-8 font-bold gap-2 whitespace-nowrap">
            {editingId ? <><Edit className="h-4 w-4" /> {isSubmitting ? "Updating..." : "Update"}</> : <><Plus className="h-4 w-4" /> {isSubmitting ? "Saving..." : "Add Category"}</>}
          </Button>
          {editingId && (
            <Button type="button" variant="ghost" onClick={resetForm} className="h-12 rounded-xl px-4 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </Button>
          )}
        </form>

        <div className="border rounded-2xl overflow-hidden mt-6">
          <table className="w-full text-left bg-white">
            <thead className="bg-muted text-muted-foreground text-xs uppercase tracking-widest font-black">
              <tr>
                <th className="px-6 py-4">Image</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Products</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">Loading...</td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">No categories found.</td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                       {cat.image ? (
                          <div className="h-12 w-12 rounded-lg bg-cover bg-center border" style={{ backgroundImage: `url(${cat.image})`}} />
                       ) : (
                          <div className="h-12 w-12 rounded-lg bg-muted flex flex-col items-center justify-center border text-muted-foreground/50">
                             <ImageIcon className="h-5 w-5" />
                          </div>
                       )}
                    </td>
                    <td className="px-6 py-4 font-bold">{cat.name}</td>
                    <td className="px-6 py-4 font-medium text-muted-foreground">{cat.productCount || 0} products</td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="text-primary hover:bg-primary/5" onClick={() => handleEditClick(cat)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50" onClick={() => handleDelete(cat.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </SectionReveal>
    </div>
  );
}
