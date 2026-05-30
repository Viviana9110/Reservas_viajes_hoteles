import "dotenv/config";
import mongoose from "mongoose";
import Hotel from "./models/Hotel.js";

const hotelImages = {
  "Hotel Montaña Encantada": [
    "https://picsum.photos/seed/hotel-montana/1200/800",
    "https://picsum.photos/seed/montana-habitacion/1200/800",
  ],
  "Hotel Carretero": [
    "https://picsum.photos/seed/hotel-carretero/1200/800",
    "https://picsum.photos/seed/carretero-lobby/1200/800",
  ],
  "Hotel Escorial": [
    "https://picsum.photos/seed/hotel-escorial/1200/800",
    "https://picsum.photos/seed/escorial-vista/1200/800",
  ],
  "Hotel Playa Bonita": [
    "https://picsum.photos/seed/hotel-playa/1200/800",
    "https://picsum.photos/seed/playa-bonita/1200/800",
  ],
};

const update = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const hotels = await Hotel.find({});
    for (const hotel of hotels) {
      const images = hotelImages[hotel.name];
      if (images) {
        await Hotel.findByIdAndUpdate(hotel._id, { images });
        console.log(`✅ ${hotel.name} → ${images[0]}`);
      } else {
        const slug = (hotel.name || "hotel").toLowerCase().replace(/[^a-z0-9]+/g, "-");
        const fallback = [`https://picsum.photos/seed/${slug}/1200/800`];
        await Hotel.findByIdAndUpdate(hotel._id, { images: fallback });
        console.log(`✅ ${hotel.name} (fallback) → ${fallback[0]}`);
      }
    }
    console.log("✅ Todas las imágenes de hoteles actualizadas");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

update();
