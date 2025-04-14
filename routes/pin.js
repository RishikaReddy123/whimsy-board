import express from "express";
import Pin from "../models/Pin.js";
import authenticate from "../middlewares/authenticate.js";
const router = express.Router();

router.post("/", authenticate, async (req, res) => {
  const { imageUrl, note, link, board } = req.body;
  try {
    const newPin = new Pin({
      imageUrl,
      note,
      link,
      board,
      createdBy: req.user.id,
    });
    await newPin.save();
    res.status(201).json({ message: "Pin created! :)", pin: newPin });
  } catch (error) {
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
  const { imageUrl, note, link } = req.body;
  try {
    const pin = await Pin.findOneAndUpdate(
      {
        _id: req.params.pinId,
        createdBy: req.user.id,
      },
      { imageUrl, note, link },
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

export default router;
