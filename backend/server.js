import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import { GoogleGenAI } from "@google/genai";
import chatRoutes from "./routes/chat.js";

const app = express();
const PORT = process.env.PORT || 8080;

/* Gemini AI */
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.use(express.json());
app.use(cors());

/* MongoDB Connection */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected with Database!");
  } catch (err) {
    console.log("Failed to connect with DB", err);
  }
};

/* Routes */
app.use("/api", chatRoutes);

/* Test AI Route */
app.post("/test", async (req, res) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: req.body.message,
    });

    res.send(response.text);
  } catch (err) {
    console.log(err);
    res.status(500).send("AI Error");
  }
});

/* Server Start */
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await connectDB();
});
