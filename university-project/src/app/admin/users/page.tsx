"use client";

import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { adminGetUsers, adminUpdateUser, adminDeleteUser } from "@/actions/admin";
import { SectionReveal } from "@/components/animations/section-reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Plus, X } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminUsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "customer" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    if (!user?.token) return;
    setIsLoading(true);
    try {
      const data = await adminGetUsers(user.token);
      setUsers(data);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
     e.preventDefault();
     setIsSubmitting(true);
     try {
      if (editingUserId) {
        const updateData: any = { name: formData.name, email: formData.email, role: formData.role };
        if (formData.password) updateData.password = formData.password;
        
        await adminUpdateUser(editingUserId, updateData, user?.token || "");
        toast.success("User updated successfully!");
      } else {
        const res = await fetch("http://localhost:5001/api/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });
        if (!res.ok) throw new Error("Failed to create user");
        toast.success("User created successfully!");
      }
      
      resetForm();
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to save user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setShowAddForm(false);
    setEditingUserId(null);
    setFormData({ name: "", email: "", password: "", role: "customer" });
  };

  const handleEditClick = (u: any) => {
    setEditingUserId(u.id);
    setFormData({ name: u.name, email: u.email, password: "", role: u.role || "customer" });
    setShowAddForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!user?.token || !confirm("Are you sure you want to delete this user?")) return;
    try {
      await adminDeleteUser(id, user.token);
      toast.success("User deleted!");
      fetchUsers();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete user");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-1">View, add, update, and remove system users.</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="rounded-full px-8 gap-2 font-bold h-12">
          {showAddForm ? <><X className="h-4 w-4" /> Cancel</> : <><Plus className="h-4 w-4" /> Add User</>}
        </Button>
      </div>

      {showAddForm && (
        <SectionReveal className="bg-white rounded-[2rem] p-8 shadow-sm border space-y-6">
          <h2 className="text-xl font-bold">{editingUserId ? "Edit User Details" : "New User Setup"}</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">Name</label>
              <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">Email</label>
              <Input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">{editingUserId ? "Account Password (leave blank to keep current)" : "Temporary Password"}</label>
              <Input type="password" required={!editingUserId} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="h-12 rounded-xl" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground">Role</label>
              <select required className="flex h-12 w-full rounded-xl border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
                <option value="customer">Customer</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <Button type="submit" disabled={isSubmitting} className="md:col-span-2 h-12 rounded-xl font-bold mt-4">
              {isSubmitting ? "Saving..." : (editingUserId ? "Update User" : "Create User")}
            </Button>
            {editingUserId && (
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
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No users found.</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-bold">{u.id}</td>
                  <td className="px-6 py-4 font-bold text-primary">{u.name}</td>
                  <td className="px-6 py-4 text-muted-foreground font-medium">{u.email}</td>
                  <td className="px-6 py-4">
                     <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                       {u.role || 'customer'}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" title="Edit User Details" onClick={() => handleEditClick(u)} className="text-primary hover:bg-primary/5">
                       <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(u.id)} className="text-rose-500 hover:text-rose-600 hover:bg-rose-50">
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
