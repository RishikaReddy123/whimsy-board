import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import boardRoutes from "./routes/board.js";
import authRoutes from "./routes/auth.js";
import pinRoutes from "./routes/pin.js";
import uploadRoute from "./routes/upload.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);

app.use("/api/boards", boardRoutes);

app.use("/api/pins", pinRoutes);

app.use("/api/upload", uploadRoute);

app.use("/", (req, res) => {
  res.send("Welcome!!");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Mongo connected!");
    app.listen(PORT, () => {
      console.log(`App listening at ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Mongo error", error.message);
  });
