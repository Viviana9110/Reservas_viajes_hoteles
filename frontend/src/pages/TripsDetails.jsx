import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets, roomCommonData, tripsDummyData } from "../assets/assets";

const TripsDetails = () => {
  const { id } = useParams();
  const [trips, setTrips] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  // Estado del modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [isAvailable, setIsAvailable] = useState(false);
  const [message, setMessage] = useState("");

  // Simulación usuario logueado (en real, vendría de authContext o Redux)
  const userId = "68ace0ab41d81f213fdece68";

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  useEffect(() => {
    const tripsFound = tripsDummyData.find((trips) => trips._id === id);
    tripsFound && setTrips(tripsFound);
    tripsFound && setMainImage(tripsFound.images[0]);
  }, [id]);

  // Verificar disponibilidad
  const checkAvailability = async () => {
    if (!checkIn || !checkOut) {
      setMessage("Debes seleccionar fechas.");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/booking-trips/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: userId, checkIn, checkOut }),
      });

      const data = await res.json();
      if (res.ok && data.available) {
        setIsAvailable(true);
        setMessage("✅ Fechas disponibles, puedes reservar.");
      } else {
        setIsAvailable(false);
        setMessage("❌ Ya tienes una reserva en estas fechas.");
      }
    } catch (error) {
      console.error("Error verificando disponibilidad", error);
      setMessage("Error al verificar disponibilidad.");
    }
  };

  // Confirmar reserva
  const handleBooking = async () => {
    try {
      const res = await fetch(`${API_URL}/api/booking-trips`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: userId,
          trip: id,
          checkIn,
          checkOut,
        }),
      });

      if (res.ok) {
        setMessage("🎉 Reserva realizada con éxito");
        setIsModalOpen(false);
      } else {
        setMessage("❌ No se pudo realizar la reserva.");
      }
    } catch (error) {
      console.error("Error creando reserva", error);
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
          className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          Reservar
        </button>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">Reservar Viaje</h2>

              <label>Check In</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full border p-2 rounded mb-3"
              />

              <label>Check Out</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full border p-2 rounded mb-3"
              />

              <button
                onClick={checkAvailability}
                className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 mb-2"
              >
                Verificar disponibilidad
              </button>

              {message && (
                <p
                  className={`text-sm mb-2 ${
                    isAvailable ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {message}
                </p>
              )}

              <button
                onClick={handleBooking}
                disabled={!isAvailable}
                className={`w-full py-2 rounded ${
                  isAvailable
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Confirmar Reserva
              </button>

              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full mt-2 bg-red-500 text-white py-2 rounded hover:bg-red-600"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

         {/* Common Specifications */}
    <div className='mt-25 space-y-4'>
        {roomCommonData.map((spec, index)=>(
            <div key={index} className='flex items-start gap-2'>
                <img src={spec.icon} alt={`${spec.title}-icon`} className='w-6.5'/>
                <div>
                    <p className='text-base'>{spec.title}</p>
                    <p className='text-gray-500'>{spec.description}</p>
                </div>
            </div>
        ))}
    </div>

    <div className='max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500'>
        <p>★ LA SEPARACIÓN DEL CUPO: SE HACE POR PERSONA.CON EL 50%
           ★ SE GARANTIZA LA SALIDA CON UN MÍNIMO DE 16 PASAJEROS
           ★ LA HABITACIÓN DOBLE IMPLICA UNA INVERSIÓN POR PERSONA DE $ 90.000</p>
    </div>

    {/* Hosted by  */}
    <div className='flex flex-col items-start gap-4'>
        <div className='flex gap-4'>
            <img src={assets.logoTour} alt="Host" className='h-14 w-14 md:h-18 md:w-18 rounded-full' />
            <div>
                <p className='text-lg md:text-xl'>Viajes Tour Colombia</p>
                <div className='flex items-center mt-1'>
                    <p className='ml-2'>200+ reviews</p>
                </div>
            </div>
        </div>
        <button className='px-6 py-2.5 mt-4 rounded text-white bg-secondary hover:bg-primary transition-all cursor-pointer'>Contact Now</button>
    </div>
    
      </div>
    )
  );
};

export default TripsDetails;
