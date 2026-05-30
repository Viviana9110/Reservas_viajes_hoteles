import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { roomCommonData } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

function useCountUp(end, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted.current) {
          hasStarted.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return [count, ref];
}

function TiltCard({ children }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -8, y: x * 8 });
  }, []);

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{
        perspective: 1000,
        transformStyle: "preserve-3d",
        transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.08s ease-out",
      }}
    >
      {children}
    </div>
  );
}

const TRUST_BADGES = [
  { icon: "🔒", label: "Pago Seguro" },
  { icon: "🔄", label: "Cancelación Gratis" },
  { icon: "⭐", label: "Mejor Precio" },
  { icon: "📞", label: "Soporte 24/7" },
];

const TRAVEL_TIPS = [
  { icon: "🌤️", label: "Mejor época", value: "Todo el año" },
  { icon: "✈️", label: "Vuelos desde", value: "$150 USD" },
  { icon: "🏨", label: "Hoteles cercanos", value: "15+ opciones" },
  { icon: "🍽️", label: "Gastronomía", value: "Incluida" },
];

const TripsDetails = () => {
  const { id } = useParams();
  const { user, trips } = useAppContext();
  const [trip, setTrip] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState(0);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [checking, setChecking] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
  const heroRef = useRef(null);
  const [heroOffset, setHeroOffset] = useState(0);
  const [heroFade, setHeroFade] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const hero = heroRef.current;
      if (!hero) return;
      const rect = hero.getBoundingClientRect();
      const scrolled = Math.max(0, -rect.top / rect.height);
      setHeroOffset(scrolled * 30);
      setHeroFade(Math.max(0, 1 - scrolled / 0.8));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const found = trips?.find((t) => t._id === id);
    if (found) {
      setTrip(found);
      setMainImage(found.images?.[0] || null);
    } else if (trips && trips.length > 0) {
      fetch(`${API_URL}/trips`)
        .then((r) => r.json())
        .then((all) => {
          const t = all.find((x) => x._id === id);
          if (t) { setTrip(t); setMainImage(t.images?.[0] || null); }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
      return;
    }
    setLoading(false);
  }, [id, trips, API_URL]);

  useEffect(() => {
    const handleScroll = () => setShowStickyBar(window.scrollY > 500);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const checkAvailability = async () => {
    if (!checkIn || !checkOut) {
      toast.error("Selecciona fechas de entrada y salida");
      return;
    }
    try {
      setChecking(true);
      const res = await fetch(`${API_URL}/booking-trips/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: user?._id, trip: id, checkIn, checkOut }),
      });
      const data = await res.json();
      if (res.ok && data.disponible) {
        setIsAvailable(true);
        toast.success(data.message || "Fechas disponibles");
      } else {
        setIsAvailable(false);
        toast.error(data.message || "Ya tienes una reserva en estas fechas");
      }
    } catch {
      toast.error("Error al verificar disponibilidad");
    } finally {
      setChecking(false);
    }
  };

  const handleBooking = async () => {
    try {
      setBookingLoading(true);
      const res = await fetch(`${API_URL}/booking-trips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: user?._id, trip: id, checkIn, checkOut }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Reserva realizada con éxito");
        setIsModalOpen(false);
      } else {
        toast.error(data.message || "No se pudo realizar la reserva");
      }
    } catch {
      toast.error("Error al crear reserva");
    } finally {
      setBookingLoading(false);
    }
  };

  const similarTrips = trips?.filter((t) => t._id !== id && t.destination === trip?.destination).slice(0, 3) || [];

  const [priceAnimated, priceRef] = useCountUp(Number(trip?.price) || 0, 1500);
  const [savingAnimated, savingRef] = useCountUp(Math.floor((Number(trip?.price) || 0) * 0.2), 1200);

  if (loading) {
    return (
      <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32 max-w-7xl mx-auto">
        <div className="skeleton h-10 w-64 mb-4" />
        <div className="skeleton h-[70vh] w-full rounded-2xl mb-4" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32 max-w-7xl mx-auto">
        <h1 className="text-3xl font-playfair font-bold text-gray-800">Viaje no encontrado</h1>
        <p className="text-gray-500 mt-2">El viaje que buscas no existe o ha sido eliminado.</p>
        <Link to="/trips" className="mt-4 inline-block text-primary font-medium hover:underline">Ver todos los destinos</Link>
      </div>
    );
  }

  const allImages = trip.images || [];
  const price = Number(trip.price) || 0;
  const saving = Math.floor(price * 0.2);
  const discounted = price - saving;

  return (
    <div className="relative">
      <div ref={heroRef} className="relative h-[70vh] md:h-[80vh] overflow-hidden">
        <motion.div style={{ y: `${heroOffset}%` }} className="absolute inset-0">
          <img
            src={mainImage || "https://placehold.co/1600x900?text=Viaje"}
            alt={trip.name}
            className="w-full h-full object-cover"
          />
        </motion.div>
        <motion.div style={{ opacity: heroFade }} className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-16 lg:p-24">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="text-xs font-semibold tracking-widest uppercase text-accent bg-black/30 px-3 py-1.5 rounded-full backdrop-blur">Paquete turístico</span>
              <span className="text-xs font-medium px-3 py-1.5 bg-accent text-white rounded-full animate-pulse">20% OFF</span>
            </div>
            <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold text-white max-w-3xl leading-tight drop-shadow-lg">
              {trip.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-4 text-white/80 text-sm">
              <span className="flex items-center gap-1.5">📍 {trip.destination}</span>
              <span className="flex items-center gap-1.5">📅 {trip.days} días / {trip.days - 1} noches</span>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: showStickyBar ? 1 : 0, y: showStickyBar ? 0 : -20 }}
        className={`fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all duration-300 ${
          showStickyBar ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-16 lg:px-24 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold text-sm">
              {trip.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-sm text-gray-800">{trip.name}</p>
              <p className="text-xs text-gray-500">{trip.destination} · {trip.days} días</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-400 line-through">${price.toLocaleString()}</p>
              <p className="text-lg font-bold text-primary">${discounted.toLocaleString()}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsModalOpen(true)}
              disabled={!user}
              className="px-5 py-2 bg-accent hover:bg-amber-600 text-white rounded-lg text-sm font-semibold shadow-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              {user ? "Reservar" : "Inicia sesión"}
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 md:px-16 lg:px-24 -mt-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl shadow-xl border border-gray-100 p-4 md:p-6"
        >
          {allImages.length > 1 ? (
            <div className="flex flex-col lg:flex-row gap-3">
              <div className="lg:w-3/5">
                <img
                  src={mainImage || allImages[0]}
                  alt={trip.name}
                  onClick={() => { setLightboxIdx(allImages.indexOf(mainImage || allImages[0])); setLightboxOpen(true); }}
                  className="w-full h-64 md:h-96 object-cover rounded-2xl cursor-pointer hover:opacity-95 transition-opacity"
                />
              </div>
              <div className="lg:w-2/5 grid grid-cols-2 gap-3">
                {allImages.slice(1, 5).map((img, i) => (
                  <div key={i} className="relative group cursor-pointer" onClick={() => { setMainImage(img); setLightboxIdx(i + 1); setLightboxOpen(true); }}>
                    <img src={img} alt="" className="w-full h-28 md:h-36 object-cover rounded-xl group-hover:ring-2 ring-primary transition-all" />
                    {i === 3 && allImages.length > 5 && (
                      <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center text-white font-medium text-sm backdrop-blur-sm">
                        +{allImages.length - 5} fotos
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : mainImage ? (
            <img
              src={mainImage}
              alt={trip.name}
              onClick={() => setLightboxOpen(true)}
              className="w-full h-64 md:h-96 object-cover rounded-2xl cursor-pointer"
            />
          ) : null}
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-16 lg:px-24 mt-10">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-14">
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                  <h2 className="font-playfair text-3xl md:text-4xl font-bold text-gray-900">{trip.name}</h2>
                  <p className="text-gray-500 mt-2 flex items-center gap-2">
                    <span>📍 {trip.destination}</span>
                    <span className="text-gray-300">·</span>
                    <span>📅 {trip.days} días</span>
                  </p>
                </div>
                <div ref={priceRef} className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl p-5 min-w-44 text-center shadow-lg">
                  <p className="text-xs text-white/70 uppercase tracking-wider">Precio por persona</p>
                  <p className="text-3xl md:text-4xl font-bold mt-1">${priceAnimated.toLocaleString()}</p>
                  <p className="text-xs text-white/70 mt-1">Impuestos incluidos</p>
                </div>
              </div>
              <p className="text-gray-600 mt-6 leading-relaxed text-base md:text-lg">{trip.description}</p>
              <div ref={savingRef} className="mt-6 inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2.5 rounded-xl text-sm font-medium">
                <span className="text-lg">💸</span>
                Ahorras <strong>${savingAnimated.toLocaleString()}</strong> con esta oferta — Precio original: <span className="line-through">${price.toLocaleString()}</span>
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-6">Información del viaje</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {TRAVEL_TIPS.map((tip, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-gray-50 rounded-xl p-4 text-center hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-2xl block mb-1">{tip.icon}</span>
                    <p className="text-xs text-gray-500">{tip.label}</p>
                    <p className="font-semibold text-gray-800 text-sm">{tip.value}</p>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-6">Incluye</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {roomCommonData.map((spec, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.06 }}
                    className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-primary/20 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <img src={spec.icon} alt="" className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{spec.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{spec.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {similarTrips.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
              >
                <h3 className="text-2xl font-playfair font-bold text-gray-900 mb-6">Viajes similares</h3>
                <div className="grid md:grid-cols-3 gap-5">
                  {similarTrips.map((st) => (
                    <TiltCard key={st._id}>
                      <Link to={`/trips/${st._id}`} className="block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 group" onClick={() => { setLoading(true); window.scrollTo(0, 0); }}>
                        <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                          {st.images?.[0] ? (
                            <img src={st.images[0]} alt={st.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <div className="flex items-center justify-center h-full"><span className="text-4xl opacity-30">🏖️</span></div>
                          )}
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-sm text-gray-800 group-hover:text-primary transition-colors">{st.name}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">{st.destination} · {st.days} días</p>
                          <p className="text-primary font-bold text-sm mt-2">${Number(st.price).toLocaleString()}</p>
                        </div>
                      </Link>
                    </TiltCard>
                  ))}
                </div>
              </motion.section>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-28 space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
              >
                <h3 className="font-bold text-gray-800 text-lg">Reserva este viaje</h3>
                <p className="text-sm text-gray-500 mt-1">Selecciona tus fechas y confirma tu aventura</p>

                <div className="mt-5 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de entrada</label>
                    <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de salida</label>
                    <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all" />
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-xl space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Precio por persona</span>
                    <span className="font-medium text-gray-800">${price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Descuento 20%</span>
                    <span>-${saving.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-base">
                    <span>Total</span>
                    <span className="text-primary">${discounted.toLocaleString()}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsModalOpen(true)}
                  disabled={!user}
                  className="mt-5 w-full py-3 bg-accent hover:bg-amber-600 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-accent/25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {user ? "Reservar Ahora" : "Inicia sesión para reservar"}
                </motion.button>

                {!user && (
                  <p className="text-xs text-red-500 text-center mt-2">Debes iniciar sesión para reservar</p>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <h4 className="font-semibold text-gray-800 text-sm mb-4">Por qué reservar con nosotros</h4>
                <div className="space-y-3">
                  {TRUST_BADGES.map((badge, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-lg">{badge.icon}</span>
                      <span className="text-sm text-gray-600">{badge.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ y: 100 }}
        animate={{ y: showStickyBar ? 0 : 100 }}
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-2xl md:hidden transition-all duration-300"
      >
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 line-through">${price.toLocaleString()}</p>
            <p className="text-xl font-bold text-primary">${discounted.toLocaleString()}</p>
            <p className="text-xs text-gray-500">por persona</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            disabled={!user}
            className="px-6 py-3 bg-accent text-white rounded-xl font-semibold text-sm shadow-lg cursor-pointer disabled:opacity-50"
          >
            {user ? "Reservar" : "Iniciar sesión"}
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button onClick={() => setLightboxOpen(false)} className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl z-10 cursor-pointer">✕</button>
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIdx((prev) => (prev - 1 + allImages.length) % allImages.length); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-4xl cursor-pointer"
            >
              ‹
            </button>
            <motion.img
              key={lightboxIdx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              src={allImages[lightboxIdx]}
              alt=""
              className="max-w-full max-h-[90vh] object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIdx((prev) => (prev + 1) % allImages.length); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white text-4xl cursor-pointer"
            >
              ›
            </button>
            <div className="absolute bottom-6 text-white/60 text-sm">
              {lightboxIdx + 1} / {allImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-800 text-center">Reservar Viaje</h2>
              <p className="text-sm text-gray-500 text-center mt-1">Selecciona las fechas de tu viaje</p>

              <div className="flex gap-4 mt-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Entrada</label>
                  <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salida</label>
                  <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all" />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={checkAvailability}
                  disabled={checking}
                  className="flex-1 py-2.5 rounded-lg bg-secondary text-white font-medium text-sm hover:bg-gray-800 transition cursor-pointer disabled:opacity-60"
                >
                  {checking ? "Consultando..." : "Consultar Disponibilidad"}
                </button>
                <button
                  onClick={handleBooking}
                  disabled={!isAvailable || bookingLoading}
                  className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${
                    isAvailable ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {bookingLoading ? "Reservando..." : "Confirmar"}
                </button>
              </div>

              <button onClick={() => setIsModalOpen(false)} className="w-full mt-3 py-2.5 rounded-lg border border-gray-300 text-gray-600 font-medium text-sm hover:bg-gray-50 transition cursor-pointer">
                Cancelar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TripsDetails;
