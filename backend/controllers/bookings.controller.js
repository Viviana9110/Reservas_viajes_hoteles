import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import Hotel from "../models/Hotel.js";

// ✅ Verificar disponibilidad
export const checkAvailability = async (req, res) => {
  try {
    const { user, roomId, checkIn, checkOut } = req.body;

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
        {
          checkIn: { $lt: new Date(checkOut) },
          checkOut: { $gt: new Date(checkIn) },
        },
      ],
    });

    if (overlapping) {
      return res
        .status(400)
        .json({ message: "La habitación ya está reservada en esas fechas" });
    }

    // crear reserva
    let booking = await Booking.create({
      user: userId,
      hotel: hotelId,
      room: roomId,
      checkIn,
      checkOut,
    });

    // repoblar para tener nombres de hotel y habitación
    booking = await Booking.findById(booking._id)
      .populate("hotel")
      .populate("room")
      .populate("user");

    // 🔹 buscar el usuario para obtener el email
    const user = await User.findById(userId);

    if (!user || !user.email) {
      return res
        .status(201)
        .json({ message: "Reserva creada, pero no se encontró el correo del usuario", booking });
    }

    // ✅ Configurar transporte de correo
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // tu correo
        pass: process.env.EMAIL_PASS, // tu contraseña o App Password
      },
    });

    // ✅ Opciones del correo
    const mailOptions = {
      from: `"Tour Colombia" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Confirmación de tu reserva ✈️",
      html: `
        <h2>¡Gracias por tu reserva!</h2>
        <p>Hola <strong>${user.name || "Viajero"}</strong>,</p>
        <p>Tu reserva fue confirmada:</p>
        <ul>
          <li><b>Hotel:</b> ${booking.hotel?.name || "Hotel sin nombre"}</li>
          <li><b>Habitación:</b> ${booking.room?.name || "Habitación"}</li>
          <li><b>Check In:</b> ${new Date(
            booking.checkIn
          ).toLocaleDateString()}</li>
          <li><b>Check Out:</b> ${new Date(
            booking.checkOut
          ).toLocaleDateString()}</li>
        </ul>
        <p>Nos alegra que viajes con <b>Tour Colombia</b> 🌎</p>
      `,
    };
     await transporter.sendMail(mailOptions);
      console.log("📧 Correo enviado a:", user.email);

    res.status(201).json({ message: "Reserva creada con éxito y correo de confirmacion", booking });
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