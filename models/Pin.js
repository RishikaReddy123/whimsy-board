import mongoose from "mongoose";

const pinSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
    default: "",
  },
  tags: {
    type: [String],
    default: [],
  },
  imageUrl: {
    type: String,
    required: false,
  },
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Pin = mongoose.model("Pin", pinSchema);

export default Pin;
