import mongoose from "mongoose";

const itineraryActivitySchema = new mongoose.Schema(
  {
    time: { type: String },
    description: { type: String },
    location: { type: String },
    tourName: { type: String },
  },
  { _id: false }
);

const itineraryDaySchema = new mongoose.Schema(
  {
    day: { type: Number },
    date: { type: Date },
    activities: [itineraryActivitySchema],
  },
  { _id: false }
);

const selectedDestinationSchema = new mongoose.Schema(
  {
    destinationRef: { type: mongoose.Schema.Types.ObjectId, ref: "Destination" },
    destinationName: { type: String },
    days: { type: Number },
    selectedTours: [
      {
        tourName: { type: String },
        tourPrice: { type: Number },
        tourDuration: { type: String },
      },
    ],
  },
  { _id: false }
);

const customTripSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    destination: { type: String },
    preferredDate: { type: Date },
    flexibleDates: { type: Boolean, default: false },
    budget: { type: Number },
    groupSize: { type: Number, default: 1 },
    interests: [{ type: String }],
    accommodation: { type: String, enum: ["hotel", "hostel", "resort", "eco-lodge", "any"], default: "any" },
    transportation: { type: String, enum: ["flight", "bus", "private", "not-needed", "any"], default: "any" },
    includesMeals: { type: Boolean, default: false },
    includesGuide: { type: Boolean, default: false },
    notes: { type: String },
    status: {
      type: String,
      enum: ["pending", "reviewing", "quoted", "approved", "rejected"],
      default: "pending",
    },
    adminNotes: { type: String },
    estimatedPrice: { type: Number },
    destinations: [selectedDestinationSchema],
    itinerary: [itineraryDaySchema],
  },
  { timestamps: true }
);

export default mongoose.model("CustomTrip", customTripSchema);
