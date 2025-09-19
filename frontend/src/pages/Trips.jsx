import React from "react";
import { useAppContext } from "../context/AppContext.jsx";
import { NavLink } from "react-router-dom";

const Trips = () => {
  const { trips, loadingTrips } = useAppContext();

  if (loadingTrips) return <p className="text-center py-10 text-gray-500">Cargando viajes...</p>;

  return (
    <div className="pt-28 md:pt-36 px-4 md:px-16 lg:px-24 xl:px-32">
      {/* Encabezado */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-gray-800">
          Paquetes de Viaje
        </h1>
        <p className="text-gray-600 mt-3 text-sm md:text-base">
          Aprovecha nuestras ofertas limitadas y paquetes especiales para crear recuerdos inolvidables.
        </p>
      </div>

      {/* Grid de viajes */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        {trips.map((trip) => (
          <div
            key={trip._id}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl transition p-6 flex flex-col"
          >
            {/* Imagen del viaje si existe */}
            {trip.image && (
              <img
                src={trip.image}
                alt={trip.name}
                className="h-48 w-full object-cover rounded-xl mb-4"
              />
            )}

            {/* Información del viaje */}
            <h2 className="text-lg font-semibold text-gray-800">{trip.name}</h2>
            <p className="text-sm text-gray-600 mt-2 flex-grow">{trip.description}</p>

            <div className="mt-4 space-y-1">
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">Destino:</span> {trip.destination}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">Duración:</span> {trip.days}
              </p>
              <p className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">Precio:</span> {trip.price}
              </p>
            </div>

            {/* Botones */}
            <div className="mt-6 flex gap-3">
              <NavLink
                to={`/trips/${trip._id}`}
                className="flex-1 text-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 transition rounded-lg text-white shadow-md text-sm font-medium"
              >
                Ver Más
              </NavLink>
              <button
                onClick={() => alert(`Reserva iniciada para: ${trip.name}`)}
                className="flex-1 text-center px-5 py-2.5 bg-green-600 hover:bg-green-700 transition rounded-lg text-white shadow-md text-sm font-medium"
              >
                Reservar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trips;
