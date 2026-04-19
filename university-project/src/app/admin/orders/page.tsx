"use client";

import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { adminGetOrders, adminUpdateOrderStatus } from "@/actions/admin";
import { SectionReveal } from "@/components/animations/section-reveal";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Truck, XCircle, Clock } from "lucide-react";

export default function AdminOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    if (!user?.token) return;
    setIsLoading(true);
    try {
      const data = await adminGetOrders(user.token);
      setOrders(data);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    if (!user?.token) return;
    try {
      await adminUpdateOrderStatus(id, newStatus, user.token);
      toast.success(`Order marked as ${newStatus}`);
      fetchOrders();
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const renderStatusBadge = (status: string) => {
     const s = status.toLowerCase();
     if (s === 'delivered') return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-600"><CheckCircle2 className="h-3 w-3"/> Delivered</span>;
     if (s === 'shipped') return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-100 text-blue-600"><Truck className="h-3 w-3"/> Shipped</span>;
     if (s === 'cancelled') return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-100 text-rose-600"><XCircle className="h-3 w-3"/> Cancelled</span>;
     return <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-orange-100 text-orange-600"><Clock className="h-3 w-3"/> {status}</span>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Order Management</h1>
        <p className="text-muted-foreground mt-1">Process shipments, verify deliveries, and manage cancellations.</p>
      </div>

      <SectionReveal className="border bg-white rounded-[2rem] overflow-hidden shadow-sm">
        <table className="w-full text-left">
          <thead className="bg-muted text-muted-foreground text-xs uppercase tracking-widest font-black">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No orders found.</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-primary">#{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold">{order.User?.name || "Customer"}</div>
                    <div className="text-xs text-muted-foreground">{order.User?.email}</div>
                  </td>
                  <td className="px-6 py-4 font-black">${Number(order.totalAmount || order.total).toFixed(2)}</td>
                  <td className="px-6 py-4">
                     {renderStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4 text-right">
                     <div className="flex justify-end gap-2 isolate">
                       {order.status !== 'cancelled' && order.status !== 'delivered' && (
                         <>
                           <Button size="sm" variant="outline" onClick={() => handleStatusChange(order.id, 'shipped')} className="h-8 rounded-lg font-bold text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 border-none">
                              Mark Shipped
                           </Button>
                           <Button size="sm" variant="outline" onClick={() => handleStatusChange(order.id, 'delivered')} className="h-8 rounded-lg font-bold text-xs bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-none">
                              Complete
                           </Button>
                           <Button size="sm" variant="outline" onClick={() => handleStatusChange(order.id, 'cancelled')} className="h-8 rounded-lg font-bold text-xs bg-rose-50 text-rose-600 hover:bg-rose-100 border-none">
                              Cancel
                           </Button>
                         </>
                       )}
                     </div>
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
