import Booking from "../models/Booking.js";
import Room from "../models/Room.js";

// ✅ Verificar disponibilidad
export const checkAvailability = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut } = req.body;

    // validar datos
    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({ available: false, message: "Faltan datos" });
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    // buscar reservas que se crucen con el rango
    const overlapping = await Booking.findOne({
      room: roomId,
      $or: [
        { checkIn: { $lt: end }, checkOut: { $gt: start } }, // se cruza con las fechas
      ],
    });

    if (overlapping) {
      return res.json({ available: false, message: "❌ Habitación no disponible en estas fechas" });
    }

    res.json({ available: true, message: "✅ Habitación disponible" });
  } catch (error) {
    console.error("Error en disponibilidad:", error);
    res.status(500).json({ available: false, message: "Error verificando disponibilidad" });
  }
};

// ✅ Crear reserva
export const createBooking = async (req, res) => {
  try {
    const { userId, hotelId, roomId, checkIn, checkOut } = req.body;

    // verificar disponibilidad antes de reservar
    const overlapping = await Booking.findOne({
      room: roomId,
      $or: [
        { checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } },
      ],
    });

    if (overlapping) {
      return res.status(400).json({ message: "La habitación ya está reservada en esas fechas" });
    }

    const booking = await Booking.create({
      user: userId,
      hotel: hotelId,
      room: roomId,
      checkIn,
      checkOut,
    });

    res.status(201).json({ message: "Reserva creada con éxito", booking });
  } catch (error) {
    console.error("Error creando reserva:", error);
    res.status(500).json({ message: "Error al crear la reserva" });
  }
};

// ✅ Obtener reservas de un usuario
export const getMyBookings = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({ user: userId })
      .populate("hotel")
      .populate("room");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener reservas" });
  }
};

// ✅ Cancelar reserva
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    // Opcional: volver a marcar la habitación como disponible
    await Room.findByIdAndUpdate(booking.room, { isAvailable: true });

    res.json({ message: "Reserva cancelada correctamente" });
  } catch (error) {
    console.error("Error cancelando reserva:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
