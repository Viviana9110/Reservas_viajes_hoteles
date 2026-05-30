import { motion } from "framer-motion";
import { assets, exclusiveOffers } from "../assets/assets";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const ExclusiveOffers = () => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-cream via-ivory to-cream pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-radial from-emerald-soft/30 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-16 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-end justify-between mb-14"
        >
          <div>
            <span className="eyebrow text-primary tracking-[0.25em] font-semibold">Tiempo Limitado</span>
            <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-coffee mt-2 leading-tight">
              Ofertas <span className="gradient-text">Exclusivas</span>
            </h2>
            <p className="text-coffee-light text-sm md:text-base mt-3 max-w-md leading-relaxed">
              Aprovecha nuestras ofertas por tiempo limitado y paquetes especiales para mejorar tu estadía.
            </p>
          </div>
          <button className="mt-6 md:mt-0 group inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark transition cursor-pointer">
            Ver todas las ofertas
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-5"
        >
          {exclusiveOffers.map((offer, i) => (
            <motion.div key={offer._id} variants={item}>
              <div className="group relative rounded-3xl overflow-hidden min-h-[340px] md:min-h-[400px] card-lift cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-t from-coffee/70 via-coffee/10 to-transparent z-10" />
                <img
                  src={offer.image}
                  alt={offer.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <span className="absolute top-4 left-4 z-20 px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full shadow-lg">
                  {offer.priceOff}% OFF
                </span>
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 z-20">
                  <p className="font-playfair text-xl md:text-2xl font-bold text-white drop-shadow-sm">{offer.title}</p>
                  <p className="text-sm text-white/80 mt-1 drop-shadow-sm">{offer.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-white/60">Vence {offer.expiryDate}</span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white group-hover:underline transition-all">
                      Ver oferta
                      <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ExclusiveOffers;
