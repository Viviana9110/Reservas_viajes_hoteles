import Hotel from "../models/Hotel.js";

// ==============================
// Crear un hotel (solo owner)
// ==============================
export const createHotel = async (req, res) => {
  try {
    const { name, location, description, amenities, pricePerNight } = req.body;

    // ✅ Validación de campos obligatorios
    if (!name || !location?.country || !location?.city || !location?.address) {
      return res.status(400).json({ message: "Faltan datos obligatorios: name, location.country, location.city, location.address" });
    }

    const hotel = new Hotel({
      name,
      location,
      description,
      amenities,
      pricePerNight,
      owner: req.user.id, // 👈 asignamos el propietario autenticado
    });

    await hotel.save();

    res.status(201).json({ message: "Hotel creado con éxito", hotel });
  } catch (error) {
    res.status(500).json({ message: "Error al crear hotel", error: error.message });
  }
};

// ==============================
// Obtener todos los hoteles
// ==============================
export const getHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find().populate("owner", "name email role");
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener hoteles", error: error.message });
  }
};

// ==============================
// Obtener un hotel por ID
// ==============================
export const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate("owner", "name email role");
    if (!hotel) return res.status(404).json({ message: "Hotel no encontrado" });
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener hotel", error: error.message });
  }
};

// ==============================
// Actualizar un hotel (solo el dueño)
// ==============================
export const updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) return res.status(404).json({ message: "Hotel no encontrado" });

    // Solo el propietario del hotel puede editarlo
    if (hotel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "No tienes permiso para actualizar este hotel" });
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.json({ message: "Hotel actualizado con éxito", hotel: updatedHotel });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar hotel", error: error.message });
  }
};

// ==============================
// Eliminar un hotel (solo el dueño)
// ==============================
export const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) return res.status(404).json({ message: "Hotel no encontrado" });

    // Solo el propietario del hotel puede eliminarlo
    if (hotel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "No tienes permiso para eliminar este hotel" });
    }

    await hotel.deleteOne();

    res.json({ message: "Hotel eliminado con éxito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar hotel", error: error.message });
  }
};
