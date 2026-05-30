import express from "express";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import {
  getAllDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
} from "../controllers/destination.controller.js";

const router = express.Router();

router.get("/", getAllDestinations);
router.get("/:id", getDestinationById);
router.post("/", requireAuth, requireRole("owner"), createDestination);
router.put("/:id", requireAuth, requireRole("owner"), updateDestination);
router.delete("/:id", requireAuth, requireRole("owner"), deleteDestination);

export default router;
