// controllers/bookingTripController.js
import BookingTrip from "../models/BookingTrips.js";

/**
 * Crear una reserva de viaje
 */
export const createBookingTrip = async (req, res) => {
  try {
    const { user, trip, checkIn, checkOut } = req.body;

    // Validación básica
    if (!user || !trip || !checkIn || !checkOut) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

    // Verificar si el usuario ya tiene una reserva para ese viaje en las mismas fechas
    const existing = await BookingTrip.findOne({
      user,
      trip,
      $or: [
        { checkIn: { $lte: checkOut, $gte: checkIn } },
        { checkOut: { $lte: checkOut, $gte: checkIn } }
      ]
    });

    if (existing) {
      return res.status(400).json({ message: "Ya tienes una reserva para estas fechas" });
    }

    const newBooking = new BookingTrip({ user, trip, checkIn, checkOut });
    await newBooking.save();

    res.status(201).json({
      message: "Reserva creada exitosamente",
      booking: await newBooking.populate("trip user"),
    });
  } catch (err) {
    res.status(500).json({ message: "Error al crear reserva", error: err.message });
  }
};

/**
 * Obtener todas las reservas
 */
export const getAllBookingTrips = async (req, res) => {
  try {
    const bookings = await BookingTrip.find()
      .populate("trip")
      .populate("user", "name email"); // solo name y email
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener reservas", error: err.message });
  }
};

/**
 * Obtener reservas de un usuario
 */
export const getBookingTripsByUser = async (req, res) => {
  try {
    const { id } = req.params;
    const bookings = await BookingTrip.find({ user: id })
      .populate("trip")
      .populate("user", "name email");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener reservas del usuario", error: err.message });
  }
};

/**
 * Eliminar una reserva
 */
export const deleteBookingTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await BookingTrip.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    res.json({ message: "Reserva eliminada correctamente" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar reserva", error: err.message });
  }
};
