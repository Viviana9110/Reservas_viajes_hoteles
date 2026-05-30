import mongoose from "mongoose";

const tourSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number },
  duration: { type: String },
  image: { type: String },
  category: { type: String },
});

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String },
    region: { type: String },
    tours: [tourSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Destination", destinationSchema);
