import express from "express";
import { body } from "express-validator";
import { cancelBooking, checkAvailability, createBooking, getMyBookings } from "../controllers/bookings.controller.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.post(
  "/availability",
  [
    body("roomId").notEmpty().withMessage("roomId es requerido"),
    body("checkIn").isISO8601().withMessage("checkIn debe ser una fecha válida"),
    body("checkOut").isISO8601().withMessage("checkOut debe ser una fecha válida"),
    validate,
  ],
  checkAvailability
);

router.post(
  "/",
  [
    body("hotelId").notEmpty().withMessage("hotelId es requerido"),
    body("roomId").notEmpty().withMessage("roomId es requerido"),
    body("checkIn").isISO8601().withMessage("checkIn debe ser una fecha válida"),
    body("checkOut").isISO8601().withMessage("checkOut debe ser una fecha válida"),
    validate,
  ],
  createBooking
);

router.get("/user/:userId", getMyBookings);
router.delete("/:id", cancelBooking);

export default router;
