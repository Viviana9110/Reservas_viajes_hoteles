import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { SkeletonRow } from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import { assets } from "../assets/assets";
import toast from "react-hot-toast";

const container = {
  hidden: {}, visible: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 },
};

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  reviewing: "bg-blue-100 text-blue-700",
  quoted: "bg-purple-100 text-purple-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};
const statusLabels = {
  pending: "Pendiente", reviewing: "En revisión", quoted: "Cotizado", approved: "Aprobado", rejected: "Rechazado",
};

const MyCustomTrips = () => {
  const { user } = useAppContext();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [expandedItinerary, setExpandedItinerary] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/custom-trips/mine`, {
          credentials: "include",
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        if (!res.ok) throw new Error("Error cargando solicitudes");
        const data = await res.json();
        setTrips(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchTrips();
    else setLoading(false);
  }, [user]);

  const deleteTrip = async (id) => {
    if (!window.confirm("¿Eliminar esta solicitud?")) return;
    try {
      setDeleting(id);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/custom-trips/${id}`, {
        method: "DELETE", credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Error al eliminar");
      setTrips((prev) => prev.filter((t) => t._id !== id));
      toast.success("Solicitud eliminada");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32 max-w-5xl mx-auto">
        <div className="skeleton h-10 w-64 mb-2" />
        <div className="skeleton h-4 w-72 mb-8" />
        {[1, 2, 3].map((i) => <SkeletonRow key={i} />)}
      </div>
    );
  }

  return (
    <div className="py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-playfair text-4xl md:text-[40px] text-gray-800">Mis Viajes Personalizados</h1>
        <p className="text-sm md:text-base text-gray-500 mt-2">Solicitudes de viajes diseñados especialmente para ti.</p>
      </motion.div>

      {!user ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">Debes iniciar sesión para ver tus solicitudes.</div>
      ) : trips.length === 0 ? (
        <EmptyState
          title="Sin solicitudes"
          description="Aún no has solicitado un viaje personalizado."
          icon={assets.calenderIcon}
          action={
            <a href="/custom-trips" className="inline-block mt-4 px-5 py-2.5 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dark transition">
              Solicitar viaje
            </a>
          }
        />
      ) : (
        <motion.div variants={container} initial="hidden" animate="visible" className="space-y-4">
          <AnimatePresence>
            {trips.map((trip) => {
              const multiDest = trip.destinations?.length > 0;
              return (
                <motion.div
                  key={trip._id}
                  variants={item}
                  layout
                  exit={{ opacity: 0, x: -100, height: 0, marginBottom: 0 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {multiDest ? trip.destinations.map((d) => d.destinationName).join(", ") : trip.destination}
                        </h3>
                        <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${statusColors[trip.status] || "bg-gray-100 text-gray-600"}`}>
                          {statusLabels[trip.status] || trip.status}
                        </span>
                      </div>

                      <div className="mt-2 text-sm text-gray-500 space-y-0.5">
                        {trip.groupSize > 1 && <p>👥 {trip.groupSize} viajeros</p>}
                        {trip.preferredDate && <p>📅 {new Date(trip.preferredDate).toLocaleDateString()}</p>}
                        {trip.budget && <p>💰 Presupuesto: ${trip.budget.toLocaleString()}</p>}
                        {trip.interests?.length > 0 && <p>🎯 Intereses: {trip.interests.join(", ")}</p>}

                        {multiDest && (
                          <div className="mt-2">
                            {trip.destinations.map((d) => (
                              <div key={d.destinationRef || d.destinationName} className="text-xs text-gray-400">
                                📍 {d.destinationName} — {d.days} día{d.days > 1 ? "s" : ""}
                                {d.selectedTours?.length > 0 && (
                                  <span className="ml-2">· {d.selectedTours.map((t) => t.tourName).join(", ")}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {trip.itinerary?.length > 0 && (
                          <div className="mt-2">
                            <button
                              onClick={() => setExpandedItinerary(expandedItinerary === trip._id ? null : trip._id)}
                              className="text-primary text-xs font-medium hover:underline cursor-pointer"
                            >
                              {expandedItinerary === trip._id ? "Ocultar itinerario" : "Ver itinerario"}
                            </button>
                            {expandedItinerary === trip._id && (
                              <div className="mt-2 space-y-2">
                                {trip.itinerary.map((day) => (
                                  <div key={day.day} className="bg-gray-50 rounded-xl p-3">
                                    <p className="text-xs font-semibold text-gray-700 mb-1">Día {day.day}</p>
                                    <div className="space-y-1">
                                      {day.activities.map((act, i) => (
                                        <div key={i} className="flex items-start gap-2 text-xs text-gray-600">
                                          {act.time && <span className="text-primary font-medium min-w-[30px]">{act.time}</span>}
                                          <span>{act.description}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {trip.accommodation !== "any" && trip.accommodation && (
                          <p>🏨 Alojamiento: {trip.accommodation}</p>
                        )}
                        {trip.transportation !== "any" && trip.transportation && (
                          <p>🚌 Transporte: {trip.transportation}</p>
                        )}
                        {trip.notes && <p className="italic text-gray-400 mt-1">"{trip.notes}"</p>}
                      </div>

                      {trip.adminNotes && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-xl text-sm text-gray-600">
                          <span className="font-medium text-blue-700">Respuesta: </span>{trip.adminNotes}
                        </div>
                      )}
                      {trip.estimatedPrice && (
                        <div className="mt-2 text-sm font-medium text-primary">
                          Precio estimado: ${trip.estimatedPrice.toLocaleString()}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`https://wa.me/573203690202?text=${encodeURIComponent(
                          `Hola Tour Colombia, quiero consultar sobre mi solicitud de viaje personalizado:\n- Destino: ${multiDest ? trip.destinations.map((d) => d.destinationName).join(", ") : trip.destination}\n- Estado: ${statusLabels[trip.status] || trip.status}`
                        )}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition whitespace-nowrap"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp
                      </a>
                      <button
                        onClick={() => deleteTrip(trip._id)}
                        disabled={deleting === trip._id}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition disabled:opacity-50 cursor-pointer"
                      >
                        {deleting === trip._id ? "..." : "Eliminar"}
                      </button>
                    </div>
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

export default MyCustomTrips;
