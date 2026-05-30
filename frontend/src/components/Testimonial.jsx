import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { testimonials } from "../assets/assets";
import StarRating from "./StarRating";

const Testimonial = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goTo = (index) => setCurrent(index);

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-coffee pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-emerald-deep/40 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-gradient-radial from-gold/20 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-16 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="eyebrow text-gold tracking-[0.25em] font-semibold">Testimonios</span>
          <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-2 leading-tight">
            Lo Que Dicen <span className="text-gold">Nuestros Huéspedes</span>
          </h2>
          <p className="text-white/60 text-sm md:text-base mt-3 max-w-lg mx-auto leading-relaxed">
            Descubre por qué los viajeros eligen Tour Colombia para sus estadías y experiencias inolvidables.
          </p>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.97 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 md:p-12 shadow-strong"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold to-gold-light blur-sm opacity-60" />
                  <motion.img
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className="relative w-14 h-14 md:w-16 md:h-16 rounded-full object-cover ring-2 ring-white/20"
                    src={testimonials[current].image}
                    alt={testimonials[current].name}
                  />
                </div>
                <div>
                  <p className="font-semibold text-white text-lg">{testimonials[current].name}</p>
                  <p className="text-sm text-white/50">{testimonials[current].address}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mt-5">
                <StarRating rating={testimonials[current].rating} />
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-white/80 mt-5 leading-relaxed italic text-base md:text-lg font-display-italic"
              >
                &ldquo;{testimonials[current].review}&rdquo;
              </motion.p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                  i === current
                    ? "w-10 bg-gold"
                    : "w-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
