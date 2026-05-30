import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.06, type: "spring", stiffness: 200 } }),
};

const icons = {
  dashboard: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm16 14a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2a1 1 0 011-1h4a1 1 0 011 1v2zM4 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zm16-2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5a1 1 0 011-1h4a1 1 0 011 1v6z" /></svg>,
  addHotel: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 21V9a4 4 0 018 0v12m-6 0h4M3 21h18" /></svg>,
  addRoom: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M4 10V6a2 2 0 012-2h12a2 2 0 012 2v4M4 10v10h16V10" /></svg>,
  addPackage: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M12 3v18" /></svg>,
  rooms: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4 10v10h16V10" /></svg>,
  packages: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>,
  customTrips: <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
};

const sidebarLinks = [
  { name: "Dashboard", path: "/owner", icon: icons.dashboard },
  { name: "Añadir Hotel", path: "/owner/add-hotel", icon: icons.addHotel },
  { name: "Añadir Habitación", path: "/owner/add-room", icon: icons.addRoom },
  { name: "Añadir Paquete", path: "/owner/add-package", icon: icons.addPackage },
  { name: "Habitaciones", path: "/owner/list-room", icon: icons.rooms },
  { name: "Paquetes", path: "/owner/list-packages", icon: icons.packages },
  { name: "Viajes Personalizados", path: "/owner/list-custom-trips", icon: icons.customTrips },
];

const Sidebar = () => {
  return (
    <motion.aside
      initial="hidden"
      animate="visible"
      className="md:w-64 w-16 bg-white border-r border-gray-200 pt-4 flex flex-col min-h-[calc(100vh-64px)]"
    >
      {sidebarLinks.map((item, i) => (
        <motion.div key={item.path} custom={i} variants={itemVariants}>
          <NavLink
            to={item.path}
            end={item.path === "/owner"}
            className={({ isActive }) =>
              `group relative flex items-center py-3 px-4 gap-3 text-sm font-medium transition-all ${
                isActive
                  ? "bg-gradient-to-r from-primary/10 to-transparent text-primary"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1 bottom-1 w-1 bg-primary rounded-r-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="shrink-0">{item.icon}</span>
                <span className="md:block hidden truncate">{item.name}</span>
                {!isActive && (
                  <span className="absolute inset-0 rounded-r-lg bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                )}
              </>
            )}
          </NavLink>
        </motion.div>
      ))}
    </motion.aside>
  );
};

export default Sidebar;
