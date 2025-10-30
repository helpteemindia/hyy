import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const API_URL = "https://api.deepseek.com/v1/chat/completions";
const API_KEY = process.env.DEEPSEEK_API_KEY;

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("API Error:", errText);
      return res.status(response.status).send("API request failed");
    }

    const data = await response.json();
    const botMessage = data.choices[0]?.message?.content || "No response from DeepSeek";
    res.json({ reply: botMessage });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).send("Error: Unable to get response.");
  }
});

app.listen(3000, () => console.log("✅ Server running on http://localhost:3000"));
