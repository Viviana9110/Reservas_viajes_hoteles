import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import Package from "../models/Package.js";
import Booking from "../models/Booking.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalHotels = await Hotel.countDocuments();
    const totalRooms = await Room.countDocuments();
    const totalPackages = await Package.countDocuments();
    const activeReservations = await Booking.countDocuments({
      checkOut: { $gte: new Date() },
    });

    res.json({
      totalHotels,
      totalRooms,
      totalPackages,
      activeReservations,
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({ message: "Error al obtener estadísticas" });
  }
};
