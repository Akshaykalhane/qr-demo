import axios from "axios";

export async function sendEmail(data) {
  const url = import.meta.env.VITE_EMAIL_API;

  try {
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("API Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    return null;
  }
}
