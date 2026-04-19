const API_BASE_URL = "http://localhost:5001/api";

export const updateProfile = async (data: any, token: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/users/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update profile");
    }

    return await res.json();
  } catch (error: any) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw new Error("Server Unreachable: Please ensure your backend is running on port 5001.");
    }
    throw new Error(error.message || "An error occurred during profile update");
  }
};
