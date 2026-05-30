import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { SkeletonCard } from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import TiltCard from "../components/TiltCard";

const container = {
  hidden: {}, visible: { transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 },
};

const SearchResults = () => {
  const location = useLocation();
  const [results, setResults] = useState({ hotels: [], packages: [], query: {} });
  const [loading, setLoading] = useState(false);

  const params = new URLSearchParams(location.search);
  const dest = params.get("destination") || "";
  const checkIn = params.get("checkIn") || "";
  const checkOut = params.get("checkOut") || "";
  const guests = params.get("guests") || "";

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/search${location.search}`);
        setResults(data);
      } catch (error) {
        console.error("Error en la búsqueda:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };
    if (location.search) fetchResults();
  }, [location.search]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("es-ES", {
      day: "numeric", month: "long", year: "numeric",
    });
  };

  const getInitials = (name) => {
    if (!name) return "H";
    return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="px-6 md:px-16 lg:px-24 pt-28 max-w-7xl mx-auto">
        <div className="skeleton h-8 w-64 mb-2" />
        <div className="skeleton h-4 w-96 mb-6" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 md:px-16 lg:px-24 pt-28 pb-16 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-playfair font-bold text-gray-800">
          {dest ? `Resultados para "${dest}"` : "Todos los destinos"}
        </h1>
        {(checkIn || checkOut || guests) && (
          <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-500">
            {checkIn && <span className="flex items-center gap-1">📅 Desde: {formatDate(checkIn)}</span>}
            {checkOut && <span className="flex items-center gap-1">📅 Hasta: {formatDate(checkOut)}</span>}
            {guests && <span className="flex items-center gap-1">👥 {guests} huéspedes</span>}
          </div>
        )}
        <p className="text-gray-500 mt-1 text-sm">
          {results.hotels?.length || 0} hoteles disponibles
          {results.packages?.length > 0 ? ` · ${results.packages.length} paquetes sugeridos` : ""}
        </p>
      </motion.div>

      {results.hotels?.length > 0 ? (
        <>
          <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
            <span className="w-1 h-6 bg-primary rounded-full" /> Hoteles disponibles
          </h2>
          <motion.div variants={container} initial="hidden" animate="visible" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.hotels.map((hotel) => (
              <motion.div key={hotel._id} variants={item}>
                <TiltCard>
                  <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group">
                    <div className="h-48 bg-gradient-to-br from-primary-light to-blue-100 flex items-center justify-center relative">
                      <span className="text-5xl font-bold text-primary/20">{getInitials(hotel.name)}</span>
                      {hotel.totalAvailable > 0 && (
                        <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
                          {hotel.totalAvailable} hab.
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-gray-800 group-hover:text-primary transition-colors">{hotel.name}</h3>
                      <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">📍 {hotel.location?.city}, {hotel.location?.country}</p>
                      <p className="text-sm text-gray-600 mt-3 line-clamp-2">{hotel.description}</p>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        {hotel.minPrice && (
                          <span className="text-lg font-bold text-primary">
                            Desde ${hotel.minPrice.toLocaleString()}
                            <span className="text-sm font-normal text-gray-400">/noche</span>
                          </span>
                        )}
                        {hotel.amenities?.length > 0 && (
                          <span className="text-xs text-gray-400">{hotel.amenities.slice(0, 2).join(" · ")}</span>
                        )}
                      </div>
                      <Link to={`/rooms/${hotel._id}`} className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors">
                        Ver habitaciones disponibles →
                      </Link>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        </>
      ) : (
        <div className="mb-10">
          <EmptyState
            title="No hay hoteles disponibles"
            description={
              dest
                ? `No encontramos hoteles en "${dest}" para los criterios seleccionados. Intenta con otro destino o fechas diferentes.`
                : "No hay hoteles disponibles en este momento."
            }
          />
        </div>
      )}

      {results.packages?.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-12 mb-4 text-gray-700 flex items-center gap-2">
            <span className="w-1 h-6 bg-accent rounded-full" /> Paquetes turísticos sugeridos
          </h2>
          <motion.div variants={container} initial="hidden" animate="visible" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.packages.map((pkg) => (
              <motion.div key={pkg._id} variants={item}>
                <TiltCard>
                  <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group">
                    <div className="h-36 bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,_#f59e0b_0%,_transparent_70%)]" />
                      <span className="text-4xl">🏖️</span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-gray-800">{pkg.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{pkg.destination} · {pkg.days} días</p>
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{pkg.description}</p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-lg font-bold text-primary">
                          ${typeof pkg.price === "number" ? pkg.price.toLocaleString() : pkg.price}
                        </span>
                        <Link to={`/trips/${pkg._id}`} className="px-4 py-2 text-sm font-medium bg-secondary text-white rounded-lg hover:bg-gray-800 active:scale-95 transition">
                          Ver más
                        </Link>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
};

export default SearchResults;
