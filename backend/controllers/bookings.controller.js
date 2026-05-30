import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
import Hotel from "../models/Hotel.js";
import { sendEmailNotification, sendWhatsAppNotification, formatBookingItems } from "../utils/notifications.js";

export const checkAvailability = async (req, res) => {
  try {
    const { user, roomId, checkIn, checkOut } = req.body;

    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({ available: false, message: "Faltan datos" });
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const overlapping = await Booking.findOne({
      room: roomId,
      $or: [{ checkIn: { $lt: end }, checkOut: { $gt: start } }],
    });

    if (overlapping) {
      return res.json({ available: false, message: "Habitación no disponible en estas fechas" });
    }

    res.json({ available: true, message: "Habitación disponible" });
  } catch (error) {
    console.error("Error en disponibilidad:", error);
    res.status(500).json({ available: false, message: "Error verificando disponibilidad" });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { userId, hotelId, roomId, checkIn, checkOut } = req.body;

    const overlapping = await Booking.findOne({
      room: roomId,
      $or: [{ checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } }],
    });

    if (overlapping) {
      return res.status(400).json({ message: "La habitación ya está reservada en esas fechas" });
    }

    let booking = await Booking.create({
      user: userId,
      hotel: hotelId,
      room: roomId,
      checkIn,
      checkOut,
    });

    booking = await Booking.findById(booking._id)
      .populate("hotel")
      .populate("room")
      .populate("user", "name email phone");

    const items = formatBookingItems(booking);
    const userName = booking.user?.name || "Viajero";
    const userEmail = booking.user?.email;
    const userPhone = booking.user?.phone;

    if (userEmail) {
      await sendEmailNotification(userEmail, userName, items,
        "Tu reserva ha sido confirmada. ¡Prepárate para disfrutar tu estadía!"
      );
    }

    if (userPhone && process.env.TWILIO_ACCOUNT_SID) {
      const waMsg = `🎉 *Reserva Confirmada - Tour Colombia*\n\nHola ${userName},\n\n${items.map((i) => `✅ ${i.label}: ${i.value}`).join("\n")}\n\n¡Gracias por viajar con nosotros! 🌎`;
      await sendWhatsAppNotification(userPhone, waMsg);
    }

    res.status(201).json({ message: "Reserva creada con éxito", booking });
  } catch (error) {
    console.error("Error creando reserva:", error);
    res.status(500).json({ message: "Error al crear la reserva" });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookings = await Booking.find({ user: userId }).populate("hotel").populate("room");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener reservas" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByIdAndDelete(id);

    if (!booking) {
      return res.status(404).json({ message: "Reserva no encontrada" });
    }

    await Room.findByIdAndUpdate(booking.room, { isAvailable: true });

    res.json({ message: "Reserva cancelada correctamente" });
  } catch (error) {
    console.error("Error cancelando reserva:", error);
    res.status(500).json({ message: "Error del servidor" });
  }
};
