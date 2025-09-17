// models/Room.js
import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true },
    roomNumber: { type: String, required: true },
    type: { type: String, enum: ["single", "double", "suite"], required: true },
    pricePerNight: { type: Number, required: true },
    description: { type: String },
    capacity: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
