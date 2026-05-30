import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const MOODS = [
  { id: "aventura", label: "Aventura", icon: "🏔️", color: "#059669", gradient: "from-emerald-500/20 to-teal-600/20" },
  { id: "playa", label: "Playa", icon: "🏖️", color: "#0284C7", gradient: "from-sky-500/20 to-blue-600/20" },
  { id: "cultura", label: "Cultura", icon: "🏛️", color: "#D97706", gradient: "from-amber-500/20 to-orange-600/20" },
  { id: "naturaleza", label: "Naturaleza", icon: "🌿", color: "#16A34A", gradient: "from-green-500/20 to-lime-600/20" },
];

const ORB_COLORS = ["#0B4F3C", "#B85C3A", "#C9A86B", "#16664E", "#8E4528"];

const COUNTERS = [
  { label: "Destinos", value: 12, suffix: "+" },
  { label: "Hoteles", value: 50, suffix: "+" },
  { label: "Viajeros", value: 2000, suffix: "+" },
  { label: "Experiencias", value: 100, suffix: "+" },
];

function useCountUp(end, duration = 2000, startOnView = false) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (!startOnView) return;
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
  }, [end, duration, startOnView]);

  return [count, ref];
}

function ParallaxOrb({ index, mouseX, mouseY, size, position }) {
  const color = ORB_COLORS[index % ORB_COLORS.length];
  const speed = 0.5 + index * 0.15;

  return (
    <motion.div
      className="absolute rounded-full blur-3xl pointer-events-none"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color}30, transparent)`,
        left: `${position.x}%`,
        top: `${position.y}%`,
      }}
      animate={{
        x: (mouseX || 0) * 40 * speed,
        y: (mouseY || 0) * 40 * speed,
      }}
      transition={{ type: "spring", stiffness: 50, damping: 30, mass: 1 }}
    />
  );
}

function TiltCard({ children, className = "" }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * -12, y: x * 12 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  return (
    <motion.div
      ref={ref}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
        scale: isHovered ? 1.02 : 1,
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
    >
      {children}
      {isHovered && (
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${50 + tilt.y * 3}% ${50 + tilt.x * 3}%, rgba(255,255,255,0.15), transparent)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />
      )}
    </motion.div>
  );
}

function AnimatedCounter({ label, value, suffix }) {
  const [count, ref] = useCountUp(value, 2000, true);
  const display = useMemo(() => {
    if (value >= 1000) return `${count.toLocaleString()}`;
    return count;
  }, [count, value]);

  return (
    <div ref={ref} className="text-center">
      <span className="text-3xl md:text-4xl font-bold gradient-text">{display}{suffix}</span>
      <span className="text-xs text-coffee-mute mt-1 block font-medium">{label}</span>
    </div>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const COLOMBIAN_REGIONS = [
  { id: "caribe", name: "Caribe", color: "#0284C7" },
  { id: "andina", name: "Andina", color: "#059669" },
  { id: "pacifico", name: "Pacífico", color: "#2563EB" },
  { id: "amazonia", name: "Amazonía", color: "#16A34A" },
  { id: "llanos", name: "Llanos", color: "#D97706" },
];

function getMoodForPackage(pkg) {
  const text = `${pkg.name} ${pkg.description} ${pkg.destination}`.toLowerCase();
  if (text.includes("playa") || text.includes("caribe") || text.includes("mar")) return "playa";
  if (text.includes("aventura") || text.includes("montaña") || text.includes("extremo")) return "aventura";
  if (text.includes("cultura") || text.includes("museo") || text.includes("histórico")) return "cultura";
  return "naturaleza";
}

function getRegionForPackage(pkg) {
  const dest = (pkg.destination || "").toLowerCase();
  if (dest.includes("cartagena") || dest.includes("san andrés") || dest.includes("santa marta")) return "caribe";
  if (dest.includes("bogotá") || dest.includes("medellín") || dest.includes("manizales") || dest.includes("eje")) return "andina";
  if (dest.includes("pacífico") || dest.includes("cali") || dest.includes("chocó")) return "pacifico";
  if (dest.includes("amazon") || dest.includes("leticia")) return "amazonia";
  if (dest.includes("llanos") || dest.includes("villavicencio")) return "llanos";
  return "andina";
}

export default function InteractiveExperience() {
  const { trips } = useAppContext();
  const [activeMood, setActiveMood] = useState(null);
  const [activeRegion, setActiveRegion] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const orbs = useMemo(
    () => [
      { size: 500, position: { x: 5, y: 20 } },
      { size: 400, position: { x: 75, y: 5 } },
      { size: 450, position: { x: 50, y: 70 } },
      { size: 300, position: { x: 90, y: 80 } },
    ],
    []
  );

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const filteredTrips = useMemo(() => {
    let result = trips || [];
    if (activeMood) result = result.filter((t) => getMoodForPackage(t) === activeMood);
    if (activeRegion) result = result.filter((t) => getRegionForPackage(t) === activeRegion);
    return result;
  }, [trips, activeMood, activeRegion]);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream via-ivory to-cream py-24 md:py-32">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {orbs.map((orb, i) => (
          <ParallaxOrb key={i} index={i} mouseX={mousePos.x} mouseY={mousePos.y} size={orb.size} position={orb.position} />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-16 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="eyebrow text-primary tracking-[0.25em] font-semibold">Explora Colombia</span>
          <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-coffee mt-2 leading-tight">
            Vive una{" "}
            <span className="gradient-text">Experiencia Única</span>
          </h2>
          <p className="text-coffee-light text-sm md:text-base mt-3 max-w-lg mx-auto leading-relaxed">
            Filtra por tu estado de ánimo o región favorita y descubre el viaje perfecto para ti.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-2 mb-4"
        >
          <button
            onClick={() => { setActiveMood(null); setActiveRegion(null); }}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
              !activeMood && !activeRegion
                ? "bg-coffee text-white shadow-lg shadow-coffee/20"
                : "bg-white/70 backdrop-blur text-coffee-light border border-white/50 hover:bg-white hover:shadow-sm"
            }`}
          >
            Todos
          </button>
          {MOODS.map((mood) => (
            <button
              key={mood.id}
              onClick={() => { setActiveMood(activeMood === mood.id ? null : mood.id); setActiveRegion(null); }}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                activeMood === mood.id
                  ? "bg-coffee text-white shadow-lg shadow-coffee/20"
                  : "bg-white/70 backdrop-blur text-coffee-light border border-white/50 hover:bg-white hover:shadow-sm"
              }`}
            >
              <span className="mr-1.5">{mood.icon}</span>
              {mood.label}
            </button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
        >
          {COLOMBIAN_REGIONS.map((region) => (
            <button
              key={region.id}
              onClick={() => { setActiveRegion(activeRegion === region.id ? null : region.id); setActiveMood(null); }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
                activeRegion === region.id
                  ? "bg-coffee text-white shadow-lg"
                  : "bg-white/70 backdrop-blur text-coffee-light border border-white/50 hover:bg-white"
              }`}
            >
              {region.name}
            </button>
          ))}
        </motion.div>

        <AnimatePresence mode="wait">
          {filteredTrips.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <span className="text-5xl block mb-4">🔍</span>
              <p className="text-coffee-light">
                {activeMood
                  ? `No encontramos paquetes de "${MOODS.find((m) => m.id === activeMood)?.label}" aún.`
                  : "No encontramos paquetes para esta región."}
              </p>
              <button onClick={() => { setActiveMood(null); setActiveRegion(null); }} className="mt-3 text-primary text-sm font-medium hover:underline cursor-pointer">
                Ver todos los destinos
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={activeMood || activeRegion || "all"}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filteredTrips.slice(0, 6).map((trip) => {
                const mood = getMoodForPackage(trip);
                const moodData = MOODS.find((m) => m.id === mood);
                const price = typeof trip.price === "number"
                  ? `$${trip.price.toLocaleString()}`
                  : `$${trip.price}`;

                return (
                  <motion.div key={trip._id} variants={cardVariants}>
                    <TiltCard>
                      <Link
                        to={`/trips/${trip._id}`}
                        className="block bg-white rounded-2xl overflow-hidden shadow-paper hover:shadow-lift card-lift border border-gray-100/60 group"
                      >
                        <div className="relative h-44 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                          <div className="absolute inset-0 bg-gradient-to-t from-coffee/30 to-transparent z-10" />
                          {trip.images?.[0] ? (
                            <img
                              src={trip.images[0]}
                              alt={trip.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <span className="text-5xl opacity-20">🏔️</span>
                            </div>
                          )}
                          <div className="absolute top-3 left-3 z-20">
                            <span
                              className="text-xs font-medium px-2.5 py-1 rounded-full text-white shadow-sm"
                              style={{ background: moodData?.color || "#2563EB" }}
                            >
                              {moodData?.icon} {moodData?.label}
                            </span>
                          </div>
                          <div className="absolute bottom-3 right-3 z-20">
                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-coffee shadow-sm">
                              {trip.days} días
                            </span>
                          </div>
                        </div>
                        <div className="p-4 md:p-5">
                          <h3 className="font-semibold text-base text-coffee group-hover:text-primary transition-colors leading-tight">
                            {trip.name}
                          </h3>
                          <p className="text-xs text-coffee-mute mt-1">
                            📍 {trip.destination}
                          </p>
                          <p className="text-sm text-coffee-light mt-2 line-clamp-2 leading-snug">
                            {trip.description}
                          </p>
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                            <div>
                              <span className="text-lg font-bold text-primary">
                                {price}
                              </span>
                              <span className="text-xs text-coffee-mute ml-1">/pers</span>
                            </div>
                            <span className="text-xs font-medium text-primary group-hover:translate-x-1 transition-transform flex items-center gap-1">
                              Explorar
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </Link>
                    </TiltCard>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {filteredTrips.length > 6 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-10"
          >
            <Link
              to="/trips"
              className="inline-flex items-center gap-2 px-6 py-3 bg-coffee text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-all shadow-lg active:scale-[0.97]"
            >
              Ver todos los destinos
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="relative bg-white/70 backdrop-blur rounded-3xl border border-white/50 p-8 md:p-10 shadow-paper">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-light/20 to-gold-light/10 pointer-events-none" />
            <div className="relative grid grid-cols-2 md:grid-cols-4 gap-8">
              {COUNTERS.map((counter) => (
                <AnimatedCounter key={counter.label} {...counter} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
