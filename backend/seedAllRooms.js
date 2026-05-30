import "dotenv/config";
import mongoose from "mongoose";
import Room from "./models/Room.js";

const ROOM_TYPES = [
  { type: "single", number: "1", desc: "Habitación individual con cama queen, baño privado y escritorio", capacity: 1, price: 1.0 },
  { type: "double", number: "2", desc: "Habitación doble con dos camas dobles, TV y minibar", capacity: 2, price: 1.6 },
  { type: "double", number: "3", desc: "Habitación doble superior con balcón y vista", capacity: 2, price: 2.0 },
  { type: "suite", number: "4", desc: "Suite de lujo con sala independiente, jacuzzi y terraza", capacity: 4, price: 3.5 },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const hotels = await mongoose.connection.db.collection("hotels").find({}).toArray();
    if (!hotels.length) { console.log("❌ No hay hoteles"); process.exit(1); }

    await Room.deleteMany({});
    let count = 0;

    for (const hotel of hotels) {
      const basePrice = hotel.pricePerNight || 150000;
      for (const rt of ROOM_TYPES) {
        await Room.create({
          hotel: hotel._id,
          roomNumber: `${rt.number}0${(hotels.indexOf(hotel) + 1)}`,
          type: rt.type,
          pricePerNight: Math.round(basePrice * rt.price),
          description: rt.desc,
          capacity: rt.capacity,
          isAvailable: true,
        });
        count++;
      }
    }

    console.log(`✅ ${count} habitaciones creadas para ${hotels.length} hoteles`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

seed();
