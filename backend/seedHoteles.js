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

// 🔹 Definir el modelo Hotel
const hotelSchema = new Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String },
    stars: { type: Number, min: 1, max: 5, default: 3 },
  },
  { timestamps: true }
);

const Hotel = mongoose.model("Hotel", hotelSchema);

// 🔹 Crear hoteles de prueba
const seedHotels = async () => {
  try {
    await connectDB();

    // Eliminar hoteles previos
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
