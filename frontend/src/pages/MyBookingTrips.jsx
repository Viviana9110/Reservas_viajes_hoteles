import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { SkeletonRow } from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import { assets } from "../assets/assets";

const container = {
  hidden: {}, visible: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 },
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

const MyBookingTrips = () => {
  const { user } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/booking-trips/user/${user._id}`);
        if (!res.ok) throw new Error("Error cargando reservas");
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error("Error cargando reservas:", err);
      } finally {
        setLoading(false);
      }
    };
    if (user?._id) fetchBookings();
  }, [user]);

  const cancelBooking = async (bookingId) => {
    if (!window.confirm("¿Seguro que quieres cancelar esta reserva?")) return;
    try {
      setCanceling(bookingId);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/booking-trips/${bookingId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al cancelar");
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
    } catch (err) {
      console.error("Error cancelando reserva:", err);
    } finally {
      setCanceling(null);
    }
  };

  if (loading) {
    return (
      <div className="py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32 max-w-5xl mx-auto">
        <div className="skeleton h-10 w-56 mb-2" />
        <div className="skeleton h-4 w-64 mb-8" />
        {[1,2,3].map(i => <SkeletonRow key={i} />)}
      </div>
    );
  }

  return (
    <div className="py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-playfair text-4xl md:text-[40px] text-gray-800">Mis Reservas de Viajes</h1>
        <p className="text-sm md:text-base text-gray-500 mt-2">
          Administra todas tus reservas de paquetes turísticos.
        </p>
      </motion.div>

      {!user ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">Debes iniciar sesión para ver tus reservas.</motion.div>
      ) : bookings.length === 0 ? (
        <EmptyState title="Sin reservas de viajes" description="No tienes reservas de paquetes turísticos registradas." icon={assets.calenderIcon} />
      ) : (
        <motion.div variants={container} initial="hidden" animate="visible" className="space-y-4">
          <AnimatePresence>
            {bookings.map((booking) => {
              const nights = (new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24);
              const status = booking.status || "pending";

              return (
                <motion.div
                  key={booking._id}
                  variants={item}
                  layout
                  exit={{ opacity: 0, x: -100, height: 0, marginBottom: 0 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-800">{booking.trip?.title || "Viaje sin nombre"}</h3>
                        <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full capitalize ${statusColors[status] || "bg-gray-100 text-gray-600"}`}>
                          {status === "confirmed" ? "Confirmada" : status === "pending" ? "Pendiente" : status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">Destino: {booking.trip?.destination || "No especificado"}</p>
                      <p className="text-sm text-gray-600 mt-1">Duración: {nights} noche{nights !== 1 ? "s" : ""}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                      <div className="text-sm">
                        <p><span className="font-medium text-gray-700">Entrada:</span> {new Date(booking.checkIn).toLocaleDateString()}</p>
                        <p><span className="font-medium text-gray-700">Salida:</span> {new Date(booking.checkOut).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">${booking.totalPrice || 0}</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => cancelBooking(booking._id)}
                      disabled={canceling === booking._id}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition disabled:opacity-50 cursor-pointer whitespace-nowrap"
                    >
                      {canceling === booking._id ? "Cancelando..." : "Cancelar"}
                    </motion.button>
                    <a
                      href={`https://wa.me/573203690202?text=${encodeURIComponent(
                        `Hola Tour Colombia, tengo una reserva de viaje:\n- Paquete: ${booking.trip?.title || booking.trip?.name || "—"}\n- Destino: ${booking.trip?.destination || "—"}\n- Entrada: ${new Date(booking.checkIn).toLocaleDateString()}\n- Salida: ${new Date(booking.checkOut).toLocaleDateString()}\n- Total: $${(booking.totalPrice || 0).toLocaleString()}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition whitespace-nowrap"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      WhatsApp
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default MyBookingTrips;
