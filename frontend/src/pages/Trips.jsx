import { useState, useRef, useEffect } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { SkeletonCard } from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import TiltCard from "../components/TiltCard";

const container = {
  hidden: {}, visible: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 },
};

function useCountUp(target, enabled) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!enabled || started.current) return;
    started.current = true;
    const duration = 800;
    const steps = 20;
    let current = 0;
    const timer = setInterval(() => {
      current += target / steps;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [target, enabled]);

  return count;
}



const CARD_ACCENTS = [
  "from-amber-500 to-orange-600",
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-rose-500 to-pink-600",
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-blue-600",
];

const sortOptions = [
  { value: "default", label: "Por defecto" },
  { value: "price-asc", label: "Menor precio" },
  { value: "price-desc", label: "Mayor precio" },
  { value: "days", label: "Más días" },
];

const Trips = () => {
  const { trips, loadingTrips } = useAppContext();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [countVisible, setCountVisible] = useState(false);
  const countRef = useRef(null);

  const allDestinations = ["Todos", ...new Set(trips.map((t) => t.destination).filter(Boolean))];
  const [selectedDest, setSelectedDest] = useState("Todos");

  useEffect(() => {
    const destParam = searchParams.get("dest");
    if (destParam && trips.length > 0) {
      const match = allDestinations.find((d) => d.toLowerCase().includes(destParam.toLowerCase()));
      if (match) setSelectedDest(match);
    }
  }, [searchParams, trips.length]);

  let filtered = trips.filter((t) => {
    const matchSearch = !search || t.name?.toLowerCase().includes(search.toLowerCase()) || t.destination?.toLowerCase().includes(search.toLowerCase());
    const matchDest = selectedDest === "Todos" || t.destination === selectedDest;
    return matchSearch && matchDest;
  });

  switch (sortBy) {
    case "price-asc":
      filtered = [...filtered].sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
      break;
    case "price-desc":
      filtered = [...filtered].sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
      break;
    case "days":
      filtered = [...filtered].sort((a, b) => (Number(b.days) || 0) - (Number(a.days) || 0));
      break;
    default: break;
  }

  useEffect(() => {
    const el = countRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setCountVisible(true);
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const animatedCount = useCountUp(filtered.length, countVisible);

  if (loadingTrips) {
    return (
      <div className="pt-28 md:pt-36 px-4 md:px-16 lg:px-24 xl:px-32 max-w-7xl mx-auto">
        <div className="skeleton h-10 w-64 mx-auto mb-2" />
        <div className="skeleton h-4 w-96 mx-auto mb-12" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (!trips.length) {
    return (
      <div className="pt-28 md:pt-36 px-4 md:px-16 lg:px-24 xl:px-32 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-gray-800">Paquetes de Viaje</h1>
          <p className="text-gray-500 mt-3">Aprovecha nuestras ofertas limitadas y paquetes especiales.</p>
        </div>
        <EmptyState title="No hay paquetes disponibles" description="Pronto tendremos nuevos paquetes para ti." />
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-36 px-4 md:px-16 lg:px-24 xl:px-32 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto mb-8">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-gray-800">Paquetes de Viaje</h1>
        <p className="text-gray-500 mt-3 text-sm md:text-base">
          Aprovecha nuestras ofertas limitadas y paquetes especiales para crear recuerdos inolvidables.
        </p>
      </motion.div>

      <div ref={countRef} className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar paquetes por destino..."
            className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-white"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all bg-white text-gray-600 cursor-pointer"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6">
        {allDestinations.map((dest) => (
          <motion.button
            key={dest}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedDest(dest)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
              selectedDest === dest
                ? "bg-accent text-white shadow-md"
                : "bg-white text-gray-600 border border-gray-200 hover:border-accent/40 hover:text-accent"
            }`}
          >
            {dest}
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between mb-6"
      >
        <p className="text-sm text-gray-500">
          <motion.span key={animatedCount} className="font-semibold text-gray-700 text-lg">{animatedCount}</motion.span> paquetes encontrados
        </p>
        {(search || selectedDest !== "Todos" || sortBy !== "default") && (
          <button onClick={() => { setSearch(""); setSelectedDest("Todos"); setSortBy("default"); }} className="text-xs text-accent hover:text-accent/80 transition cursor-pointer">
            Limpiar filtros
          </button>
        )}
      </motion.div>

      {filtered.length > 0 ? (
        <motion.div variants={container} initial="hidden" animate="visible" className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((trip, idx) => {
            const accentGradient = CARD_ACCENTS[idx % CARD_ACCENTS.length];
            const img = trip.images?.[0] || "https://picsum.photos/seed/travel/1200/800";
            const pricePerDay = trip.price && trip.days ? Math.round(Number(trip.price) / Number(trip.days)) : null;

            return (
              <motion.div key={trip._id} variants={item}>
                <TiltCard tiltDegree={7}>
                  <NavLink to={`/trips/${trip._id}`} className="block bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden group">
                    <div className="h-52 relative overflow-hidden">
                      <img
                        src={img}
                        alt={trip.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        onError={(e) => { e.target.src = "https://picsum.photos/seed/travel/1200/800"; }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className={`absolute top-3 left-3 w-12 h-1 rounded-full bg-gradient-to-r ${accentGradient}`} />
                      {trip.destination && (
                        <span className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-medium rounded-full border border-white/20">
                          {trip.destination}
                        </span>
                      )}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h2 className="text-xl font-bold text-white drop-shadow-lg">{trip.name}</h2>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-white/80">
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                            {trip.days} días
                          </span>
                          {pricePerDay && (
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                              ${pricePerDay.toLocaleString()}/día
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{trip.description}</p>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <div>
                          <span className="text-2xl font-bold text-gray-800">${Number(trip.price).toLocaleString()}</span>
                          <span className="text-xs text-gray-400 ml-1">/persona</span>
                        </div>
                        <span className="inline-flex items-center gap-2 px-5 py-2 bg-primary text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg hover:bg-primary-dark active:scale-95 transition-all">
                          Ver Más
                          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </span>
                      </div>
                    </div>
                  </NavLink>
                </TiltCard>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <EmptyState
            title="Sin resultados"
            description={`No encontramos paquetes${search ? ` para "${search}"` : ""}${selectedDest !== "Todos" ? ` en ${selectedDest}` : ""}. Intenta con otros filtros.`}
          />
          <div className="text-center mt-4">
            <button onClick={() => { setSearch(""); setSelectedDest("Todos"); setSortBy("default"); }} className="text-sm text-accent hover:text-accent/80 transition cursor-pointer">
              Limpiar filtros
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Trips;
