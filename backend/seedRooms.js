import "dotenv/config.js";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import Room from "./models/Room.js";
import Hotel from "./models/Hotel.js";

const seedRooms = async () => {
  try {
    await connectDB();

    // 🔹 Buscar un hotel existente (toma el primero que haya)
    const hotel = await Hotel.findOne();
    if (!hotel) {
      console.log("❌ No hay hoteles en la base de datos. Inserta hoteles primero.");
      process.exit(1);
    }

    const rooms = [
      {
        hotel: hotel._id,
        roomNumber: "101",
        type: "single",
        pricePerNight: 80,
        description: "Habitación individual con cama sencilla",
        capacity: 1,
        isAvailable: true,
      },
      {
        hotel: hotel._id,
        roomNumber: "102",
        type: "double",
        pricePerNight: 120,
        description: "Habitación doble con dos camas",
        capacity: 2,
        isAvailable: true,
      },
      {
        hotel: hotel._id,
        roomNumber: "201",
        type: "suite",
        pricePerNight: 200,
        description: "Suite de lujo con balcón y vista",
        capacity: 4,
        isAvailable: true,
      },
    ];

    await Room.deleteMany(); // Limpia las habitaciones previas
    await Room.insertMany(rooms);

    console.log("✅ Habitaciones insertadas correctamente");
    process.exit();
  } catch (error) {
    console.error("❌ Error insertando habitaciones:", error);
    process.exit(1);
  }
};

seedRooms();
