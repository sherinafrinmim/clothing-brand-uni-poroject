"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { SectionReveal } from "@/components/animations/section-reveal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Bell, CreditCard, User, Mail, Smartphone, Lock } from "lucide-react";
import { toast } from "react-hot-toast";
import { updateProfile } from "@/actions/profile";
import { useState } from "react";

export default function ProfilePage() {
  const { user, isMounted, logout } = useAuth();
  const router = useRouter();
  
  const [name, setName] = useState(user?.name || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  useEffect(() => {
    if (isMounted && !user) {
      router.push("/");
    }
  }, [isMounted, user, router]);

   if (!isMounted || !user) {
     return null;
   }
 
  const handleUpdateInfo = async () => {
    if (!user?.token) return;
    setIsUpdating(true);
    try {
      await updateProfile({ name }, user.token);
      toast.success("Profile updated! Please log in again to see changes.");
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!user?.token) return;
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      await updateProfile({ password: newPassword }, user.token);
      toast.success("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-4xl space-y-12">
      <SectionReveal className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter italic">Your Profile</h1>
        <p className="text-muted-foreground text-lg font-medium">Manage your personal information and security settings.</p>
      </SectionReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <aside className="space-y-4">
           <button className="w-full h-14 flex items-center justify-between px-6 rounded-2xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
             <div className="flex items-center gap-3">
               <User className="h-4 w-4" /> Account Details
             </div>
           </button>
           <button className="w-full h-14 flex items-center gap-3 px-6 rounded-2xl text-muted-foreground hover:bg-muted font-bold text-sm transition-all hover:translate-x-1">
             <Shield className="h-4 w-4" /> Security
           </button>
           <button className="w-full h-14 flex items-center gap-3 px-6 rounded-2xl text-muted-foreground hover:bg-muted font-bold text-sm transition-all hover:translate-x-1">
             <Bell className="h-4 w-4" /> Notifications
           </button>
           <button className="w-full h-14 flex items-center gap-3 px-6 rounded-2xl text-muted-foreground hover:bg-muted font-bold text-sm transition-all hover:translate-x-1">
             <CreditCard className="h-4 w-4" /> Payments
           </button>

           <div className="pt-8 border-t">
              <Button 
                variant="ghost" 
                className="w-full h-14 rounded-2xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 font-bold transition-all"
                onClick={() => {
                  logout();
                  window.location.href = "/";
                }}
              >
                Sign Out
              </Button>
           </div>
        </aside>

        <div className="md:col-span-2 space-y-8">
           <SectionReveal direction="left" delay={0.1}>
              <Card className="border-none bg-muted/20 rounded-[2.5rem] shadow-sm">
                <CardHeader className="px-8 pt-10">
                  <CardTitle className="text-3xl font-black tracking-tight">Personal Information</CardTitle>
                  <CardDescription className="text-base font-medium">Update your photo and personal details.</CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-10 space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-3">
                        <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Full Name</Label>
                         <div className="relative">
                           <User className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                           <Input id="name" className="pl-11 h-12 rounded-2xl bg-white border-border/50 focus-visible:ring-primary shadow-sm" value={name} onChange={(e) => setName(e.target.value)} />
                         </div>
                     </div>
                     <div className="space-y-3">
                        <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                          <Input id="email" className="pl-11 h-12 rounded-2xl bg-white border-border/50 shadow-sm" defaultValue={user.email} disabled />
                        </div>
                     </div>
                   </div>

                   <div className="space-y-3">
                      <Label htmlFor="phone" className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Phone Number</Label>
                      <div className="relative">
                        <Smartphone className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                        <Input id="phone" className="pl-11 h-12 rounded-2xl bg-white border-border/50 shadow-sm" placeholder="+1 (555) 000-0000" />
                      </div>
                   </div>

                    <div className="flex justify-end pt-4">
                      <Button disabled={isUpdating} onClick={handleUpdateInfo} className="h-12 px-10 rounded-full font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5">
                         {isUpdating ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                </CardContent>
              </Card>
            </SectionReveal>
 
           <SectionReveal direction="left" delay={0.15}>
              <Card className="border-none bg-muted/20 rounded-[2.5rem] shadow-sm">
                <CardHeader className="px-8 pt-10">
                  <CardTitle className="text-3xl font-black tracking-tight">Security & Password</CardTitle>
                  <CardDescription className="text-base font-medium">Change your password to keep your account secure.</CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-10 space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-3">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">New Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                          <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="pl-11 h-12 rounded-2xl bg-white border-border/50 shadow-sm" placeholder="••••••••" />
                        </div>
                     </div>
                     <div className="space-y-3">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground px-1">Confirm New Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-3.5 h-4 w-4 text-muted-foreground" />
                          <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-11 h-12 rounded-2xl bg-white border-border/50 shadow-sm" placeholder="••••••••" />
                        </div>
                     </div>
                   </div>
                   <div className="flex justify-end pt-4">
                      <Button disabled={isUpdatingPassword} onClick={handleUpdatePassword} className="h-12 px-10 rounded-full font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5">
                         {isUpdatingPassword ? "Updating..." : "Update Password"}
                      </Button>
                   </div>
                </CardContent>
              </Card>
           </SectionReveal>

            <SectionReveal direction="left" delay={0.2}>
              <Card className="border-none bg-rose-500/5 border border-rose-500/10 rounded-[2.5rem]">
                <CardHeader className="px-8 pt-10">
                  <CardTitle className="text-3xl font-black tracking-tight text-rose-500">Security Zone</CardTitle>
                  <CardDescription className="text-base font-medium">Actions related to account termination and sensitive data.</CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-10 space-y-6">
                   <p className="text-md text-neutral-600 font-medium leading-relaxed">Deleting your account is permanent and will result in the loss of all order history and reward points. Please be certain before proceeding.</p>
                   <Button variant="destructive" className="h-12 px-10 rounded-full font-black uppercase tracking-widest bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/20 hover:shadow-rose-500/40 transition-all hover:-translate-y-0.5">Delete Account</Button>
                </CardContent>
              </Card>
           </SectionReveal>
        </div>
      </div>
    </div>
  );
}
