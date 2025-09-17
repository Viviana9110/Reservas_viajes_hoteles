import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "unaclavesupersegura"; // ⚠️ pon una variable segura en producción
const JWT_EXPIRES_IN = "1d"; // expira en 1 día, puedes cambiarlo

// 👉 Generar token
export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role, // 👈 importante para los permisos
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// 👉 Verificar token
export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
