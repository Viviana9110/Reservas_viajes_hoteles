import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

const destinos = [
  {
    _id: "68c86b946a4880feeccf218e",
    name: "Bogotá Cultural",
    image: "https://southamericabackpacker.com/wp-content/uploads/2023/04/Bogota-Sign-Monserrate-1200x800.jpg",
    description: "3 días de recorridos por museos, centros históricos y gastronomía.",
    price: 950000,
  },
  {
    _id: "68c882893fbdcb2354aaa001",
    name: "Pueblos Patrimonio",
    image: "https://images.unsplash.com/photo-1623194419771-c6cbe2e869a4?q=80&w=873&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description: "Pueblos Patrimonio de Colombia, arquitectura y belleza colonial.",
    price: 2970000,
  },
  {
    _id: "68c882ee3fbdcb2354aaa003",
    name: "Sorprendente Boyacá",
    image: "https://aneia.uniandes.edu.co/wp-content/uploads/2024/08/puente-de-boy.jpg",
    description: "Descubre durante 5 días, los lugares más increíbles de Boyacá.",
    price: 1665000,
  },
  {
    _id: "68c8838d3fbdcb2354aaa005",
    name: "Mexico y Cancún",
    image: "https://ichef.bbci.co.uk/ace/ws/640/cpsprodpb/ef90/live/d3367b00-c22b-11ef-aff0-072ce821b6ab.jpg.webp",
    description: "Descubre durante 9 días, los lugares más increíbles de México.",
    price: 9900000,
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const FeaturedDestination = () => {
  const navigate = useNavigate();

  const [featured, ...rest] = destinos;

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-16 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-14"
        >
          <div>
            <span className="eyebrow text-primary tracking-[0.25em] font-semibold">Selección Editorial</span>
            <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-coffee mt-2 leading-tight">
              Destinos <span className="gradient-text">Destacados</span>
            </h2>
            <p className="text-coffee-light text-sm md:text-base mt-3 max-w-md leading-relaxed">
              Descubre nuestra selección de destinos excepcionales que ofrecen experiencias inolvidables.
            </p>
          </div>
          <button
            onClick={() => { navigate("/trips"); scrollTo(0, 0); }}
            className="mt-6 md:mt-0 group inline-flex items-center gap-2 px-6 py-3 bg-secondary text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-all active:scale-[0.97] cursor-pointer"
          >
            Ver todos los destinos
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-12 gap-5"
        >
          {/* Featured card — spans 7 cols */}
          <motion.div variants={item} className="md:col-span-7 row-span-2">
            <Link to={`/trips/${featured._id}`} className="group block h-full">
              <div className="relative h-full min-h-[420px] md:min-h-[580px] rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-coffee/80 via-coffee/20 to-transparent z-10" />
                <img
                  src={featured.image}
                  alt={featured.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-5 left-5 z-20">
                  <span className="px-3 py-1 bg-white/15 backdrop-blur text-white text-xs font-medium rounded-full border border-white/20">Destacado</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 z-20">
                  <p className="text-white/70 text-xs md:text-sm font-medium mb-1">Desde <span className="text-white font-bold">${featured.price.toLocaleString()}</span></p>
                  <h3 className="font-playfair text-2xl md:text-4xl font-bold text-white mb-2">{featured.name}</h3>
                  <p className="text-white/80 text-sm md:text-base max-w-lg leading-relaxed">{featured.description}</p>
                  <span className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                    Explorar destino
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Rest cards — 5 cols, 2 rows */}
          <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-5">
            {rest.map((destino, index) => (
              <motion.div key={destino._id} variants={item}>
                <Link to={`/trips/${destino._id}`} className="group block">
                  <div className="relative rounded-2xl overflow-hidden bg-white shadow-paper hover:shadow-lift card-lift">
                    <div className="flex md:flex-row flex-row items-stretch">
                      <div className="relative w-1/3 md:w-2/5 min-h-[140px] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent z-10" />
                        <img
                          src={destino.image}
                          alt={destino.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="flex-1 p-4 flex flex-col justify-center">
                        <h4 className="font-playfair text-base md:text-lg font-bold text-coffee group-hover:text-primary transition-colors leading-tight">
                          {destino.name}
                        </h4>
                        <p className="text-xs text-coffee-mute mt-1 line-clamp-2 leading-relaxed">{destino.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-sm font-bold text-primary">${destino.price.toLocaleString()}</span>
                          <span className="text-xs font-medium text-coffee-mute group-hover:text-primary group-hover:translate-x-0.5 transition-all">
                            Explorar →
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedDestination;
