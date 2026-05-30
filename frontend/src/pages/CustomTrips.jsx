import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const stepLabels = ["Destinos", "Preferencias", "Tours", "Itinerario", "Enviar"];

const containerVariants = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.2 } },
};

const INTEREST_OPTIONS = [
  "Aventura", "Cultura", "Naturaleza", "Gastronomía",
  "Compras", "Historia", "Playa", "Ecoturismo",
  "Deportes", "Relax", "Vida Nocturna", "Fotografía",
];

const CustomTrips = () => {
  const { user, setShowUserLogin } = useAppContext();
  const [step, setStep] = useState(0);
  const [allDestinations, setAllDestinations] = useState([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);

  const [selectedDestinations, setSelectedDestinations] = useState([]);
  const [preferences, setPreferences] = useState({
    startDate: "",
    flexibleDates: true,
    groupSize: 1,
    budget: "",
    accommodation: "any",
    transportation: "any",
    includesMeals: false,
    includesGuide: false,
    notes: "",
    interests: [],
  });
  const [itinerary, setItinerary] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/destinations`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setAllDestinations(data);
      } catch {
        toast.error("No se pudieron cargar los destinos");
      } finally {
        setLoadingDestinations(false);
      }
    };
    fetchDestinations();
  }, []);

  const toggleDestination = (dest) => {
    setSelectedDestinations((prev) => {
      const exists = prev.find((d) => d.destinationRef === dest._id);
      if (exists) return prev.filter((d) => d.destinationRef !== dest._id);
      return [...prev, { destinationRef: dest._id, destinationName: dest.name, days: 2, selectedTours: [] }];
    });
  };

  const updateDestDays = (ref, days) => {
    setSelectedDestinations((prev) =>
      prev.map((d) => (d.destinationRef === ref ? { ...d, days: Math.max(1, days) } : d))
    );
  };

  const toggleTour = (destRef, tour) => {
    setSelectedDestinations((prev) =>
      prev.map((d) => {
        if (d.destinationRef !== destRef) return d;
        const exists = d.selectedTours.find((t) => t.tourName === tour.name);
        return {
          ...d,
          selectedTours: exists
            ? d.selectedTours.filter((t) => t.tourName !== tour.name)
            : [...d.selectedTours, { tourName: tour.name, tourPrice: tour.price, tourDuration: tour.duration }],
        };
      })
    );
  };

  const totalDays = useMemo(
    () => selectedDestinations.reduce((sum, d) => sum + d.days, 0),
    [selectedDestinations]
  );

  const totalTourPrice = useMemo(() => {
    return selectedDestinations.reduce((sum, d) => {
      const dest = allDestinations.find((ad) => ad._id === d.destinationRef);
      if (!dest) return sum;
      return sum + d.selectedTours.reduce((s, t) => s + (t.tourPrice || 0), 0);
    }, 0);
  }, [selectedDestinations, allDestinations]);

  const token = localStorage.getItem("token");

  const authHeaders = (method, body) => ({
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const handleGenerateItinerary = async () => {
    if (!user) { setShowUserLogin(true); return; }
    setGenerating(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/custom-trips/generate-itinerary`, {
        ...authHeaders("POST"),
        credentials: "include",
        body: JSON.stringify({
          selectedDestinations,
          startDate: preferences.startDate || null,
          groupSize: preferences.groupSize,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al generar");
      setItinerary(data.itinerary);
      setStep(3);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleSubmit = async () => {
    if (!user) { setShowUserLogin(true); return; }
    setSending(true);
    try {
      const body = {
        destinations: selectedDestinations,
        itinerary,
        preferredDate: preferences.startDate || null,
        flexibleDates: preferences.flexibleDates,
        budget: preferences.budget ? Number(preferences.budget) : null,
        groupSize: preferences.groupSize,
        interests: preferences.interests,
        accommodation: preferences.accommodation,
        transportation: preferences.transportation,
        includesMeals: preferences.includesMeals,
        includesGuide: preferences.includesGuide,
        notes: preferences.notes,
      };
      const res = await fetch(`${import.meta.env.VITE_API_URL}/custom-trips`, {
        ...authHeaders("POST", body),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error al enviar");
      toast.success(data.message);
      setSubmitted(true);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-blue-50/50 to-white">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-12 max-w-lg text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">¡Solicitud Enviada!</h2>
          <p className="text-gray-500 mb-6">Tu itinerario personalizado ha sido recibido. Te cotizaremos pronto.</p>
          <a href="/my-custom-trips" className="inline-block px-6 py-2.5 bg-primary text-white rounded-full font-medium hover:bg-primary-dark transition">Ver mis solicitudes</a>
        </motion.div>
      </div>
    );
  }

  const canProceed = () => {
    if (step === 0) return selectedDestinations.length > 0;
    if (step === 1) return true;
    if (step === 2) return true;
    return true;
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 md:px-16 lg:px-24 xl:px-32">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="font-playfair text-4xl md:text-[42px] text-gray-800">Crea tu Viaje Ideal</h1>
          <p className="text-gray-500 mt-1">Selecciona destinos, elige tours y genera un itinerario a tu medida.</p>
        </div>

        <div className="flex items-center gap-2 md:gap-4 mb-8 overflow-x-auto pb-2">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => i < step && setStep(i)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition cursor-pointer ${
                  i < step ? "bg-primary text-white" : i === step ? "bg-primary text-white ring-4 ring-primary/20" : "bg-gray-200 text-gray-500"
                }`}
              >
                {i < step ? "✓" : i + 1}
              </button>
              <span className={`text-sm font-medium ${i <= step ? "text-gray-800" : "text-gray-400"}`}>{label}</span>
              {i < stepLabels.length - 1 && <div className={`w-6 md:w-12 h-0.5 ${i < step ? "bg-primary" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {step === 0 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">¿A dónde quieres ir?</h2>
                <p className="text-sm text-gray-500 mb-5">Selecciona uno o más destinos y define cuántos días por cada uno.</p>

                {loadingDestinations ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="h-48 bg-gray-100 rounded-2xl animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allDestinations.map((dest) => {
                      const selected = selectedDestinations.find((d) => d.destinationRef === dest._id);
                      return (
                        <motion.div
                          key={dest._id}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => toggleDestination(dest)}
                          className={`relative rounded-2xl overflow-hidden cursor-pointer border-2 transition bg-white ${
                            selected ? "border-primary ring-2 ring-primary/20" : "border-gray-100 hover:border-gray-200"
                          }`}
                        >
                          <div className="h-36 relative overflow-hidden bg-gray-100">
                            <img
                              src={dest.image || "https://picsum.photos/seed/travel/800/600"}
                              alt={dest.name}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.src = "https://picsum.photos/seed/travel/800/600"; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            <div className="absolute top-3 left-3">
                              <span className="px-2 py-0.5 bg-white/20 backdrop-blur text-white text-[11px] font-medium rounded-full">{dest.region}</span>
                            </div>
                            {selected && (
                              <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg">
                                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                              </div>
                            )}
                          </div>
                          <div className="p-3 space-y-2" onClick={(e) => e.stopPropagation()}>
                            <div onClick={() => toggleDestination(dest)}>
                              <h3 className="font-bold text-gray-800 text-sm">{dest.name}</h3>
                              <p className="text-gray-400 text-xs leading-tight line-clamp-2">{dest.description}</p>
                            </div>
                            <div className="flex items-center justify-between pt-1">
                              <button
                                onClick={() => toggleDestination(dest)}
                                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition cursor-pointer border-none ${
                                  selected ? "bg-red-50 text-red-600" : "bg-primary text-white"
                                }`}
                              >
                                {selected ? "Quitar" : "Agregar"}
                              </button>
                              {selected && (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => updateDestDays(dest._id, selected.days - 1)}
                                    disabled={selected.days <= 1}
                                    className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 disabled:opacity-30 cursor-pointer text-gray-600 text-lg font-medium"
                                  >−</button>
                                  <span className="font-semibold text-gray-800 text-sm min-w-[24px] text-center">{selected.days}d</span>
                                  <button
                                    onClick={() => updateDestDays(dest._id, selected.days + 1)}
                                    className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 cursor-pointer text-gray-600 text-lg font-medium"
                                  >+</button>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {selectedDestinations.length > 0 && (
                  <div className="mt-4 p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-between">
                    <span className="text-sm text-gray-700">
                      <strong>{selectedDestinations.length}</strong> destino{selectedDestinations.length > 1 ? "s" : ""} seleccionado{selectedDestinations.length > 1 ? "s" : ""} · <strong>{totalDays}</strong> día{totalDays > 1 ? "s" : ""} en total
                    </span>
                    <button onClick={() => setStep(1)} className="px-5 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dark transition cursor-pointer">
                      Continuar
                    </button>
                  </div>
                )}
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">Preferencias del Viaje</h2>
                <p className="text-sm text-gray-500 mb-5">Cuéntanos más detalles para afinar tu experiencia.</p>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de inicio</label>
                      <input type="date" value={preferences.startDate}
                        onChange={(e) => setPreferences((p) => ({ ...p, startDate: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
                    </div>
                    <div className="flex items-end pb-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={preferences.flexibleDates}
                          onChange={(e) => setPreferences((p) => ({ ...p, flexibleDates: e.target.checked }))}
                          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                        <span className="text-sm text-gray-600">Fechas flexibles</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Número de viajeros</label>
                      <input type="number" min="1" value={preferences.groupSize}
                        onChange={(e) => setPreferences((p) => ({ ...p, groupSize: Math.max(1, Number(e.target.value)) }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Presupuesto estimado (COP)</label>
                      <input type="number" placeholder="Ej: 2000000" value={preferences.budget}
                        onChange={(e) => setPreferences((p) => ({ ...p, budget: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Alojamiento</label>
                      <select value={preferences.accommodation}
                        onChange={(e) => setPreferences((p) => ({ ...p, accommodation: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition">
                        <option value="any">Sin preferencia</option>
                        <option value="hotel">Hotel</option>
                        <option value="hostel">Hostal</option>
                        <option value="resort">Resort</option>
                        <option value="eco-lodge">Eco-lodge</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Transporte</label>
                      <select value={preferences.transportation}
                        onChange={(e) => setPreferences((p) => ({ ...p, transportation: e.target.value }))}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition">
                        <option value="any">Sin preferencia</option>
                        <option value="flight">Vuelo</option>
                        <option value="bus">Bus</option>
                        <option value="private">Transporte privado</option>
                        <option value="not-needed">No necesita</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Intereses</label>
                    <div className="flex flex-wrap gap-2">
                      {INTEREST_OPTIONS.map((interest) => {
                        const selected = preferences.interests.includes(interest);
                        return (
                          <button key={interest} type="button"
                            onClick={() => setPreferences((p) => ({
                              ...p,
                              interests: selected ? p.interests.filter((i) => i !== interest) : [...p.interests, interest],
                            }))}
                            className={`px-3 py-1.5 text-xs font-medium rounded-full border transition cursor-pointer ${
                              selected ? "bg-primary text-white border-primary" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-primary hover:text-primary"
                            }`}
                          >{interest}</button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={preferences.includesMeals}
                        onChange={(e) => setPreferences((p) => ({ ...p, includesMeals: e.target.checked }))}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                      <span className="text-sm text-gray-600">Incluir comidas</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={preferences.includesGuide}
                        onChange={(e) => setPreferences((p) => ({ ...p, includesGuide: e.target.checked }))}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                      <span className="text-sm text-gray-600">Incluir guía turístico</span>
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notas adicionales</label>
                    <textarea rows="3" value={preferences.notes}
                      onChange={(e) => setPreferences((p) => ({ ...p, notes: e.target.value }))}
                      placeholder="Alguna preferencia especial, restricciones o deseos..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none" />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(0)} className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-50 transition cursor-pointer">Atrás</button>
                  <button onClick={() => setStep(2)} className="px-5 py-2.5 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dark transition cursor-pointer">Continuar a Tours</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">Elige tus Tours y Actividades</h2>
                <p className="text-sm text-gray-500 mb-5">Selecciona los tours que más te gusten para cada destino.</p>

                <div className="space-y-6">
                  {selectedDestinations.map((sd) => {
                    const dest = allDestinations.find((d) => d._id === sd.destinationRef);
                    if (!dest || !dest.tours) return null;
                    return (
                      <div key={sd.destinationRef} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                            <img src={dest.image || "https://picsum.photos/seed/travel/100/100"} alt={dest.name} className="w-full h-full object-cover"
                              onError={(e) => { e.target.src = "https://picsum.photos/seed/travel/100/100"; }} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{dest.name}</h3>
                            <p className="text-xs text-gray-400">{sd.days} día{sd.days > 1 ? "s" : ""}</p>
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-3">
                          {dest.tours.map((tour) => {
                            const selected = sd.selectedTours.find((t) => t.tourName === tour.name);
                            return (
                              <div
                                key={tour.name}
                                onClick={() => toggleTour(sd.destinationRef, tour)}
                                className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                                  selected ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200 bg-gray-50/50"
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-medium text-gray-800 text-sm">{tour.name}</h4>
                                      {tour.category && (
                                        <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-medium rounded">{tour.category}</span>
                                      )}
                                    </div>
                                    <p className="text-xs text-gray-500 line-clamp-2">{tour.description}</p>
                                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                                      {tour.duration && <span>⏱ {tour.duration}</span>}
                                      {tour.price && <span>💰 ${tour.price.toLocaleString()}</span>}
                                    </div>
                                  </div>
                                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                                    selected ? "bg-primary border-primary" : "border-gray-300"
                                  }`}>
                                    {selected && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)} className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-50 transition cursor-pointer">Atrás</button>
                  <button
                    onClick={handleGenerateItinerary}
                    disabled={generating}
                    className="px-5 py-2.5 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dark transition disabled:opacity-60 cursor-pointer flex items-center gap-2"
                  >
                    {generating ? (
                      <>Generando<span className="animate-pulse">...</span></>
                    ) : (
                      <>Generar Itinerario ({totalDays} día{totalDays > 1 ? "s" : ""})</>
                    )}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">Tu Itinerario Personalizado</h2>
                <p className="text-sm text-gray-500 mb-5">Así se verá tu viaje día a día. Puedes ajustar los tours volviendo al paso anterior.</p>

                <div className="space-y-3">
                  {itinerary.map((day) => (
                    <div key={day.day} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="bg-gradient-to-r from-primary to-primary-dark px-5 py-3 text-white">
                        <span className="text-sm font-semibold">Día {day.day}</span>
                        {day.date && (
                          <span className="text-white/70 text-sm ml-3">
                            {new Date(day.date).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}
                          </span>
                        )}
                      </div>
                      <div className="p-4 md:p-5">
                        <div className="relative pl-6 border-l-2 border-primary/20 space-y-4">
                          {day.activities.map((act, i) => (
                            <div key={i} className="relative">
                              <div className="absolute -left-[25px] top-1 w-3 h-3 rounded-full bg-primary border-2 border-white" />
                              <div className="flex items-start gap-3">
                                {act.time && (
                                  <span className="text-xs font-medium text-primary whitespace-nowrap mt-0.5 min-w-[40px]">{act.time}</span>
                                )}
                                <div>
                                  <p className="text-sm text-gray-700">{act.description}</p>
                                  {act.location && (
                                    <span className="text-xs text-gray-400 mt-0.5 block">📍 {act.location}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-2xl flex items-center justify-between flex-wrap gap-3">
                  <div className="text-sm text-gray-600">
                    <strong>{totalDays} días</strong> de viaje · {selectedDestinations.length} destino{selectedDestinations.length > 1 ? "s" : ""}
                    {totalTourPrice > 0 && <span> · Tours: <strong>${totalTourPrice.toLocaleString()}</strong></span>}
                  </div>
                  <button onClick={() => setStep(4)} className="px-5 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dark transition cursor-pointer">
                    Continuar
                  </button>
                </div>

                <div className="flex gap-3 mt-3">
                  <button onClick={() => setStep(2)} className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-50 transition cursor-pointer">Atrás</button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-1">Revisa y Envía tu Solicitud</h2>
                <p className="text-sm text-gray-500 mb-5">Verifica todos los detalles antes de enviar.</p>

                <div className="space-y-4">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h3 className="font-semibold text-gray-800 mb-3">Destinos seleccionados</h3>
                    <div className="space-y-2">
                      {selectedDestinations.map((sd) => {
                        const dest = allDestinations.find((d) => d._id === sd.destinationRef);
                        return (
                          <div key={sd.destinationRef} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700">📍 {sd.destinationName}</span>
                            <span className="text-gray-500">{sd.days} día{sd.days > 1 ? "s" : ""} · {sd.selectedTours.length} tour{sd.selectedTours.length !== 1 ? "s" : ""}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h3 className="font-semibold text-gray-800 mb-3">Preferencias</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                      <div><span className="text-gray-500">Viajeros:</span> <span className="text-gray-700 font-medium">{preferences.groupSize}</span></div>
                      {preferences.budget && <div><span className="text-gray-500">Presupuesto:</span> <span className="text-gray-700 font-medium">${Number(preferences.budget).toLocaleString()}</span></div>}
                      <div><span className="text-gray-500">Alojamiento:</span> <span className="text-gray-700 font-medium capitalize">{preferences.accommodation === "any" ? "Sin preferencia" : preferences.accommodation}</span></div>
                      <div><span className="text-gray-500">Transporte:</span> <span className="text-gray-700 font-medium capitalize">{preferences.transportation === "any" ? "Sin preferencia" : preferences.transportation}</span></div>
                      <div><span className="text-gray-500">Comidas:</span> <span className="text-gray-700 font-medium">{preferences.includesMeals ? "Sí" : "No"}</span></div>
                      <div><span className="text-gray-500">Guía:</span> <span className="text-gray-700 font-medium">{preferences.includesGuide ? "Sí" : "No"}</span></div>
                    </div>
                    {preferences.interests.length > 0 && (
                      <div className="mt-3 text-sm"><span className="text-gray-500">Intereses:</span> <span className="text-gray-700">{preferences.interests.join(", ")}</span></div>
                    )}
                    {preferences.notes && (
                      <div className="mt-2 text-sm"><span className="text-gray-500">Notas:</span> <span className="text-gray-600 italic">"{preferences.notes}"</span></div>
                    )}
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <h3 className="font-semibold text-gray-800 mb-1">Itinerario ({totalDays} días)</h3>
                    <p className="text-xs text-gray-400 mb-2">{itinerary.length} días planificados</p>
                    <details>
                      <summary className="text-sm text-primary cursor-pointer font-medium">Ver resumen del itinerario</summary>
                      <div className="mt-2 space-y-2">
                        {itinerary.map((day) => (
                          <div key={day.day} className="text-sm">
                            <span className="font-medium text-gray-700">Día {day.day}:</span>{" "}
                            <span className="text-gray-500">{day.activities.map((a) => a.description).join(" / ")}</span>
                          </div>
                        ))}
                      </div>
                    </details>
                  </div>

                  {totalTourPrice > 0 && (
                    <div className="bg-primary/5 rounded-2xl border border-primary/10 p-5 text-center">
                      <p className="text-sm text-gray-600">Costo estimado de tours seleccionados</p>
                      <p className="text-2xl font-bold text-primary">${totalTourPrice.toLocaleString()}</p>
                      <p className="text-xs text-gray-400 mt-1">*No incluye alojamiento ni transporte. El owner te dará la cotización final.</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(3)} className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-50 transition cursor-pointer">Atrás</button>
                  <button
                    onClick={handleSubmit}
                    disabled={sending}
                    className="px-6 py-2.5 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dark transition disabled:opacity-60 cursor-pointer"
                  >
                    {sending ? "Enviando..." : "Enviar Solicitud"}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CustomTrips;
