import express from "express";
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();
console.log("OPENAI_API_KEY:", process.env.OPENAI_API_KEY);

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/generate-metadata", async (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ error: "Description is required!" });
  }
  return res.json({
    metadata: `✨ "A dreamy day beneath pastel skies." \n\n#whimsical #pastelvibes #dreamscape #aestheticart #softcolors #moodboard`,
  });
  // try {
  //   const completion = await openai.chat.completions.create({
  //     messages: [
  //       {
  //         role: "system",
  //         content:
  //           "You're a creative assistant. For any given pin description, generate a short poetic caption and a few relevant aesthetic-style hashtags (max 6).",
  //       },
  //       {
  //         role: "user",
  //         content: description,
  //       },
  //     ],
  //     model: "gpt-3.5-turbo",
  //   });

  //   const aiResponse = completion.choices[0].message.content;

  //   res.json({ metadata: aiResponse });
  // } catch (error) {
  //   console.error("AI error:", error);
  //   res.status(500).json({ error: "Failed to generate metadata" });
  // }
});

export default router;
