import express from "express";
import {
  createBookingTrip,
  getAllBookingTrips,
  getBookingTripsByUser,
  deleteBookingTrip,
  checkBookingTripDates, // 👈 nuevo controlador
} from "../controllers/bookingTrip.controller.js";

const router = express.Router();

// Crear una reserva
router.post("/", createBookingTrip);

// Verificar disponibilidad de fechas (sin guardar)
router.post("/check", checkBookingTripDates); // 👈 nueva ruta

// Obtener todas las reservas
router.get("/", getAllBookingTrips);

// Obtener reservas de un usuario
router.get("/user/:id", getBookingTripsByUser);

// Eliminar reserva
router.delete("/:id", deleteBookingTrip);

export default router;
