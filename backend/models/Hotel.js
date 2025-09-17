import { Schema, model } from "mongoose";

const hotelSchema = new Schema(
  {
    name: { type: String, required: true },
    location: {
      country: { type: String, required: true },
      city: { type: String, required: true },
      address: { type: String, required: true },
    },
    description: { type: String },
    amenities: [{ type: String }], // opcional
    pricePerNight: { type: Number }, // opcional
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default model("Hotel", hotelSchema);
