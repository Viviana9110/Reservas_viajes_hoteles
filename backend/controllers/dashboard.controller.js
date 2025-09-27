import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import Package from "../models/Package.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalHotels = await Hotel.countDocuments();
    const totalRooms = await Room.countDocuments();
    const totalPackages = await Package.countDocuments();
    
    res.json({
      totalHotels,
      totalRooms,
      totalPackages,
      
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({ message: "Error al obtener estadísticas" });
  }
};
