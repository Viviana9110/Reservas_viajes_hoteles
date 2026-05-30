import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["owner", "user"], default: "user", index: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

const seedUsuarios = async () => {
  try {
    await mongoose.connect(`${MONGO_URI}/Reservas`);
    console.log("✅ Database Connected");

    await User.deleteMany({});

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
