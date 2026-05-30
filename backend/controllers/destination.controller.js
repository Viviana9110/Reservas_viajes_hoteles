import Destination from "../models/Destination.js";

export const getAllDestinations = async (req, res) => {
  try {
    const destinations = await Destination.find().sort({ name: 1 });
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener destinos", error: error.message });
  }
};

export const getDestinationById = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).json({ message: "Destino no encontrado" });
    res.json(destination);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener destino", error: error.message });
  }
};

export const createDestination = async (req, res) => {
  try {
    const destination = await Destination.create(req.body);
    res.status(201).json(destination);
  } catch (error) {
    res.status(500).json({ message: "Error al crear destino", error: error.message });
  }
};

export const updateDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!destination) return res.status(404).json({ message: "Destino no encontrado" });
    res.json(destination);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar destino", error: error.message });
  }
};

export const deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) return res.status(404).json({ message: "Destino no encontrado" });
    res.json({ message: "Destino eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar destino", error: error.message });
  }
};
