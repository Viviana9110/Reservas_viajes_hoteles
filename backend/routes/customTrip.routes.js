import express from "express";
import { body } from "express-validator";
import { validate } from "../middlewares/validate.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import {
  createCustomTrip,
  getMyCustomTrips,
  getAllCustomTrips,
  updateCustomTripStatus,
  deleteCustomTrip,
  generateItinerary,
} from "../controllers/customTrip.controller.js";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  [body("destination").optional(), validate],
  createCustomTrip
);

router.post("/generate-itinerary", requireAuth, generateItinerary);
router.get("/mine", requireAuth, getMyCustomTrips);
router.get("/", requireAuth, requireRole("owner"), getAllCustomTrips);
router.patch("/:id", requireAuth, requireRole("owner"), updateCustomTripStatus);
router.delete("/:id", requireAuth, deleteCustomTrip);

export default router;
