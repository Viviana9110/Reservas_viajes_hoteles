import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import hotelsRoutes from "./routes/hotels.routes.js";
import roomRoutes from "./routes/rooms.routes.js";

import bookingsRoutes from "./routes/bookings.routes.js";
import bookingTripRoutes from "./routes/bookingTrip.routes.js";

import packageRoutes from "./routes/package.routes.js";

import searchRoutes from "./routes/search.routes.js";

import dashboardRoutes from "./routes/dashboard.routes.js";
import customTripRoutes from "./routes/customTrip.routes.js";
import destinationRoutes from "./routes/destination.routes.js";

import { notFound, onError } from "./middlewares/error.js";
import cookieParser from "cookie-parser";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://reservas-viajes-hoteles-front.vercel.app",
];

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(async (req, res, next) => {
  if (!mongoose.connection.readyState) {
    try {
      await connectDB();
    } catch {
      return res.status(503).json({ message: "Base de datos no disponible" });
    }
  }
  next();
});

app.get("/", (req, res) => res.send("API is working 🚀"));

app.get("/api/debug", async (req, res) => {
  const state = mongoose.connection.readyState;
  const stateMap = { 0: "disconnected", 1: "connected", 2: "connecting", 3: "disconnecting" };
  let counts = {};
  if (state === 1) {
    try {
      for (const name of ["User", "Hotel", "Room", "Package", "Destination", "Booking", "BookingTrips", "CustomTrip"]) {
        try {
          const model = mongoose.model(name);
          counts[name] = await model.countDocuments();
        } catch {
          counts[name] = "modelo no registrado";
        }
      }
    } catch {
      counts = { error: "error al contar" };
    }
  }
  res.json({
    mongooseState: stateMap[state] ?? state,
    databaseName: mongoose.connection.db?.databaseName || null,
    collections: await mongoose.connection.db?.listCollections().toArray().then(c => c.map(x => x.name)).catch(() => []),
    counts,
    mongodbUri: (process.env.MONGODB_URI || "").slice(0, 50) + "...",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/hotels", hotelsRoutes);
app.use("/api/hoteles", roomRoutes);
app.use("/api/bookings", bookingsRoutes);
app.use("/api/trips", packageRoutes);
app.use("/api/booking-trips", bookingTripRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/custom-trips", customTripRoutes);
app.use("/api/destinations", destinationRoutes);

app.use(notFound);
app.use(onError);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
