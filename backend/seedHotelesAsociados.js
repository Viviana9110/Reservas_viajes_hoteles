import "dotenv/config";
import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: {
      country: { type: String, required: true },
      city: { type: String, required: true },
      address: { type: String, required: true },
    },
    description: { type: String },
    amenities: [{ type: String }],
    pricePerNight: { type: Number },
    images: [{ type: String }],
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Hotel = mongoose.model("Hotel", hotelSchema);

const HOTELES = [
  {
    name: "Hotel Centro Histórico",
    location: { country: "Colombia", city: "Bogotá", address: "Carrera 5 # 12-34, La Candelaria" },
    description: "Encantador hotel boutique en el corazón del centro histórico de Bogotá, cerca de museos y plazas.",
    amenities: ["Free WiFi", "Free Breakfast", "Room Service", "Restaurante"],
    pricePerNight: 180000,
    images: ["https://picsum.photos/seed/hotel-centro-historico/1200/800", "https://picsum.photos/seed/centro-habitacion/1200/800"],
    owner: "68ace0ab41d81f213fdece68",
  },
  {
    name: "Hotel Santa Fe",
    location: { country: "Colombia", city: "Bogotá", address: "Calle 26 # 45-12, Chapinero" },
    description: "Hotel moderno con vista a la ciudad, ideal para viajeros de negocios y placer.",
    amenities: ["Free WiFi", "Pool Access", "Gimnasio", "Bar"],
    pricePerNight: 250000,
    images: ["https://picsum.photos/seed/hotel-santa-fe/1200/800", "https://picsum.photos/seed/santafe-vista/1200/800"],
    owner: "68ace0ab41d81f213fdece68",
  },
  {
    name: "Hotel Aventura San Gil",
    location: { country: "Colombia", city: "San Gil", address: "Carrera 10 # 15-30, Centro" },
    description: "Hotel temático de aventura con paquetes de rafting, parapente y espeleología.",
    amenities: ["Free WiFi", "Piscina", "Tour Desk", "Restaurante", "Estacionamiento"],
    pricePerNight: 120000,
    images: ["https://picsum.photos/seed/hotel-aventura-sangil/1200/800", "https://picsum.photos/seed/sangil-hotel/1200/800"],
    owner: "68ace0ab41d81f213fdece68",
  },
  {
    name: "Hotel Río Suárez",
    location: { country: "Colombia", city: "San Gil", address: "Vía al Río Suárez, Sector El Puente" },
    description: "Alojamiento rústico a orillas del río Suárez, perfecto para deportes extremos.",
    amenities: ["Free WiFi", "Zona de Camping", "Restaurante", "Guías"],
    pricePerNight: 95000,
    images: ["https://picsum.photos/seed/hotel-rio-suarez/1200/800", "https://picsum.photos/seed/rio-habitacion/1200/800"],
    owner: "68ace0ab41d81f213fdece68",
  },
  {
    name: "Hotel Bocagrande Plaza",
    location: { country: "Colombia", city: "Cartagena", address: "Av. San Martín # 8-56, Bocagrande" },
    description: "Hotel frente al mar en la zona turística más exclusiva de Cartagena.",
    amenities: ["Free WiFi", "Free Breakfast", "Pool Access", "Room Service", "Bar en Terraza"],
    pricePerNight: 320000,
    images: ["https://picsum.photos/seed/hotel-bocagrande/1200/800", "https://picsum.photos/seed/bocagrande-piscina/1200/800"],
    owner: "68ace0ab41d81f213fdece68",
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    for (const h of HOTELES) {
      const exists = await Hotel.findOne({ name: h.name });
      if (exists) {
        console.log(`⏭️  ${h.name} ya existe`);
      } else {
        await Hotel.create(h);
        console.log(`✅ ${h.name} creado`);
      }
    }
    console.log("✅ Hoteles asociados insertados");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

seed();
