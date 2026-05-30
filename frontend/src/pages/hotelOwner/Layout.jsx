import { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/hotelOwner/Navbar";
import Sidebar from "../../components/hotelOwner/Sidebar";

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      <Navbar />
      <div className="flex relative">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black/30" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0">
              <Sidebar />
            </div>
          </div>
        )}
        <main className="flex-1 p-4 md:p-8 overflow-auto min-h-[calc(100vh-64px)]">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden mb-4 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            Menú
          </button>
          <AnimatePresence mode="wait">
            <motion.div key={location.pathname} {...pageTransition}>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Layout;
