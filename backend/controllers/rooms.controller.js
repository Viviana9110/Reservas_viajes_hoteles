import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import mongoose from "mongoose";

// Crear habitación en un hotel
export const createRoom = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const { roomNumber, type, pricePerNight, description, capacity, isAvailable } = req.body;

    // validar que el hotel exista
    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
      return res.status(400).json({ message: "ID de hotel inválido" });
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel no encontrado" });
    }

    // crear la habitación
    const room = await Room.create({
      hotel: hotel._id,
      roomNumber,
      type,
      pricePerNight,
      description,
      capacity,
      isAvailable,
    });

    res.status(201).json(room);
  } catch (error) {
    console.error("❌ Error creando habitación:", error);
    res.status(500).json({ message: "Error al crear la habitación", error: error.message });
  }
};

// Obtener todas las habitaciones
export const getRooms = async (req, res) => {
  try {
    // Populate para traer info del hotel si existe
    const rooms = await Room.find().populate("hotel", "name location");
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener habitaciones", error });
  }
};

// Obtener todas las habitaciones de un hotel
export const getRoomsByHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(hotelId)) {
      return res.status(400).json({ message: "ID de hotel inválido" });
    }

    const rooms = await Room.find({ hotel: hotelId });

    if (rooms.length === 0) {
      return res.status(200).json([]); // devuelve array vacío
    }

    res.status(200).json(rooms);
  } catch (error) {
    console.error("❌ Error obteniendo habitaciones:", error);
    res.status(500).json({ message: "Error al obtener habitaciones", error: error.message });
  }
};

// Actualizar habitación
export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findByIdAndUpdate(id, req.body, { new: true });
    if (!room) {
      return res.status(404).json({ message: "Habitación no encontrada" });
    }

    res.json(room);
  } catch (error) {
    console.error("❌ Error actualizando habitación:", error);
    res.status(500).json({ message: "Error al actualizar habitación", error: error.message });
  }
};

// Eliminar habitación
export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findByIdAndDelete(id);
    if (!room) {
      return res.status(404).json({ message: "Habitación no encontrada" });
    }

    res.json({ message: "Habitación eliminada correctamente" });
  } catch (error) {
    console.error("❌ Error eliminando habitación:", error);
    res.status(500).json({ message: "Error al eliminar habitación", error: error.message });
  }
};
