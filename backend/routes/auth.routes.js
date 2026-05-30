import express from "express";
import { body } from "express-validator";
import { register, login, getMe, logout } from "../controllers/auth.controller.js";
import { requireAuth, requireRole } from "../middlewares/auth.js";
import { validate } from "../middlewares/validate.js";

const router = express.Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("El nombre es requerido"),
    body("email").isEmail().withMessage("Email inválido"),
    body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
    validate,
  ],
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Email inválido"),
    body("password").notEmpty().withMessage("La contraseña es requerida"),
    validate,
  ],
  login
);

router.get("/me", requireAuth, getMe);
router.post("/logout", logout);
router.get("/owner", requireAuth, requireRole("owner"), (req, res) => {
  res.json({ message: "Bienvenido al dashboard de Owner 🚀" });
});

export default router;
