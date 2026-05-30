import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String },
    stars: { type: Number, min: 1, max: 5, default: 3 },
  },
  { timestamps: true }
);

const Hotel = mongoose.model("Hotel", hotelSchema);

const seedHotels = async () => {
  try {
    await mongoose.connect(`${MONGO_URI}/Reservas`);
    console.log("✅ Database Connected");

    await Hotel.deleteMany({});

    const hoteles = [
      {
        name: "Hotel Caribe",
        location: "Cartagena, Colombia",
        description: "Hotel frente al mar con piscina y restaurante.",
        stars: 5,
      },
      {
        name: "Hotel Andino",
        location: "Bogotá, Colombia",
        description: "Hotel en el centro de la ciudad, ideal para negocios.",
        stars: 4,
      },
      {
        name: "Hotel Sierra",
        location: "Medellín, Colombia",
        description: "Hotel rodeado de naturaleza, perfecto para descansar.",
        stars: 3,
      },
    ];

    await Hotel.insertMany(hoteles);
    console.log("✅ Hoteles insertados correctamente");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error al insertar hoteles:", error);
    mongoose.connection.close();
  }
};

seedHotels();
