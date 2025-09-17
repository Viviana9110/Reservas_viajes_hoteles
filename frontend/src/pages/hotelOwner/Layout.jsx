import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/hotelOwner/Navbar";
import Sidebar from "../../components/hotelOwner/Sidebar";


const Layout = () => {
  return (
    <>
    <Navbar/>
    <div className="flex min-h-screen">
      
      {/* Sidebar fijo a la izquierda */}
      <Sidebar />

      {/* Contenido dinámico a la derecha */}
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
    </>
    
  );
};

export default Layout;
