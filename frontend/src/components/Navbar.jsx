import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { to: "/", label: "Inicio" },
  { to: "/hotels", label: "Hoteles" },
  { to: "/trips", label: "Paquetes" },
  { to: "/custom-trips", label: "Personalizado" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, setShowUserLogin, navigate, logoutUser } = useAppContext();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== "/") {
      setIsScrolled(true);
      return;
    }
    setIsScrolled(false);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const isHome = location.pathname === "/";

  const menuVariants = {
    closed: { opacity: 0, scale: 0.95, y: -12 },
    open: { opacity: 1, scale: 1, y: 0 },
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
      isScrolled
        ? "bg-white/70 backdrop-blur-xl shadow-[0_1px_0_rgba(42,31,26,0.06)] py-3 md:py-3"
        : "bg-gradient-to-b from-black/20 to-transparent py-4 md:py-5"
    }`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-16 lg:px-24">
        <Link to="/">
          <img src={assets.logoTour} alt="Tour Colombia" className="w-22 md:w-25" />
        </Link>

        <div className="hidden md:flex items-center gap-3 lg:gap-6">
          <div className="flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <NavLink key={link.to} to={link.to} end={link.to === "/"} className="relative px-3 py-2">
                {({ isActive }) => (
                  <>
                    <span className={`text-sm font-medium transition-colors duration-300 ${
                      isActive
                        ? isScrolled ? "text-primary" : "text-white"
                        : isScrolled ? "text-gray-700 hover:text-primary" : "text-white/80 hover:text-white"
                    }`}>
                      {link.label}
                    </span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className={`absolute -bottom-0.5 left-2 right-2 h-0.5 rounded-full ${
                          isScrolled ? "bg-primary" : "bg-white"
                        }`}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {user?.role === "owner" && (
            <NavLink
              to="/owner"
              className={({ isActive }) =>
                `px-4 py-1.5 text-sm font-semibold rounded-full cursor-pointer transition-all ${
                  isActive
                    ? "bg-primary text-white"
                    : isScrolled
                      ? "border border-primary text-primary hover:bg-primary hover:text-white"
                      : "border border-white/60 text-white hover:bg-white hover:text-primary"
                }`
              }
            >
              Dashboard
            </NavLink>
          )}

          {!user ? (
            <button
              onClick={() => setShowUserLogin(true)}
              className={`px-7 py-2.5 rounded-full ml-2 font-medium text-sm transition-all duration-300 active:scale-95 cursor-pointer ${
                isScrolled
                  ? "bg-secondary text-white hover:bg-gray-800"
                  : "bg-white/15 backdrop-blur text-white border border-white/30 hover:bg-white/25"
              }`}
            >
              Iniciar Sesión
            </button>
          ) : (
            <div className="relative ml-2">
              <div className="group">
                <div className="flex items-center gap-2 cursor-pointer">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`w-9 h-9 flex items-center justify-center rounded-full font-semibold text-sm transition-colors ${
                      isScrolled ? "bg-primary text-white" : "bg-white/15 text-white backdrop-blur"
                    }`}
                  >
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </motion.div>
                  <span className={`text-sm font-medium hidden lg:block ${isScrolled ? "text-gray-800" : "text-white"}`}>
                    {user.name}
                  </span>
                </div>

                <AnimatePresence>
                  <motion.ul
                    variants={menuVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    transition={{ duration: 0.15 }}
                    className="invisible group-hover:visible absolute top-11 right-0 bg-white shadow-xl border border-gray-100/80 py-1.5 w-48 rounded-xl text-sm z-40 opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    {[
                      { label: "Mis Reservas", path: "/my-bookings" },
                      { label: "Mis Viajes", path: "/my-bookings-trips" },
                      { label: "Viaje Personalizado", path: "/my-custom-trips" },
                    ].map((item) => (
                      <li
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className="px-4 py-2.5 text-gray-700 hover:bg-cream hover:text-primary cursor-pointer transition-colors"
                      >
                        {item.label}
                      </li>
                    ))}
                    <li className="border-t border-gray-100 my-1" />
                    <li onClick={logoutUser} className="px-4 py-2.5 text-red-600 hover:bg-red-50 cursor-pointer transition-colors">
                      Cerrar Sesión
                    </li>
                  </motion.ul>
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>

        <button onClick={() => setOpen(!open)} aria-label="Menu" className="md:hidden cursor-pointer z-50">
          <div className="w-5 h-4 relative flex flex-col justify-between">
            <motion.span
              animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              className="block h-0.5 w-full rounded-full origin-center"
              style={{ background: isScrolled ? "#2A1F1A" : "white" }}
            />
            <motion.span
              animate={open ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
              className="block h-0.5 w-3/4 rounded-full"
              style={{ background: isScrolled ? "#2A1F1A" : "white" }}
            />
            <motion.span
              animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              className="block h-0.5 w-full rounded-full origin-center"
              style={{ background: isScrolled ? "#2A1F1A" : "white" }}
            />
          </div>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full left-3 right-3 mt-1 bg-white/95 backdrop-blur-xl shadow-xl border border-gray-100/80 rounded-2xl py-3 px-3 md:hidden"
          >
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-xl transition-colors text-sm font-medium ${
                    isActive ? "bg-primary-light text-primary" : "text-gray-700 hover:bg-cream"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {user && (
              <>
                <div className="h-px bg-gray-100 my-1 mx-3" />
                <NavLink to="/my-bookings" onClick={() => setOpen(false)} className="block px-4 py-3 rounded-xl text-sm text-gray-700 hover:bg-cream transition-colors">Mis Reservas</NavLink>
                <NavLink to="/my-bookings-trips" onClick={() => setOpen(false)} className="block px-4 py-3 rounded-xl text-sm text-gray-700 hover:bg-cream transition-colors">Mis Viajes</NavLink>
                <NavLink to="/my-custom-trips" onClick={() => setOpen(false)} className="block px-4 py-3 rounded-xl text-sm text-gray-700 hover:bg-cream transition-colors">Viaje Personalizado</NavLink>
              </>
            )}
            {user?.role === "owner" && (
              <NavLink to="/owner" onClick={() => setOpen(false)} className="block px-4 py-3 rounded-xl text-sm text-primary font-semibold hover:bg-primary-light transition-colors">Dashboard</NavLink>
            )}
            <div className="h-px bg-gray-100 my-1 mx-3" />
            {!user ? (
              <button onClick={() => { setShowUserLogin(true); setOpen(false); }}
                className="w-full cursor-pointer px-4 py-3 mt-1 bg-primary hover:bg-primary-dark transition text-white rounded-xl text-sm font-medium text-center">
                Iniciar Sesión
              </button>
            ) : (
              <button onClick={() => { logoutUser(); setOpen(false); }}
                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer">
                Cerrar Sesión
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
