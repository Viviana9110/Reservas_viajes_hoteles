import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { SkeletonCard } from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import TiltCard from "../components/TiltCard";
import { assets } from "../assets/assets";

const container = {
  hidden: {}, visible: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 },
};

const Rooms = () => {
  const { user } = useAppContext();
  const { id } = useParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [roomAvailability, setRoomAvailability] = useState(null);
  const [loadingCheck, setLoadingCheck] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await fetch(`${API_URL}/hoteles/${id}/rooms`);
        const data = await res.json();
        setRooms(data);
      } catch (error) {
        toast.error("Error al cargar habitaciones");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [id]);

  const checkAvailability = async () => {
    if (!checkIn || !checkOut) {
      toast.error("Selecciona fechas de entrada y salida");
      return;
    }
    try {
      setLoadingCheck(true);
      const res = await fetch(`${API_URL}/bookings/availability`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId: selectedRoom._id, checkIn, checkOut }),
      });
      const data = await res.json();
      setRoomAvailability(data);
    } catch (error) {
      toast.error("Error al consultar disponibilidad");
    } finally {
      setLoadingCheck(false);
    }
  };

  const handleReservation = async () => {
    try {
      setBookingLoading(true);
      const res = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId: id,
          roomId: selectedRoom._id,
          checkIn,
          checkOut,
          userId: user?._id,
        }),
      });
      if (res.ok) {
        toast.success("Reserva confirmada");
        closeModal();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Error al realizar la reserva");
      }
    } catch (error) {
      toast.error("Error al procesar la reserva");
    } finally {
      setBookingLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedRoom(null);
    setRoomAvailability(null);
    setCheckIn("");
    setCheckOut("");
  };

  if (loading) {
    return (
      <div className="pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32 max-w-7xl mx-auto">
        <div className="skeleton h-10 w-48 mb-2" />
        <div className="skeleton h-4 w-96 mb-8" />
        <div className="grid md:grid-cols-2 gap-6">
          {[1,2].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-playfair text-4xl md:text-[40px] text-gray-800">Habitaciones</h1>
        <p className="text-sm md:text-base text-gray-500 mt-2 max-w-2xl">
          Aprovecha nuestras ofertas y paquetes especiales para mejorar tu estadía y crear recuerdos inolvidables.
        </p>
      </motion.div>

      {rooms.length > 0 ? (
        <motion.div variants={container} initial="hidden" animate="visible" className="grid md:grid-cols-2 gap-6">
          {rooms.map((room) => (
            <motion.div key={room._id} variants={item}>
              <TiltCard>
                <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-100 group">
                  <div className="h-52 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                    {room.images?.[0] ? (
                      <img src={room.images[0]} alt={room.roomNumber} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <span className="text-6xl opacity-30">🛏️</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <span className="absolute top-3 left-3 px-3 py-1 text-xs font-medium bg-white/90 backdrop-blur rounded-full capitalize shadow-sm">
                      {room.type}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <h2 className="font-semibold text-xl text-gray-800">Habitación {room.roomNumber}</h2>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <img src={assets.guestsIcon} alt="" className="h-4" />
                        {room.capacity} pers.
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{room.description || "Habitación cómoda y bien equipada para una estancia agradable."}</p>
                    {room.amenities?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {room.amenities.slice(0, 4).map((a, i) => (
                          <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-md">{a}</span>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-5">
                      <p className="text-2xl font-bold text-primary">
                        ${room.pricePerNight}
                        <span className="text-sm font-normal text-gray-500">/noche</span>
                      </p>
                      <button
                        onClick={() => setSelectedRoom(room)}
                        className="px-6 py-2.5 rounded-lg bg-secondary text-white font-medium text-sm hover:bg-gray-800 active:scale-95 transition cursor-pointer"
                      >
                        Reservar
                      </button>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <EmptyState title="Sin habitaciones disponibles" description="Este hotel no tiene habitaciones disponibles por el momento." />
      )}

      <AnimatePresence>
        {selectedRoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-800 text-center">Reservar Habitación {selectedRoom.roomNumber}</h2>
              <p className="text-sm text-gray-500 text-center mt-1">Selecciona tus fechas de estadía</p>

              <div className="flex gap-4 mt-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Entrada</label>
                  <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Salida</label>
                  <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-all" />
                </div>
              </div>

              {roomAvailability && (
                <div className={`mt-4 p-3 rounded-lg text-sm font-medium text-center ${
                  roomAvailability.available ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}>
                  {roomAvailability.message}
                </div>
              )}

              {!user && (
                <p className="text-red-500 text-sm mt-3 text-center">Debes iniciar sesión para reservar.</p>
              )}

              <div className="flex gap-3 mt-6">
                <button onClick={closeModal} className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-600 font-medium text-sm hover:bg-gray-50 transition cursor-pointer">
                  Cancelar
                </button>
                {!roomAvailability?.available ? (
                  <button
                    onClick={checkAvailability}
                    disabled={loadingCheck}
                    className="flex-1 py-2.5 rounded-lg bg-secondary text-white font-medium text-sm hover:bg-gray-800 transition cursor-pointer disabled:opacity-60"
                  >
                    {loadingCheck ? "Consultando..." : "Consultar"}
                  </button>
                ) : (
                  <button
                    onClick={handleReservation}
                    disabled={!user || bookingLoading}
                    className="flex-1 py-2.5 rounded-lg bg-green-600 text-white font-medium text-sm hover:bg-green-700 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {bookingLoading ? "Reservando..." : "Confirmar Reserva"}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Rooms;
