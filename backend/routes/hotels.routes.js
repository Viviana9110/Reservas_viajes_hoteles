import express from "express";
import {
  createHotel,
  getHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
} from "../controllers/hotels.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import { createRoom, getRoomsByHotel } from "../controllers/rooms.controller.js";

const router = express.Router();

// ==============================
// Rutas de Hoteles
// ==============================

// 📌 Crear hotel → solo usuarios autenticados con rol "owner" o "admin"
router.post("/", requireAuth, requireRole("owner", "admin"), createHotel);

// 📌 Obtener todos los hoteles (público)
router.get("/", getHotels);

// 📌 Obtener un hotel por ID (público)
router.get("/:id", getHotelById);

router.post("/:hotelId/rooms", requireAuth, createRoom);

// 📌 Listar habitaciones de un hotel específico (público)
router.get("/:id/rooms", getRoomsByHotel);

// 📌 Actualizar hotel → solo el owner del hotel o admin
router.put("/:id", requireAuth, requireRole("owner", "admin"), updateHotel);

// 📌 Eliminar hotel → solo el owner del hotel o admin
router.delete("/:id", requireAuth, requireRole("owner", "admin"), deleteHotel);


export default router;
