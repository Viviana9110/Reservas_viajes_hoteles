import mongoose from "mongoose";

const bookingTripSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    trip: { type: mongoose.Schema.Types.ObjectId, ref: "Package", required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("BookingTrip", bookingTripSchema);
