import BookingTrip from "../models/BookingTrips.js";
import mongoose from "mongoose";

// Crear una reserva
export const createBookingTrip = async (req, res) => {
  try {
    const { user, trip, checkIn, checkOut } = req.body;

    if (!user || !trip || !checkIn || !checkOut) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

    const booking = await BookingTrip.create({ user, trip, checkIn, checkOut });
    res.status(201).json(booking);
  } catch (error) {
    console.error("❌ Error creando reserva de viaje:", error);
    res.status(500).json({ message: "Error al crear la reserva", error: error.message });
  }
};

// Verificar disponibilidad
export const checkBookingAvailability = async (req, res) => {
  try {
    const { user, checkIn, checkOut } = req.body;

    if (!user || !checkIn || !checkOut) {
      return res.status(400).json({ message: "Usuario y fechas son requeridos" });
    }

    // Buscar reservas del usuario que se crucen con el rango de fechas
    const overlapping = await BookingTrip.findOne({
      user,
      $or: [
        {
          checkIn: { $lte: new Date(checkOut) },
          checkOut: { $gte: new Date(checkIn) },
        },
      ],
    });

    if (overlapping) {
      return res.status(200).json({ available: false, message: "Ya tienes una reserva en esas fechas" });
    }

    res.status(200).json({ available: true, message: "Fechas disponibles" });
  } catch (error) {
    console.error("❌ Error verificando disponibilidad:", error);
    res.status(500).json({ message: "Error al verificar disponibilidad", error: error.message });
  }
};

// Obtener reservas de un usuario
export const getBookingsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "ID de usuario inválido" });
    }

    const bookings = await BookingTrip.find({ user: userId }).populate("trip");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener reservas", error });
  }
};
