import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, setShowUserLogin, navigate, logoutUser } = useAppContext();

  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/") {
      setIsScrolled(true);
      return;
    } else {
      setIsScrolled(false);
    }
    setIsScrolled((prev) => (location.pathname !== "/" ? true : prev));

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 w-full bg-white/20 backdrop-blur flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${
        isScrolled
          ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4"
          : "py-4 md:py-6"
      }`}
    >
      {/* Logo */}
      <Link to="/">
        <img src={assets.logoTour} alt="logo" className="w-25" />
      </Link>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8 text-white">
        <NavLink to="/" className="text-gray-950 hover:text-gray-500">Home</NavLink>
        <NavLink to="/hotels" className="text-gray-950 hover:text-gray-500">Hoteles</NavLink>
        <NavLink to="/trips" className="text-gray-950 hover:text-gray-500">Paquetes</NavLink>

        {/* 👇 Dashboard solo si es owner */}
        {user?.role === "owner" && (
          <NavLink to="/owner" className="border px-4 py-1 text-gray-950 hover:text-gray-500 rounded-full cursor-pointer">
            Dashboard
          </NavLink>
        )}

        {/* Botón Login / Perfil */}
        {!user ? (
          <button
            onClick={() => setShowUserLogin(true)}
            className="cursor-pointer px-8 py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full"
          >
            Login
          </button>
        ) : (
          <div className="relative group cursor-pointer flex items-center gap-2">
            {/* Avatar */}
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500 text-white font-bold">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            {/* Nombre */}
            <span className="text-gray-700 font-medium">{user.name}</span>

            {/* Dropdown */}
            <ul className="hidden group-hover:block absolute top-12 right-0  bg-white/20 backdrop-blur shadow border border-gray py-2.5 w-44 rounded-md text-sm z-40">
              <li
                onClick={() => navigate("/my-bookings")}
                className="p-2 text-gray-950 hover:text-gray-500 cursor-pointer"
              >
                Mis Reservas
              </li>
              
              <li
                onClick={logoutUser}
                className="p-2 hover:text-gray-950 cursor-pointer text-red-600"
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Mobile Menu Btn */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Menu"
        className="sm:hidden"
      >
        <svg
          width="21"
          height="15"
          viewBox="0 0 21 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="21" height="1.5" rx=".75" fill="#426287" />
          <rect x="8" y="6" width="13" height="1.5" rx=".75" fill="#426287" />
          <rect x="6" y="13" width="15" height="1.5" rx=".75" fill="#426287" />
        </svg>
      </button>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden flex">
          <NavLink to="/" onClick={() => setOpen(false)} className="block">
            Home
          </NavLink>
          <NavLink to="/hotels" onClick={() => setOpen(false)} className="block">
            Hoteles
          </NavLink>

          {user && (
            <>
              <NavLink
                to="/trip-planner"
                onClick={() => setOpen(false)}
                className="block"
              >
                Planeador
              </NavLink>
              <NavLink
                to="/my-trip-plans"
                onClick={() => setOpen(false)}
                className="block"
              >
                Mis Planes
              </NavLink>
              <NavLink
                to="/my-bookings"
                onClick={() => setOpen(false)}
                className="block"
              >
                Mis Reservas
              </NavLink>
            </>
          )}

          {/* 👇 Dashboard solo si es owner */}
          {user?.role === "owner" && (
            <NavLink
              to="/owner"
              onClick={() => setOpen(false)}
              className="block"
            >
              Dashboard
            </NavLink>
          )}

          {!user ? (
            <button
              onClick={() => {
                setShowUserLogin(true);
                setOpen(false);
              }}
              className="cursor-pointer px-6 py-2 mt-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-sm"
            >
              Login
            </button>
          ) : (
            <button
              onClick={() => {
                logoutUser();
                setOpen(false);
              }}
              className="text-left text-red-600 mt-2"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
