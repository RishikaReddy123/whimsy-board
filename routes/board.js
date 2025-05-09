import express from "express";
import Board from "../models/Board.js";
import authenticate from "../middlewares/authenticate.js";
import Pin from "../models/Pin.js";
const router = express.Router();

router.post("/", authenticate, async (req, res) => {
  const { name, description, coverImage } = req.body;
  try {
    const newBoard = new Board({
      name,
      description,
      coverImage,
      createdBy: req.user.id,
    });
    await newBoard.save();
    res.status(201).json({ message: "New Board created :)", board: newBoard });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", authenticate, async (req, res) => {
  try {
    const boards = await Board.find({ createdBy: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ boards });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", authenticate, async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    if (!board) {
      return res.status(404).json({ message: "Board not found!" });
    }
    const pins = await Pin.find({ boardId: req.params.id });
    res.status(200).json({ board, pins });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.patch("/:id", authenticate, async (req, res) => {
  const { name, description, coverImage } = req.body;
  try {
    const board = await Board.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user.id,
      },
      { name, description, coverImage },
      { new: true }
    );
    if (!board) {
      return res
        .status(404)
        .json({ message: "No board found or unauthorized!" });
    }
    res.status(200).json({ message: "Board updated :)", board });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", authenticate, async (req, res) => {
  try {
    const board = await Board.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });
    if (!board) {
      return res.status(404).json({ message: "No board found!!" });
    }
    res.status(200).json({ message: "Board deleted :)" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
