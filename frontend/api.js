const API_URL = "http://localhost:5000/api";

// 🔐 Generate ML Draw
export const generateMLDraw = async (token) => {
  try {
    const res = await fetch(`${API_URL}/admin/draw/generate-ml`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return await res.json();
  } catch (err) {
    console.error("API Error:", err);
  }
};