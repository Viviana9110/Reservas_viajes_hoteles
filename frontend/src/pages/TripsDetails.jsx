import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets, roomCommonData, tripsDummyData } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const TripsDetails = () => {
  const { id } = useParams();
  const { user } = useAppContext();
  const [trips, setTrips] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  // Estado del modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [message, setMessage] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

  useEffect(() => {
    const tripsFound = tripsDummyData.find((trips) => trips._id === id);
    tripsFound && setTrips(tripsFound);
    tripsFound && setMainImage(tripsFound.images[0]);
  }, [id]);

  // Verificar disponibilidad
  const checkAvailability = async () => {
    if (!checkIn || !checkOut) {
      toast.error("⚠️ Debes seleccionar fechas.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/booking-trips/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: user?._id, trip: id, checkIn, checkOut }),
      });

      const data = await res.json();
      if (res.ok && data.disponible) {
        setIsAvailable(true);
        toast.success(data.message || "✅ Fechas disponibles, puedes reservar.");
      } else {
        setIsAvailable(false);
        toast.error(data.message || "❌ Ya tienes una reserva en estas fechas.");
      }
    } catch (error) {
      console.error("Error verificando disponibilidad", error);
      toast.error("❌ Error al verificar disponibilidad.");
    }
  };

  // Confirmar reserva
  const handleBooking = async () => {
    try {
      const res = await fetch(`${API_URL}/booking-trips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: user?._id,
          trip: id,
          checkIn,
          checkOut,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "🎉 Reserva realizada con éxito");
        setIsModalOpen(false);
      } else {
        toast.error(data.message || "❌ No se pudo realizar la reserva.");
      }
    } catch (error) {
      console.error("Error creando reserva", error);
      toast.error("❌ Error al crear reserva.");
    }
  };

  return (
    trips && (
      <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
        {/* Trip Details */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <h1 className="text-3xl md:text-4xl font-playfair">{trips.name}</h1>
          <p className="text-xs font-inter py-1.5 px-3 text-white bg-third rounded-full">
            20% OFF
          </p>
        </div>

        {/* Imagenes */}
        <div className="flex flex-col lg:flex-row mt-6 gap-6">
          <div className="lg:w-1/2 w-full">
            <img
              src={mainImage}
              alt="Trip"
              className="w-full rounded-xl shadow-lg object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
            {trips?.images.length > 1 &&
              trips.images.map((image, index) => (
                <img
                  onClick={() => setMainImage(image)}
                  key={index}
                  src={image}
                  alt="Trip"
                  className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${
                    mainImage === image && "outline-3 outline-orange-500"
                  }`}
                />
              ))}
          </div>
        </div>

        {/* Descripción */}
        <div className="flex flex-col md:flex-row md:justify-between mt-10">
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-playfair">
              Una Verdadera Experiencia De Lujo
            </h1>
            <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
              {trips.description}
            </div>
          </div>
          <p className="text-2xl font-medium">${trips.price}</p>
        </div>

        {/* Botón reservar */}
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={!user}
          className={`mt-3 px-5 py-2.5 bg-slate-900 hover:bg-slate-500 text-white rounded-md
            ${
              user
                ? "px-5 py-2.5 bg-slate-900 hover:bg-slate-500"
                : "flex items-center justify-between bg-red-600/20 text-center px-3 h-10 rounded-sm"
            } `}
        >
          {user ? "Reservar" : "Inicia sesión para reservar"}
        </button>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0  bg-black/60 backdrop-blur bg-opacity-50 flex justify-center items-center">
            <div className="flex flex-col items-center bg-white shadow-md rounded-xl py-6 px-5 md:w-[460px] w-[370px] border border-gray-200">
              <h2 className="text-gray-900 font-semibold mt-4 text-xl">Reservar Viaje</h2>

              <div className="flex flex-col md:flex-row gap-4 mt-4 w-full">
                <div className="flex-1">
                  <label htmlFor="checkIn" className="block text-sm font-medium text-gray-700">
                    Check In
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full border p-2 rounded mb-3"
                  />
                </div>

                <div className="flex-1">
                  <label htmlFor="checkOut" className="block text-sm font-medium text-gray-700">
                    Check Out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full border p-2 rounded mb-3"
                  />
                </div>
              </div>

              {message && (
                <p
                  className={`text-sm mb-2 ${
                    isAvailable ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {message}
                </p>
              )}

              <div className="flex justify-end gap-3 mt-6 w-full">
                <button
                  onClick={checkAvailability}
                  className="flex-1 h-10 px-3 rounded-md text-white bg-blue-950 font-medium text-sm hover:bg-blue-600 active:scale-95 transition"
                >
                  Consultar
                </button>
                <button
                  onClick={handleBooking}
                  disabled={!isAvailable}
                  className={`flex-1 px-4 py-2 rounded-lg text-white ${
                    isAvailable
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Confirmar Reserva
                </button>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full md:w-36 h-10 mt-3 rounded-md border border-gray-300 bg-white text-gray-600 font-medium text-sm hover:bg-gray-100 active:scale-95 transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Common Specifications */}
        <div className="mt-25 space-y-4">
          {roomCommonData.map((spec, index) => (
            <div key={index} className="flex items-start gap-2">
              <img src={spec.icon} alt={`${spec.title}-icon`} className="w-6.5" />
              <div>
                <p className="text-base">{spec.title}</p>
                <p className="text-gray-500">{spec.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default TripsDetails;
