import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";

const HERO_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1648507946692-cce607820ba8?auto=format&fit=crop&w=1920&q=80",
    alt: "Cartagena",
    mobile: "https://images.unsplash.com/photo-1648507946692-cce607820ba8?auto=format&fit=crop&w=600&q=75",
  },
  {
    src: "https://images.unsplash.com/photo-1680209082240-1abf11585936?auto=format&fit=crop&w=1920&q=80",
    alt: "Medellín",
    mobile: "https://images.unsplash.com/photo-1680209082240-1abf11585936?auto=format&fit=crop&w=600&q=75",
  },
  {
    src: "https://images.unsplash.com/photo-1572882602941-ba4fba8d3b1f?auto=format&fit=crop&w=1920&q=80",
    alt: "Eje Cafetero",
    mobile: "https://images.unsplash.com/photo-1572882602941-ba4fba8d3b1f?auto=format&fit=crop&w=600&q=75",
  },
  {
    src: "https://images.unsplash.com/photo-1549025227-2fd0b499aaae?auto=format&fit=crop&w=1920&q=80",
    alt: "Santa Marta",
    mobile: "https://images.unsplash.com/photo-1549025227-2fd0b499aaae?auto=format&fit=crop&w=600&q=75",
  },
  {
    src: "https://images.unsplash.com/photo-1611148261486-4e315d904232?auto=format&fit=crop&w=1920&q=80",
    alt: "Guatapé",
    mobile: "https://images.unsplash.com/photo-1611148261486-4e315d904232?auto=format&fit=crop&w=600&q=75",
  },
];

const DESTINATION_TAGS = [
  "Cartagena", "Bogotá", "Medellín", "San Andrés",
  "Eje Cafetero", "Santa Marta", "Boyacá", "Amazonía",
];

const Hero = () => {
  const { navigate } = useAppContext();
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [currentImg, setCurrentImg] = useState(0);
  const [loaded, setLoaded] = useState({});

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({ destination, checkIn, checkOut, guests });
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="relative h-screen overflow-hidden bg-black">
      {/* Crossfade images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentImg}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <picture>
            <source media="(max-width: 768px)" srcSet={HERO_IMAGES[currentImg].mobile} />
            <img
              src={HERO_IMAGES[currentImg].src}
              alt={HERO_IMAGES[currentImg].alt}
              className="w-full h-full object-cover"
              loading={currentImg === 0 ? "eager" : "lazy"}
              fetchpriority={currentImg === 0 ? "high" : "low"}
              onLoad={() => setLoaded((p) => ({ ...p, [currentImg]: true }))}
            />
          </picture>
        </motion.div>
      </AnimatePresence>

      {/* Layered gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/70" />
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-deep/15 to-transparent" />

      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -right-32 w-[500px] h-[500px] rounded-full bg-gold/10 blur-[150px]"
          animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.4, 0.25] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-48 -left-32 w-[600px] h-[600px] rounded-full bg-emerald-deep/15 blur-[150px]"
          animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />
        <motion.div
          className="absolute top-1/3 left-1/3 w-64 h-64 rounded-full bg-terracotta/8 blur-[100px]"
          animate={{ scale: [1, 1.3, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>

      {/* Main content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-16 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl"
        >
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full text-xs font-semibold tracking-widest uppercase text-gold border border-gold/30 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            Viajes que transforman
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-playfair text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[1.05] tracking-tight"
          >
            Descubre{" "}
            <span className="bg-gradient-to-r from-gold via-gold-light to-gold bg-clip-text text-transparent">
              Colombia
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-4 text-sm md:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed"
          >
            Hoteles exclusivos, paquetes turísticos y experiencias únicas en los destinos más increíbles del país.
          </motion.p>
        </motion.div>

        {/* Search form */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          onSubmit={handleSubmit}
          className="w-full max-w-4xl mt-8 md:mt-10 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 p-4 md:p-5"
          style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.3)" }}
        >
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 min-w-0">
              <label className="flex items-center gap-1.5 text-xs font-medium text-white/50 mb-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Destino
              </label>
              <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)}
                className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-2.5 text-sm text-white placeholder-white/30 outline-none focus:border-gold/40 focus:bg-white/15 transition-all"
                placeholder="¿A dónde quieres ir?" required />
            </div>
            <div className="flex-1 min-w-0">
              <label className="flex items-center gap-1.5 text-xs font-medium text-white/50 mb-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                Entrada
              </label>
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)}
                className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-2.5 text-sm text-white [color-scheme:dark] outline-none focus:border-gold/40 focus:bg-white/15 transition-all" />
            </div>
            <div className="flex-1 min-w-0">
              <label className="flex items-center gap-1.5 text-xs font-medium text-white/50 mb-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                Salida
              </label>
              <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)}
                className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-2.5 text-sm text-white [color-scheme:dark] outline-none focus:border-gold/40 focus:bg-white/15 transition-all" />
            </div>
            <div className="flex-1 min-w-0">
              <label className="flex items-center gap-1.5 text-xs font-medium text-white/50 mb-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Huéspedes
              </label>
              <input min={1} max={4} type="number" value={guests} onChange={(e) => setGuests(e.target.value)}
                className="w-full rounded-xl bg-white/10 border border-white/10 px-4 py-2.5 text-sm text-white outline-none focus:border-gold/40 focus:bg-white/15 transition-all" />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-light hover:from-gold-light hover:to-gold py-3 px-8 text-coffee font-semibold text-sm shadow-lg transition-all cursor-pointer self-end md:self-center mt-1.5 md:mt-0"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              Buscar
            </motion.button>
          </div>
        </motion.form>

        {/* Destination tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-2 mt-6 max-w-2xl"
        >
          <span className="text-xs text-white/40 mr-1">Destinos populares:</span>
          {DESTINATION_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setDestination(tag)}
              className="px-3 py-1 text-xs text-white/50 bg-white/5 hover:bg-white/15 hover:text-white/90 rounded-full transition-all cursor-pointer border border-white/5 hover:border-gold/30"
            >
              {tag}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Carousel indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentImg(i)}
            className={`rounded-full transition-all duration-700 cursor-pointer ${
              i === currentImg
                ? "w-10 h-1.5 bg-gold"
                : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="flex flex-col items-center gap-2 pb-6">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1"
          >
            <span className="w-0.5 h-2 rounded-full bg-white/40" />
            <span className="w-0.5 h-2 rounded-full bg-white/20" />
            <span className="w-0.5 h-2 rounded-full bg-white/10" />
          </motion.div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-white/30 font-medium">Scroll</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
