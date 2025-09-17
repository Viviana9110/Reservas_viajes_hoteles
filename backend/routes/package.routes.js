import express from "express";
import { createPackage, getPackages } from "../controllers/package.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";

const router = express.Router();

router.post("/", createPackage);
router.get("/", getPackages);

export default router;
