import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Rooms = () => {
  const { user } = useAppContext();
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
          userId: user?._id, // 👈 usar el id real del usuario logueado
        }),
      });

      if (res.ok) {
        alert("✅ Reserva confirmada");
        closeModal();
      } else {
        const errorData = await res.json();
        alert("❌ " + (errorData.message || "Error al realizar la reserva"));
      }
    } catch (error) {
      console.error("Error en la reserva", error);
    }
  };

  // ✅ Función para cerrar y limpiar modal
  const closeModal = () => {
    setSelectedRoom(null);
    setRoomAvailability(null);
    setCheckIn("");
    setCheckOut("");
  };

  if (loading) return <p className="text-center">Cargando habitaciones...</p>;

  return (
    <div className="flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32">
      <div>
        {/* Habitaciones */}
        <div className="flex flex-col items-start text-left">
          <h1 className="font-playfair text-4xl md:text-[40px]">Habitaciones</h1>
          <p className="text-sm md:text-base text-gray-500/90 mt-2 max-w-174">
            Take advantage of our limited-time offers and special packages to
            enhance your stay and create unforgettable memories.
          </p>
        </div>

        <div>
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <div
                key={room._id}
                className="flex flex-col items-center bg-white shadow-md rounded-xl py-6 px-5 md:w-[460px] w-[370px] border border-gray-200"
              >
                <div className="flex items-center justify-center p-4 bg-indigo-200 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="#2563EB"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 10h18M4 10V6a2 2 0 012-2h12a2 2 0 012 2v4M4 10v10m16-10v10M8 14h8"
                    />
                  </svg>
                </div>
                <h2 className="text-gray-900 font-semibold mt-4 text-xl">
                  Habitación {room.roomNumber}
                </h2>
                <p className="text-sm text-gray-600 mt-2 text-center">
                  Desea consultar la disponibilidad de esta habitación?.
                </p>
                <p className="text-gray-500/60 text-sm capitalize">
                  Tipo: {room.type}
                </p>
                <p className="text-gray-500/60 text-sm capitalize">
                  Capacidad: {room.capacity} personas
                </p>

                <div className="flex items-center justify-center gap-4 mt-5 w-full">
                  <p className="md:text-xl text-base font-medium text-indigo-500">
                    <span className="text-gray-500/60 md:text-sm text-xs">
                      ${room.pricePerNight}/noche
                    </span>
                  </p>
                  <div className="text-indigo-500">
                    {/* Abrir modal */}
                    <button
                      className="w-full md:w-36 h-10 rounded-md text-white bg-indigo-950 font-medium text-sm hover:bg-indigo-500 active:scale-95 transition"
                      onClick={() => setSelectedRoom(room)}
                    >
                      Ver
                    </button>
                  </div>
                </div>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur bg-opacity-50 flex justify-center items-center">
          <div
            className="flex flex-col items-center bg-white shadow-md rounded-xl py-6 px-5 md:w-[460px] w-[370px] border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center p-4 bg-green-100 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="#16A34A"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10m2-6h1a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h1m12 0V3m-8 10l2 2 4-4"
                />
              </svg>
            </div>
            <h2 className="text-gray-900 font-semibold mt-4 text-xl">
              Habitación {selectedRoom.roomNumber}
            </h2>
            <p className="text-sm text-gray-600 mt-2 text-center">
              Selecciona tus fechas de estadía para continuar con la reserva.
            </p>

            <div className="bg-white text-gray-500 rounded-lg px-6 py-4 flex flex-col md:flex-row gap-4">
              <div>
                <label
                  htmlFor="checkIn"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  Check in
                </label>
                <input
                  id="checkIn"
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
                />
              </div>

              <div>
                <label
                  htmlFor="checkOut"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  Check out
                </label>
                <input
                  id="checkOut"
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
                />
              </div>
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

            {!user && (
              <p className="text-red-500 text-sm mt-2">
                ⚠️ Debes iniciar sesión para reservar.
              </p>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeModal}
                className="w-full md:w-36 h-10 rounded-md border border-gray-300 bg-white text-gray-600 font-medium text-sm hover:bg-gray-100 active:scale-95 transition"
              >
                Cancelar
              </button>

              {!roomAvailability?.available ? (
                <button
                  onClick={checkAvailability}
                  className="w-full md:w-36 h-10 rounded-md text-white bg-blue-950 font-medium text-sm hover:bg-blue-600 active:scale-95 transition"
                  disabled={loadingCheck}
                >
                  {loadingCheck ? "Consultando..." : "Consultar"}
                </button>
              ) : (
                <button
                  onClick={handleReservation}
                  className="px-4 py-2 rounded-lg bg-green-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!user} // 👈 se deshabilita si no hay usuario logueado
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
