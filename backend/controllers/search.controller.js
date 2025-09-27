import Hotel from "../models/Hotel.js";
import Package from "../models/Package.js";
import Room from "../models/Room.js";
import Booking from "../models/Booking.js";

export const search = async (req, res) => {
  try {
    const {
      destination = "",
      checkIn,
      checkOut,
      guests,
      page = 1,
      limit = 12,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10));
    const lim = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * lim;
    const dest = (destination || "").trim();

    // Query base para hoteles
    const hotelsQuery = dest
      ? {
          $or: [
            { "location.city": { $regex: dest, $options: "i" } },
            { "location.country": { $regex: dest, $options: "i" } },
          ],
        }
      : {};

    // Buscar hoteles
    let hotels = await Hotel.find(hotelsQuery).skip(skip).limit(lim).lean();

    // Si se enviaron fechas, filtrar disponibilidad
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      // Buscar habitaciones ocupadas en esas fechas
      const bookedRooms = await Booking.find({
        $or: [
          {
            checkIn: { $lte: checkOutDate },
            checkOut: { $gte: checkInDate },
          },
        ],
      }).select("room");

      const bookedRoomIds = bookedRooms.map((b) => b.room.toString());

      // Filtrar hoteles que tengan al menos una habitación libre
      const availableHotels = [];
      for (const hotel of hotels) {
        const rooms = await Room.find({
          hotel: hotel._id,
          _id: { $nin: bookedRoomIds },
        }).lean();

        if (rooms.length > 0) {
          availableHotels.push({
            ...hotel,
            availableRooms: rooms, // opcional: devolver habitaciones libres
          });
        }
      }

      hotels = availableHotels;
    }

    // Buscar paquetes turísticos
    const packagesQuery = dest
      ? { destination: { $regex: dest, $options: "i" } }
      : {};

    const packages = await Package.find(packagesQuery).skip(skip).limit(lim).lean();

    return res.json({
      hotels,
      packages,
      pagination: { page: pageNum, limit: lim },
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ message: "Error en la búsqueda", error: error.message });
  }
};
