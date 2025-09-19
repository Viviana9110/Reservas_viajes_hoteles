import express from "express";
import {
  createBookingTrip,
  checkBookingAvailability,
  getBookingsByUser,
} from "../controllers/bookingsTrip.controller.js";

const router = express.Router();

// Crear reserva
router.post("/", createBookingTrip);

// Verificar disponibilidad
router.post("/check", checkBookingAvailability);

// Obtener reservas de un usuario
router.get("/user/:userId", getBookingsByUser);

export default router;
