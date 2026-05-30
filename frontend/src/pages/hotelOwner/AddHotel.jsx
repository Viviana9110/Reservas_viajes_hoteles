import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const AddHotel = () => {
  const { token, logoutUser } = useAppContext();

  const [hotel, setHotel] = useState({
    name: "", country: "", city: "", address: "", description: "", amenities: "", pricePerNight: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setHotel({ ...hotel, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!token) {
        toast.error("Debes iniciar sesión para registrar un hotel");
        setLoading(false);
        return;
      }
      await axios.post(
        `${import.meta.env.VITE_API_URL}/hotels`,
        {
          name: hotel.name,
          location: { country: hotel.country, city: hotel.city, address: hotel.address },
          description: hotel.description,
          amenities: hotel.amenities ? hotel.amenities.split(",").map((a) => a.trim()) : [],
          pricePerNight: hotel.pricePerNight,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Hotel registrado correctamente");
      setHotel({ name: "", country: "", city: "", address: "", description: "", amenities: "", pricePerNight: "" });
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Sesión expirada. Vuelve a iniciar sesión.");
        if (logoutUser) logoutUser();
      } else {
        toast.error("Error al registrar hotel");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 max-w-4xl">
      <motion.div {...fadeUp} className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Añadir Hotel</h2>
        <p className="text-sm text-gray-500 mt-1">Completa los detalles del nuevo hotel.</p>
      </motion.div>

      <motion.form
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.05 } } }}
        onSubmit={handleSubmit}
        className="space-y-5 max-w-lg bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm"
      >
        <motion.div variants={fadeUp}>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Nombre del Hotel</label>
          <input type="text" name="name" value={hotel.name} onChange={handleChange} placeholder="Nombre del Hotel" className="outline-none py-2.5 px-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary-light transition-all w-full text-sm" required />
        </motion.div>

        <motion.div variants={fadeUp} className="flex items-center gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">País</label>
            <input type="text" name="country" value={hotel.country} onChange={handleChange} placeholder="Colombia" className="outline-none py-2.5 px-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary-light transition-all w-full text-sm" required />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Ciudad</label>
            <input type="text" name="city" value={hotel.city} onChange={handleChange} placeholder="Medellín" className="outline-none py-2.5 px-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary-light transition-all w-full text-sm" required />
          </div>
        </motion.div>

        <motion.div variants={fadeUp}>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Dirección</label>
          <input type="text" name="address" value={hotel.address} onChange={handleChange} placeholder="Dirección" className="outline-none py-2.5 px-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary-light transition-all w-full text-sm" required />
        </motion.div>

        <motion.div variants={fadeUp}>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Descripción</label>
          <textarea name="description" value={hotel.description} onChange={handleChange} placeholder="Descripción del hotel" rows={3} className="outline-none py-2.5 px-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary-light transition-all w-full text-sm resize-none" />
        </motion.div>

        <motion.div variants={fadeUp}>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Amenidades (separadas por coma)</label>
          <input type="text" name="amenities" value={hotel.amenities} onChange={handleChange} placeholder="Wifi, Piscina, Parqueadero" className="outline-none py-2.5 px-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary-light transition-all w-full text-sm" />
        </motion.div>

        <motion.div variants={fadeUp}>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Precio por Noche</label>
          <input type="number" name="pricePerNight" value={hotel.pricePerNight} onChange={handleChange} placeholder="150000" className="outline-none py-2.5 px-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary-light transition-all w-full text-sm" />
        </motion.div>

        <motion.button
          variants={fadeUp}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-2.5 bg-gradient-to-r from-secondary to-gray-800 text-white font-medium rounded-lg hover:from-gray-800 hover:to-gray-900 transition text-sm cursor-pointer disabled:opacity-60 shadow-sm"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
              Registrando...
            </span>
          ) : "Registrar Hotel"}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default AddHotel;
