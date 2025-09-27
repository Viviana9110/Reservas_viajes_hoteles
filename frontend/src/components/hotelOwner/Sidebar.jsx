import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const dashboardicon = (
    <svg className="w-6 h-6" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path stroke="currentColor" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5Zm16 14a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2ZM4 13a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6Zm16-2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v6Z" />
    </svg>
  );

 const addhotel = (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" d="M8 21V9a4 4 0 018 0v12m-6 0h4" />
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 21h18" />
</svg>

 );

  const addhabitacion = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M4 10V6a2 2 0 012-2h12a2 2 0 012 2v4M4 10v10h16V10" />
</svg>

  );
  const habitaciones = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4 10v10h16V10" />
</svg>

  );

  const addpaquete = (
   <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M12 3v18" />
</svg>
  );

  const paquete = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 0v20m10-10H2" />
</svg>

  )

  const sidebarLinks = [
    { name: "Dashboard", path: "/owner", icon: dashboardicon },
    { name: "Añadir Hotel", path: "/owner/add-hotel", icon: addhotel },
    { name: "Añadir Habitacion", path: "/owner/add-room", icon: addhabitacion },
    { name: "Añadir Paquete Turístico", path: "/owner/add-package", icon: addpaquete },
    { name: "Habitaciones", path: "/owner/list-room", icon: habitaciones },
    { name: "Paquetes Turísticos", path: "/owner/list-packages", icon: paquete },

  ];

  return (
    <div className="md:w-64 w-16 border-r h-[550px] text-base border-gray-300 pt-4 flex flex-col transition-all duration-300">
      {sidebarLinks.map((item, index) => (
        <NavLink
          to={item.path}
          key={index}
          className={({ isActive }) =>
            `flex items-center py-3 px-4 gap-3 ${
              isActive
                ? "border-r-4 md:border-r-[6px] bg-indigo-500/10 border-indigo-500 text-indigo-500"
                : "hover:bg-gray-100/90 border-white text-gray-700"
            }`
          }
        >
          {item.icon}
          <p className="md:block hidden text-center">{item.name}</p>
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
