"use server";

export const createCheckoutSession = async (orderId: number, token: string) => {
  if (!token) {
    return { error: "Please login to proceed with checkout" };
  }

  try {
    const res = await fetch("http://localhost:5001/api/payments/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ orderId })
    });

    if (!res.ok) {
      const err = await res.json();
      return { error: err.message || "Something went wrong" };
    }

    const data = await res.json();
    return { url: data.url };
  } catch (error: any) {
    console.error("Checkout error:", error);
    return { error: "API connection failed" };
  }
};

export const finalizeOrder = async (sessionId: string, token: string) => {
  try {
    const res = await fetch("http://localhost:5001/api/payments/fulfill", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ session_id: sessionId })
    });

    if (!res.ok) {
      const err = await res.json();
      return { error: err.message || "Failed to finalize order" };
    }

    return await res.json();
  } catch (error) {
    console.error("Finalize error:", error);
    return { error: "Fulfillment connection failed" };
  }
};
