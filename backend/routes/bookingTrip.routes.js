import express from "express";
import { body } from "express-validator";
import { validate } from "../middlewares/validate.js";
import {
  createBookingTrip,
  checkBookingTripDates,
  getAllBookingTrips,
  getBookingTripsByUser,
  deleteBookingTrip,
} from "../controllers/bookingTrip.controller.js";

const router = express.Router();

router.post(
  "/",
  [
    body("user").notEmpty().withMessage("user es requerido"),
    body("trip").notEmpty().withMessage("trip es requerido"),
    body("checkIn").isISO8601().withMessage("checkIn debe ser una fecha válida"),
    body("checkOut").isISO8601().withMessage("checkOut debe ser una fecha válida"),
    validate,
  ],
  createBookingTrip
);

router.post(
  "/check",
  [
    body("user").notEmpty().withMessage("user es requerido"),
    body("trip").notEmpty().withMessage("trip es requerido"),
    body("checkIn").isISO8601().withMessage("checkIn debe ser una fecha válida"),
    body("checkOut").isISO8601().withMessage("checkOut debe ser una fecha válida"),
    validate,
  ],
  checkBookingTripDates
);

router.get("/", getAllBookingTrips);
router.get("/user/:id", getBookingTripsByUser);
router.delete("/:id", deleteBookingTrip);

export default router;
