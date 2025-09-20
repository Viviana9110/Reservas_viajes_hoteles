import express from "express";
import {
  createBookingTrip,
  getAllBookingTrips,
  getBookingTripsByUser,
  deleteBookingTrip,
} from "../controllers/bookingTrip.controller.js";

const router = express.Router();

// Crear una reserva
router.post("/", createBookingTrip);

// Obtener todas las reservas
router.get("/", getAllBookingTrips);

// Obtener reservas de un usuario
router.get("/user/:id", getBookingTripsByUser);

// Eliminar reserva
router.delete("/:id", deleteBookingTrip);

export default router;
