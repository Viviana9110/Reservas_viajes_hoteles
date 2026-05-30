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
    const guestCount = parseInt(guests, 10) || 0;

    const hotelsQuery = dest
      ? {
          $or: [
            { "location.city": { $regex: dest, $options: "i" } },
            { "location.country": { $regex: dest, $options: "i" } },
            { name: { $regex: dest, $options: "i" } },
          ],
        }
      : {};

    let hotels = await Hotel.find(hotelsQuery).skip(skip).limit(lim).lean();

    const checkInDate = checkIn ? new Date(checkIn) : null;
    const checkOutDate = checkOut ? new Date(checkOut) : null;

    let bookedRoomIds = [];
    if (checkInDate && checkOutDate) {
      const bookedRooms = await Booking.find({
        $or: [
          {
            checkIn: { $lte: checkOutDate },
            checkOut: { $gte: checkInDate },
          },
        ],
      }).select("room");
      bookedRoomIds = bookedRooms.map((b) => b.room.toString());
    }

    const availableHotels = [];
    for (const hotel of hotels) {
      const roomFilter = { hotel: hotel._id };
      if (bookedRoomIds.length > 0) {
        roomFilter._id = { $nin: bookedRoomIds };
      }
      if (guestCount > 0) {
        roomFilter.capacity = { $gte: guestCount };
      }

      const rooms = await Room.find(roomFilter).lean();

      if (rooms.length > 0) {
        availableHotels.push({
          ...hotel,
          availableRooms: rooms,
          minPrice: Math.min(...rooms.map((r) => r.pricePerNight)),
          totalAvailable: rooms.length,
        });
      }
    }

    const packagesQuery = dest
      ? {
          $or: [
            { destination: { $regex: dest, $options: "i" } },
            { name: { $regex: dest, $options: "i" } },
          ],
        }
      : {};

    const packages = await Package.find(packagesQuery).skip(skip).limit(lim).lean();

    return res.json({
      hotels: availableHotels,
      packages,
      query: { destination: dest, checkIn, checkOut, guests: guestCount },
      pagination: { page: pageNum, limit: lim },
    });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ message: "Error en la búsqueda", error: error.message });
  }
};
