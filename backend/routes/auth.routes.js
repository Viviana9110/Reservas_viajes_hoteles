// routes/auth.routes.js
import express from "express";
import { register, login, getMe, logout } from "../controllers/auth.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", requireAuth, getMe);
router.post("/logout", logout);
router.get("/owner", requireAuth, requireRole("owner"), (req, res) => {
  res.json({ message: "Bienvenido al dashboard de Owner 🚀" });
});

export default router;
