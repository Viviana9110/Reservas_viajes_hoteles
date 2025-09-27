// pages/SearchResults.jsx
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

const SearchResults = () => {
  const location = useLocation();
  const [results, setResults] = useState({ hotels: [], packages: [] });
  const [loading, setLoading] = useState(false);

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

    fetchResults();
  }, [location.search]);

  if (loading) return <p className="text-center mt-20">Buscando...</p>;

  return (
    <div className="px-6 md:px-16 lg:px-24 pt-28">
      <h1 className="text-2xl font-bold mb-6">Resultados de la búsqueda</h1>

      {/* Hoteles */}
      {results.hotels?.length > 0 ? (
        <>
          <h2 className="text-xl font-semibold mb-4">Hoteles disponibles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {results.hotels.map((hotel) => (
              <div key={hotel._id} className="p-4 border rounded-lg shadow-sm">
                <h3 className="font-bold text-lg">{hotel.name}</h3>
                <p>{hotel.location?.city}, {hotel.location?.country}</p>
                <p>{hotel.description}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>No hay hoteles disponibles</p>
      )}

      {/* Paquetes */}
      {results.packages?.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mt-10 mb-4">Paquetes sugeridos</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {results.packages.map((pkg) => (
              <div key={pkg._id} className="p-4 border rounded-lg shadow-sm">
                <h3 className="font-bold text-lg">{pkg.name}</h3>
                <p>Destino: {pkg.destination}</p>
                <p>{pkg.days} días</p>
                <p className="font-semibold">${pkg.price}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchResults;
