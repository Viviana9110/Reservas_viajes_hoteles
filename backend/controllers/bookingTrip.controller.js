// controllers/bookingTripController.js
import BookingTrip from "../models/BookingTrips.js";
import nodemailer from "nodemailer"

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

    // Validar que checkIn < checkOut
    if (new Date(checkIn) >= new Date(checkOut)) {
      return res.status(400).json({ message: "La fecha de entrada debe ser menor a la de salida" });
    }

    // Verificar si el usuario ya tiene una reserva para ese viaje en las mismas fechas
    const existing = await BookingTrip.findOne({
      user,
      trip,
      $or: [
        { checkIn: { $lte: new Date(checkOut), $gte: new Date(checkIn) } },
        { checkOut: { $lte: new Date(checkOut), $gte: new Date(checkIn) } },
        {
          $and: [
            { checkIn: { $lte: new Date(checkIn) } },
            { checkOut: { $gte: new Date(checkOut) } },
          ],
        },
      ],
    });

    if (existing) {
      return res.status(400).json({ message: "Ya tienes una reserva para estas fechas" });
    }

    const newBooking = new BookingTrip({ user, trip, checkIn, checkOut });
    await newBooking.save();
    await newBooking.populate("trip user");

   // ✅ Configurar nodemailer (si tienes EMAIL_USER y EMAIL_PASS en .env)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // ✅ Opciones del correo
    const mailOptions = {
      from: `"Tour Colombia" <${process.env.EMAIL_USER}>`,
      to: newBooking.user.email, // usamos el email del usuario de la reserva
      subject: "Confirmación de tu reserva ✈️",
      html: `
        <h2>¡Gracias por tu reserva!</h2>
        <p>Hola <strong>${newBooking.user.name}</strong>,</p>
        <p>Tu reserva fue confirmada:</p>
        <ul>
          <li>Destino: ${newBooking.trip.name ?? trip}</li>
          <li>Check In: ${checkIn}</li>
          <li>Check Out: ${checkOut}</li>
        </ul>
        <p>Nos alegra que viajes con <b>Tour Colombia</b> 🌎</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (emailErr) {
      console.error("❌ Error al enviar correo:", emailErr.message);
      // No rompemos el flujo si falla el correo
    }

    // ✅ Solo una respuesta al cliente
    res.status(201).json({
      success: true,
      message: "Reserva creada exitosamente",
      booking: newBooking,
    });


  } catch (err) {
    res.status(500).json({ message: "Error al crear reserva", error: err.message });
  }
};

/**
 * Verificar disponibilidad sin crear reserva
 */
export const checkBookingTripDates = async (req, res) => {
  try {
    const { user, trip, checkIn, checkOut } = req.body;

    if (!user || !trip || !checkIn || !checkOut) {
      return res.status(400).json({ disponible: false, message: "Todos los campos son requeridos" });
    }

    if (new Date(checkIn) >= new Date(checkOut)) {
      return res.status(400).json({ disponible: false, message: "La fecha de entrada debe ser menor a la de salida" });
    }

    const existing = await BookingTrip.findOne({
      user,
      trip,
      $or: [
        { checkIn: { $lte: new Date(checkOut), $gte: new Date(checkIn) } },
        { checkOut: { $lte: new Date(checkOut), $gte: new Date(checkIn) } },
        {
          $and: [
            { checkIn: { $lte: new Date(checkIn) } },
            { checkOut: { $gte: new Date(checkOut) } },
          ],
        },
      ],
    });

    if (existing) {
      return res.json({ disponible: false, message: "Ya tienes una reserva en estas fechas" });
    }

    res.json({ disponible: true, message: "Fechas disponibles" });
  } catch (err) {
    res.status(500).json({ disponible: false, message: "Error al verificar", error: err.message });
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
