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

import { notFound, onError } from "./middlewares/error.js";
import cookieParser from "cookie-parser";

const app = express();

// 🔹 Conectar a la base de datos
connectDB();

const allowedOrigins = ['http://localhost:5173', 'https://reservas-viajes-hoteles-front.vercel.app' ]


// 🔹 Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "*", credentials: true }));

// 🔹 Ruta de prueba
app.get("/", (req, res) => res.send("API is working 🚀"));

// 🔹 Rutas principales
app.use("/api/auth", authRoutes);       // /api/auth/register & /api/auth/login
app.use("/api/hotels", hotelsRoutes);   // rutas de hoteles
app.use("/api/hoteles", roomRoutes); //Habitaciones
app.use("/api/rooms", roomRoutes)
app.use("/api/bookings", bookingsRoutes); // rutas de reservas

app.use("/api/trips", packageRoutes );
app.use("/api/booking-trips", bookingTripRoutes); // rutas de reservas


// 🔹 Manejo de errores
app.use(notFound);
app.use(onError);

// 🔹 Levantar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);



