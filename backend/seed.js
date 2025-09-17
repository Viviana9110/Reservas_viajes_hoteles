import mongoose from "mongoose";
import dotenv from "dotenv";
import Hotel from "./models/Hotel.js";
import Room from "./models/Room.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://vivianalondononaranjo:S2qsst8rTNaCy6bD@cluster0.g1sbxwi.mongodb.net/Reservas";

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Conectado a MongoDB");

    // Limpia las colecciones antes de insertar
    await Hotel.deleteMany();
    await Room.deleteMany();

    // Usa un ObjectId válido de un usuario existente
    const ownerId = new mongoose.Types.ObjectId("68ace0ab41d81f213fdece68");

    // 1️⃣ Crear hoteles
    const hoteles = await Hotel.insertMany([
      {
        name: "Hotel Playa Bonita",
        description: "Un hotel frente al mar con todas las comodidades.",
        amenities: ["Piscina", "WiFi", "Restaurante"],
        pricePerNight: 200,
        owner: ownerId,
        location: {
          address: "Calle 123, Bocagrande",
          city: "Cartagena",
          country: "Colombia",
        },
      },
      {
        name: "Hotel Montaña Encantada",
        description: "Un lugar tranquilo en medio de la naturaleza.",
        amenities: ["Spa", "Senderismo", "Restaurante"],
        pricePerNight: 150,
        owner: ownerId,
        location: {
          address: "Km 5 vía al Nevado",
          city: "Manizales",
          country: "Colombia",
        },
      },
    ]);

    console.log("🏨 Hoteles insertados");

    // 2️⃣ Crear habitaciones para cada hotel
    const habitaciones = [
      // Habitaciones para Playa Bonita
      {
        hotel: hoteles[0]._id,
        roomNumber: "101",
        type: "single",
        pricePerNight: 200,
        description: "Habitación individual con vista al mar",
        capacity: 1,
      },
      {
        hotel: hoteles[0]._id,
        roomNumber: "102",
        type: "double",
        pricePerNight: 300,
        description: "Habitación doble con balcón privado",
        capacity: 2,
      },
      {
        hotel: hoteles[0]._id,
        roomNumber: "201",
        type: "suite",
        pricePerNight: 500,
        description: "Suite de lujo frente al mar",
        capacity: 4,
      },

      // Habitaciones para Montaña Encantada
      {
        hotel: hoteles[1]._id,
        roomNumber: "101",
        type: "single",
        pricePerNight: 150,
        description: "Habitación individual con vista a la montaña",
        capacity: 1,
      },
      {
        hotel: hoteles[1]._id,
        roomNumber: "102",
        type: "double",
        pricePerNight: 220,
        description: "Habitación doble con chimenea",
        capacity: 2,
      },
      {
        hotel: hoteles[1]._id,
        roomNumber: "201",
        type: "suite",
        pricePerNight: 400,
        description: "Suite con jacuzzi y vista panorámica",
        capacity: 3,
      },
    ];

    await Room.insertMany(habitaciones);

    console.log("🛏️ Habitaciones insertadas");
    console.log("🌱 Base de datos poblada correctamente");
    process.exit();
  } catch (error) {
    console.error("❌ Error al inicializar:", error);
    process.exit(1);
  }
};

seedDatabase();
