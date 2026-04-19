"use server";

export const getOrders = async (token: string) => {
  if (!token) return [];
  
  try {
    const res = await fetch("http://localhost:5001/api/orders/my", {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
};

export const createOrder = async (data: { items: any[], shippingAddress: string }, token: string) => {
  try {
    const res = await fetch("http://localhost:5001/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Failed to create order");
    }

    return await res.json();
  } catch (error: any) {
    console.error("Create order error:", error);
    throw error;
  }
};
