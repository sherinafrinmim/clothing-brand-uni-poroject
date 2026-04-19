const API_BASE_URL = "http://localhost:5001/api";

const fetchWithAdminAuth = async (url: string, method: string, token: string, body?: any) => {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    }
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  try {
    const res = await fetch(`${API_BASE_URL}${url}`, options);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Admin API Request Failed");
    }
    return await res.json();
  } catch (error: any) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error("Server Unreachable: Please ensure your backend is running on port 5001.");
    }
    throw error;
  }
};

export const adminGetOrders = (token: string) => fetchWithAdminAuth("/orders", "GET", token);
export const adminUpdateOrderStatus = (id: number, status: string, token: string) => fetchWithAdminAuth(`/orders/${id}/status`, "PUT", token, { status });

export const adminGetUsers = (token: string) => fetchWithAdminAuth("/users", "GET", token);
export const adminUpdateUser = (id: number, data: any, token: string) => fetchWithAdminAuth(`/users/${id}`, "PUT", token, data);
export const adminDeleteUser = (id: number, token: string) => fetchWithAdminAuth(`/users/${id}`, "DELETE", token);

export const adminCreateProduct = (data: any, token: string) => fetchWithAdminAuth("/products", "POST", token, data);
export const adminUpdateProduct = (id: number, data: any, token: string) => fetchWithAdminAuth(`/products/${id}`, "PUT", token, data);
export const adminDeleteProduct = (id: number, token: string) => fetchWithAdminAuth(`/products/${id}`, "DELETE", token);

export const adminCreateCategory = (data: any, token: string) => fetchWithAdminAuth("/categories", "POST", token, data);
export const adminUpdateCategory = (id: number, data: any, token: string) => fetchWithAdminAuth(`/categories/${id}`, "PUT", token, data);
export const adminDeleteCategory = (id: number, token: string) => fetchWithAdminAuth(`/categories/${id}`, "DELETE", token);
