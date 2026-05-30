import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const AccessDenied = () => {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
      <div className="bg-red-50 rounded-full p-6 mb-6">
        <span className="text-5xl">🚫</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Acceso Denegado</h1>
      <p className="text-gray-500 mb-8 max-w-md">
        No tienes permisos para acceder a esta página. Inicia sesión con una cuenta que tenga los permisos necesarios.
      </p>
      <Link to="/" className="px-6 py-2.5 bg-secondary text-white rounded-lg hover:bg-gray-800 transition font-medium">
        Volver al Inicio
      </Link>
    </motion.div>
  );
};

export default AccessDenied;
