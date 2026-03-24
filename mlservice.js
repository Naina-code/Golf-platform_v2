import axios from "axios";

const ML_API_URL = "http://127.0.0.1:8000";

export const getPredictedDraw = async (scores) => {
  try {
    const response = await axios.post(`${ML_API_URL}/predict`, {
      scores: scores
    });

    return response.data.draw_numbers;
  } catch (error) {
    console.error("ML API Error:", error.message);
    throw new Error("ML Service Failed");
  }
};