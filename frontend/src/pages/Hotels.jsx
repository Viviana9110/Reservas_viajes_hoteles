import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";
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
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
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

const getInitials = (name) => {
  if (!name) return "H";
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
};

const GLARE_COLORS = [
  "from-blue-500 via-indigo-400 to-violet-500",
  "from-emerald-500 via-teal-400 to-cyan-500",
  "from-amber-500 via-orange-400 to-rose-500",
  "from-sky-500 via-blue-400 to-indigo-500",
  "from-rose-500 via-pink-400 to-purple-500",
  "from-teal-500 via-green-400 to-emerald-500",
];

const Hotels = () => {
  const { hotels, trips, loadingHotels } = useAppContext();
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("Todas");
  const [countVisible, setCountVisible] = useState(false);
  const countRef = useRef(null);

  const cities = ["Todas", ...new Set(hotels.map((h) => h.location?.city).filter(Boolean))];

  const filtered = hotels.filter((h) => {
    const matchSearch = !search || h.name?.toLowerCase().includes(search.toLowerCase()) || h.location?.city?.toLowerCase().includes(search.toLowerCase());
    const matchCity = selectedCity === "Todas" || h.location?.city === selectedCity;
    return matchSearch && matchCity;
  });

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

  if (loadingHotels) {
    return (
      <div className="pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32 max-w-7xl mx-auto">
        <div className="skeleton h-10 w-40 mb-2" />
        <div className="skeleton h-4 w-96 mb-8" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  if (!hotels.length) {
    return (
      <div className="pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-gray-800">Hoteles</h1>
          <p className="text-gray-500 mt-3">Explora nuestra selección de hoteles exclusivos.</p>
        </div>
        <EmptyState title="No hay hoteles disponibles" description="Pronto tendremos hoteles disponibles para ti." />
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-gray-800">Hoteles</h1>
        <p className="text-gray-500 mt-2">Explora nuestra selección de hoteles exclusivos y encuentra tu estadía perfecta.</p>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-4 mb-8" ref={countRef}>
        <div className="relative flex-1">
          <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar hoteles por nombre o ciudad..."
            className="w-full rounded-xl border border-gray-200 pl-10 pr-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all bg-white"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {cities.map((city) => (
            <motion.button
              key={city}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCity(city)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                selectedCity === city
                  ? "bg-secondary text-white shadow-md"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {city}
            </motion.button>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-between mb-6"
      >
        <p className="text-sm text-gray-500">
          <motion.span key={animatedCount} className="font-semibold text-gray-700 text-lg">{animatedCount}</motion.span> hoteles encontrados
        </p>
        {search && (
          <button onClick={() => { setSearch(""); setSelectedCity("Todas"); }} className="text-xs text-primary hover:text-primary-dark transition cursor-pointer">
            Limpiar filtros
          </button>
        )}
      </motion.div>

      {filtered.length > 0 ? (
        <motion.div variants={container} initial="hidden" animate="visible" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((hotel, idx) => {
            const bgGradient = GLARE_COLORS[idx % GLARE_COLORS.length];
            return (
              <motion.div key={hotel._id} variants={item}>
                <TiltCard tiltDegree={6}>
                  <Link to={`/rooms/${hotel._id}`} className="block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="h-44 relative overflow-hidden bg-gray-100">
                      {hotel.images?.[0] ? (
                        <img
                          src={hotel.images[0]}
                          alt={hotel.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          onError={(e) => { e.target.style.display = "none"; e.target.parentElement.classList.add("flex", "items-center", "justify-center"); const s = document.createElement("span"); s.className = "text-3xl font-bold text-gray-300 select-none"; s.textContent = getInitials(hotel.name); e.target.parentElement.appendChild(s); }}
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${bgGradient} flex items-center justify-center`}>
                          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,_white_0%,_transparent_70%)]" />
                          <span className="text-3xl font-bold text-white/30 drop-shadow-lg select-none">{getInitials(hotel.name)}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                      <div className="absolute top-3 right-3 flex gap-1.5">
                        {hotel.amenities?.slice(0, 3).map((a, i) => (
                          <span key={i} className="w-2 h-2 rounded-full bg-white/60 shadow-sm" title={a} />
                        ))}
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="font-bold text-lg text-gray-800 group-hover:text-primary transition-colors">{hotel.name}</h2>
                        {hotel.pricePerNight && (
                          <span className="text-lg font-bold text-primary whitespace-nowrap">
                            ${hotel.pricePerNight}
                            <span className="text-xs font-normal text-gray-400">/noche</span>
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                        {hotel.location?.city || "Ubicación no disponible"}
                        {hotel.location?.country && `, ${hotel.location.country}`}
                      </p>
                      {hotel.description && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{hotel.description}</p>
                      )}
                      {hotel.amenities?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {hotel.amenities.map((a, i) => (
                            <span key={i} className="px-2.5 py-1 bg-gray-50 text-gray-500 text-xs rounded-md border border-gray-100 hover:bg-primary-light hover:text-primary hover:border-primary-light transition-colors">
                              {a}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                        <Link to={`/rooms/${hotel._id}`} className="text-xs text-gray-400 hover:text-primary flex items-center gap-1.5 transition-colors">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                          Ver Habitaciones
                        </Link>
                        {(() => {
                          const city = hotel.location?.city;
                          const matchCount = city ? trips.filter((t) => t.destination?.toLowerCase().includes(city.toLowerCase())).length : 0;
                          if (!matchCount) return null;
                          return (
                            <Link
                              to={`/trips?dest=${encodeURIComponent(city)}`}
                              className="text-xs font-medium text-primary hover:text-primary-dark flex items-center gap-1 transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                              {matchCount} paquete{matchCount > 1 ? "s" : ""} en {city}
                            </Link>
                          );
                        })()}
                      </div>
                    </div>
                  </Link>
                </TiltCard>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <EmptyState
            title="Sin resultados"
            description={`No encontramos hoteles${search ? ` para "${search}"` : ""}${selectedCity !== "Todas" ? ` en ${selectedCity}` : ""}. Intenta con otros filtros.`}
          />
          <div className="text-center mt-4">
            <button onClick={() => { setSearch(""); setSelectedCity("Todas"); }} className="text-sm text-primary hover:text-primary-dark transition cursor-pointer">
              Limpiar filtros
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Hotels;
