import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";

// ✅ Middleware de autenticación
export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token requerido" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token); // 👈 { id, email, role }

    // Guardamos la info del token
    req.user = decoded;

    // 🔹 Opcional: cargar usuario real de la DB
    // const user = await User.findById(decoded.id).select("-password");
    // if (!user) {
    //   return res.status(401).json({ message: "Usuario no encontrado" });
    // }
    // req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

// ✅ Middleware de autorización por rol
export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Acceso denegado" });
    }
    next();
  };
};

export const protect = async (req, res, next) => {
  let token;

  if (req.cookies?.token) {
    try {
      token = req.cookies.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      return next();
    } catch (error) {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }
  }

  res.status(401).json({ message: "No autorizado, no hay token" });
};
