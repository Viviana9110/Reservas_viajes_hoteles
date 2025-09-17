import express from "express";
import { cancelBooking, checkAvailability, createBooking, getMyBookings } from "../controllers/bookings.controller.js";

const router = express.Router();

// Consultar disponibilidad
router.post("/availability", checkAvailability);

// Crear reserva
router.post("/", createBooking);

// Mis reservas
router.get("/user/:userId", getMyBookings);

router.delete("/:id", cancelBooking);


export default router;
