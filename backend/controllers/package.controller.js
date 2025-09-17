import Package from "../models/Package.js";

// ==============================
// Crear un Package (solo owner)
// ==============================
export const createPackage = async (req, res) => {
  try {
    const { name, destination, description, price, days } = req.body;

    // ✅ Validación de campos obligatorios
    if (!name || !destination || !price || !days) {
      return res.status(400).json({ message: "Todos los datos son obligatorios" });
    }

    const newPackage = new Package({ name, destination, description, price, days });

   await newPackage.save();

    res.status(201).json({ message: "Package creado con éxito", newPackage });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el package", error: error.message });
  }
};

export const getPackages = async (req, res) => {
  try {
    const packages = await Package.find();
    res.status(200).json(packages);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los paquetes", error });
  }
};
