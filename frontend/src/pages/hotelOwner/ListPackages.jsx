import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../../context/AppContext";
import EmptyState from "../../components/EmptyState";
import { assets } from "../../assets/assets";

const container = {
  hidden: {}, visible: { transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 },
};

const ListPackages = () => {
  const { trips, loadingTrips } = useAppContext();
  const [search, setSearch] = useState("");

  const filtered = trips.filter((t) =>
    !search || t.name?.toLowerCase().includes(search.toLowerCase()) || t.destination?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="py-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Paquetes Turísticos</h2>
        <p className="text-sm text-gray-500 mt-1">Lista de todos los paquetes disponibles.</p>
      </motion.div>

      <div className="relative mb-5 max-w-md">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar paquetes..."
          className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-white"
        />
      </div>

      {loadingTrips ? (
        <div className="space-y-3">
          {[1,2,3].map(i => <div key={i} className="skeleton h-12 w-full rounded-lg" />)}
        </div>
      ) : filtered.length > 0 ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-sm font-semibold text-gray-700">
                <th className="px-5 py-3.5">Nombre</th>
                <th className="px-5 py-3.5">Destino</th>
                <th className="px-5 py-3.5 hidden sm:table-cell">Precio</th>
                <th className="px-5 py-3.5">Días</th>
              </tr>
            </thead>
            <AnimatePresence>
              <tbody className="text-sm text-gray-600">
                {filtered.map((trip) => (
                  <motion.tr
                    key={trip._id}
                    variants={item}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-4 font-medium">{trip.name}</td>
                    <td className="px-5 py-4">{trip.destination}</td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className="font-medium text-primary">${Number(trip.price).toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-xs font-medium rounded-full">{trip.days} días</span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </AnimatePresence>
          </table>
        </motion.div>
      ) : (
        <EmptyState title={search ? "Sin resultados" : "No hay paquetes"} description={search ? `No encontramos paquetes para "${search}"` : "No hay paquetes disponibles en este momento."} icon={assets.searchIcon} />
      )}
    </div>
  );
};

export default ListPackages;
