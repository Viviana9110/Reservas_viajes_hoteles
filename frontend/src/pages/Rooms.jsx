import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Rooms = () => {
  const { id } = useParams(); // id del hotel
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [roomAvailability, setRoomAvailability] = useState(null);
  const [loadingCheck, setLoadingCheck] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/hoteles/${id}/rooms`);
        const data = await res.json();
        setRooms(data);
      } catch (error) {
        console.error("Error al cargar habitaciones", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [id]);

  // ✅ Consultar disponibilidad
  const checkAvailability = async () => {
    if (!checkIn || !checkOut) {
      alert("Por favor selecciona fechas de entrada y salida");
      return;
    }

    try {
      setLoadingCheck(true);
      const res = await fetch("http://localhost:4000/api/bookings/availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: selectedRoom._id, checkIn, checkOut }),
      });
      const data = await res.json();
      setRoomAvailability(data); // { available: true/false, message }
    } catch (error) {
      console.error("Error al consultar disponibilidad", error);
    } finally {
      setLoadingCheck(false);
    }
  };

  // ✅ Reservar habitación
  const handleReservation = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId: id,
          roomId: selectedRoom._id,
          checkIn,
          checkOut,
          userId: "68ace0ab41d81f213fdece68", // 👈 cambia esto por el id real del usuario logueado
        }),
      });

      if (res.ok) {
        alert("✅ Reserva confirmada");
        setSelectedRoom(null); // cerrar modal
        setRoomAvailability(null);
        setCheckIn("");
        setCheckOut("");
      } else {
        const errorData = await res.json();
        alert("❌ " + (errorData.message || "Error al realizar la reserva"));
      }
    } catch (error) {
      console.error("Error en la reserva", error);
    }
  };

  if (loading) return <p className="text-center">Cargando habitaciones...</p>;

  return (
    <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32'>
      <div>
         {/* Habitaciones */}
         <div className='flex flex-col items-start text-left'>
            <h1 className='font-playfair text-4xl md:text-[40px]'>Habitaciones</h1>
            <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-174'>Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.</p>
        </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
        {rooms.length > 0 ? (
          rooms.map((room) => (
            <div key={room._id} className="border rounded-xl shadow-md p-4">
              <h2 className="text-lg font-bold mb-2">
                Habitación {room.roomNumber}
              </h2>
              <p className="text-gray-600 capitalize">Tipo: {room.type}</p>
              <p className="text-gray-600">
                Capacidad: {room.capacity} personas
              </p>
              <p className="font-semibold text-blue-600">
                ${room.pricePerNight} / noche
              </p>

              {/* Abrir modal */}
              <button
                className="mt-3 bg-blue-500 text-white px-4 py-2 rounded-lg"
                onClick={() => setSelectedRoom(room)}
              >
                Consultar disponibilidad
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No hay habitaciones disponibles.
          </p>
        )}
      </div>

      </div>
     

      {/* Modal */}
      {selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-xl p-6 w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              Habitación {selectedRoom.roomNumber}
            </h2>

            <div className="flex flex-col gap-4">
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="border rounded p-2"
              />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="border rounded p-2"
              />
            </div>

            {/* Resultado de disponibilidad */}
            {roomAvailability && (
              <p
                className={`mt-3 font-medium ${
                  roomAvailability.available ? "text-green-600" : "text-red-600"
                }`}
              >
                {roomAvailability.message}
              </p>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setSelectedRoom(null);
                  setRoomAvailability(null);
                }}
                className="px-4 py-2 rounded-lg border"
              >
                Cancelar
              </button>

              {!roomAvailability?.available ? (
                <button
                  onClick={checkAvailability}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white"
                  disabled={loadingCheck}
                >
                  {loadingCheck ? "Consultando..." : "Consultar"}
                </button>
              ) : (
                <button
                  onClick={handleReservation}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white"
                >
                  Reservar
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
