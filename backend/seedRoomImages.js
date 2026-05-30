import "dotenv/config";
import mongoose from "mongoose";
import Room from "./models/Room.js";

const ROOM_IMAGE_SEEDS = {
  single: [
    "https://picsum.photos/seed/habitacion-single-1/1200/800",
    "https://picsum.photos/seed/habitacion-single-2/1200/800",
  ],
  double: [
    "https://picsum.photos/seed/habitacion-doble-1/1200/800",
    "https://picsum.photos/seed/habitacion-doble-2/1200/800",
  ],
  suite: [
    "https://picsum.photos/seed/habitacion-suite-1/1200/800",
    "https://picsum.photos/seed/habitacion-suite-2/1200/800",
  ],
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const rooms = await Room.find({});
    let count = 0;

    for (const room of rooms) {
      const images = ROOM_IMAGE_SEEDS[room.type] || ROOM_IMAGE_SEEDS.double;
      await Room.findByIdAndUpdate(room._id, { images });
      count++;
    }

    console.log(`✅ ${count} habitaciones actualizadas con imágenes`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

seed();
