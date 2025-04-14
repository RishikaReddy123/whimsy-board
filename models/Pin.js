import mongoose from "mongoose";

const pinSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true,
  },
  note: String,
  link: String,
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
