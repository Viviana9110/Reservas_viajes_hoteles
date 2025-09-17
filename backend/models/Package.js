// models/Package.js
import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    destination: { type: String, required: true},
    description: { type: String },
    price: { type: Number, required: true },
    days: { type: Number, required: true },
   
  },
  { timestamps: true }
);

export default mongoose.model("Package", packageSchema);
