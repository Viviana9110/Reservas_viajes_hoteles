import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

const AddPackage = () => {
  const [paquete, setPaquete] = useState({
    name: "", destination: "", description: "", price: "", days: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setPaquete({ ...paquete, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/packages`, paquete);
      toast.success("Paquete añadido con éxito");
      setPaquete({ name: "", destination: "", description: "", price: "", days: "" });
    } catch {
      toast.error("Error al añadir paquete");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6 max-w-4xl">
      <motion.div {...fadeUp} className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Añadir Paquete Turístico</h2>
        <p className="text-sm text-gray-500 mt-1">Crea un nuevo paquete de viaje para tus clientes.</p>
      </motion.div>

      <motion.form
        initial="initial"
        animate="animate"
        variants={{ animate: { transition: { staggerChildren: 0.05 } } }}
        onSubmit={handleSubmit}
        className="space-y-5 max-w-lg bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm"
      >
        <motion.div variants={fadeUp}>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Nombre</label>
          <input name="name" value={paquete.name} onChange={handleChange} className="outline-none py-2.5 px-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary-light transition-all w-full text-sm" required />
        </motion.div>

        <motion.div variants={fadeUp}>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Destino</label>
          <input name="destination" value={paquete.destination} onChange={handleChange} className="outline-none py-2.5 px-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary-light transition-all w-full text-sm" required />
        </motion.div>

        <motion.div variants={fadeUp}>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Descripción</label>
          <textarea name="description" value={paquete.description} onChange={handleChange} rows={3} className="outline-none py-2.5 px-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary-light transition-all w-full text-sm resize-none" placeholder="Descripción del paquete" />
        </motion.div>

        <motion.div variants={fadeUp} className="flex gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Precio</label>
            <input type="number" name="price" value={paquete.price} onChange={handleChange} className="outline-none py-2.5 px-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary-light transition-all w-full text-sm" required />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Días</label>
            <input type="number" name="days" value={paquete.days} onChange={handleChange} className="outline-none py-2.5 px-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary-light transition-all w-full text-sm" required />
          </div>
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
              Añadiendo...
            </span>
          ) : "Añadir Paquete"}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default AddPackage;
