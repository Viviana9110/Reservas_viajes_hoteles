import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";

const Navbar = () => {
  const { user, logoutUser } = useAppContext();

  return (
    <div className="flex items-center justify-between px-4 md:px-8 border-b border-gray-200 py-3 bg-white shadow-sm">
      <Link to="/" className="flex items-center gap-2">
        <img src={assets.logoTour} alt="Tour Colombia" className="w-25" />
      </Link>
      <div className="flex items-center gap-4 text-gray-600">
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-sm text-gray-500">Bienvenido,</span>
            <span className="font-semibold text-gray-800">{user?.name}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          onClick={logoutUser}
          className="border border-gray-300 rounded-full text-sm px-4 py-1.5 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition cursor-pointer"
        >
          Cerrar Sesión
        </motion.button>
      </div>
    </div>
  );
};

export default Navbar;
