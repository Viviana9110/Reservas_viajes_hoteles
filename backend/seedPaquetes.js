import mongoose, { Schema } from "mongoose";

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

// 🔹 Definir el modelo Paquete
const packageSchema = new Schema(
  {
    name: { type: String, required: true },
    destination: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    days: { type: Number, required: true },
    hotel: { type: String }, // opcional, si quieres asociar un hotel
  },
  { timestamps: true }
);

const Package = mongoose.model("Package", packageSchema);

// 🔹 Crear paquetes de prueba
const seedPaquetes = async () => {
  try {
    await connectDB();

    // Eliminar paquetes previos
    await Package.deleteMany({});

    const paquetes = [
      {
        name: "Paquete Caribe",
        destination: "Cartagena, Colombia",
        description: "4 días y 3 noches en hotel frente al mar, incluye desayuno.",
        price: 1200000,
        days: 4,
        hotel: "Hotel Caribe",
      },
      {
        name: "Paquete Aventura",
        destination: "San Gil, Colombia",
        description: "5 días de deportes extremos y excursiones.",
        price: 950000,
        days: 5,
        hotel: "Hotel Sierra",
      },
      {
        name: "Paquete Cultural",
        destination: "Bogotá, Colombia",
        description: "3 días de recorridos por museos, centros históricos y gastronomía.",
        price: 750000,
        days: 3,
        hotel: "Hotel Andino",
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
