import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    destination: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    days: { type: Number, required: true },
    hotel: { type: String },
    images: [{ type: String }],
  },
  { timestamps: true }
);

const Package = mongoose.model("Package", packageSchema);

const seedPaquetes = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Database Connected");

    await Package.deleteMany({});

    const paquetes = [
      {
        name: "Paquete Caribe",
        destination: "Cartagena, Colombia",
        description: "4 días y 3 noches en hotel frente al mar, incluye desayuno.",
        price: 1200000,
        days: 4,
        hotel: "Hotel Caribe",
        images: ["https://picsum.photos/seed/cartagena-paquete/1200/800", "https://picsum.photos/seed/cartagena-playa/1200/800"],
      },
      {
        name: "Paquete Aventura",
        destination: "San Gil, Colombia",
        description: "5 días de deportes extremos y excursiones.",
        price: 950000,
        days: 5,
        hotel: "Hotel Sierra",
        images: ["https://picsum.photos/seed/sangil-aventura/1200/800", "https://picsum.photos/seed/sangil-rio/1200/800"],
      },
      {
        name: "Paquete Cultural",
        destination: "Bogotá, Colombia",
        description: "3 días de recorridos por museos, centros históricos y gastronomía.",
        price: 750000,
        days: 3,
        hotel: "Hotel Andino",
        images: ["https://picsum.photos/seed/bogota-cultural/1200/800", "https://picsum.photos/seed/bogota-museo/1200/800"],
      },
    ];

    await Package.insertMany(paquetes);
    console.log("✅ Paquetes insertados correctamente");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error al insertar paquetes:", error);
    mongoose.connection.close();
  }
};

seedPaquetes();
