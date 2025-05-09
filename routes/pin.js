import express from "express";
import Pin from "../models/Pin.js";
import authenticate from "../middlewares/authenticate.js";
const router = express.Router();

router.post("/", authenticate, async (req, res) => {
  const { title, imageUrl, board, caption, tags, description } = req.body;
  try {
    console.log("📌 Incoming request to /api/pins");
    console.log("Body:", req.body);
    console.log("User:", req.user);
    const newPin = new Pin({
      title,
      imageUrl,
      description,
      caption,
      tags,
      board,
      createdBy: req.user.id,
    });
    await newPin.save();
    res.status(201).json({ message: "Pin created! :)", pin: newPin });
  } catch (error) {
    console.error("❌ Error in POST /api/pins:", error.message);
    res.status(500).json({ message: error.message });
  }
});

router.get("/board/:boardId", authenticate, async (req, res) => {
  try {
    const pins = await Pin.find({
      board: req.params.boardId,
      createdBy: req.user.id,
    }).sort({ createdAt: -1 });
    if (!pins) {
      return res.status(404).json({ message: "No pins found :(" });
    }
    res.status(200).json(pins);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.patch("/:pinId", authenticate, async (req, res) => {
  const { title, description } = req.body;
  try {
    const pin = await Pin.findOneAndUpdate(
      {
        _id: req.params.pinId,
        createdBy: req.user.id,
      },
      { title },
      { description },
      { new: true }
    );
    if (!pin) {
      return res.status(404).json({ message: "No pin found!" });
    }
    res.status(200).json({ message: "Pin updated", pin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:pinId", authenticate, async (req, res) => {
  try {
    const pin = await Pin.findOneAndDelete({
      _id: req.params.pinId,
      createdBy: req.user.id,
    });
    if (!pin) {
      return res.status(404).json({ message: "No pin found!" });
    }
    res.status(200).json({ message: "Pin deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/:pinId/save", authenticate, async (req, res) => {
  const { board } = req.body;
  try {
    const originalPin = await Pin.findById(req.params.pinId);
    if (!originalPin) {
      return res.status(404).json({ message: "Pin not found!" });
    }
    const title = originalPin.title || "Untitled Pin";
    const newPin = new Pin({
      title,
      imageUrl: originalPin.imageUrl,
      description,
      caption,
      tags,
      board,
      createdBy: req.user.id,
    });
    await newPin.save();
    res.status(201).json({ message: "Pin saved successfully!" });
  } catch (error) {
    console.error("Error saving pin:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
