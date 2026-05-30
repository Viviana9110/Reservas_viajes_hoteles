import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SkeletonRow } from "../../components/Skeleton";
import EmptyState from "../../components/EmptyState";
import { assets } from "../../assets/assets";

const container = {
  hidden: {}, visible: { transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 },
};

const ListRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/hotels`);
        if (!res.ok) throw new Error();
        const hotels = await res.json();
        const allRooms = [];
        for (const hotel of hotels) {
          const r = await fetch(`${import.meta.env.VITE_API_URL}/hoteles/${hotel._id}/rooms`);
          if (r.ok) {
            const data = await r.json();
            allRooms.push(...data.map((rm) => ({ ...rm, hotelName: hotel.name })));
          }
        }
        setRooms(allRooms);
      } catch {
        console.error("Error cargando habitaciones");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const toggleAvailability = async (roomId, current) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/rooms/${roomId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !current }),
      });
      setRooms((prev) => prev.map((r) => r._id === roomId ? { ...r, isAvailable: !current } : r));
    } catch {
      console.error("Error al cambiar disponibilidad");
    }
  };

  if (loading) {
    return (
      <div className="py-6">
        <div className="mb-6">
          <div className="skeleton h-8 w-56 mb-2" />
          <div className="skeleton h-4 w-72" />
        </div>
        {[1,2,3].map(i => <SkeletonRow key={i} />)}
      </div>
    );
  }

  return (
    <div className="py-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Lista de Habitaciones</h2>
        <p className="text-sm text-gray-500 mt-1">Administra las habitaciones de tus hoteles.</p>
      </motion.div>

      {rooms.length > 0 ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-sm font-semibold text-gray-700">
                <th className="px-5 py-3.5">Hotel</th>
                <th className="px-5 py-3.5">N°</th>
                <th className="px-5 py-3.5 hidden sm:table-cell">Tipo</th>
                <th className="px-5 py-3.5 hidden md:table-cell">Precio</th>
                <th className="px-5 py-3.5">Disponible</th>
              </tr>
            </thead>
            <AnimatePresence>
              <tbody className="text-sm text-gray-600">
                {rooms.map((room) => (
                  <motion.tr
                    key={room._id}
                    variants={item}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-4 font-medium">{room.hotelName || "—"}</td>
                    <td className="px-5 py-4">{room.roomNumber || "—"}</td>
                    <td className="px-5 py-4 hidden sm:table-cell capitalize">{room.type || "—"}</td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="font-medium">${room.pricePerNight}</span>
                    </td>
                    <td className="px-5 py-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={room.isAvailable !== false}
                          onChange={() => toggleAvailability(room._id, room.isAvailable)}
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:left-0.5 after:top-0.5 after:w-5 after:h-5 after:bg-white after:rounded-full after:shadow-sm after:transition-transform peer-checked:after:translate-x-5" />
                      </label>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </AnimatePresence>
          </table>
        </motion.div>
      ) : (
        <EmptyState title="Sin habitaciones" description="No hay habitaciones registradas todavía." icon={assets.addIcon} />
      )}
    </div>
  );
};

export default ListRoom;
