import express from "express";
import { body } from "express-validator";
import {
  createHotel,
  getHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
} from "../controllers/hotels.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";
import { createRoom, getRoomsByHotel } from "../controllers/rooms.controller.js";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  requireRole("owner", "admin"),
  [
    body("name").trim().notEmpty().withMessage("El nombre del hotel es requerido"),
    body("location").notEmpty().withMessage("La ubicación es requerida"),
    validate,
  ],
  createHotel
);

router.get("/", getHotels);
router.get("/:id", getHotelById);

router.post("/:hotelId/rooms", requireAuth, createRoom);
router.get("/:id/rooms", getRoomsByHotel);

router.put("/:id", requireAuth, requireRole("owner", "admin"), updateHotel);
router.delete("/:id", requireAuth, requireRole("owner", "admin"), deleteHotel);

export default router;
