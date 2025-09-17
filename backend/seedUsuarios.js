import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

// 🔹 Conexión a MongoDB Atlas
const MONGO_URI = "mongodb+srv://vivianalondononaranjo:S2qsst8rTNaCy6bD@cluster0.g1sbxwi.mongodb.net/Reservas";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => console.log("✅ Database Connected"));
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (error) {
    console.log("❌ Error de conexión:", error.message);
  }
};

// 🔹 Definir el modelo Usuario
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["owner", "user"], default: "user", index: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

// 🔹 Crear usuarios de prueba
const seedUsuarios = async () => {
  try {
    await connectDB();

    // Eliminar usuarios previos
    await User.deleteMany({});

    // Encriptar contraseñas
    const passAdmin = await bcrypt.hash("123456", 10);
    const passUser = await bcrypt.hash("123456", 10);

    const usuarios = [
      {
        name: "Propietario",
        email: "owner@test.com",
        password: passAdmin,
        role: "owner",
      },
      {
        name: "Usuario Cliente",
        email: "user@test.com",
        password: passUser,
        role: "user",
      },
    ];

    await User.insertMany(usuarios);
    console.log("✅ Usuarios insertados correctamente");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error al insertar usuarios:", error);
    mongoose.connection.close();
  }
};

seedUsuarios();

