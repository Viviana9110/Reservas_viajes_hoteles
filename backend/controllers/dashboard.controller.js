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

    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email")
      .populate("hotel", "name")
      .lean();

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const bookingTrend = await Booking.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const upcomingCheckins = await Booking.find({
      checkIn: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    })
      .populate("user", "name")
      .populate("hotel", "name")
      .lean();

    const lowRoomResult = await Room.aggregate([
      { $match: { isAvailable: true } },
      { $group: { _id: "$hotel", count: { $sum: 1 } } },
      { $match: { count: { $lt: 3 } } },
    ]);
    const lowRoomHotels = lowRoomResult.length;

    res.json({
      totalHotels,
      totalRooms,
      totalPackages,
      activeReservations,
      recentBookings: recentBookings.map((b) => ({
        _id: b._id,
        userName: b.user?.name || "Anónimo",
        userEmail: b.user?.email || "",
        hotelName: b.hotel?.name || "Hotel eliminado",
        checkIn: b.checkIn,
        checkOut: b.checkOut,
        createdAt: b.createdAt,
      })),
      bookingTrend: bookingTrend.map((t) => ({
        month: `${t._id.year}-${String(t._id.month).padStart(2, "0")}`,
        count: t.count,
      })),
      alerts: {
        upcomingCheckins: upcomingCheckins.map((b) => ({
          _id: b._id,
          userName: b.user?.name || "Anónimo",
          hotelName: b.hotel?.name || "Hotel eliminado",
          checkIn: b.checkIn,
        })),
        lowRoomHotels,
      },
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({ message: "Error al obtener estadísticas" });
  }
};
