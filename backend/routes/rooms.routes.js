import express from "express";
import {
  createRoom,
  getRooms,
  getRoomsByHotel,
  updateRoom,
  deleteRoom,
} from "../controllers/rooms.controller.js";

const router = express.Router();

// Obtener TODAS las habitaciones
router.get("/", getRooms);

// Crear habitación en un hotel
router.post("/:hotelId/rooms", createRoom);

// Obtener habitaciones de un hotel
router.get("/:hotelId/rooms", getRoomsByHotel);

// Actualizar habitación
router.put("/:id", updateRoom);

// Eliminar habitación
router.delete("/:id", deleteRoom);

export default router;
