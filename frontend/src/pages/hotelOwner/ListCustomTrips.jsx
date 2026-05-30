import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

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
const statusOptions = ["pending", "reviewing", "quoted", "approved", "rejected"];

const ListCustomTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [expandedItinerary, setExpandedItinerary] = useState(null);

  const fetchTrips = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/custom-trips`, {
        credentials: "include",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!res.ok) throw new Error("Error cargando");
      const data = await res.json();
      setTrips(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTrips(); }, []);

  const updateField = async (id, field, value) => {
    try {
      setUpdating(id);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/custom-trips/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ [field]: value }),
      });
      if (!res.ok) throw new Error("Error al actualizar");
      const data = await res.json();
      setTrips((prev) => prev.map((t) => (t._id === id ? data.trip : t)));
      toast.success("Actualizada");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3, 4].map((i) => <div key={i} className="h-20 bg-gray-200 rounded-xl" />)}
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="text-center py-16">
        <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
        <h3 className="text-gray-500 font-medium">No hay solicitudes de viaje personalizadas</h3>
        <p className="text-sm text-gray-400 mt-1">Los usuarios enviarán solicitudes que aparecerán aquí.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Viajes Personalizados</h2>
          <p className="text-sm text-gray-500 mt-0.5">{trips.length} solicitud{trips.length !== 1 ? "es" : ""}</p>
        </div>
      </div>

      <AnimatePresence>
        <div className="space-y-4">
          {trips.map((trip) => {
            const multiDest = trip.destinations?.length > 0;
            return (
              <motion.div
                key={trip._id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {multiDest ? trip.destinations.map((d) => d.destinationName).join(", ") : trip.destination}
                      </h3>
                      <span className={`px-2.5 py-0.5 text-[11px] font-medium rounded-full ${statusColors[trip.status] || "bg-gray-100 text-gray-600"}`}>
                        {statusLabels[trip.status] || trip.status}
                      </span>
                    </div>

                    <div className="mt-2 text-sm text-gray-500 space-y-0.5">
                      <p><span className="font-medium text-gray-700">Cliente:</span> {trip.user?.name || "—"}</p>
                      {trip.user?.email && <p><span className="font-medium text-gray-700">Email:</span> {trip.user.email}</p>}
                      {trip.user?.phone && <p><span className="font-medium text-gray-700">Tel:</span> {trip.user.phone}</p>}
                      {trip.groupSize > 1 && <p><span className="font-medium text-gray-700">Viajeros:</span> {trip.groupSize}</p>}
                      {trip.preferredDate && <p><span className="font-medium text-gray-700">Fecha:</span> {new Date(trip.preferredDate).toLocaleDateString()}</p>}
                      {trip.flexibleDates && <p className="text-blue-500 text-xs">Fechas flexibles</p>}
                      {trip.budget && <p><span className="font-medium text-gray-700">Presupuesto:</span> ${trip.budget.toLocaleString()}</p>}
                      {trip.interests?.length > 0 && <p><span className="font-medium text-gray-700">Intereses:</span> {trip.interests.join(", ")}</p>}

                      {multiDest && (
                        <div className="mt-2 space-y-1">
                          {trip.destinations.map((d) => (
                            <div key={d.destinationRef || d.destinationName} className="text-xs text-gray-500">
                              📍 <span className="font-medium">{d.destinationName}</span> — {d.days} día{d.days > 1 ? "s" : ""}
                              {d.selectedTours?.length > 0 && (
                                <span className="ml-1">· Tours: {d.selectedTours.map((t) => t.tourName).join(", ")}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {trip.accommodation !== "any" && trip.accommodation && (
                        <p><span className="font-medium text-gray-700">Alojamiento:</span> {trip.accommodation}</p>
                      )}
                      {trip.transportation !== "any" && trip.transportation && (
                        <p><span className="font-medium text-gray-700">Transporte:</span> {trip.transportation}</p>
                      )}
                      {trip.includesMeals && <p><span className="font-medium text-gray-700">Comidas:</span> Sí</p>}
                      {trip.includesGuide && <p><span className="font-medium text-gray-700">Guía:</span> Sí</p>}
                      {trip.notes && <p className="italic text-gray-400 mt-1">"{trip.notes}"</p>}

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
                    </div>
                  </div>

                  <div className="lg:w-72 space-y-3 shrink-0">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Estado</label>
                      <select
                        value={trip.status}
                        onChange={(e) => updateField(trip._id, "status", e.target.value)}
                        disabled={updating === trip._id}
                        className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                      >
                        {statusOptions.map((opt) => (
                          <option key={opt} value={opt}>{statusLabels[opt]}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Notas (cliente)</label>
                      <textarea
                        defaultValue={trip.adminNotes || ""}
                        onBlur={(e) => {
                          if (e.target.value !== (trip.adminNotes || "")) {
                            updateField(trip._id, "adminNotes", e.target.value);
                          }
                        }}
                        rows="2"
                        placeholder="Respuesta para el cliente..."
                        className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Precio estimado (COP)</label>
                      <input
                        type="number"
                        defaultValue={trip.estimatedPrice || ""}
                        onBlur={(e) => {
                          const val = e.target.value ? Number(e.target.value) : null;
                          if (val !== trip.estimatedPrice) updateField(trip._id, "estimatedPrice", val);
                        }}
                        placeholder="0"
                        className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
                      />
                    </div>

                    <a
                      href={`https://wa.me/573203690202?text=${encodeURIComponent(
                        `Hola ${trip.user?.name || "cliente"}, te escribo de Tour Colombia sobre tu solicitud de viaje personalizado a ${multiDest ? trip.destinations.map((d) => d.destinationName).join(", ") : trip.destination} (${statusLabels[trip.status] || trip.status}).`
                      )}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition"
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      WhatsApp
                    </a>
                  </div>
                </div>

                <div className="mt-2 text-[11px] text-gray-400">
                  Creado: {new Date(trip.createdAt).toLocaleString()}
                </div>
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default ListCustomTrips;
