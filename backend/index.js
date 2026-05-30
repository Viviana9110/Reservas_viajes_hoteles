import "dotenv/config";
import express from "express";
import cors from "cors";
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

connectDB();

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

app.get("/", (req, res) => res.send("API is working 🚀"));

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
